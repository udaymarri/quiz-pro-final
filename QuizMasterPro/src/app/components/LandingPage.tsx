import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { 
  Brain, 
  Trophy, 
  Sparkles, 
  Zap, 
  Target, 
  Award,
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax effects
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Floating quiz elements data
  const floatingElements = [
    { 
      id: 1, 
      Icon: HelpCircle, 
      color: 'text-blue-500', 
      size: 'w-16 h-16',
      x: '15%', 
      y: '20%',
      duration: 15,
      delay: 0
    },
    { 
      id: 2, 
      Icon: Brain, 
      color: 'text-purple-500', 
      size: 'w-20 h-20',
      x: '80%', 
      y: '15%',
      duration: 18,
      delay: 2
    },
    { 
      id: 3, 
      Icon: Trophy, 
      color: 'text-yellow-500', 
      size: 'w-14 h-14',
      x: '10%', 
      y: '70%',
      duration: 16,
      delay: 1
    },
    { 
      id: 4, 
      Icon: Zap, 
      color: 'text-orange-500', 
      size: 'w-12 h-12',
      x: '85%', 
      y: '65%',
      duration: 14,
      delay: 3
    },
    { 
      id: 5, 
      Icon: Target, 
      color: 'text-pink-500', 
      size: 'w-16 h-16',
      x: '20%', 
      y: '45%',
      duration: 17,
      delay: 0.5
    },
    { 
      id: 6, 
      Icon: BookOpen, 
      color: 'text-cyan-500', 
      size: 'w-14 h-14',
      x: '75%', 
      y: '40%',
      duration: 19,
      delay: 1.5
    },
    { 
      id: 7, 
      Icon: Award, 
      color: 'text-green-500', 
      size: 'w-12 h-12',
      x: '5%', 
      y: '90%',
      duration: 15,
      delay: 2.5
    },
    { 
      id: 8, 
      Icon: CheckCircle, 
      color: 'text-emerald-500', 
      size: 'w-10 h-10',
      x: '90%', 
      y: '85%',
      duration: 13,
      delay: 1.8
    },
  ];

  // Premium feature stats
  const stats = [
    { value: '57+', label: 'Questions', icon: HelpCircle, gradient: 'from-blue-500 to-cyan-500' },
    { value: '6', label: 'Categories', icon: BookOpen, gradient: 'from-purple-500 to-pink-500' },
    { value: '3', label: 'Levels', icon: Target, gradient: 'from-orange-500 to-yellow-500' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium Gradient Background matching QuizHome */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
        {/* Animated Blob Background */}
        <div className="absolute inset-0 opacity-40">
          <motion.div 
            className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl"
            animate={{
              x: [0, -80, 0],
              y: [0, -80, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
        </div>
      </div>

      {/* Floating Quiz Icons */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute pointer-events-none"
          style={{
            left: element.x,
            top: element.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.3, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer"
          >
            <element.Icon 
              className={`${element.size} ${element.color} drop-shadow-lg opacity-60 hover:opacity-100 transition-opacity`}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Question Mark Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute text-2xl font-bold opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][i % 5],
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ?
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo with 3D Effect */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 20,
            delay: 0.2 
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            
            {/* Icon container */}
            <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-full shadow-2xl border-4 border-white/50">
              <motion.div
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Brain className="w-20 h-20 text-purple-600" />
              </motion.div>
            </div>

            {/* Orbiting icons */}
            {[Trophy, Sparkles, Star].map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.3,
                }}
              >
                <motion.div
                  style={{
                    x: Math.cos((index * 2 * Math.PI) / 3) * 80,
                    y: Math.sin((index * 2 * Math.PI) / 3) * 80,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  <Icon className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-6"
        >
          <motion.h1 
            className="text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            QuizMaster Pro
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-2xl text-gray-700 font-medium"
          >
            <TrendingUp className="w-6 h-6 text-green-500" />
            <span>Test Your Knowledge, Track Your Progress</span>
            <Zap className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl text-gray-600 text-center max-w-2xl mb-12 leading-relaxed"
        >
          Experience the ultimate quiz platform with{' '}
          <span className="font-bold text-blue-600">timed challenges</span>,{' '}
          <span className="font-bold text-purple-600">multiple categories</span>, and{' '}
          <span className="font-bold text-pink-600">detailed analytics</span>
        </motion.p>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.08, y: -5 }}
              className="relative group"
            >
              <div className="bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
                
                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-2xl"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            id="landing-enter-button"
            onClick={onEnter}
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-8 text-2xl font-bold rounded-2xl shadow-2xl overflow-hidden transition-all"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            
            <span className="relative flex items-center gap-4">
              <Sparkles className="w-7 h-7" />
              Start Your Journey
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-7 h-7" />
              </motion.div>
            </span>
          </Button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16 flex flex-wrap justify-center gap-6 max-w-4xl"
        >
          {[
            { icon: Clock, text: 'Timed Challenges' },
            { icon: Award, text: 'Detailed Analytics' },
            { icon: Trophy, text: 'Achievement System' },
            { icon: TrendingUp, text: 'Progress Tracking' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -3 }}
              className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-full border-2 border-white/50 shadow-lg"
            >
              <feature.icon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">{feature.text}</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Animated Sparkles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
