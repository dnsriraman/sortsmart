import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_MODULES } from './wasteDataset';

interface QuizViewProps {
  ecoPoints: number;
  onAwardPoints: (quizId: string, answers: number[]) => Promise<boolean>;
  completedQuizzes: string[];
}

export const QuizView: React.FC<QuizViewProps> = ({
  ecoPoints,
  onAwardPoints,
  completedQuizzes,
}) => {
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [wasAlreadyCompleted, setWasAlreadyCompleted] = useState(false);
  const [rewardAwarded, setRewardAwarded] = useState(false);
  const [isAwarding, setIsAwarding] = useState(false);
  const [awardError, setAwardError] = useState<string | null>(null);

  const activeQuiz = selectedQuizIndex !== null ? QUIZ_MODULES[selectedQuizIndex] : null;

  // Start a quiz
  const handleStartQuiz = (index: number) => {
    setSelectedQuizIndex(index);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setQuizFinished(false);
    setEarnedScore(0);
    setWasAlreadyCompleted(false);
    setRewardAwarded(false);
    setIsAwarding(false);
    setAwardError(null);
  };

  // Select an option
  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return; // Locked once answered
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
    setShowExplanation(true);
  };

  // Move to next question or finish
  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      activeQuiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });

      const passThreshold = Math.ceil(activeQuiz.questions.length * 0.6);
      const isPassed = correctCount >= passThreshold;
      const isAlreadyCompleted = completedQuizzes.includes(activeQuiz.id);

      setQuizFinished(true);
      setEarnedScore(correctCount);
      setWasAlreadyCompleted(isAlreadyCompleted);

      if (isPassed && !isAlreadyCompleted) {
        setIsAwarding(true);
        setAwardError(null);
        const answers = activeQuiz.questions.map((_, index) => selectedAnswers[index] ?? -1);
        onAwardPoints(activeQuiz.id, answers)
          .then((awarded) => {
            if (awarded) {
              setRewardAwarded(true);
              try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch { /* optional effect */ }
            } else {
              setWasAlreadyCompleted(true);
            }
          })
          .catch((error) => setAwardError(error instanceof Error ? error.message : 'Could not save quiz result.'))
          .finally(() => setIsAwarding(false));
      }
    }
  };

  const badges = [
    {
      id: 'b1',
      title: 'Zero Contaminator',
      desc: 'Mastered 4-bin segregation chemistry without mixing grease.',
      icon: '🛡️',
      unlocked: completedQuizzes.includes('quiz-segregation-101') || ecoPoints >= 50,
    },
    {
      id: 'b2',
      title: 'Lithium Guardian',
      desc: 'Passed hazardous battery fire safety & terminal taping protocol.',
      icon: '⚡',
      unlocked: completedQuizzes.includes('quiz-hazards-batteries') || ecoPoints >= 125,
    },
    {
      id: 'b3',
      title: 'Compost Alchemist',
      desc: 'Understands aerobic nitrogen-to-carbon soil carbon capture.',
      icon: '🌱',
      unlocked: completedQuizzes.includes('quiz-composting-impact') || ecoPoints >= 200,
    },
    {
      id: 'b4',
      title: 'Campus Sustainability Hero',
      desc: 'Achieved 350+ Eco-Points across quizzes and verified drop-offs.',
      icon: '🏆',
      unlocked: ecoPoints >= 350,
    },
  ];
  const correctAnswersSoFar = activeQuiz
    ? activeQuiz.questions.reduce((count, question, index) => count + (selectedAnswers[index] === question.correctIndex ? 1 : 0), 0)
    : 0;

  const retryRewardSave = async () => {
    if (!activeQuiz) return;
    setIsAwarding(true);
    setAwardError(null);
    try {
      const answers = activeQuiz.questions.map((_, index) => selectedAnswers[index] ?? -1);
      const awarded = await onAwardPoints(activeQuiz.id, answers);
      setRewardAwarded(awarded);
      if (!awarded) setWasAlreadyCompleted(true);
    } catch (error) {
      setAwardError(error instanceof Error ? error.message : 'Could not save quiz result.');
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          Interactive Environmental Academy
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Eco-Points & Quizzes
        </h1>
        <p className="text-sm text-slate-600">
          Practice safer sorting with short quizzes. Pass to add eco-credits to your wallet and unlock badges.
        </p>
      </div>

      {/* Badges & Wallet Row */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              Your Eco-Wallet Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-heading text-white">
                {ecoPoints}
              </span>
              <span className="text-emerald-300 text-sm font-semibold">
                Eco-Points
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 max-w-md">
              Pass a quiz once to earn its reward. Your completion and credits are saved with your account.
            </p>
          </div>

          {/* Badges Carousel */}
          <div className="w-full md:w-auto">
            <span className="text-xs font-bold text-emerald-300 block mb-2">
              Earned Badges & Credentials
            </span>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border transition ${
                    b.unlocked
                      ? 'bg-emerald-800/80 border-emerald-400/50 text-white shadow-xs'
                      : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300/40 opacity-60'
                  }`}
                  title={b.desc}
                >
                  <span className="text-base">{b.icon}</span>
                  <div>
                    <div className="font-bold">{b.title}</div>
                    <div className="text-[10px] text-emerald-200">
                      {b.unlocked ? 'Unlocked ✓' : 'Locked'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Quiz Player or Quiz Selection Grid */}
      {activeQuiz ? (
        /* Quiz Active Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          {!quizFinished ? (
            <>
              {/* Progress Bar & Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">
                    {activeQuiz.title}
                  </span>
                  <span>
                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length} · Score {correctAnswersSoFar}/{Object.keys(selectedAnswers).length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {activeQuiz.questions[currentQuestionIndex].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  const isCorrect = optIdx === activeQuiz.questions[currentQuestionIndex].correctIndex;

                  let optStyles = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50';

                  if (showExplanation) {
                    if (isCorrect) {
                      optStyles = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-500/20';
                    } else if (isSelected && !isCorrect) {
                      optStyles = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-2 ring-rose-500/20';
                    } else {
                      optStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={showExplanation}
                      aria-pressed={isSelected}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition text-sm flex items-start justify-between gap-3 cursor-pointer ${optStyles}`}
                    >
                      <span className="flex items-start gap-3"><span className="text-[11px] font-bold opacity-60">{String.fromCharCode(65 + optIdx)}.</span><span>{opt}</span></span>
                      {showExplanation && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {showExplanation && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scientific Explanation Reveal */}
              {showExplanation && (
                <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${selectedAnswers[currentQuestionIndex] === activeQuiz.questions[currentQuestionIndex].correctIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${selectedAnswers[currentQuestionIndex] === activeQuiz.questions[currentQuestionIndex].correctIndex ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {selectedAnswers[currentQuestionIndex] === activeQuiz.questions[currentQuestionIndex].correctIndex
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      : <HelpCircle className="w-4 h-4 text-amber-600" />}
                    {selectedAnswers[currentQuestionIndex] === activeQuiz.questions[currentQuestionIndex].correctIndex ? 'Correct answer' : 'Not quite — here’s why'}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {activeQuiz.questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {showExplanation && (
                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleNextQuestion}
                    className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed Results Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-2xl font-bold">
                {earnedScore >= Math.ceil(activeQuiz.questions.length * 0.6) ? '🎉' : '📚'}
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
                  {earnedScore >= Math.ceil(activeQuiz.questions.length * 0.6)
                    ? 'Quiz passed!'
                    : 'Review the answers and try again'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  You got {earnedScore} of {activeQuiz.questions.length} correct ({Math.round((earnedScore / activeQuiz.questions.length) * 100)}%).
                </p>
              </div>

              {earnedScore >= Math.ceil(activeQuiz.questions.length * 0.6) && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${rewardAwarded ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>{isAwarding ? 'Saving your result…' : rewardAwarded ? `+${activeQuiz.pointsAward} credits added to your wallet!` : wasAlreadyCompleted ? 'This quiz was completed before; no duplicate credits added.' : 'Passing score reached.'}</span>
                </div>
              )}

              {awardError && (
                <div role="alert" className="mx-auto max-w-lg rounded-xl border border-rose-200 bg-rose-50 p-3 text-left text-xs text-rose-800">
                  <p>{awardError}</p>
                  <button type="button" onClick={retryRewardSave} disabled={isAwarding} className="mt-2 font-bold underline disabled:opacity-50">{isAwarding ? 'Saving…' : 'Retry saving reward'}</button>
                </div>
              )}

              {earnedScore < activeQuiz.questions.length && (
                <div className="mx-auto max-w-xl text-left rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Review missed questions</h4>
                  {activeQuiz.questions.map((question, index) => selectedAnswers[index] === question.correctIndex ? null : (
                    <div key={question.id} className="border-t border-slate-200 pt-3 first:border-0 first:pt-0">
                      <p className="text-xs font-semibold text-slate-800">{question.question}</p>
                      <p className="mt-1 text-[11px] text-rose-700">Your answer: {question.options[selectedAnswers[index]] ?? 'No answer'}</p>
                      <p className="text-[11px] text-emerald-800">Correct: {question.options[question.correctIndex]}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{question.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => selectedQuizIndex !== null && handleStartQuiz(selectedQuizIndex)}
                  disabled={isAwarding}
                  className="py-2.5 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake Quiz
                </button>

                <button
                  onClick={() => setSelectedQuizIndex(null)}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Back to All Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Selection Grid */
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {QUIZ_MODULES.map((qm, idx) => {
            const isCompleted = completedQuizzes.includes(qm.id);
            return (
              <div
                key={qm.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      +{qm.pointsAward} pts
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {qm.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {qm.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {qm.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {qm.questions.length} questions
                  </span>
                  <button
                    onClick={() => handleStartQuiz(idx)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                    }`}
                  >
                    <span>{isCompleted ? 'Review' : 'Start Quiz'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
