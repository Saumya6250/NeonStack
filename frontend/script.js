// API Base URL (Change this to your Express server URL)
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const deleteCompletedBtn = document.getElementById('deleteCompleted');

// State
let todos = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    deleteCompletedBtn.addEventListener('click', deleteAllCompleted);
}

// Load todos from backend
async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`); //// Sends GET request to backend route: /api/todos.
        if (!response.ok) throw new Error('Failed to load todos');
        
        const data = await response.json();
        todos = data; //store data in array
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
        showNotification('Failed to load todos', 'error');
    }
}

// Add new todo
async function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.focus();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: text })
        });

        if (!response.ok) throw new Error('Failed to add todo');
        
        const newTodo = await response.json();
        todos.push(newTodo);
        todoInput.value = '';
        todoInput.focus();
        renderTodos();
        showNotification('Task added successfully! ✓', 'success');
    } catch (error) {
        console.error('Error adding todo:', error);
        showNotification('Failed to add task', 'error');
    }
}

// Toggle todo completion
async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !todo.completed })
        });

        if (!response.ok) throw new Error('Failed to update todo');
        
        todo.completed = !todo.completed;
        renderTodos();
    } catch (error) {
        console.error('Error toggling todo:', error);
        showNotification('Failed to update task', 'error');
    }
}

// Delete a single todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete todo');
        
        todos = todos.filter(t => t.id !== id);
        renderTodos();
        showNotification('Task deleted! ', 'success');
    } catch (error) {
        console.error('Error deleting todo:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// Delete all completed todos
async function deleteAllCompleted() {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);
    
    if (completedIds.length === 0) return;

    try {
        for (const id of completedIds) {
            await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE'
            });
        }
        
        todos = todos.filter(t => !t.completed);
        renderTodos();
        showNotification('Completed tasks deleted!', 'success');
    } catch (error) {
        console.error('Error deleting completed todos:', error);
        showNotification('Failed to delete completed tasks', 'error');
    }
}

// Render todos based on filter
function renderTodos() {
    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    // Clear list
    todoList.innerHTML = '';

    // Add todos
    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filteredTodos.forEach(todo => {
            const todoItem = createTodoElement(todo);
            todoList.appendChild(todoItem);
        });
    }

    // Show/hide delete completed button
    const hasCompleted = todos.some(t => t.completed);
    deleteCompletedBtn.style.display = hasCompleted ? 'block' : 'none';

    // Update empty state visibility
    if (filteredTodos.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Create todo element
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
        <input 
            type="checkbox" 
            class="checkbox" 
            ${todo.completed ? 'checked' : ''}
            onchange="toggleTodo(${todo.id})"
        >
        <span class="todo-text">${escapeHtml(todo.title)}</span>
        <button class="btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    return li;
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple console notification (you can replace with toast notifications)
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Optional: Create a toast notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
