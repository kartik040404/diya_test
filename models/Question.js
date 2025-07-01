import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    quesEng: {
        type: String,
        required: true,
    },
    quesImg: {
        type: String,
    },
    option1: {
        type: String,
        required: true,
    },
    option2: {
        type: String,
        required: true,
    },
    option3: {
        type: String,
        required: true,
    },
    option4: {
        type: String,
        required: true,
    },
    quesMarathi: {
        type: String,
        required: true,
    },
    option1M: {
        type: String,
        required: true,
    },
    option2M: {
        type: String,
        required: true,
    },
    option3M: {
        type: String,
        required: true,
    },
    option4M: {
        type: String,
        required: true,
    },
    correctOption: {
        type: Number,
        required: true,
    },
    explainationEng: {
        type: String,
        required: true,
    },
    explainationMarathi: {
        type: String,
        required: true,
    },
    chapter: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    subTopic: {
        type: String,
    },
    difficulty: {
        type: String,
        required: true,
    },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
