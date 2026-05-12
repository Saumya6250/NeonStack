# Todo App - Full Stack Setup Guide

## 📋 Project Structure

```
todo-app/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── database.sql
```

---

## 🎨 FRONTEND (HTML, CSS, JavaScript)

### Files:
1. **index.html** - HTML structure with input field, buttons, and todo list
2. **style.css** - Beautiful gradient styling, animations, responsive design
3. **script.js** - Frontend logic to fetch/send data to backend API

### What it does:
- ✅ Gets todos from backend API (`GET /api/todos`)
- ✅ Adds new todo to database (`POST /api/todos`)
- ✅ Updates todo status - mark complete/incomplete (`PUT /api/todos/:id`)
- ✅ Deletes todos (`DELETE /api/todos/:id`)
- ✅ Filters by All/Active/Completed
- ✅ Responsive design for mobile & desktop

### Setup Frontend:
```bash
# No installation needed! Just open index.html in browser
# Make sure backend server is running on http://localhost:5000
```

---

## ⚙️ BACKEND (Express.js + Node.js)

### What Express.js does:
- **Handles HTTP requests** from frontend
- **Creates API endpoints** for CRUD operations
- **Validates data** before sending to database
- **Sends JSON responses** back to frontend
- **Manages CORS** (allows frontend to communicate with backend)

### API Endpoints:

```
GET  /api/todos          → Fetch all todos
POST   /api/todos          → Create new todo
PUT    /api/todos/:id      → Update todo (mark complete/incomplete)
DELETE /api/todos/:id      → Delete a todo
```

### Setup Backend:

1. **Install Node.js** (if not installed)
   - Download from: https://nodejs.org/

2. **Create project folder**
   ```bash
   mkdir todo-app-backend
   cd todo-app-backend
   ```

3. **Copy server.js and package.json** to this folder

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

6. **Start backend server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

---

## 🗄️ DATABASE (MySQL)

### What MySQL does:
- **Stores all todos** in a table
- **Persists data** so todos survive page refresh
- **Returns data** when frontend requests todos

### Database Table:

```sql
CREATE TABLE todos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Schema Explanation:
- **id** - Unique identifier for each todo
- **title** - The todo task text
- **completed** - Boolean flag (TRUE/FALSE) for completion status
- **created_at** - Timestamp when todo was created
- **updated_at** - Timestamp when todo was last updated

### Setup Database:

1. **Install MySQL** (if not installed)
   - Download from: https://www.mysql.com/downloads/

2. **Start MySQL Server**
   ```bash
   # Windows: MySQL is usually running as service
   # Mac: brew services start mysql
   # Linux: sudo systemctl start mysql
   ```

3. **Open MySQL Console**
   ```bash
   mysql -u root -p
   # Enter your password (default is empty for root)
   ```

4. **Run database.sql**
   ```sql
   -- Copy all SQL from database.sql and paste here
   -- Or use:
   mysql -u root -p < database.sql
   ```

5. **Verify table created**
   ```sql
   USE todo_db;
   DESCRIBE todos;
   SELECT * FROM todos;
   ```

---

## 🚀 How It All Works Together

### Flow of Data:

```
1. User types todo in frontend
   ↓
2. JavaScript sends POST request to backend
   ↓
3. Express.js receives request at /api/todos
   ↓
4. Express validates data & inserts into MySQL
   ↓
5. MySQL stores in 'todos' table
   ↓
6. Database returns success response
   ↓
7. JavaScript receives response and updates UI
   ↓
8. User sees new todo in list
```

### Real Example:

```
Frontend: User clicks "Add" with "Learn Node.js"
   ↓
JavaScript sends:
POST http://localhost:5000/api/todos
{
  "title": "Learn Node.js"
}
   ↓
Express.js receives and runs:
INSERT INTO todos (title, completed) VALUES ('Learn Node.js', FALSE);
   ↓
MySQL stores in database
   ↓
Express returns:
{
  "id": 1,
  "title": "Learn Node.js",
  "completed": false,
  "created_at": "2024-01-15T10:30:00Z"
}
   ↓
JavaScript adds to DOM
   ↓
User sees "Learn Node.js" in the list ✓
```

---

## 📝 Complete Startup Instructions

### Step 1: Setup Database
```bash
# Open MySQL
mysql -u root -p

# Run all SQL commands from database.sql
```

### Step 2: Setup Backend
```bash
cd todo-app-backend
npm install
# Create .env file with your MySQL credentials
npm start
# Should see: "✓ Server running at http://localhost:5000"
```

### Step 3: Setup Frontend
```bash
# Open index.html in browser (drag & drop or right-click → Open with Browser)
# Or use VS Code Live Server extension
```

### Step 4: Test
1. Type a todo and click "Add"
2. Check MySQL if data was inserted: `SELECT * FROM todos;`
3. Refresh page - todo should still be there (proof it's in database)
4. Toggle complete/delete - should update database

---

## 🐛 Troubleshooting

**Frontend can't connect to backend:**
- Check if backend is running: `http://localhost:5000/api/health`
- Check CORS settings in server.js
- Update API_URL in script.js if using different port

**Database connection failed:**
- Check MySQL is running
- Verify credentials in .env file
- Check database name is correct

**Data not persisting:**
- Check table created: `SHOW TABLES;`
- Verify data in MySQL: `SELECT * FROM todos;`

---

## 📚 Key Technologies

| Technology | Purpose |
|-----------|---------|
| **HTML** | Structure of the app |
| **CSS** | Styling and animations |
| **JavaScript** | Frontend logic & API calls |
| **Express.js** | Backend web server & routing |
| **Node.js** | JavaScript runtime for backend |
| **MySQL** | Database storage |

---

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- MySQL: https://dev.mysql.com/doc/
- Node.js: https://nodejs.org/en/docs/
- REST API: https://restfulapi.net/

Happy coding! 🚀
