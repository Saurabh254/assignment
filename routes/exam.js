const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const auth = require('../middleware/auth');

// Create new exam (Teacher only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can create exams' });
        }

        const exam = new Exam({
            ...req.body,
            teacher: req.user.userId
        });

        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Error creating exam', error: error.message });
    }
});

// Get all exams
router.get('/', auth, async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate('teacher', 'name');
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exams', error: error.message });
    }
});

// Get exam by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate('teacher', 'name');

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