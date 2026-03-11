import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, TrendingUp, Award, Clock, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { api, QuizResult } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    try {
      const targetUserId = user ? user.uid : localStorage.getItem('guestUserId');
      if (targetUserId) {
        const data = await api.getHistory(targetUserId);
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalScore = history.reduce((sum, r) => sum + r.score, 0);
  const avgAccuracy = history.length > 0 
    ? Math.round((history.reduce((sum, r) => sum + (r.correctAnswers / r.totalQuestions), 0) / history.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <History className="w-10 h-10 text-blue-600" />
              Your Progress
            </h1>
          </motion.div>
          <Button onClick={onBack} variant="outline" className="rounded-xl border-2">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                < Award className="w-10 h-10 opacity-80" />
                <div>
                  <p className="text-blue-100 font-medium">Total Score</p>
                  <p className="text-3xl font-bold">{totalScore.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-10 h-10 opacity-80" />
                <div>
                  <p className="text-purple-100 font-medium">Avg. Accuracy</p>
                  <p className="text-3xl font-bold">{avgAccuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="w-10 h-10 opacity-80" />
                <div>
                  <p className="text-orange-100 font-medium">Quizzes Taken</p>
                  <p className="text-3xl font-bold">{history.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gray-100/50">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading your history...</div>
            ) : history.length === 0 ? (
              <div className="p-10 text-center text-gray-500">No quizzes taken yet. Start your journey!</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {history.map((result, index) => (
                  <div key={index} className="p-6 flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 capitalize">{result.category} - {result.difficulty}</p>
                        <p className="text-sm text-gray-500">Score: <span className="text-blue-600 font-bold">{result.score}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{result.correctAnswers}/{result.totalQuestions} Correct</p>
                        <p className="text-xs text-gray-500">{result.timeTaken}s Total Time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
