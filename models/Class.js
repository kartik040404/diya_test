import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    instituteid: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    div: {
        type: String,
        required: true,
    },
    assignedTest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test"
        }
    ],
});

const Class = mongoose.model('Class', classSchema);

export default Class;
