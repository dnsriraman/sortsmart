import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { WASTE_DATASET, RECYCLING_CENTRES, WASTE_CATEGORIES, QUIZ_MODULES } from './wasteDataset.ts';
import {
  addCredits,
  completeQuiz,
  ensureCreditAccount,
  getCreditBalance,
  readActivities,
  readCampusReports,
  readComplaints,
  readCompletedQuizIds,
  saveActivity,
  saveCampusReport,
  saveComplaint,
  spendCredits,
  updateCampusReport,
} from './database.ts';

// dotenv does not load .env.local by default, although that is the file the
// project README asks local developers to use. Load it explicitly.
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const app = express();
export { app };

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client if key is present
const apiKey = process.env.GEMINI_API_KEY?.trim();
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Activity logs store
interface ActivityLog {
  id: string;
  itemName: string;
  category: string;
  actionType: 'scanned' | 'searched' | 'recycled' | 'composted' | 'quiz_completed' | 'bin_reported';
  ecoPoints: number;
  timestamp: string;
  isVerified: boolean;
  notes?: string;
}

// Start with a clean database. Real activity, credits, and reports are added
// only through the app's API instead of fabricated demo records.
const demoUserId = 'cust-demo-1';
ensureCreditAccount(demoUserId);

// Anti-spam rate limiting map (IP / session -> timestamp)
const rateLimitMap = new Map<string, number>();

// --- API ROUTES ---

// 1. Health & Config status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(aiClient),
    timestamp: new Date().toISOString(),
    version: '1.0.0-smit-hackathon',
  });
});

// 2. Curated waste dataset
app.get('/api/waste-items', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const category = (req.query.category as string || '').trim();

  let results = WASTE_DATASET;

  if (category && category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (query) {
    results = results.filter((item) => {
      const matchName = item.name.toLowerCase().includes(query);
      const matchAlias = item.aliases.some((a) => a.toLowerCase().includes(query));
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchWhy = item.whyThisBin.toLowerCase().includes(query);
      return matchName || matchAlias || matchDesc || matchWhy;
    });
  }

  res.json({
    total: results.length,
    items: results,
  });
});

