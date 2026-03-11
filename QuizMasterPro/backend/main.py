from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
from typing import List, Optional
from datetime import datetime
import google.generativeai as genai

# Configure Gemini AI
genai.configure(api_key="AIzaSyAQ4fMQE8ufty9Q08Gvd1aWLdxaVLr4STY")
generation_config = {
  "temperature": 0.7,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
}
ai_model = genai.GenerativeModel(
  model_name="gemini-2.5-flash",
  generation_config=generation_config,
)

app = FastAPI(title="QuizMaster Pro API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
try:
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    print(f"Firebase Admin Check: {e}")
    # Fallback/Mock initialization if needed for dev
    db = None

# --- MOCK DATA STORES FOR LOCAL DEV WITHOUT FIREBASE ---
mock_questions_store = [
    {"id": "mock-1", "question": "What is the capital of France?", "options": ["London", "Berlin", "Paris", "Madrid"], "correctAnswer": 2, "category": "geography", "difficulty": "easy"},
    {"id": "mock-2", "question": "Which planet is known as the Red Planet?", "options": ["Venus", "Jupiter", "Mars", "Saturn"], "correctAnswer": 2, "category": "science", "difficulty": "medium"},
    {"id": "mock-3", "question": "In what year did the Titanic sink?", "options": ["1912", "1905", "1898", "1923"], "correctAnswer": 0, "category": "history", "difficulty": "hard"},
    {"id": "mock-4", "question": "What does HTTP stand for?", "options": ["HyperText Transfer Protocol", "HyperText Transmission Protocol", "Hyper Transfer Text Protocol", "HyperLink Transfer Protocol"], "correctAnswer": 0, "category": "programming", "difficulty": "easy"},
    {"id": "mock-5", "question": "Which programming language is known as the 'mother of all languages'?", "options": ["Java", "C", "Python", "Assembly"], "correctAnswer": 1, "category": "programming", "difficulty": "medium"},
    {"id": "mock-6", "question": "What is the square root of 144?", "options": ["10", "12", "14", "16"], "correctAnswer": 1, "category": "math", "difficulty": "easy"},
    {"id": "mock-7", "question": "Who painted the Mona Lisa?", "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], "correctAnswer": 2, "category": "general", "difficulty": "medium"},
    {"id": "mock-8", "question": "What is the largest ocean on Earth?", "options": ["Atlantic", "Indian", "Arctic", "Pacific"], "correctAnswer": 3, "category": "geography", "difficulty": "easy"},
    {"id": "mock-9", "question": "Who wrote 'Hamlet'?", "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], "correctAnswer": 1, "category": "history", "difficulty": "medium"},
    {"id": "mock-10", "question": "What is the chemical symbol for Gold?", "options": ["Au", "Ag", "Pb", "Fe"], "correctAnswer": 0, "category": "science", "difficulty": "easy"}
]

mock_results_store: List[dict] = []

class Question(BaseModel):
    id: Optional[str] = None
    question: str
    options: List[str]
    correctAnswer: int
    category: str
    difficulty: str

class QuizResult(BaseModel):
    userId: str
    username: str
    score: int
    correctAnswers: int
    totalQuestions: int
    timeTaken: int
    category: str
    difficulty: str

class AIQuizRequest(BaseModel):
    topic: str
    difficulty: str

class ChatbotRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "QuizMaster Pro API is running"}

@app.get("/questions")
async def get_questions(category: Optional[str] = None, difficulty: Optional[str] = None):
    if not db:
        res = mock_questions_store
        if category:
            res = [q for q in res if q["category"] == category]
        if difficulty:
            res = [q for q in res if q["difficulty"] == difficulty]
        return res
    
    questions_ref = db.collection("questions")
    query = questions_ref
    
    if category:
        query = query.where("category", "==", category)
    if difficulty:
        query = query.where("difficulty", "==", difficulty)
        
    docs = query.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@app.post("/questions")
async def add_question(question: Question):
    data = question.dict(exclude_unset=True)
    if "id" in data:
        del data["id"]
        
    if not db:
        data["id"] = f"mock-q-{len(mock_questions_store) + 100}"
        mock_questions_store.append(data)
        return {"id": data["id"], "status": "success"}
        
    update_time, doc_ref = db.collection("questions").add(data)
    return {"id": doc_ref.id, "status": "success"}

@app.put("/questions/{question_id}")
async def update_question(question_id: str, question: Question):
    data = question.dict(exclude_unset=True)
    if "id" in data:
        del data["id"]
        
    if not db:
        for i, q in enumerate(mock_questions_store):
            if q["id"] == question_id:
                data["id"] = question_id
                mock_questions_store[i] = data
                break
        return {"id": question_id, "status": "success"}
        
    db.collection("questions").document(question_id).update(data)
    return {"id": question_id, "status": "success"}

@app.delete("/questions/{question_id}")
async def delete_question(question_id: str):
    if not db:
        global mock_questions_store
        mock_questions_store = [q for q in mock_questions_store if q["id"] != question_id]
        return {"status": "success"}
        
    db.collection("questions").document(question_id).delete()
    return {"status": "success"}

@app.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    if not db:
        base_mocks = [
            {"id": "user-1", "username": "QuizMaster", "score": 9500, "category": "General"},
            {"id": "user-2", "username": "Brainiac", "score": 8200, "category": "Science"},
            {"id": "user-3", "username": "TriviaKing", "score": 7500, "category": "History"}
        ]
        all_results = sorted(mock_results_store + base_mocks, key=lambda x: x["score"], reverse=True)
        return all_results[:limit]
    
    results_ref = db.collection("results")
    docs = results_ref.order_by("score", direction=firestore.Query.DESCENDING).limit(limit).stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

@app.post("/results")
async def save_result(result: QuizResult):
    data = result.dict()
    if not db:
        data["id"] = f"mock-res-{len(mock_results_store)}"
        mock_results_store.append(data)
        return {"id": data["id"], "status": "success"}
    
    data["timestamp"] = firestore.SERVER_TIMESTAMP
    update_time, doc_ref = db.collection("results").add(data)
    return {"id": doc_ref.id, "status": "success"}

@app.get("/history/{user_id}")
async def get_history(user_id: str):
    if not db:
        user_history = [r for r in mock_results_store if r["userId"] == user_id]
        if not user_history:
            return [
                {
                    "userId": user_id,
                    "username": "Guest",
                    "score": 4500,
                    "correctAnswers": 4,
                    "totalQuestions": 5,
                    "timeTaken": 45,
                    "category": "science",
                    "difficulty": "medium"
                }
            ]
        # Return newest first
        return user_history[::-1]

    results_ref = db.collection("results")
    query = results_ref.where("userId", "==", user_id).order_by("timestamp", direction=firestore.Query.DESCENDING)
    docs = query.stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

# --- MULTIPLAYER WEBSOCKET LOGIC ---
from collections import defaultdict
import asyncio

class ConnectionManager:
    def __init__(self):
        # room_id -> list of WebSockets
        self.active_connections: dict[str, List[WebSocket]] = defaultdict(list)
        # room_id -> dict of {username: {score, isReady, hasFinished}}
        self.room_states: dict[str, dict] = defaultdict(dict)

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[room_id].append(websocket)
        # Send current state
        if room_id in self.room_states:
             await websocket.send_json({"type": "state_update", "players": self.room_states[room_id]})

    def disconnect(self, room_id: str, websocket: WebSocket, username: str = None):
        if room_id in self.active_connections and websocket in self.active_connections[room_id]:
            self.active_connections[room_id].remove(websocket)
        
        if username and room_id in self.room_states and username in self.room_states[room_id]:
            del self.room_states[room_id][username]
            # broadcast leave
            asyncio.create_task(self.broadcast(room_id, {
                "type": "state_update", 
                "players": self.room_states[room_id]
            }))
            
        # Cleanup empty rooms
        if not self.active_connections.get(room_id):
            if room_id in self.active_connections: del self.active_connections[room_id]
            if room_id in self.room_states: del self.room_states[room_id]

    async def broadcast(self, room_id: str, message: dict):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

@app.websocket("/ws/multiplayer/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(room_id, websocket)
    current_username = None
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                action = msg.get("action")
                
                if action == "join":
                    username = msg.get("username", "Anonymous")
                    current_username = username
                    if room_id not in manager.room_states:
                        manager.room_states[room_id] = {}
                        
                    manager.room_states[room_id][username] = {
                        "score": 0,
                        "isReady": False,
                        "hasFinished": False
                    }
                    await manager.broadcast(room_id, {
                        "type": "state_update",
                        "players": manager.room_states[room_id]
                    })
                    
                elif action == "ready":
                    if current_username and current_username in manager.room_states[room_id]:
                        manager.room_states[room_id][current_username]["isReady"] = True
                        await manager.broadcast(room_id, {
                            "type": "state_update",
                            "players": manager.room_states[room_id]
                        })
                        
                elif action == "start":
                    # Anyone can initiate start once all are ready, but we skip validation for demo simplicity
                    await manager.broadcast(room_id, {
                        "type": "game_started"
                    })
                    
                elif action == "update_score":
                    if current_username and current_username in manager.room_states[room_id]:
                        score = msg.get("score", 0)
                        manager.room_states[room_id][current_username]["score"] = score
                        await manager.broadcast(room_id, {
                            "type": "state_update",
                            "players": manager.room_states[room_id]
                        })
                        
                elif action == "finish":
                     if current_username and current_username in manager.room_states[room_id]:
                        manager.room_states[room_id][current_username]["hasFinished"] = True
                        await manager.broadcast(room_id, {
                            "type": "state_update",
                            "players": manager.room_states[room_id]
                        })
                        
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket, current_username)

# --- AI Integration Endpoints ---

FALLBACK_FAQ = {
    "rules": "The rules are simple: answer the questions before the timer runs out. Timed mode gives you 15 seconds per question with bonus points for speed!",
    "modes": "We have Practice Mode (no timer), Timed Challenge (15s per question), and Live Multiplayer (compete against others!).",
    "practice": "Practice mode gives you unlimited time to answer questions and learn at your own pace.",
    "timed": "Timed Challenge gives you 15 seconds per question. The faster you answer correctly, the more bonus points you get!",
    "leaderboard": "The leaderboard shows the top scores from all players. You can access it from the home screen.",
    "profile": "Your profile shows your past quiz results, total score, and average accuracy.",
    "multiplayer": "In multiplayer, one person creates a match and shares the 6-letter room code. Others join using that code. The host starts the game when everyone is ready!",
    "hi": "Hello there! I'm the QuizMaster AI Assistant. Ask me anything about the game!",
    "hello": "Hello! How can I help you with QuizMaster Pro today?",
    "default": "I'm currently offline and using my backup system. I might not understand everything, but you can ask me about the rules, game modes, or how multiplayer works!"
}

FALLBACK_QUIZ = [
    {
        "question": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "correctAnswer": 2,
        "category": "Offline Fallback",
        "difficulty": "easy"
    },
    {
        "question": "Which planet is closest to the Sun?",
        "options": ["Venus", "Earth", "Mercury", "Mars"],
        "correctAnswer": 2,
        "category": "Offline Fallback",
        "difficulty": "easy"
    },
    {
        "question": "What is 7 x 8?",
        "options": ["54", "56", "64", "48"],
        "correctAnswer": 1,
        "category": "Offline Fallback",
        "difficulty": "easy"
    },
    {
        "question": "Who wrote 'Hamlet'?",
        "options": ["Charles Dickens", "Leo Tolstoy", "William Shakespeare", "Mark Twain"],
        "correctAnswer": 2,
        "category": "Offline Fallback",
        "difficulty": "medium"
    },
    {
        "question": "What is the chemical symbol for water?",
        "options": ["H2O", "CO2", "O2", "NaCl"],
        "correctAnswer": 0,
        "category": "Offline Fallback",
        "difficulty": "easy"
    }
]

@app.post("/api/generate_quiz")
async def generate_quiz(req: AIQuizRequest):
    prompt = f"""
    You are an expert quiz master. Generate exactly 5 multiple-choice questions about the topic "{req.topic}" at a {req.difficulty} difficulty level.
    You must respond ONLY with a valid JSON array of objects. Do not wrap in markdown tags like ```json.
    Each object must have exactly these keys:
    - "question": a string containing the question text.
    - "options": an array of exactly 4 strings containing the possible answers.
    - "correctAnswer": an integer (0, 1, 2, or 3) representing the index of the correct string in the options array.
    """
    try:
        response = ai_model.generate_content(prompt)
        text = response.text.replace('```json\n', '').replace('```', '').strip()
        
        questions = json.loads(text)
        
        for q in questions:
            q["category"] = "AI Generated"
            q["difficulty"] = req.difficulty
            
        return questions
    except Exception as e:
        print(f"Gemini API Error: {e}. Using fallback.")
        return FALLBACK_QUIZ

@app.post("/api/chatbot")
async def chat_with_bot(req: ChatbotRequest):
    prompt = f"""
    You are the friendly 'QuizMaster Pro AI Assistant'. 
    Your job is to answer the user's questions about trivia, how quizzes work, or any general knowledge questions they have.
    Keep your answers concise, helpful, and fun.
    User's message: {req.message}
    """
    try:
        response = ai_model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Gemini Chatbot Error: {e}. Using fallback.")
        msg_lower = req.message.lower()
        response_text = FALLBACK_FAQ["default"]
        for key, value in FALLBACK_FAQ.items():
            if key != "default" and key in msg_lower:
                response_text = value
                break
        return {"response": response_text}
