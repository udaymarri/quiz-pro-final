

# 🧠 QuizMaster Pro

### AI-Powered Multiplayer Quiz Platform

**QuizMaster Pro** is an advanced full-stack quiz platform that combines **AI-generated questions, real-time multiplayer gameplay, and performance analytics** to create an engaging learning experience.

The platform integrates **Google Gemini AI** to dynamically generate quiz questions, allowing users to practice on various topics without relying on static question datasets. Users can compete in **real-time multiplayer quiz rooms**, track their performance through **interactive analytics dashboards**, and view rankings on the **global leaderboard**.

---

# 🚀 Features

### 🤖 AI-Powered Quiz Generation

* Generates quiz questions dynamically using **Google Gemini AI**
* Supports topic-based quiz creation
* Eliminates dependency on static question datasets

### 👥 Real-Time Multiplayer Quiz

* Players can join **multiplayer quiz rooms**
* Questions delivered simultaneously to all players
* Live score updates using **WebSockets**

### 🔐 User Authentication

* Secure login and signup system
* User profiles with stored scores and history
* Powered by **Firebase Authentication**

### 🏆 Leaderboard System

* Global ranking of top players
* Score persistence using **Firebase Firestore**

### 📊 Performance Analytics

* Visual charts showing quiz performance
* Accuracy tracking and score analytics
* Implemented using **Recharts**

### 🎨 Modern UI/UX

* Smooth animations with **Framer Motion**
* Responsive design using **Tailwind CSS**
* Clean component-based architecture

---

# 🛠 Tech Stack

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Recharts

### Backend

* FastAPI (Python)
* WebSockets for real-time multiplayer

### AI Integration

* Google Gemini AI API

### Database & Authentication

* Firebase Authentication
* Firebase Firestore

---

# 🏗 Project Architecture

```
Frontend (React + TypeScript)
        ↓
FastAPI Backend
        ↓
Gemini AI API
        ↓
Firebase Firestore
        ↓
WebSocket Multiplayer Server
```

---

# 📂 Project Structure

```
QuizMasterPro
│
├── backend
│   ├── main.py
│   ├── requirements.txt
│
├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── context
│   ├── utils
│
├── assets
├── styles
└── README.md
```

---

# ⚙ Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/quizmaster-pro.git
cd quizmaster-pro
```

---

## 2️⃣ Install Frontend Dependencies

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

---

## 3️⃣ Setup Backend

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn main:app --reload
```

---

# 📈 Future Improvements

* AI-powered adaptive difficulty
* Real-time voice quiz mode
* Mobile application version
* Advanced learning analytics
* Quiz tournaments and events

---

# 👨‍💻 Author

Developed by **Uday Marri**

Frontend Developer | AI & Web Development Enthusiast

