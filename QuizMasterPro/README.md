# QuizMaster Pro

QuizMaster Pro is a modern, interactive quiz application built with **React 18**, **TypeScript**, and **Tailwind CSS**. It features multiple categories, real-time feedback, and detailed performance analytics.

## Features

- 🏎️ **Timed Quizzes**: Multiple difficulty levels with dynamic countdown timers.
- 📚 **Diverse Categories**: Choose from Programming, Science, History, Geography, and more.
- 📊 **Rich Analytics**: Visual breakdown of your performance with interactive charts.
- 📱 **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- ⚡ **Animations**: Smooth transitions powered by Framer Motion.

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quiz-app.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Folder Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── common/         # Shared utility components
│   │   ├── ui/             # Reusable UI components
│   │   ├── QuizHome.tsx    # Category & difficulty selection
│   │   ├── QuizInterface.tsx # Quiz interaction logic
│   │   └── QuizResults.tsx # Performance metrics
│   ├── data/               # Question sets and quiz data
│   └── App.tsx             # Main application entry
└── styles/                 # Global styles and themes
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
