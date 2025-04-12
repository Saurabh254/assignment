import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Passed', 'Failed'],
        required: true,
    },
    feedback: String,
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Calculate percentage and grade before saving
examResultSchema.pre('save', function (next) {
    this.percentage = (this.score / this.totalMarks) * 100;

    // Grade calculation
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B+';
    else if (this.percentage >= 60) this.grade = 'B';
    else if (this.percentage >= 50) this.grade = 'C';
    else this.grade = 'F';

    // Status calculation
    this.status = this.percentage >= 50 ? 'Passed' : 'Failed';

    next();
});

export default mongoose.model('ExamResult', examResultSchema);