import { motion } from 'motion/react';
import { Trophy, Clock, CheckCircle, XCircle, BarChart3, TrendingUp, Home, RotateCcw, Star, Award, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { QuizResult } from '@/app/components/QuizInterface';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { saveQuizResult } from '@/services/firebase';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface QuizResultsProps {
  result: QuizResult & { score?: number };
  onRetakeQuiz: () => void;
  onGoHome: () => void;
}

export function QuizResults({ result, onRetakeQuiz, onGoHome }: QuizResultsProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const score = result.score ?? Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const scorePercentage = (result.correctAnswers / result.totalQuestions) * 100;
  const averageTime = result.totalTime / result.totalQuestions;

  useEffect(() => {
    const saveResult = async () => {
      if (!user) return;
      
      setIsSaving(true);
      try {
        await saveQuizResult({
          userId: user.uid,
          username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          score: score,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          timeTaken: result.totalTime,
          category: result.category,
          difficulty: result.difficulty
        });
      } catch (err: any) {
        console.error("Error saving result:", err);
        setSaveError("Failed to save result to leaderboard.");
      } finally {
        setIsSaving(false);
      }
    };

    saveResult();
  }, [user, result, score]);

  // Prepare data for time spent chart
  const timeChartData = result.results.map((r, index) => ({
    question: `Q${index + 1}`,
    time: r.timeSpent,
    fill: r.isCorrect ? '#22c55e' : '#ef4444'
  }));

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Correct', value: result.correctAnswers, color: '#22c55e' },
    { name: 'Incorrect', value: result.incorrectAnswers, color: '#ef4444' }
  ];

  // Get performance message and color
  const getPerformanceMessage = () => {
    if (scorePercentage >= 80) {
      return { message: 'Outstanding!', color: 'text-green-600', emoji: '🎉' };
    } else if (scorePercentage >= 60) {
      return { message: 'Good Job!', color: 'text-blue-600', emoji: '👏' };
    } else if (scorePercentage >= 40) {
      return { message: 'Keep Practicing!', color: 'text-yellow-600', emoji: '💪' };
    } else {
      return { message: 'Try Again!', color: 'text-red-600', emoji: '📚' };
    }
  };

  const performance = getPerformanceMessage();

  // Confetti particles
  const confettiColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Confetti Animation */}
      {scorePercentage >= 60 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confetti.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: '-10%'
              }}
              initial={{ y: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: ['0vh', '110vh'],
                rotate: [0, 360, 720],
                opacity: [1, 1, 0],
                x: [0, Math.sin(particle.id) * 100]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-center mb-12"
          >
            <motion.div 
              className="flex items-center justify-center gap-4 mb-6"
              animate={{ 
                rotate: scorePercentage >= 80 ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 0.5,
                repeat: scorePercentage >= 80 ? Infinity : 0,
                repeatDelay: 1
              }}
            >
              <Trophy className="w-20 h-20 text-yellow-500 drop-shadow-2xl" />
              <Star className="w-16 h-16 text-yellow-400 drop-shadow-2xl" />
            </motion.div>
            <motion.h1 
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              Quiz Complete!
            </motion.h1>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, delay: 0.4 }}
            >
              <p className={`text-4xl font-bold ${performance.color} flex items-center justify-center gap-3`}>
                <span className="text-5xl">{performance.emoji}</span>
                {performance.message}
                <Sparkles className={`w-10 h-10 ${performance.color}`} />
              </p>
            </motion.div>
          </motion.div>

          {/* Score Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <CardContent className="p-8 text-center relative">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm opacity-90 mb-2 font-semibold">Score</p>
                  <motion.p 
                    className="text-5xl font-bold" 
                    id="score-percentage"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                  >
                    {score}
                  </motion.p>
                  <p className="text-xs opacity-75 mt-1">Points</p>
                  {isSaving && (
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Saving...
                    </div>
                  )}
                  {saveError && (
                    <p className="text-xs text-red-200 mt-2">{saveError}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <CardContent className="p-8 text-center relative">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm opacity-90 mb-2 font-semibold">Correct</p>
                  <motion.p 
                    className="text-5xl font-bold" 
                    id="correct-answers"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                  >
                    {result.correctAnswers}/{result.totalQuestions}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-2xl border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <CardContent className="p-8 text-center relative">
                  <XCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm opacity-90 mb-2 font-semibold">Incorrect</p>
                  <motion.p 
                    className="text-5xl font-bold" 
                    id="incorrect-answers"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                  >
                    {result.incorrectAnswers}/{result.totalQuestions}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-2xl border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <CardContent className="p-8 text-center relative">
                  <Clock className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm opacity-90 mb-2 font-semibold">Avg Time</p>
                  <motion.p 
                    className="text-5xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                  >
                    {averageTime.toFixed(1)}s
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Time Spent Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-2 border-white/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    Time Spent Per Question
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeChartData}>
                      <defs>
                        <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="colorIncorrect" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="question" stroke="#6b7280" />
                      <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: number) => [`${value}s`, 'Time']}
                        contentStyle={{ borderRadius: '12px', border: '2px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="time" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-gray-600 text-center mt-3 font-medium">
                    🟢 Green = Correct • 🔴 Red = Incorrect
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Accuracy Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-2 border-white/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    Answer Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <defs>
                        <linearGradient id="pieCorrect" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.9}/>
                        </linearGradient>
                        <linearGradient id="pieIncorrect" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0.9}/>
                        </linearGradient>
                      </defs>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Question Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-2 border-white/50 mb-10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  Question-by-Question Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.results.map((r, index) => (
                    <motion.div
                      key={r.questionId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 8 }}
                      className={`p-6 rounded-2xl border-2 shadow-lg transition-all ${
                        r.isCorrect
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                          : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <motion.div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ${
                              r.isCorrect 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                                : 'bg-gradient-to-br from-red-500 to-pink-500'
                            } text-white flex-shrink-0`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            {index + 1}
                          </motion.div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 mb-3 text-lg">{r.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                                {r.isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span className="text-gray-700 font-medium">
                                  Your Answer: <span className="font-bold">
                                    {r.selectedAnswer >= 0 ? String.fromCharCode(65 + r.selectedAnswer) : 'No Answer'}
                                  </span>
                                </span>
                              </div>
                              {!r.isCorrect && (
                                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="text-gray-700 font-medium">
                                    Correct Answer: <span className="font-bold text-green-700">
                                      {String.fromCharCode(65 + r.correctAnswer)}
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0 bg-white/60 px-4 py-2 rounded-xl">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <span className="text-base font-bold text-gray-700">
                            {r.timeSpent}s
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onRetakeQuiz}
                size="lg"
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-8 text-xl font-bold rounded-2xl shadow-2xl overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative flex items-center gap-3">
                  <RotateCcw className="w-6 h-6" />
                  Retake Quiz
                </span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onGoHome}
                size="lg"
                variant="outline"
                className="px-16 py-8 text-xl font-bold rounded-2xl border-4 border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-white shadow-xl"
              >
                <Home className="mr-3 w-6 h-6" />
                Back to Home
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}