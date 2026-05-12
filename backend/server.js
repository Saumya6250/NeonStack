

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'todo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// GET - Fetch all todos
app.get('/api/todos', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM todos ORDER BY created_at DESC'
        );
        connection.release();
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// POST - Create a new todo
app.post('/api/todos', async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO todos (title, completed) VALUES (?, ?)',
            [title, false]
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            title,
            completed: false,
            created_at: new Date()
        });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// PUT - Update a todo (toggle completed status)
app.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE todos SET completed = ? WHERE id = ?',
            [completed, id]
        );
        connection.release();

        res.json({ success: true, message: 'Todo updated successfully' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// DELETE - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'DELETE FROM todos WHERE id = ?',
            [id]
        );
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json({ success: true, message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await pool.end();
    process.exit(0);
});
