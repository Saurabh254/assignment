const mongoose = require('mongoose');

const questionResultSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true
    }
});

const resultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    questionResults: [questionResultSchema],
    weakTopics: [{
        topic: String,
        score: Number
    }],
    timeTaken: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);