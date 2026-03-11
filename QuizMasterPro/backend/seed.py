import requests

API_URL = "http://localhost:8000/questions"

# A list of good additional questions to populate the database
NEW_QUESTIONS = [
    {
        "question": "What is the largest organ in the human body?",
        "options": ["Heart", "Brain", "Liver", "Skin"],
        "correctAnswer": 3,
        "category": "science",
        "difficulty": "easy"
    },
    {
        "question": "Which planet is known as the Red Planet?",
        "options": ["Mars", "Jupiter", "Venus", "Saturn"],
        "correctAnswer": 0,
        "category": "science",
        "difficulty": "easy"
    },
    {
        "question": "Who developed the theory of relativity?",
        "options": ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"],
        "correctAnswer": 1,
        "category": "science",
        "difficulty": "medium"
    },
    {
        "question": "What is the speed of light in a vacuum?",
        "options": ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "299,792 km/s"],
        "correctAnswer": 3,
        "category": "science",
        "difficulty": "hard"
    },
    {
        "question": "In computing, what does CPU stand for?",
        "options": ["Central Processing Unit", "Computer Personal Unit", "Central Processor Unit", "Control Processing Unit"],
        "correctAnswer": 0,
        "category": "technology",
        "difficulty": "easy"
    },
    {
        "question": "Which programming language is known as the mother of all languages?",
        "options": ["Python", "Java", "C", "Assembly"],
        "correctAnswer": 2,
        "category": "technology",
        "difficulty": "medium"
    },
    {
        "question": "What year was the first iPhone released?",
        "options": ["2005", "2007", "2009", "2010"],
        "correctAnswer": 1,
        "category": "technology",
        "difficulty": "medium"
    },
    {
        "question": "Who painted the Mona Lisa?",
        "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        "correctAnswer": 2,
        "category": "arts",
        "difficulty": "easy"
    },
    {
        "question": "What is the capital of Japan?",
        "options": ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        "correctAnswer": 2,
        "category": "geography",
        "difficulty": "easy"
    },
    {
        "question": "Which river is the longest in the world?",
        "options": ["Amazon", "Nile", "Yangtze", "Mississippi"],
        "correctAnswer": 1,
        "category": "geography",
        "difficulty": "medium"
    }
]

def seed_database():
    print(f"Seeding {len(NEW_QUESTIONS)} questions...")
    success = 0
    for q in NEW_QUESTIONS:
        try:
            response = requests.post(API_URL, json=q)
            if response.status_code == 200 or response.status_code == 201:
                success += 1
                print(f"Added: {q['question']}")
            else:
                print(f"Failed to add: {q['question']} - {response.text}")
        except Exception as e:
            print(f"Error adding {q['question']}: {e}")
            
    print(f"\nSeed complete! Successfully added {success} / {len(NEW_QUESTIONS)} questions.")

if __name__ == "__main__":
    seed_database()
