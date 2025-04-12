import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getStudentExams,
    getExamDetails,
    submitExamResult,
    getStudentResults,
    getPerformanceAnalytics,
    createExam,
    getExams,
    getExamById,
    submitExam,
} from '../controllers/examController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Exam management endpoints
 */

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Get all exams
 *     description: Retrieve a list of all available exams
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   duration:
 *                     type: integer
 *                     description: Duration in minutes
 *                   totalMarks:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, getExams);

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     description: Retrieve detailed information about a specific exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                   description: Duration in minutes
 *                 totalMarks:
 *                   type: integer
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       question:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Exam not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticateToken, getExamById);

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Create a new exam
 *     description: Create a new exam with questions and options
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - duration
 *               - totalMarks
 *               - startTime
 *               - endTime
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Exam title
 *               description:
 *                 type: string
 *                 description: Exam description
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *               totalMarks:
 *                 type: integer
 *                 description: Total marks for the exam
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Exam start time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Exam end time
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - options
 *                     - correctAnswer
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: Question text
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of possible answers
 *                     correctAnswer:
 *                       type: integer
 *                       description: Index of the correct answer in options array
 *     responses:
 *       201:
 *         description: Exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                 totalMarks:
 *                   type: integer
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, createExam);

/**
 * @swagger
 * /exams/{id}/submit:
 *   post:
 *     summary: Submit exam answers
 *     description: Submit answers for an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - answer
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       description: ID of the question
 *                     answer:
 *                       type: integer
 *                       description: Index of the selected answer
 *     responses:
 *       200:
 *         description: Exam submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   description: Total score achieved
 *                 totalMarks:
 *                   type: integer
 *                   description: Total possible marks
 *                 percentage:
 *                   type: number
 *                   format: float
 *                   description: Percentage score
 *       400:
 *         description: Invalid input or exam already submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Exam not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/submit', authenticateToken, submitExam);

// Get all exams for the logged-in student
router.get('/student/exams', getStudentExams);

// Get specific exam details
router.get('/student/exams/:examId', getExamDetails);

// Submit exam result
router.post('/student/exams/:examId/submit', submitExamResult);

// Get student's exam results
router.get('/student/results', getStudentResults);

// Get performance analytics
router.get('/student/analytics', getPerformanceAnalytics);

export default router;