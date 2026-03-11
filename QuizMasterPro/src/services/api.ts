const API_BASE_URL = 'http://localhost:8000';

export interface Question {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

export interface QuizResult {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  category: string;
  difficulty: string;
}

export const api = {
  getQuestions: async (category?: string, difficulty?: string): Promise<Question[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    const response = await fetch(`${API_BASE_URL}/questions?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  },

  addQuestion: async (question: Question): Promise<{ id: string }> => {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    if (!response.ok) throw new Error('Failed to add question');
    return response.json();
  },

  updateQuestion: async (id: string, question: Question): Promise<{ id: string }> => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    if (!response.ok) throw new Error('Failed to update question');
    return response.json();
  },

  deleteQuestion: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete question');
  },

  getLeaderboard: async (limit: number = 10): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },

  saveResult: async (result: QuizResult): Promise<{ id: string }> => {
    const response = await fetch(`${API_BASE_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
    if (!response.ok) throw new Error('Failed to save result');
    return response.json();
  },

  getHistory: async (userId: string): Promise<QuizResult[]> => {
    const response = await fetch(`${API_BASE_URL}/history/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  generateAiQuiz: async (topic: string, difficulty: string): Promise<Question[]> => {
    const response = await fetch(`${API_BASE_URL}/api/generate_quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty }),
    });
    if (!response.ok) throw new Error('Failed to generate AI quiz');
    return response.json();
  },

  sendChatbotMessage: async (message: string): Promise<{response: string}> => {
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error('Failed to get chatbot response');
    return response.json();
  }
};

export const createMultiplayerSocket = (roomId: string) => {
  return new WebSocket(`ws://localhost:8000/ws/multiplayer/${roomId}`);
};