// 3. AI Waste Scanner Endpoint
app.post('/api/scan-waste', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', itemNameHint } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 string is required.' });
    }

    // Strip data URL prefix if included
    let cleanBase64 = imageBase64;
    let actualMime = mimeType;
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      const mimeMatch = parts[0].match(/data:(.*?)$/);
      if (mimeMatch) actualMime = mimeMatch[1];
      cleanBase64 = parts[1];
    }

    // If Gemini client is active, execute real vision analysis
    if (aiClient) {
      const promptText = `You are a certified environmental waste auditor for SortSmart at a university hackathon.
Analyze the provided photograph of a waste item.
Identify what physical object or packaging this item is.
Categorize it strictly into ONE of the following 4 primary categories:
- "wet_organic" (kitchen scraps, food residue, garden cuttings, compostable matter)
- "dry_recyclable" (clean paper, cardboard, PET/HDPE plastics, aluminum/tin cans, clean glass bottles)
- "hazardous" (batteries, CFL tube bulbs, expired pharmaceuticals, paint/solvents, aerosols, corrosive chemicals)
- "e_waste" (electronics, cables, chargers, circuit boards, appliances)
- "sanitary_residual" (used tissues, diapers, medical dressings, heavily soiled styrofoam, broken ceramics)

CRITICAL INSTRUCTIONS:
1. Never present an uncertain prediction as guaranteed correct. If the image is blurry, ambiguous, or multi-material, reflect this honestly in the confidence percentage (e.g. 50-70%) and label confidenceLevel as "Uncertain" or "Moderate".
2. If it is a food-soiled item (like a greasy pizza box), explain why grease ruins paper pulping and specify whether it belongs in organic composting or residual.
3. If it is a battery or CFL bulb, highlight the severe fire or mercury hazard.
4. Provide practical preparation steps (e.g. rinse, crush, tape battery terminals).
5. State whether local municipal or campus confirmation is needed.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: actualMime,
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              itemName: { type: Type.STRING, description: 'Specific common name of the item (e.g. Used Lithium Battery, Half-eaten Apple, Crushed Soda Can)' },
              category: {
                type: Type.STRING,
                enum: ['wet_organic', 'dry_recyclable', 'hazardous', 'e_waste', 'sanitary_residual'],
                description: 'Waste category used by the SortSmart app',
              },
              categoryLabel: { type: Type.STRING, description: 'Human readable category title' },
              binName: { type: Type.STRING, description: 'Color and name of bin (e.g. Green Bin, Blue Bin, Red Bin, Grey Bin)' },
              confidencePercent: { type: Type.INTEGER, description: 'Estimated confidence score 0 to 100' },
              confidenceLevel: { type: Type.STRING, description: 'High, Moderate, or Uncertain' },
              whyThisBin: { type: Type.STRING, description: 'Scientific explanation of why this bin is appropriate and the environmental hazard if misclassified' },
              preparationSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Step-by-step preparation instructions before disposal'
              },
              canBeRecycled: { type: Type.BOOLEAN, description: 'Whether the material can undergo industrial recycling' },
              canBeReused: { type: Type.BOOLEAN, description: 'Whether the item has practical domestic or campus reuse potential' },
              reuseIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Clever upcycling or reuse ideas'
              },
              safetyPrecautions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Crucial safety warnings (fire risk, cut hazard, toxic gas)'
              },
              localRulesConfirmation: { type: Type.STRING, description: 'Disclaimer regarding local municipal or campus recycling differences' },
              uncertaintyNotice: { type: Type.STRING, description: 'Transparent notice regarding AI visual inference limits' }
            },
            required: ['itemName', 'category', 'categoryLabel', 'confidencePercent', 'confidenceLevel', 'whyThisBin', 'preparationSteps', 'canBeRecycled']
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsedData = JSON.parse(responseText.trim());
        return res.json({
          source: 'gemini-vision',
          model: 'gemini-3.5-flash-lite',
          isRealAi: true,
          ...parsedData,
        });
      }
    }

    // Allow named demo presets to work offline, but never claim an arbitrary
    // image was identified when the vision model is not configured.
    const hint = (itemNameHint || '').toLowerCase();
    let matched = WASTE_DATASET.find(item => 
      hint.includes(item.name.toLowerCase()) || 
      item.aliases.some(a => hint.includes(a.toLowerCase()))
    );

    if (!matched) {
      return res.status(503).json({
        error: 'Gemini AI is not configured. Add a valid GEMINI_API_KEY to .env.local and restart the server to identify uploaded images.',
      });
    }

    return res.json({
      source: 'curated-offline-engine',
      model: 'rule-based-fallback',
      isRealAi: false,
      itemName: matched.name,
      category: matched.category,
      categoryLabel: matched.categoryLabel,
      binName: matched.binColor === '#15803d' ? 'Green Bin (Wet Organic)' :
               matched.binColor === '#0284c7' ? 'Blue Bin (Dry Recyclable)' :
               matched.binColor === '#dc2626' ? 'Red Bin (Hazardous)' : 'Grey Bin (E-Waste)',
      confidencePercent: 78,
      confidenceLevel: 'Moderate',
      whyThisBin: matched.whyThisBin,
      preparationSteps: matched.preparationSteps,
      canBeRecycled: matched.canBeRecycled,
      canBeReused: matched.canBeReused,
      reuseIdeas: matched.reuseIdeas || [],
      safetyPrecautions: matched.safetyPrecautions,
      localRulesConfirmation: matched.localDisclaimer,
      uncertaintyNotice: 'Notice: Server running in offline fallback mode. Vision model output approximated from sample metadata. Always verify physical item against campus bin instructions.'
    });

  } catch (err: any) {
    console.error('Error during AI waste scan:', err);
    res.status(500).json({
      error: 'Failed to process waste image.',
      details: err?.message || 'Unknown server error',
      fallbackAlternative: 'Please use the Smart Waste Search bar below to look up any item instantly.'
    });
  }
});

// 4. Campus Bin Reports Endpoints
app.get('/api/campus-bins', (req, res) => {
  const reports = readCampusReports();
  res.json({
    total: reports.length,
    reports,
  });
});

app.post('/api/campus-bins/report', (req, res) => {
  const { location, campusArea, wasteType, severity, description, reportedBy, photoUrl } = req.body;
  const userId = String(req.body.userId || demoUserId);
  const latitude = Number(req.body.coordinates?.lat);
  const longitude = Number(req.body.coordinates?.lng);
  const coordinates = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
    ? { lat: latitude, lng: longitude }
    : undefined;

  if (!location || !wasteType || !description) {
    return res.status(400).json({ error: 'Location, wasteType, and description are required.' });
  }

  const newReport = {
    id: `rep-${Date.now()}`,
    location,
    campusArea: campusArea || 'Campus Grounds',
    wasteType,
    severity: severity || 'Full',
    status: 'Pending',
    description,
    reportedBy: reportedBy || 'Anonymous Student',
    timestamp: new Date().toISOString(),
    upvotes: 1,
    assignedStaff: 'Unassigned',
    photoUrl: photoUrl || null,
    ...(coordinates ? { coordinates } : {}),
  };

  saveCampusReport(newReport);

  // Award eco-points for civic reporting
  const log: ActivityLog = {
    id: `act-${Date.now()}`,
    itemName: `Bin Report: ${location}`,
    category: wasteType,
    actionType: 'bin_reported',
    ecoPoints: 20,
    timestamp: new Date().toISOString(),
    isVerified: true,
    notes: `Civic report lodged for ${severity} bin condition.`
  };
  saveActivity(log, userId);
  const totalPoints = addCredits(userId, 20, 'Campus bin report reward', newReport.id);

  res.status(201).json({
    message: 'Report submitted successfully. Facilities management has been alerted.',
    report: newReport,
    pointsAwarded: 20,
    totalPoints,
  });
});

app.patch('/api/campus-bins/report/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedStaff } = req.body;

  const report = updateCampusReport(id, { ...(status ? { status } : {}), ...(assignedStaff ? { assignedStaff } : {}) });
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  res.json({
    message: 'Report updated successfully.',
    report,
  });
});

// 5. Activity Logs & Eco-Points
app.get('/api/user/activities', (req, res) => {
  const userId = String(req.query.userId || demoUserId);
  ensureCreditAccount(userId);
  const activities = readActivities(userId);
  res.json({
    totalPoints: getCreditBalance(userId),
    totalActivities: activities.length,
    activities,
  });
});

app.get('/api/user/quizzes', (req, res) => {
  const userId = String(req.query.userId || demoUserId);
  res.json({ completedQuizIds: readCompletedQuizIds(userId) });
});

app.post('/api/user/quizzes/complete', (req, res) => {
  const userId = String(req.body.userId || demoUserId);
  const quiz = QUIZ_MODULES.find((module) => module.id === req.body.quizId);
  const answers = req.body.answers;
  if (!quiz || !Array.isArray(answers) || answers.length !== quiz.questions.length || answers.some((answer: unknown) => typeof answer !== 'number' || !Number.isInteger(answer))) {
    return res.status(400).json({ error: 'Quiz answers are incomplete or invalid.' });
  }

  const score = quiz.questions.reduce((total, question, index) => total + (answers[index] === question.correctIndex ? 1 : 0), 0);
  const passThreshold = Math.ceil(quiz.questions.length * 0.6);
  if (score < passThreshold) {
    return res.status(400).json({ error: 'The passing score was not reached.', score, passThreshold });
  }

  const timestamp = new Date().toISOString();
  const activity: ActivityLog = {
    id: `act-${crypto.randomUUID()}`,
    itemName: `Quiz: ${quiz.title}`,
    category: 'dry_recyclable',
    actionType: 'quiz_completed',
    ecoPoints: quiz.pointsAward,
    timestamp,
    isVerified: true,
    notes: `Passed with ${score} of ${quiz.questions.length} correct answers.`,
  };
  const result = completeQuiz(userId, quiz.id, score, quiz.questions.length, quiz.pointsAward, activity);
  res.json({
    message: result.awarded ? 'Quiz passed and credits awarded.' : 'Quiz was already completed; no duplicate credits were added.',
    awarded: result.awarded,
    score,
    totalQuestions: quiz.questions.length,
    pointsAwarded: result.awarded ? quiz.pointsAward : 0,
    totalPoints: result.balance,
    activity: result.awarded ? activity : null,
  });
});

app.post('/api/user/activities/log', (req, res) => {
  const { itemName, category, actionType, notes, isVerified = false } = req.body;
  const userId = String(req.body.userId || demoUserId);

  if (!itemName || !actionType) {
    return res.status(400).json({ error: 'Item name and actionType are required.' });
  }
  if (actionType === 'quiz_completed') {
    return res.status(400).json({ error: 'Complete quizzes through the quiz completion endpoint.' });
  }

  // Anti-spam safeguard: limit logging the same item within 30 seconds
  const spamKey = `${userId}-${itemName.toLowerCase()}-${actionType}`;
  const lastTime = rateLimitMap.get(spamKey);
  const now = Date.now();
  if (lastTime && now - lastTime < 30000) {
    return res.status(429).json({
      error: 'Anti-spam protection: You recently logged this exact action. Please wait 30 seconds to record new activities.',
    });
  }
  rateLimitMap.set(spamKey, now);

  const pointsMap: Record<string, number> = {
    recycled: 15,
    composted: 20,
    scanned: 10,
    searched: 5,
    bin_reported: 20,
  };

  const pts = pointsMap[actionType] || 10;

  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    itemName,
    category: category || 'dry_recyclable',
    actionType,
    ecoPoints: pts,
    timestamp: new Date().toISOString(),
    isVerified: Boolean(isVerified),
    notes: notes || 'User reported disposal action',
  };

  saveActivity(newLog, userId);
  const totalPoints = addCredits(userId, pts, `Reward: ${actionType}`, newLog.id);

  res.status(201).json({
    message: 'Activity recorded successfully!',
    activity: newLog,
    ecoPointsAdded: pts,
    totalPoints,
  });
});

app.post('/api/user/credits/redeem', (req, res) => {
  const userId = String(req.body.userId || demoUserId);
  const amount = Number(req.body.amount);
  if (!Number.isInteger(amount) || amount !== 100) {
    return res.status(400).json({ error: 'Choose a 100-credit campus eco-reward.' });
  }

  const balance = spendCredits(userId, amount, 'Redeemed campus eco-reward');
  if (balance === null) {
    return res.status(409).json({ error: 'Not enough credits to redeem this reward.', balance: getCreditBalance(userId) });
  }

  res.json({ message: 'Eco-reward redeemed successfully.', balance, reward: 'Campus eco-reward voucher' });
});

app.get('/api/complaints', (req, res) => {
  const userId = String(req.query.userId || demoUserId);
  res.json({ complaints: readComplaints(userId) });
});

app.post('/api/complaints', (req, res) => {
  const userId = String(req.body.userId || demoUserId).slice(0, 100);
  const name = String(req.body.name || 'Customer').trim().slice(0, 120);
  const email = String(req.body.email || '').trim().slice(0, 254);
  const subject = String(req.body.subject || '').trim().slice(0, 160);
  const category = String(req.body.category || 'General').trim().slice(0, 80);
  const message = String(req.body.message || '').trim().slice(0, 4000);
  if (!subject || message.length < 8) {
    return res.status(400).json({ error: 'Add a subject and a message with at least 8 characters.' });
  }

  const complaint = {
    id: `cmp-${crypto.randomUUID()}`,
    userId,
    name,
    email,
    subject,
    category,
    message,
    status: 'Received',
    createdAt: new Date().toISOString(),
  };
  saveComplaint(complaint);
  res.status(201).json({ complaint });
});

// 6. Recycling Centres endpoint
app.get('/api/recycling-centres', (req, res) => {
  const material = req.query.material as string;
  let results = RECYCLING_CENTRES;

  if (material && material !== 'all') {
    results = results.filter(rc => rc.acceptedMaterials.includes(material));
  }

  res.json({
    total: results.length,
    centres: results,
  });
});

