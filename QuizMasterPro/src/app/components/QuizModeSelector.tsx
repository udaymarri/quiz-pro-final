import { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Clock, Users, Zap, ShieldQuestion as QuestionMark, ArrowRight, PlusCircle, LogIn } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

export type QuizMode = 'practice' | 'timed' | 'multiplayer' | 'ai';

interface QuizModeSelectorProps {
  onSelect: (mode: QuizMode, roomId?: string) => void;
  onCancel: () => void;
  category: string;
}

export function QuizModeSelector({ onSelect, onCancel, category }: QuizModeSelectorProps) {
  const [showMultiplayerMenu, setShowMultiplayerMenu] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const modes: { id: QuizMode; name: string; description: string; icon: any; color: string }[] = [
    {
      id: 'practice',
      name: 'Practice Mode',
      description: 'No timer. Relax and learn at your own pace.',
      icon: QuestionMark,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ai',
      name: 'AI Dynamic',
      description: 'Generate a unique quiz instantly using AI.',
      icon: Zap,
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'timed',
      name: 'Timed Challenge',
      description: '15s per question. Earn weighted bonuses for speed!',
      icon: Clock,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'multiplayer',
      name: 'Live Multiplayer',
      description: 'Real-time battle against others! (Coming Soon)',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl max-h-[100dvh] overflow-y-auto py-8"
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-2 border-white/50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardContent className="p-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {showMultiplayerMenu ? "Multiplayer Match" : "Choose Your Mode"}
              </h2>
              <p className="text-gray-600 text-lg">
                Preparing for <span className="font-bold text-blue-600 capitalize">{category}</span> quiz
              </p>
            </div>

            {showMultiplayerMenu ? (
              <div className="max-w-md mx-auto space-y-6 mb-10">
                <Card className="border-2 border-purple-200 hover:border-purple-500 transition-all shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                      <PlusCircle className="mr-2 text-purple-500" /> Create New Match
                    </h3>
                    <p className="text-gray-600 mb-4">Start a new room and invite your friends.</p>
                    <Button 
                      onClick={() => onSelect('multiplayer')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110"
                    >
                      Host Game
                    </Button>
                  </CardContent>
                </Card>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 font-medium">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <Card className="border-2 border-blue-200 hover:border-blue-500 transition-all shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                      <LogIn className="mr-2 text-blue-500" /> Join Existing Match
                    </h3>
                    <p className="text-gray-600 mb-4">Have a room code? Enter it below.</p>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={joinCode}
                         onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                         placeholder="Enter 6-letter Code"
                         maxLength={6}
                         className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none uppercase text-center font-bold tracking-widest"
                       />
                       <Button 
                         onClick={() => onSelect('multiplayer', joinCode)}
                         disabled={joinCode.length < 3}
                         className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:brightness-110"
                       >
                         Join
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {modes.map((mode, index) => {
                  const Icon = mode.icon;
                  return (
                  <motion.div
                    key={mode.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="cursor-pointer h-full border-2 hover:border-blue-500 transition-all shadow-lg group"
                      onClick={() => {
                        if (mode.id === 'multiplayer') {
                          setShowMultiplayerMenu(true);
                        } else {
                          onSelect(mode.id);
                        }
                      }}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${mode.color} shadow-lg mb-4 text-white group-hover:rotate-12 transition-transform`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{mode.name}</h3>
                        <p className="text-gray-600 mb-6">{mode.description}</p>
                        <Button 
                          className={`w-full font-bold bg-gradient-to-r ${mode.color} hover:brightness-110 shadow-md`}
                        >
                          Select
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
                <div className="text-center md:col-span-3 mt-4 mb-8">
                  {modes.find(m => m.id === 'ai') && (
                     <div className="max-w-md mx-auto p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 mt-4">
                        <h4 className="font-bold text-emerald-800 mb-2 flex items-center justify-center gap-2"><Zap className="w-5 h-5"/> Custom AI Topic</h4>
                        <div className="flex gap-2">
                           <input 
                             type="text" 
                             id="ai-topic-input"
                             placeholder="e.g. Quantum Physics, History of Rome..."
                             className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                             onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                 onSelect('ai' as QuizMode, (e.target as HTMLInputElement).value);
                               }
                             }}
                           />
                           <Button 
                             onClick={(e) => {
                               const input = document.getElementById('ai-topic-input') as HTMLInputElement;
                               if(input.value) onSelect('ai' as QuizMode, input.value);
                             }}
                             className="bg-emerald-500 hover:bg-emerald-600"
                           >
                             Generate
                           </Button>
                        </div>
                     </div>
                  )}
                </div>
            </div>
            )}

            <div className="text-center">
              {showMultiplayerMenu ? (
                <Button 
                  variant="ghost" 
                  onClick={() => setShowMultiplayerMenu(false)}
                  className="text-gray-500 hover:text-gray-800 font-bold"
                >
                  Back to Modes
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={onCancel}
                  className="text-gray-500 hover:text-gray-800 font-bold"
                >
                  Go Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
