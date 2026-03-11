import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, Clock, User as UserIcon, ArrowLeft, Loader2, Award, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { api } from '@/services/api';
import { format } from 'date-fns';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const topResults = await api.getLeaderboard(10);
        setResults(topResults);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1: return <Medal className="w-8 h-8 text-gray-400" />;
      case 2: return <Medal className="w-8 h-8 text-amber-600" />;
      default: return <span className="text-xl font-bold text-gray-400">#{rank + 1}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0: return 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-400';
      case 1: return 'bg-gray-50 border-gray-200 ring-2 ring-gray-300';
      case 2: return 'bg-amber-50 border-amber-200 ring-2 ring-amber-400';
      default: return 'bg-white border-gray-100 hover:border-blue-200';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="rounded-xl hover:bg-white/50 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-xl mb-4 group rotate-12 hover:rotate-0 transition-transform duration-500">
               <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Leaderboard
            </h1>
            <p className="text-gray-500 font-bold mt-2 tracking-widest uppercase text-sm">Top Global Players</p>
          </motion.div>
          <div className="w-24"></div> 
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <p className="text-xl font-bold text-blue-600/60 animate-pulse">Loading legends...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`relative p-6 rounded-3xl border-2 shadow-lg transition-all flex items-center justify-between ${getRankColor(index)}`}
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 flex justify-center">
                      {getRankIcon(index)}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white">
                        <UserIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                          {result.username}
                          {index < 3 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </h3>
                        <div className="flex items-center gap-4 text-sm font-bold text-gray-500 mt-1">
                          <span className="flex items-center gap-1 uppercase tracking-tighter">
                            <Zap className="w-3 h-3 text-orange-500" />
                            {result.category} • {result.difficulty}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.timestamp ? format(new Date(result.timestamp), 'MMM d, yyyy') : 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex flex-col">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {result.score}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">Score</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <Card className="bg-white/50 backdrop-blur-md border-dashed border-2 p-20 text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-400">No records yet. Be the first!</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
