# Exam Evaluation System

A comprehensive exam evaluation system that allows teachers to create and manage exams, and students to take exams and view their results with detailed analytics.

## Features

- Teacher and Student roles
- Create and manage exams with MCQ and text questions
- Timer for each question (2 minutes for MCQ, 5 minutes for text)
- Real-time exam taking interface
- Detailed results with charts and analytics
- Topic-wise performance analysis
- Weak topics identification

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Charts: Recharts

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd exam-evaluation-system
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a .env file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/exam-system
JWT_SECRET=your-secret-key
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Exams
- GET /api/exam - Get all exams
- POST /api/exam - Create a new exam
- GET /api/exam/:id - Get exam by ID
- PUT /api/exam/:id - Update exam
- DELETE /api/exam/:id - Delete exam

### Results
- POST /api/result - Submit exam result
- GET /api/result/student - Get student's results
- GET /api/result/all - Get all results (teachers only)
- GET /api/result/:id - Get result by ID

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request