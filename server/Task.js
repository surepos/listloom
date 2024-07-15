import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    taskDate: {
        type: Date, 
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
    
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
