const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const auth = require('../middleware/auth');

// Submit exam result
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit exam results' });
        }

        const { examId, answers, timeTaken } = req.body;
        const exam = await Exam.findById(examId);

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
                question: question._id,
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

        const result = new Result({
            student: req.user.userId,
            exam: examId,
            score,
            questionResults,
            weakTopics,
            timeTaken: timeTaken.reduce((a, b) => a + b, 0)
        });

        await result.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting result', error: error.message });
    }
});

// Get student's results
router.get('/student', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can view their results' });
        }

        const results = await Result.find({ student: req.user.userId })
            .populate('exam', 'title subject')
            .sort('-createdAt');

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