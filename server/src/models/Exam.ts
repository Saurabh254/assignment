import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description: String,
    duration: {
        type: Number, // in minutes
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming',
    },
}, {
    timestamps: true,
});

export default mongoose.model('Exam', examSchema);