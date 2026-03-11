import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore';

// Your web app's Firebase configuration
// NOTE: In a real production app, these should be in environment variables (.env)
const firebaseConfig = {
  apiKey: "AIzaSyCqi1CW80aKhJztW9FZ3Eyfimh8sMDrsxY",
  authDomain: "quiz-635a0.firebaseapp.com",
  projectId: "quiz-635a0",
  storageBucket: "quiz-635a0.firebasestorage.app",
  messagingSenderId: "964342938107",
  appId: "1:964342938107:web:5a4ec7ec1074d4b201f35e",
  measurementId: "G-JHR9SXXNP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Questions and Categories
export const getCategories = async () => {
  const categoriesCol = collection(db, 'categories');
  const snapshot = await getDocs(categoriesCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getQuestions = async (category: string, difficulty: string) => {
  const questionsCol = collection(db, 'questions');
  const q = query(
    questionsCol, 
    where('category', '==', category), 
    where('difficulty', '==', difficulty)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addQuestion = async (questionData: any) => {
  return await addDoc(collection(db, 'questions'), questionData);
};

export const updateQuestion = async (id: string, questionData: any) => {
  const questionRef = doc(db, 'questions', id);
  await updateDoc(questionRef, questionData);
};

export const deleteQuestion = async (id: string) => {
  await deleteDoc(doc(db, 'questions', id));
};

// Results
export interface QuizResultData {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  category: string;
  difficulty: string;
  timestamp?: Timestamp | any;
}

export const saveQuizResult = async (result: QuizResultData) => {
  return await addDoc(collection(db, 'results'), {
    ...result,
    timestamp: serverTimestamp()
  });
};

// Leaderboard
export const getLeaderboard = async (limitCount = 10) => {
  const resultsCol = collection(db, 'results');
  const q = query(
    resultsCol, 
    orderBy('score', 'desc'), 
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
