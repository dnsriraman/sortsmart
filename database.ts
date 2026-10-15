import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Load local configuration before deriving the database path. Hosting services
// should set SORTSMART_DB_PATH to a persistent writable volume.
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const functionTempDir = isServerless ? (process.env.TMPDIR || '/tmp') : null;
const databasePath = process.env.SORTSMART_DB_PATH || (functionTempDir
  ? path.join(functionTempDir, 'sortsmart.sqlite')
  : path.join(process.cwd(), 'data', 'sortsmart.sqlite'));
type SqliteDatabase = { exec(sql: string): void; prepare(sql: string): any };
let database: SqliteDatabase | null = null;
if (!isServerless) {
  mkdirSync(path.dirname(databasePath), { recursive: true });
  const nodeRequire = createRequire(path.join(process.cwd(), 'package.json'));
  const { DatabaseSync } = nodeRequire('node:sqlite');
  database = new DatabaseSync(databasePath);
}

const memoryActivities: Array<{ userId: string; activity: any }> = [];
const memoryAccounts = new Map<string, number>();
const memoryReports = new Map<string, any>();
const memoryComplaints: any[] = [];
const memoryQuizzes = new Map<string, { score: number; totalQuestions: number; completedAt: string }>();

database?.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    action_type TEXT NOT NULL,
    eco_points INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    is_verified INTEGER NOT NULL DEFAULT 0,
    notes TEXT
  );
  CREATE INDEX IF NOT EXISTS activities_user_time ON activities(user_id, timestamp DESC);

  CREATE TABLE IF NOT EXISTS credit_accounts (
    user_id TEXT PRIMARY KEY,
    balance INTEGER NOT NULL DEFAULT 0 CHECK(balance >= 0),
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS credit_ledger (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS credit_ledger_user_time ON credit_ledger(user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS campus_reports (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Received',
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS complaints_user_time ON complaints(user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS quiz_completions (
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TEXT NOT NULL,
    PRIMARY KEY (user_id, quiz_id)
  );
`);

export function getCreditBalance(userId: string): number {
  if (!database) return memoryAccounts.get(userId) ?? 0;
  const row = database.prepare('SELECT balance FROM credit_accounts WHERE user_id = ?').get(userId) as { balance?: number } | undefined;
  return Number(row?.balance ?? 0);
}

export function ensureCreditAccount(userId: string, initialBalance = 0): void {
  if (!database) {
    if (!memoryAccounts.has(userId)) memoryAccounts.set(userId, initialBalance);
    return;
  }
  database.prepare(`
    INSERT OR IGNORE INTO credit_accounts (user_id, balance, updated_at)
    VALUES (?, ?, ?)
  `).run(userId, initialBalance, new Date().toISOString());
}

function inTransaction<T>(operation: () => T): T {
  if (!database) return operation();
  database.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    database.exec('COMMIT');
    return result;
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

export function addCredits(userId: string, amount: number, reason: string, referenceId: string): number {
  const now = new Date().toISOString();
  if (!database) {
    ensureCreditAccount(userId);
    memoryAccounts.set(userId, getCreditBalance(userId) + amount);
    return getCreditBalance(userId);
  }
  inTransaction(() => {
    ensureCreditAccount(userId);
    database.prepare('UPDATE credit_accounts SET balance = balance + ?, updated_at = ? WHERE user_id = ?').run(amount, now, userId);
    database.prepare(`
      INSERT INTO credit_ledger (id, user_id, amount, reason, reference_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`credit-${crypto.randomUUID()}`, userId, amount, reason, referenceId, now);
  });
  return getCreditBalance(userId);
}

export function spendCredits(userId: string, amount: number, reason: string): number | null {
  const now = new Date().toISOString();
  if (!database) {
    ensureCreditAccount(userId);
    const balance = getCreditBalance(userId);
    if (balance < amount) return null;
    memoryAccounts.set(userId, balance - amount);
    return getCreditBalance(userId);
  }
  const wasSpent = inTransaction(() => {
    ensureCreditAccount(userId);
    const update = database.prepare(`
      UPDATE credit_accounts SET balance = balance - ?, updated_at = ?
      WHERE user_id = ? AND balance >= ?
    `).run(amount, now, userId, amount);
    if (Number(update.changes) === 0) return false;
    database.prepare(`
      INSERT INTO credit_ledger (id, user_id, amount, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(`credit-${crypto.randomUUID()}`, userId, -amount, reason, now);
    return true;
  });
  return wasSpent ? getCreditBalance(userId) : null;
}

export function readActivities(userId: string): any[] {
  if (!database) return memoryActivities.filter((row) => row.userId === userId).map((row) => ({ ...row.activity })).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return database.prepare(`
    SELECT id, item_name AS itemName, category, action_type AS actionType, eco_points AS ecoPoints,
      timestamp, is_verified AS isVerified, notes
    FROM activities WHERE user_id = ? ORDER BY timestamp DESC
  `).all(userId).map((row: any) => ({ ...row, isVerified: Boolean(row.isVerified) }));
}

export function saveActivity(activity: any, userId: string): void {
  if (!database) {
    memoryActivities.push({ userId, activity: { ...activity } });
    return;
  }
  database.prepare(`
    INSERT INTO activities (id, user_id, item_name, category, action_type, eco_points, timestamp, is_verified, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(activity.id, userId, activity.itemName, activity.category, activity.actionType, activity.ecoPoints,
    activity.timestamp, activity.isVerified ? 1 : 0, activity.notes ?? null);
}

export function readCampusReports(): any[] {
  if (!database) return Array.from(memoryReports.values()).map((report) => ({ ...report }));
  return database.prepare('SELECT payload FROM campus_reports ORDER BY created_at DESC').all()
    .map((row: any) => JSON.parse(row.payload));
}

export function saveCampusReport(report: any): void {
  if (!database) {
    memoryReports.set(report.id, { ...report });
    return;
  }
  database.prepare('INSERT INTO campus_reports (id, payload, created_at) VALUES (?, ?, ?)')
    .run(report.id, JSON.stringify(report), report.timestamp);
}

export function updateCampusReport(id: string, update: Record<string, unknown>): any | null {
  if (!database) {
    const report = memoryReports.get(id);
    if (!report) return null;
    const updated = { ...report, ...update };
    memoryReports.set(id, updated);
    return updated;
  }
  const row = database.prepare('SELECT payload FROM campus_reports WHERE id = ?').get(id) as { payload: string } | undefined;
  if (!row) return null;
  const report = { ...JSON.parse(row.payload), ...update };
  database.prepare('UPDATE campus_reports SET payload = ? WHERE id = ?').run(JSON.stringify(report), id);
  return report;
}

export function readComplaints(userId: string): any[] {
  if (!database) return memoryComplaints.filter((complaint) => complaint.userId === userId).map((complaint) => ({ ...complaint }));
  return database.prepare(`
    SELECT id, user_id AS userId, name, email, subject, category, message, status, created_at AS createdAt
    FROM complaints WHERE user_id = ? ORDER BY created_at DESC
  `).all(userId);
}

export function saveComplaint(complaint: any): void {
  if (!database) {
    memoryComplaints.push({ ...complaint });
    return;
  }
  database.prepare(`
    INSERT INTO complaints (id, user_id, name, email, subject, category, message, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(complaint.id, complaint.userId, complaint.name, complaint.email, complaint.subject, complaint.category,
    complaint.message, complaint.status, complaint.createdAt);
}

export function readCompletedQuizIds(userId: string): string[] {
  if (!database) return Array.from(memoryQuizzes.keys()).filter((key) => key.startsWith(`${userId}::`)).map((key) => key.slice(userId.length + 2));
  return (database.prepare('SELECT quiz_id FROM quiz_completions WHERE user_id = ? ORDER BY completed_at DESC').all(userId) as Array<{ quiz_id: string }>)
    .map((row) => row.quiz_id);
}

export function completeQuiz(userId: string, quizId: string, score: number, totalQuestions: number, points: number, activity: any): { awarded: boolean; balance: number } {
  if (!database) {
    const key = `${userId}::${quizId}`;
    ensureCreditAccount(userId);
    if (memoryQuizzes.has(key)) return { awarded: false, balance: getCreditBalance(userId) };
    memoryQuizzes.set(key, { score, totalQuestions, completedAt: activity.timestamp });
    saveActivity(activity, userId);
    memoryAccounts.set(userId, getCreditBalance(userId) + points);
    return { awarded: true, balance: getCreditBalance(userId) };
  }
  let awarded = false;
  inTransaction(() => {
    ensureCreditAccount(userId);
    const timestamp = activity.timestamp;
    const result = database.prepare(`
      INSERT OR IGNORE INTO quiz_completions (user_id, quiz_id, score, total_questions, completed_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, quizId, score, totalQuestions, timestamp);
    if (Number(result.changes) === 0) return;

    saveActivity(activity, userId);
    database.prepare('UPDATE credit_accounts SET balance = balance + ?, updated_at = ? WHERE user_id = ?').run(points, timestamp, userId);
    database.prepare(`
      INSERT INTO credit_ledger (id, user_id, amount, reason, reference_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`credit-${crypto.randomUUID()}`, userId, points, `Quiz reward: ${quizId}`, activity.id, timestamp);
    awarded = true;
  });
  return { awarded, balance: getCreditBalance(userId) };
}
