const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['mcq', 'text'],
        required: true
    },
    options: [{
        type: String
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    timeLimit: {
        type: Number,
        required: true,
        default: function () {
            return this.questionType === 'mcq' ? 120 : 300; // 2 minutes for MCQ, 5 minutes for text
        }
    },
    topic: {
        type: String,
        required: true
    }
});

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [questionSchema],
    duration: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);