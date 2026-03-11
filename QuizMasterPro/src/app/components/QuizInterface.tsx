import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Timer } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Question } from '@/app/data/quizData';

interface QuizInterfaceProps {
  questions: Question[];
  category: string;
  difficulty: string;
  mode: 'practice' | 'timed' | 'multiplayer';
  roomId?: string;
  username?: string;
  onComplete: (results: QuizResult) => void;
}

export interface QuestionResult {
  questionId: number;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  category: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalTime: number;
  results: QuestionResult[];
}

const TIMER_DURATION = 15;

export function QuizInterface({ questions, category, difficulty, mode, roomId, username, onComplete }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timesSpent, setTimesSpent] = useState<number[]>(new Array(questions.length).fill(0));
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [multiplayerScores, setMultiplayerScores] = useState<Record<string, {score: number, hasFinished: boolean}>>({});

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (mode === 'multiplayer' && roomId && username) {
      const socket = new WebSocket(`ws://localhost:8000/ws/multiplayer/${roomId}`);
      
      socket.onopen = () => {
        // Assume already joined in lobby, but send join to get current state just in case
        socket.send(JSON.stringify({ action: 'join', username }));
        setWs(socket);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'state_update') {
          setMultiplayerScores(data.players);
        }
      };

      return () => {
        socket.close();
      };
    }
  }, [mode, roomId, username]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timerDuration = TIMER_DURATION;

  // Timer effect
  useEffect(() => {
    if (isAnswered || mode === 'practice') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isAnswered]);

  const handleTimeUp = () => {
    const timeSpent = timerDuration;
    const newTimesSpent = [...timesSpent];
    newTimesSpent[currentQuestionIndex] = timeSpent;
    setTimesSpent(newTimesSpent);
    
    setIsAnswered(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        goToNextQuestion();
      } else {
        submitQuiz();
      }
    }, 1500);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    const timeSpent = timerDuration - timeLeft;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(answerIndex);

    const newTimesSpent = [...timesSpent];
    newTimesSpent[currentQuestionIndex] = timeSpent;
    setTimesSpent(newTimesSpent);

    // Calculate score for this question (Weighted Scoring)
    if (answerIndex === currentQuestion.correctAnswer) {
      const basePoints = 100;
      let timeBonus = 0;
      
      if (mode === 'timed') {
        // High reward for being extremely fast
        const speedRatio = timeLeft / timerDuration;
        if (speedRatio > 0.8) {
          timeBonus = 100; // Bonus for < 3 seconds
        } else {
          timeBonus = Math.round(speedRatio * 50);
        }
      }
      
      const newScore = totalScore + basePoints + timeBonus;
      setTotalScore(newScore);

      if (ws && mode === 'multiplayer') {
         ws.send(JSON.stringify({ action: 'update_score', score: newScore }));
      }
    }

    setIsAnswered(true);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
      setTimeLeft(timerDuration);
      setIsAnswered(answers[currentQuestionIndex + 1] !== null);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setTimeLeft(timerDuration);
      setIsAnswered(answers[currentQuestionIndex - 1] !== null);
    }
  };

  const submitQuiz = () => {
    const results: QuestionResult[] = questions.map((q, index) => ({
      questionId: Number(q.id),
      question: q.question,
      selectedAnswer: answers[index] ?? -1,
      correctAnswer: q.correctAnswer,
      isCorrect: answers[index] === q.correctAnswer,
      timeSpent: timesSpent[index]
    }));

    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalTime = timesSpent.reduce((sum, time) => sum + time, 0);

    const quizResult: QuizResult & { score: number } = {
      category,
      difficulty,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers: questions.length - correctAnswers,
      totalTime,
      results,
      score: totalScore
    };

    if (ws && mode === 'multiplayer') {
       ws.send(JSON.stringify({ action: 'finish' }));
    }

    onCompleteRef.current(quizResult);
  };

  const timerColor = timeLeft <= 5 ? 'text-red-500' : timeLeft <= 10 ? 'text-yellow-500' : 'text-green-500';
  const timerProgress = (timeLeft / timerDuration) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 p-6 flex max-w-7xl mx-auto gap-8">
        {mode === 'multiplayer' && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 hidden lg:block shrink-0"
          >
            <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-2 border-white/50 sticky top-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 font-bold text-center rounded-t-xl shadow-md border-b-2 border-white/20">
                Live Leaderboard
              </div>
              <CardContent className="p-4 space-y-3 pt-6">
                {Object.entries(multiplayerScores)
                  .sort(([, a], [, b]) => b.score - a.score)
                  .map(([name, data], idx) => (
                    <motion.div 
                      key={name}
                      layout
                      className="bg-gray-50 p-3 rounded-xl flex justify-between items-center shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="font-bold text-gray-400 text-sm">#{idx + 1}</span>
                        <span className="font-medium text-gray-800 truncate" title={name}>{name}</span>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pl-2">
                        <span className="font-bold text-purple-600">{data.score}</span>
                        {data.hasFinished && <span className="text-[10px] uppercase font-bold text-green-500 tracking-wider">Done</span>}
                      </div>
                    </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="flex-1 w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 capitalize">
                  {category} Quiz
                </h2>
                <p className="text-gray-600 capitalize text-lg mt-1">
                  Difficulty: <span className="font-bold">{difficulty}</span>
                </p>
              </div>
              
              {mode !== 'practice' && (
                <motion.div 
                  className="relative"
                  animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
                >
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={314}
                      strokeDashoffset={314 - (314 * timerProgress) / 100}
                      strokeLinecap="round"
                      className={timeLeft <= 5 ? 'text-red-500' : timeLeft <= 10 ? 'text-yellow-500' : 'text-green-500'}
                      initial={{ strokeDashoffset: 314 }}
                      animate={{ strokeDashoffset: 314 - (314 * timerProgress) / 100 }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Timer className={`w-6 h-6 mx-auto mb-1 ${timerColor}`} />
                      <span className={`text-2xl font-bold ${timerColor}`}>
                        {timeLeft}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-700 font-medium">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-4" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-3 mb-8"
          >
            {questions.map((_, index) => {
              const isCurrentQuestion = index === currentQuestionIndex;
              const hasAnswer = answers[index] !== null;
              let buttonClass = 'w-12 h-12 rounded-full font-bold transition-all shadow-lg ';
              
              if (isCurrentQuestion) {
                buttonClass += 'bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-125 ring-4 ring-blue-300';
              } else if (hasAnswer) {
                buttonClass += 'bg-gradient-to-br from-green-500 to-emerald-500 text-white';
              } else {
                buttonClass += 'bg-white text-gray-600 border-2 border-gray-300';
              }
              buttonClass += ' hover:scale-110';

              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setSelectedAnswer(answers[index]);
                    setTimeLeft(timerDuration);
                    setIsAnswered(answers[index] !== null);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={buttonClass}
                  id={`question-nav-${index + 1}`}
                >
                  {index + 1}
                </motion.button>
              );
            })}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-2 border-white/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardContent className="p-10">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-xl shadow-lg flex-shrink-0">
                      {currentQuestionIndex + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 leading-relaxed" id={`question-${currentQuestionIndex + 1}`}>
                      {currentQuestion.question}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {currentQuestion.options.map((option: string, index: number) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQuestion.correctAnswer;
                      const showResult = isAnswered;

                      let cardClass = 'w-full p-6 rounded-2xl text-left transition-all ';
                      
                      if (showResult) {
                        if (isSelected && isCorrect) {
                          cardClass += 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500 shadow-xl';
                        } else if (isSelected && !isCorrect) {
                          cardClass += 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-500 shadow-xl';
                        } else if (isCorrect) {
                          cardClass += 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-lg';
                        } else {
                          cardClass += 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300';
                        }
                      } else if (isSelected) {
                        cardClass += 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-500 shadow-xl';
                      } else {
                        cardClass += 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 hover:border-blue-400 hover:shadow-lg';
                      }
                      
                      cardClass += isAnswered ? ' cursor-default' : ' cursor-pointer';

                      let badgeClass = 'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ';
                      if (showResult && isCorrect) {
                        badgeClass += 'bg-gradient-to-br from-green-500 to-emerald-500 text-white';
                      } else if (showResult && isSelected && !isCorrect) {
                        badgeClass += 'bg-gradient-to-br from-red-500 to-pink-500 text-white';
                      } else if (isSelected) {
                        badgeClass += 'bg-gradient-to-br from-blue-500 to-purple-500 text-white';
                      } else {
                        badgeClass += 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700';
                      }

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={isAnswered}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={!isAnswered ? { scale: 1.02, x: 4 } : {}}
                          whileTap={!isAnswered ? { scale: 0.98 } : {}}
                          className={cardClass}
                          id={`option-${index + 1}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <motion.div 
                                className={badgeClass}
                                whileHover={!isAnswered ? { rotate: 360 } : {}}
                                transition={{ duration: 0.5 }}
                              >
                                {String.fromCharCode(65 + index)}
                              </motion.div>
                              <span className="text-lg font-semibold text-gray-800">{option}</span>
                            </div>
                            {showResult && isCorrect && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              >
                                <CheckCircle className="w-8 h-8 text-green-500" />
                              </motion.div>
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              >
                                <XCircle className="w-8 h-8 text-red-500" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="lg"
                className="px-10 py-6 text-lg font-bold rounded-xl border-2 shadow-lg disabled:opacity-50"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Previous
              </Button>
            </motion.div>

            {currentQuestionIndex < questions.length - 1 ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={goToNextQuestion}
                  disabled={!isAnswered}
                  size="lg"
                  className="px-10 py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={submitQuiz}
                  disabled={!isAnswered}
                  size="lg"
                  className="px-10 py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl disabled:opacity-50"
                  id="submit-quiz-button"
                >
                  Submit Quiz
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
