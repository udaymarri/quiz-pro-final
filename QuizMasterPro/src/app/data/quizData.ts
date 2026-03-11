export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: QuizCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    icon: 'Code',
    description: 'Test your coding knowledge'
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'Atom',
    description: 'Explore scientific concepts'
  },
  {
    id: 'history',
    name: 'History',
    icon: 'BookOpen',
    description: 'Journey through time'
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    description: 'Discover the world'
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    description: 'Challenge your math skills'
  },
  {
    id: 'general',
    name: 'General Knowledge',
    icon: 'Brain',
    description: 'Test your trivia'
  }
];

export const questions: Question[] = [
  // Programming - Easy
  {
    id: 1,
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
    correctAnswer: 0,
    category: "programming",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2,
    category: "programming",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 1,
    category: "programming",
    difficulty: "easy"
  },
  
  // Programming - Medium
  {
    id: 4,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: "programming",
    difficulty: "medium"
  },
  {
    id: 5,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    category: "programming",
    difficulty: "medium"
  },
  {
    id: 6,
    question: "Which keyword is used to define a class in Python?",
    options: ["function", "class", "def", "struct"],
    correctAnswer: 1,
    category: "programming",
    difficulty: "medium"
  },

  // Programming - Hard
  {
    id: 7,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that has access to variables in its outer scope",
      "A way to close the browser window",
      "A method to end a loop",
      "A type of error handling"
    ],
    correctAnswer: 0,
    category: "programming",
    difficulty: "hard"
  },
  {
    id: 8,
    question: "What design pattern ensures a class has only one instance?",
    options: ["Factory Pattern", "Singleton Pattern", "Observer Pattern", "Decorator Pattern"],
    correctAnswer: 1,
    category: "programming",
    difficulty: "hard"
  },
  
  // Programming - Hard (Additional)
  {
    id: 41,
    question: "What is the primary purpose of the Virtual DOM in React?",
    options: [
      "To optimize rendering performance by minimizing direct DOM manipulations",
      "To store application state permanently",
      "To handle HTTP requests",
      "To manage CSS styles"
    ],
    correctAnswer: 0,
    category: "programming",
    difficulty: "hard"
  },
  
  // Science - Easy
  {
    id: 9,
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "O2", "HO"],
    correctAnswer: 0,
    category: "science",
    difficulty: "easy"
  },
  {
    id: 10,
    question: "What planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctAnswer: 2,
    category: "science",
    difficulty: "easy"
  },
  {
    id: 11,
    question: "What force keeps us on the ground?",
    options: ["Magnetism", "Friction", "Gravity", "Inertia"],
    correctAnswer: 2,
    category: "science",
    difficulty: "easy"
  },

  // Science - Medium
  {
    id: 12,
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
    correctAnswer: 1,
    category: "science",
    difficulty: "medium"
  },
  {
    id: 13,
    question: "What is the speed of light in vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
    correctAnswer: 0,
    category: "science",
    difficulty: "medium"
  },
  {
    id: 14,
    question: "What is the most abundant gas in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: 2,
    category: "science",
    difficulty: "medium"
  },

  // Science - Hard
  {
    id: 15,
    question: "What is the Heisenberg Uncertainty Principle?",
    options: [
      "You cannot know both position and momentum precisely",
      "Energy cannot be created or destroyed",
      "Matter cannot be created or destroyed",
      "Light behaves as both wave and particle"
    ],
    correctAnswer: 0,
    category: "science",
    difficulty: "hard"
  },
  
  // Science - Hard (Additional)
  {
    id: 42,
    question: "What is the process by which plants convert light energy into chemical energy?",
    options: ["Respiration", "Photosynthesis", "Osmosis", "Transpiration"],
    correctAnswer: 1,
    category: "science",
    difficulty: "hard"
  },

  // History - Easy
  {
    id: 16,
    question: "Who was the first President of the United States?",
    options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
    correctAnswer: 1,
    category: "history",
    difficulty: "easy"
  },
  {
    id: 17,
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    category: "history",
    difficulty: "easy"
  },
  {
    id: 18,
    question: "Who discovered America in 1492?",
    options: ["Marco Polo", "Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan"],
    correctAnswer: 1,
    category: "history",
    difficulty: "easy"
  },

  // History - Medium
  {
    id: 19,
    question: "The Renaissance began in which country?",
    options: ["France", "Spain", "Italy", "England"],
    correctAnswer: 2,
    category: "history",
    difficulty: "medium"
  },
  {
    id: 20,
    question: "Who wrote the Declaration of Independence?",
    options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "John Adams"],
    correctAnswer: 2,
    category: "history",
    difficulty: "medium"
  },

  // History - Medium (Additional)
  {
    id: 43,
    question: "Who was the first man to walk on the moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"],
    correctAnswer: 1,
    category: "history",
    difficulty: "medium"
  },
  {
    id: 44,
    question: "The French Revolution began in which year?",
    options: ["1776", "1789", "1799", "1804"],
    correctAnswer: 1,
    category: "history",
    difficulty: "medium"
  },

  // History - Hard
  {
    id: 21,
    question: "What year did the Berlin Wall fall?",
    options: ["1987", "1988", "1989", "1990"],
    correctAnswer: 2,
    category: "history",
    difficulty: "hard"
  },

  // Geography - Easy
  {
    id: 22,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "geography",
    difficulty: "easy"
  },
  {
    id: 23,
    question: "Which ocean is the largest?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    category: "geography",
    difficulty: "easy"
  },
  {
    id: 24,
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    category: "geography",
    difficulty: "easy"
  },

  // Geography - Medium
  {
    id: 25,
    question: "What is the longest river in the world?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correctAnswer: 1,
    category: "geography",
    difficulty: "medium"
  },
  {
    id: 26,
    question: "Mount Everest is located in which mountain range?",
    options: ["Alps", "Andes", "Rockies", "Himalayas"],
    correctAnswer: 3,
    category: "geography",
    difficulty: "medium"
  },

  // Geography - Medium (Additional)
  {
    id: 45,
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
    category: "geography",
    difficulty: "medium"
  },
  {
    id: 46,
    question: "Which desert is the largest hot desert in the world?",
    options: ["Gobi Desert", "Sahara Desert", "Arabian Desert", "Kalahari Desert"],
    correctAnswer: 1,
    category: "geography",
    difficulty: "medium"
  },

  // Geography - Hard
  {
    id: 27,
    question: "What is the smallest country in the world by area?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1,
    category: "geography",
    difficulty: "hard"
  },

  // Math - Easy
  {
    id: 28,
    question: "What is 5 + 7?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    category: "math",
    difficulty: "easy"
  },
  {
    id: 29,
    question: "What is 10 × 10?",
    options: ["10", "50", "100", "1000"],
    correctAnswer: 2,
    category: "math",
    difficulty: "easy"
  },
  {
    id: 30,
    question: "What is 20 - 8?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    category: "math",
    difficulty: "easy"
  },

  // Math - Medium
  {
    id: 31,
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    category: "math",
    difficulty: "medium"
  },
  {
    id: 32,
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 2,
    category: "math",
    difficulty: "medium"
  },

  // Math - Medium (Additional)
  {
    id: 47,
    question: "What is the value of Pi (π) rounded to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correctAnswer: 1,
    category: "math",
    difficulty: "medium"
  },
  {
    id: 48,
    question: "What is 12² (12 squared)?",
    options: ["124", "132", "144", "156"],
    correctAnswer: 2,
    category: "math",
    difficulty: "medium"
  },

  // Math - Hard
  {
    id: 33,
    question: "What is the derivative of x³?",
    options: ["x²", "2x²", "3x²", "4x²"],
    correctAnswer: 2,
    category: "math",
    difficulty: "hard"
  },

  // General Knowledge - Easy
  {
    id: 34,
    question: "What is the capital of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    correctAnswer: 2,
    category: "general",
    difficulty: "easy"
  },
  {
    id: 35,
    question: "How many days are in a year?",
    options: ["360", "364", "365", "366"],
    correctAnswer: 2,
    category: "general",
    difficulty: "easy"
  },
  {
    id: 36,
    question: "What color is the sky on a clear day?",
    options: ["Green", "Blue", "Red", "Yellow"],
    correctAnswer: 1,
    category: "general",
    difficulty: "easy"
  },

  // General Knowledge - Medium
  {
    id: 37,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "general",
    difficulty: "medium"
  },
  {
    id: 38,
    question: "What is the tallest mammal on Earth?",
    options: ["Elephant", "Giraffe", "Blue Whale", "Brown Bear"],
    correctAnswer: 1,
    category: "general",
    difficulty: "medium"
  },

  // General Knowledge - Medium (Additional)
  {
    id: 49,
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    correctAnswer: 1,
    category: "general",
    difficulty: "medium"
  },
  {
    id: 50,
    question: "Which country is famous for the Great Wall?",
    options: ["Japan", "Mongolia", "China", "Korea"],
    correctAnswer: 2,
    category: "general",
    difficulty: "medium"
  },

  // General Knowledge - Hard
  {
    id: 39,
    question: "What is the smallest bone in the human body?",
    options: ["Stapes", "Femur", "Radius", "Ulna"],
    correctAnswer: 0,
    category: "general",
    difficulty: "hard"
  },
  {
    id: 40,
    question: "In which year was the United Nations founded?",
    options: ["1942", "1945", "1948", "1950"],
    correctAnswer: 1,
    category: "general",
    difficulty: "hard"
  },

  // Programming - Medium (Additional)
  {
    id: 51,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Integration",
      "Automated Program Interaction",
      "Application Process Integration"
    ],
    correctAnswer: 0,
    category: "programming",
    difficulty: "medium"
  },
  {
    id: 52,
    question: "Which of these is NOT a JavaScript framework?",
    options: ["React", "Angular", "Vue", "Django"],
    correctAnswer: 3,
    category: "programming",
    difficulty: "medium"
  },

  // Science - Medium (Additional)
  {
    id: 53,
    question: "What is the smallest unit of life?",
    options: ["Atom", "Molecule", "Cell", "Organ"],
    correctAnswer: 2,
    category: "science",
    difficulty: "medium"
  },
  {
    id: 54,
    question: "How many bones are in the adult human body?",
    options: ["186", "206", "226", "246"],
    correctAnswer: 1,
    category: "science",
    difficulty: "medium"
  },

  // History - Hard (Additional)
  {
    id: 55,
    question: "Which ancient civilization built Machu Picchu?",
    options: ["Aztec", "Maya", "Inca", "Olmec"],
    correctAnswer: 2,
    category: "history",
    difficulty: "hard"
  },

  // Geography - Hard (Additional)
  {
    id: 56,
    question: "What is the deepest point in Earth's oceans?",
    options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Tonga Trench"],
    correctAnswer: 2,
    category: "geography",
    difficulty: "hard"
  },

  // Math - Hard (Additional)
  {
    id: 57,
    question: "What is the integral of 1/x with respect to x?",
    options: ["ln|x| + C", "x² + C", "1/x² + C", "e^x + C"],
    correctAnswer: 0,
    category: "math",
    difficulty: "hard"
  }
];

export const getQuestionsByCategory = (category: string, difficulty: string): Question[] => {
  return questions.filter(
    q => q.category === category && q.difficulty === difficulty
  );
};