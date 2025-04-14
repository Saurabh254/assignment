import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define types for exam creation
interface QuestionInput {
    question: string;
    options: string[];
    correctAnswer: number;
}

// Validation schema for creating an exam
const createExamSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    duration: z.number().int().min(1).max(180),
    totalMarks: z.number().int().min(1),
    date: z.string().datetime(),
    subject: z.string(),
    questions: z.array(z.object({
        question: z.string().min(10),
        options: z.array(z.string().min(1)).min(4),
        correctAnswer: z.number().int().min(0).max(3)
    })).min(1)
});

// Get all exams
export const getExams = async (req: Request, res: Response) => {
    try {
        const exams = await prisma.exam.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                duration: true,
                totalMarks: true,
                class: true,
                subject: true,
                status: true,
                startDateTime: true,
                createdAt: true
            }
        });

        return res.json(exams);
    } catch (error: unknown) {
        console.error('Error fetching exams:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get exam by ID
export const getExamById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const exam = await prisma.exam.findUnique({
            where: { id },

        });

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        return res.json(exam);
    } catch (error: unknown) {
        console.error('Error fetching exam:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new exam
export const createExam = async (req: Request, res: Response) => {
    try {
        const validatedData = createExamSchema.parse(req.body);

        // Create exam
        const exam = await prisma.exam.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                duration: validatedData.duration,
                totalMarks: validatedData.totalMarks,
                startDateTime: new Date(validatedData.date),
                class: '10th', // Assuming class is hardcoded for now
                status: 'upcoming',
                createdById: req.user.id, // Assuming user ID is attached by auth middleware
                subject: validatedData.subject,
                questions: validatedData.questions
            }
        });

        const resp = res.status(201).json(exam);

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating exam:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Submit exam answers
export const submitExam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate request body
        const submitSchema = z.object({
            answers: z.array(z.object({
                questionIndex: z.number().int().min(0),
                answer: z.number().int().min(0)
            }))
        });
        const { answers } = submitSchema.parse(req.body);

        // Get the exam with questions stored as JSON
        const exam = await prisma.exam.findUnique({
            where: { id }
        });

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // Check if exam is already submitted
        const existingSubmission = await prisma.examSubmission.findFirst({
            where: {
                examId: id,
                userId: userId
            }
        });

        if (existingSubmission) {
            return res.status(400).json({ error: 'Exam already submitted' });
        }

        // Parse questions from the JSON field
        const questions = exam.questions as any[] || [];

        // Calculate score
        let score = 0;
        for (const answer of answers) {
            const question = questions[answer.questionIndex];
            if (question && question.correctAnswer === answer.answer) {
                score++;
            }
        }

        // Create submission record
        const submission = await prisma.examSubmission.create({
            data: {
                examId: id,
                userId: userId,
                score: score,
                totalMarks: questions.length,
                answers: answers
            }
        });

        // Calculate percentage
        const percentage = (score / questions.length) * 100;
        return res.json({
            score,
            totalMarks: questions.length,
            percentage: percentage.toFixed(2)
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error submitting exam:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all exams for a student
export const getStudentExams = async (req: Request, res: Response) => {
    try {
        const studentId = req.user.id; // Assuming user ID is attached by auth middleware
        const studentClass = req.user.class;

        // Get upcoming exams
        const upcomingExams = await prisma.exam.findMany({
            where: {
                class: studentClass,
                status: 'upcoming',
                startDateTime: {
                    gte: new Date(),
                },
            },
            orderBy: {
                startDateTime: 'asc',
            },
        });

        // Get completed exams with results
        const completedExams = await prisma.exam.findMany({
            where: {
                class: studentClass,
                status: 'completed',
            },
            include: {
                results: {
                    where: {
                        studentId: studentId,
                    },
                },
            },
            orderBy: {
                startDateTime: 'desc',
            },
        });

        res.json({
            upcomingExams,
            completedExams,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
};

// Get exam details
export const getExamDetails = async (req: Request, res: Response) => {
    try {
        const { examId } = req.params;
        const studentId = req.user.id;

        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: {
                results: {
                    where: { studentId: studentId },
                },
            },
        });

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        res.json(exam);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exam details' });
    }
};

// Submit exam result
export const submitExamResult = async (req: Request, res: Response) => {
    try {
        const { examId } = req.params;
        const studentId = req.user.id;
        const { score, totalMarks } = req.body;

        // Calculate percentage and grade
        const percentage = (score / totalMarks) * 100;
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';

        const status = percentage >= 50 ? 'Passed' : 'Failed';

        const result = await prisma.examResult.create({
            data: {
                examId,
                studentId,
                score,
                totalMarks,
                percentage,
                grade,
                status,
            },
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit exam result' });
    }
};

// Get student's exam results
export const getStudentResults = async (req: Request, res: Response) => {
    try {
        const studentId = req.user.id;

        const results = await prisma.examResult.findMany({
            where: {
                studentId,
            },
            include: {
                exam: true,
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        // Calculate performance summary
        const totalExams = results.length;
        const averageScore = results.reduce((acc: number, curr: { percentage: number }) => acc + curr.percentage, 0) / totalExams;
        const highestScore = Math.max(...results.map((r: { percentage: number }) => r.percentage));
        const lowestScore = Math.min(...results.map((r: { percentage: number }) => r.percentage));
        const passRate = (results.filter((r: { status: string }) => r.status === 'Passed').length / totalExams) * 100;

        res.json({
            results,
            performanceSummary: {
                totalExams,
                averageScore,
                highestScore,
                lowestScore,
                passRate,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch results' });
    }
};

// Get performance analytics
export const getPerformanceAnalytics = async (req: Request, res: Response) => {
    try {
        const studentId = req.user.id;

        const results = await prisma.examResult.findMany({
            where: {
                studentId,
            },
            include: {
                exam: true,
            },
            orderBy: {
                submittedAt: 'asc',
            },
        });

        // Prepare data for the performance graph
        const performanceData = results.map((result: { submittedAt: Date; percentage: number; exam: { subject: string } }) => ({
            date: result.submittedAt,
            score: result.percentage,
            subject: result.exam.subject,
        }));

        res.json(performanceData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch performance analytics' });
    }
};
