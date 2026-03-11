import { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Atom, BookOpen, Globe, Calculator, Brain, Trophy, Clock, Target, Sparkles, Zap, Award } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { categories } from '@/app/data/quizData';

interface QuizHomeProps {
  onStartQuiz: (category: string, difficulty: string) => void;
}

const iconMap: { [key: string]: any } = {
  Code,
  Atom,
  BookOpen,
  Globe,
  Calculator,
  Brain
};

const difficultyLevels = [
  {
    id: 'easy',
    name: 'Easy',
    description: '3 Questions • 20s per question',
    color: 'bg-green-500',
    questions: 3
  },
  {
    id: 'medium',
    name: 'Medium',
    description: '3 Questions • 25s per question',
    color: 'bg-yellow-500',
    questions: 3
  },
  {
    id: 'hard',
    name: 'Hard',
    description: '2 Questions • 30s per question',
    color: 'bg-red-500',
    questions: 2
  }
];

export function QuizHome({ onStartQuiz }: QuizHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const handleStartQuiz = () => {
    if (selectedCategory && selectedDifficulty) {
      onStartQuiz(selectedCategory, selectedDifficulty);
    }
  };

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-cyan-500'
  ];

  const gradientClasses = {
    easy: 'from-green-500 to-emerald-500',
    medium: 'from-yellow-500 to-orange-500',
    hard: 'from-red-500 to-pink-500'
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-center mb-12"
          >
            <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-lg" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                QuizMaster Pro
              </h1>
              <Sparkles className="w-16 h-16 text-pink-500 drop-shadow-lg" />
            </motion.div>
            <p className="text-xl text-gray-700 font-medium">
              Test your knowledge across multiple categories and difficulty levels
            </p>
          </motion.div>

          {/* Features Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-white/70 backdrop-blur-md border-2 border-white/50 shadow-xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Timed Questions</h3>
                    <p className="text-sm text-gray-600">Beat the clock!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-white/70 backdrop-blur-md border-2 border-white/50 shadow-xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Multiple Categories</h3>
                    <p className="text-sm text-gray-600">Choose your expertise</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="bg-white/70 backdrop-blur-md border-2 border-white/50 shadow-xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Detailed Analysis</h3>
                    <p className="text-sm text-gray-600">Track your performance</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              Select a Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const Icon = iconMap[category.icon];
                const isSelected = selectedCategory === category.id;
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all h-full relative overflow-hidden ${
                        isSelected
                          ? 'ring-4 ring-blue-500 shadow-2xl'
                          : 'hover:shadow-xl'
                      } bg-white/80 backdrop-blur-sm border-2 border-white/50`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {isSelected && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <CardHeader className="relative">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className={`p-4 rounded-xl shadow-lg bg-gradient-to-br ${gradients[index % gradients.length]}`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </motion.div>
                          <div>
                            <CardTitle className="text-xl">{category.name}</CardTitle>
                            <CardDescription className="text-gray-600">{category.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Difficulty Selection */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-500" />
                Select Difficulty
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {difficultyLevels.map((level, index) => {
                  const isSelected = selectedDifficulty === level.id;
                  
                  return (
                    <motion.div
                      key={level.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all h-full relative overflow-hidden ${
                          isSelected
                            ? 'ring-4 ring-purple-500 shadow-2xl'
                            : 'hover:shadow-xl'
                        } bg-white/80 backdrop-blur-sm border-2 border-white/50`}
                        onClick={() => setSelectedDifficulty(level.id)}
                      >
                        {isSelected && (
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <CardContent className="p-8 relative">
                          <div className="flex items-center gap-4 mb-4">
                            <motion.div 
                              className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClasses[level.id as keyof typeof gradientClasses]} shadow-lg flex items-center justify-center`}
                              whileHover={{ scale: 1.2, rotate: 180 }}
                              transition={{ duration: 0.4 }}
                            >
                              <span className="text-white font-bold text-xl">{level.name[0]}</span>
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800">{level.name}</h3>
                          </div>
                          <p className="text-gray-600 font-medium">{level.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          {selectedCategory && selectedDifficulty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleStartQuiz}
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-8 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all overflow-hidden group"
                  id="start-quiz-button"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Start Quiz
                    <Trophy className="w-6 h-6" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
