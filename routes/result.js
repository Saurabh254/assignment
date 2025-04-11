const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/result:
 *   post:
 *     summary: Submit exam result (Student only)
 *     tags: [Result]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examId
 *               - answers
 *               - timeTaken
 *             properties:
 *               examId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *               timeTaken:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       201:
 *         description: Result submitted successfully
 *       403:
 *         description: Only students can submit exam results
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit exam results' });
        }

        const { examId, answers, timeTaken } = req.body;
        const exam = await Exam.findByPk(examId);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Calculate score and weak topics
        let score = 0;
        const questionResults = [];
        const topicScores = {};

        for (let i = 0; i < exam.questions.length; i++) {
            const question = exam.questions[i];
            const userAnswer = answers[i];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) {
                score++;
                topicScores[question.topic] = (topicScores[question.topic] || 0) + 1;
            }

            questionResults.push({
                questionId: question.id,
                userAnswer,
                isCorrect,
                timeTaken: timeTaken[i]
            });
        }

        // Calculate weak topics
        const weakTopics = Object.entries(topicScores)
            .filter(([_, score]) => score < exam.questions.filter(q => q.topic === _).length / 2)
            .map(([topic, score]) => ({
                topic,
                score: score / exam.questions.filter(q => q.topic === topic).length
            }));

        // Create result
        const result = await Result.create({
            examId,
            studentId: req.user.userId,
            score,
            questionResults,
            weakTopics,
            totalTime: timeTaken.reduce((a, b) => a + b, 0)
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting result', error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/result/student/{studentId}:
 *   get:
 *     summary: Get results for a student
 *     tags: [Result]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of student results
 *       403:
 *         description: Not authorized to view these results
 *       500:
 *         description: Server error
 */
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        // Only allow teachers or the student themselves to view results
        if (req.user.role !== 'teacher' && req.user.userId !== req.params.studentId) {
            return res.status(403).json({ message: 'Not authorized to view these results' });
        }

        const results = await Result.findAll({
            where: { studentId: req.params.studentId },
            include: [{
                model: Exam,
                as: 'exam',
                attributes: ['title', 'subject']
            }]
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
});

// Get all results (Teacher only)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can view all results' });
        }

        const results = await Result.find()
            .populate('student', 'name email')
            .populate('exam', 'title subject')
            .sort('-createdAt');

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
});

// Get result by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('student', 'name email')
            .populate('exam', 'title subject');

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Check if user is authorized to view this result
        if (req.user.role === 'student' && result.student._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to view this result' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching result', error: error.message });
    }
});

module.exports = router;