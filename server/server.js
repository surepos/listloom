import express from 'express';
import connectDB from './db.js';
import Task from './Task.js';
import cors from 'cors';
import fs from 'fs';
import https from 'https';

const app = express();
const PORT = 8080;
// const options = {
//     key: fs.readFileSync('../server.key'),
//     cert: fs.readFileSync('/server.cert')
// };

app.use(cors());
app.use(express.json());

connectDB();


const fetchData = async () => {
    try {
        const tasks = await Task.find();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Failed to fetch tasks');
    }
};


app.post('/search', async (req, res) => {
    try {
        const taskData = req.body;

        const newTask = new Task({
            task: taskData.task,
            taskDate: taskData.taskDate,
        });

        await newTask.save();

        const inquiredDate = new Date(taskData.displayDate);
        inquiredDate.setHours(0, 0, 0, 0);
    

        const tasks = await Task.find({
            taskDate: {
                $gte: inquiredDate,
                $lt: new Date(inquiredDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        res.status(201).json({ tasks });
    } catch (error) {
        console.error('Error saving task:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/tasks/:date', async (req, res) => {
    try {
        const inquiredDate = new Date(req.params.date);
        
        
        inquiredDate.setHours(0, 0, 0, 0);

        const tasks = await Task.find({
            taskDate: {
                $gte: inquiredDate,
                $lt: new Date(inquiredDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/task/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.completed = !task.completed;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const response = req.body;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.task = response.task;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/task/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
