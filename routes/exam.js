const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/exam:
 *   post:
 *     summary: Create a new exam (Teacher only)
 *     tags: [Exam]
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
 *               - subject
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *               duration:
 *                 type: integer
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Exam created successfully
 *       403:
 *         description: Only teachers can create exams
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can create exams' });
        }

        const exam = await Exam.create({
            ...req.body,
            teacherId: req.user.userId
        });

        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Error creating exam', error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/exam:
 *   get:
 *     summary: Get all exams
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
    try {
        const exams = await Exam.findAll({
            include: [{
                model: User,
                as: 'teacher',
                attributes: ['name']
            }]
        });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exams', error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/exam/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Exam]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam details
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'teacher',
                attributes: ['name']
            }]
        });

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exam', error: error.message });
    }
});

// Update exam (Teacher only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can update exams' });
        }

        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (exam.teacher.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this exam' });
        }

        const updatedExam = await Exam.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedExam);
    } catch (error) {
        res.status(500).json({ message: 'Error updating exam', error: error.message });
    }
});

// Delete exam (Teacher only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can delete exams' });
        }

        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (exam.teacher.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this exam' });
        }

        await exam.remove();
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exam', error: error.message });
    }
});

module.exports = router;