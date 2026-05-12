-- MYSQL DATABASE SETUP
-- ====================

-- Create Database
CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add some sample data (optional)
INSERT INTO todos (title, completed) VALUES 
('Learn Node.js', FALSE),
('Build a Todo App', TRUE),
('Master Express.js', FALSE),
('Connect to MySQL', FALSE);

-- Verify table structure
DESCRIBE todos;

-- Query to see all todos
SELECT * FROM todos;
