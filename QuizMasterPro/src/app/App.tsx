import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPage } from '@/app/components/LandingPage';
import { QuizHome } from '@/app/components/QuizHome';
import { QuizInterface, QuizResult } from '@/app/components/QuizInterface';
import { QuizResults } from '@/app/components/QuizResults';
import { Profile } from '@/app/pages/Profile';
import { getQuestionsByCategory } from '@/app/data/quizData';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthOverlay } from '@/app/components/AuthOverlay';
import { QuizModeSelector, QuizMode } from '@/app/components/QuizModeSelector';
import { MultiplayerLobby } from '@/app/components/MultiplayerLobby';
import { ChatbotFAQ } from '@/app/components/ChatbotFAQ';
import { api } from '@/services/api';
import { 
  Brain, 
  Trophy, 
  Zap, 
  Target, 
  Award,
  Sparkles,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { auth, getQuestions } from '@/services/firebase';
import { Leaderboard } from '@/app/pages/Leaderboard';
import { AdminPanel } from '@/app/pages/AdminPanel';

type AppState = 'landing' | 'auth' | 'home' | 'mode-select' | 'lobby' | 'quiz' | 'results' | 'leaderboard' | 'admin' | 'profile';

function App() {
  const { user, logout } = useAuth();
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<QuizMode>('timed');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    // If we're on the auth page and the user logs in, go to home
    if (appState === 'auth' && user) {
      setAppState('home');
    }
  }, [user, appState]);

  const handleEnterApp = () => {
    if (user) {
      setAppState('home');
    } else {
      setAppState('auth');
    }
  };

  const handleStartQuiz = async (category: string, difficulty: string) => {
    // If auth is completely required to even access home, we wouldn't be here.
    // However, if a guest user arrives here, we should let them proceed.
    // To be safe, we allow any user (including guest/null if they bypassed auth overlay) to start the quiz.
    
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);
    setAppState('mode-select');
  };

  const handleModeSelect = async (mode: QuizMode, customStringArg?: string) => {
    setSelectedMode(mode);
    setIsLoadingQuestions(true);
    setAppState('quiz'); // Default to quiz screen to show loading state
    
    try {
      if (mode === 'multiplayer') {
         if (customStringArg) {
           setRoomId(customStringArg);
         } else {
           setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase());
         }
         setAppState('lobby');
         
         const fetchedQuestions = await api.getQuestions(selectedCategory, selectedDifficulty);
         setDynamicQuestions(fetchedQuestions.length > 0 ? fetchedQuestions : getQuestionsByCategory(selectedCategory, selectedDifficulty));
         
      } else if (mode === 'ai') {
         // customStringArg holds the topic the user typed in
         setSelectedCategory(customStringArg || 'Random Topic');
         const aiQuestions = await api.generateAiQuiz(customStringArg || 'Random Topic', selectedDifficulty);
         setDynamicQuestions(aiQuestions);
         
      } else {
         const fetchedQuestions = await api.getQuestions(selectedCategory, selectedDifficulty);
         if (fetchedQuestions.length > 0) {
           setDynamicQuestions(fetchedQuestions);
         } else {
           setDynamicQuestions(getQuestionsByCategory(selectedCategory, selectedDifficulty));
         }
      }
    } catch (error) {
      console.error("Error fetching/generating questions:", error);
      if (mode !== 'ai') {
        setDynamicQuestions(getQuestionsByCategory(selectedCategory, selectedDifficulty));
      } else {
        // Fallback for AI if it fails
        setDynamicQuestions(getQuestionsByCategory('General', 'medium'));
        alert("Failed to generate AI quiz. Falling back to standard questions.");
      }
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    setQuizResult(result);
    setAppState('results');
    
    let targetUserId = user?.uid;
    let targetUsername = user?.displayName || user?.email?.split('@')[0];

    if (!targetUserId) {
       targetUserId = localStorage.getItem('guestUserId');
       if (!targetUserId) {
           targetUserId = 'guest_' + Math.random().toString(36).substring(2, 9);
           localStorage.setItem('guestUserId', targetUserId);
       }
       targetUsername = 'Guest Player';
    }

    try {
      await api.saveResult({
        userId: targetUserId,
        username: targetUsername || 'Anonymous',
        score: (result as any).score || 0,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        timeTaken: result.totalTime,
        category: result.category,
        difficulty: result.difficulty
      });
    } catch (err) {
      console.error("Failed to save result to backend:", err);
    }
  };

  const handleRetakeQuiz = () => {
    setAppState('quiz');
  };

  const handleGoHome = () => {
    setAppState('home');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setQuizResult(null);
  };

  const handleOpenLeaderboard = () => {
    setAppState('leaderboard');
  };

  const handleOpenAdmin = () => {
    setAppState('admin');
  };

  const handleOpenProfile = () => {
    setAppState('profile');
  };

  const questions = getQuestionsByCategory(selectedCategory, selectedDifficulty);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 }
  };

  const pageTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  };

  return (
    <div className="min-h-screen">
      <ChatbotFAQ />
      {user && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4 bg-white/80 backdrop-blur-md p-2 pl-4 rounded-full shadow-lg border border-white/50">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-800">{user.displayName || user.email?.split('@')[0]}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {appState === 'auth' && (
          <motion.div
            key="auth"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
          >
            <AuthOverlay isOpen={true} onClose={() => setAppState('home')} />
          </motion.div>
        )}

        {appState === 'landing' && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <LandingPage onEnter={handleEnterApp} />
          </motion.div>
        )}
        
        {appState === 'home' && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <QuizHome onStartQuiz={handleStartQuiz} />
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleOpenLeaderboard}
                className="rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border-2"
              >
                <Trophy className="mr-2 w-5 h-5 text-yellow-500" />
                Leaderboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleOpenAdmin}
                className="rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border-2"
              >
                <LayoutDashboard className="mr-2 w-5 h-5 text-blue-500" />
                Admin
              </Button>
              <Button 
                variant="outline" 
                onClick={handleOpenProfile}
                className="rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border-2"
              >
                <UserIcon className="mr-2 w-5 h-5 text-indigo-500" />
                Profile
              </Button>
            </div>
          </motion.div>
        )}

        {appState === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Leaderboard onBack={handleGoHome} />
          </motion.div>
        )}

        {appState === 'admin' && (
          <motion.div
            key="admin"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <AdminPanel onBack={handleGoHome} />
          </motion.div>
        )}

        {appState === 'profile' && (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Profile onBack={handleGoHome} />
          </motion.div>
        )}
        
        {appState === 'mode-select' && (
          <motion.div
            key="mode-select"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <QuizModeSelector 
              category={selectedCategory} 
              onSelect={handleModeSelect} 
              onCancel={() => setAppState('home')}
            />
          </motion.div>
        )}

        {appState === 'lobby' && (
          <motion.div
            key="lobby"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <MultiplayerLobby 
              roomId={roomId}
              username={user?.displayName || user?.email?.split('@')[0] || 'Guest'}
              onBack={() => setAppState('home')}
              onStartGame={() => setAppState('quiz')}
            />
          </motion.div>
        )}

        {appState === 'quiz' && (
          <motion.div
            key="quiz"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {isLoadingQuestions ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : dynamicQuestions.length > 0 ? (
              <QuizInterface
                questions={dynamicQuestions}
                category={selectedCategory}
                difficulty={selectedDifficulty}
                mode={selectedMode}
                roomId={roomId}
                username={user?.displayName || user?.email?.split('@')[0] || 'Guest'}
                onComplete={handleQuizComplete}
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-xl text-gray-600">No questions found for this selection.</p>
                <Button onClick={handleGoHome}>Go Back</Button>
              </div>
            )}
          </motion.div>
        )}
        
        {appState === 'results' && quizResult && (
          <motion.div
            key="results"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <QuizResults
              result={quizResult}
              onRetakeQuiz={handleRetakeQuiz}
              onGoHome={handleGoHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;