import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Play, Copy, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

interface Player {
  score: number;
  isReady: boolean;
  hasFinished: boolean;
}

interface MultiplayerLobbyProps {
  roomId: string;
  username: string;
  onBack: () => void;
  onStartGame: () => void;
}

export function MultiplayerLobby({ roomId, username, onBack, onStartGame }: MultiplayerLobbyProps) {
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [copied, setCopied] = useState(false);

  const onStartGameRef = useRef(onStartGame);
  useEffect(() => {
    onStartGameRef.current = onStartGame;
  }, [onStartGame]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/multiplayer/${roomId}`);
    
    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'join', username }));
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'state_update') {
        setPlayers(data.players);
      } else if (data.type === 'game_started') {
        onStartGameRef.current();
      }
    };

    return () => {
      socket.close();
    };
  }, [roomId, username]);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReady = () => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'ready' }));
      setIsReady(true);
    }
  };

  const startGameMatch = () => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'start' }));
    }
  };

  const playerNames = Object.keys(players);
  const allReady = playerNames.length > 0 && playerNames.every(name => players[name].isReady);
  const isHost = playerNames[0] === username; // First person to join is soft-host

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border-2 border-white/20 overflow-hidden rounded-3xl text-white">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-8">
              <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 w-5 h-5" /> Leave Room
              </Button>
              <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-xl">
                <span className="font-medium text-purple-200">Room Code:</span>
                <span className="font-bold text-xl tracking-widest">{roomId}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20" onClick={handleCopy}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Users className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold mb-2">Multiplayer Lobby</h2>
              <p className="text-purple-200">Waiting for players to join and ready up...</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Players in Room ({playerNames.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {playerNames.map((name) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={name}
                      className="flex items-center justify-between bg-white/10 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-lg text-white">
                          {name} {name === username && "(You)"} {name === playerNames[0] && "👑"}
                        </span>
                      </div>
                      
                      {players[name].isReady ? (
                        <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Ready
                        </span>
                      ) : (
                        <span className="text-yellow-400/80 italic text-sm">Selecting Loadout...</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {!isReady ? (
                <Button 
                  size="lg" 
                  onClick={toggleReady}
                  className="w-full py-6 text-xl rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-xl shadow-indigo-500/20"
                >
                  I'm Ready!
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-white/10 flex items-center justify-center py-4 rounded-xl border border-white/20 font-medium text-purple-200">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" /> You are ready
                  </div>
                  {isHost && (
                    <Button 
                      size="lg"
                      onClick={startGameMatch}
                      disabled={!allReady || playerNames.length < 1} // allow solo start for testing
                      className="flex-1 py-6 text-xl rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl shadow-green-500/20 disabled:opacity-50"
                    >
                      <Play className="mr-2 w-6 h-6" /> Start Match
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
