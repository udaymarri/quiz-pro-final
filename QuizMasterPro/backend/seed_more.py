import requests

API_URL = "http://localhost:8000/questions"

NEW_QUESTIONS = [
    {
        "question": "What is the smallest country in the world?",
        "options": ["Monaco", "Nauru", "Vatican City", "Tuvalu"],
        "correctAnswer": 2,
        "category": "geography",
        "difficulty": "medium"
    },
    {
        "question": "Who wrote 'Romeo and Juliet'?",
        "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        "correctAnswer": 1,
        "category": "arts",
        "difficulty": "easy"
    },
    {
        "question": "What is the chemical symbol for Gold?",
        "options": ["Ag", "Au", "Fe", "Cu"],
        "correctAnswer": 1,
        "category": "science",
        "difficulty": "easy"
    },
    {
        "question": "Which programming language was created by Brendan Eich?",
        "options": ["Python", "JavaScript", "C++", "Ruby"],
        "correctAnswer": 1,
        "category": "technology",
        "difficulty": "hard"
    },
    {
        "question": "What is the highest mountain in the world?",
        "options": ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"],
        "correctAnswer": 2,
        "category": "geography",
        "difficulty": "easy"
    },
    {
        "question": "In what year did the Titanic sink?",
        "options": ["1905", "1912", "1918", "1923"],
        "correctAnswer": 1,
        "category": "history",
        "difficulty": "medium"
    },
    {
        "question": "What does HTTP stand for?",
        "options": ["HyperText Transfer Protocol", "Hyper Transfer Text Protocol", "HyperText Transmission Protocol", "Hyper Transmission Text Protocol"],
        "correctAnswer": 0,
        "category": "technology",
        "difficulty": "easy"
    },
    {
        "question": "Who painted the Starry Night?",
        "options": ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"],
        "correctAnswer": 1,
        "category": "arts",
        "difficulty": "medium"
    },
    {
        "question": "What is the hardest natural substance on Earth?",
        "options": ["Gold", "Iron", "Diamond", "Platinum"],
        "correctAnswer": 2,
        "category": "science",
        "difficulty": "easy"
    },
    {
        "question": "Which planet is known as the Morning Star or Evening Star?",
        "options": ["Mars", "Venus", "Mercury", "Jupiter"],
        "correctAnswer": 1,
        "category": "science",
        "difficulty": "medium"
    },
    {
        "question": "What is the capital of Australia?",
        "options": ["Sydney", "Melbourne", "Canberra", "Perth"],
        "correctAnswer": 2,
        "category": "geography",
        "difficulty": "medium"
    },
    {
        "question": "What is the main ingredient in guacamole?",
        "options": ["Tomato", "Onion", "Avocado", "Pepper"],
        "correctAnswer": 2,
        "category": "food",
        "difficulty": "easy"
    },
    {
        "question": "How many bones are in the adult human body?",
        "options": ["206", "210", "198", "212"],
        "correctAnswer": 0,
        "category": "science",
        "difficulty": "medium"
    },
    {
        "question": "Which tech company created the Android operating system?",
        "options": ["Apple", "Microsoft", "Google", "Samsung"],
        "correctAnswer": 2,
        "category": "technology",
        "difficulty": "easy"
    },
    {
        "question": "What is the meaning of life, the universe, and everything?",
        "options": ["Love", "42", "Happiness", "Knowledge"],
        "correctAnswer": 1,
        "category": "literature",
        "difficulty": "hard"
    }
]

def seed_database():
    print(f"Seeding {len(NEW_QUESTIONS)} additional questions...")
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
