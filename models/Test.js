import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    instituteid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    question: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
    ],
    duration: {
        type: String,
    },
    startdate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    easy: {
        type: Number,
        required: true,
    },
    medium: {
        type: Number,
        required: true,
    },
    hard: {
        type: Number,
        required: true,
    },
});

const Test = mongoose.model('Test', testSchema);

export default Test;
