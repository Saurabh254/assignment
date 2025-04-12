export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Exam {
    id: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    startTime: string;
    endTime: string;
    questions: Question[];
}