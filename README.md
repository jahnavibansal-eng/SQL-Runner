SQL RUNNER

A lightweight SQL execution and database exploration tool built with React + FastAPI + SQLite.

This application allows users to:

1. Log in using a secure token
2. Browse all available tables
3. Preview table schema & sample data
4. Execute SQL queries dynamically
5. View and re-run recent queries
6. Clear query history
7. Enjoy a clean and responsive UI

TECH STACK

Frontend
React (Vite / CRA)
Custom components (Sidebar, SqlEditor, ResultsTable, TablePreview)
Fetch API for HTTP requests
Token-based login (stored in localStorage)

Backend
FastAPI
SQLite (Python sqlite3)
Uvicorn (for development server)
CORS enabled
Simple authentication system
Query history tracking


PROJECT STRUCTURE

SQL_RUNNER/
│
├── backend/
│   ├── .vscode/
│   │   └── (VS Code settings)
│   │
│   ├── venv/
│   │   └── (Python virtual environment)
│   │
│   ├── main.py                # FastAPI backend
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── node_modules/          # Installed npm packages
│   │
│   ├── public/
│   │   └── index.html         # HTML template for React
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── QueryInput.js        # SQL input component
│   │   │   ├── ResultsTable.jsx     # Query results table UI
│   │   │   ├── Sidebar.jsx          # Sidebar (tables + history)
│   │   │   ├── SqlEditor.jsx        # Main SQL editor
│   │   │   └── TablePreview.jsx     # Table schema + sample rows
│   │   │
│   │   ├── api.js              # All API calls to backend
│   │   ├── App.jsx             # Root React component
│   │   ├── index.css           # Global styles
│   │   ├── Login.jsx           # Login screen
│   │   └── main.jsx            # React entry point
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json            # Frontend dependencies & scripts
│   ├── README.md               # Project documentation
│   └── vite.config.js          # Vite configuration for frontend
│
├── sql_runner.db               # SQLite database
│
└── README.md                   # Root-level project documentation


INSTALLATION AND SETUP

Backend Setup (FastAPI)

Step 1: Create venv

python3 -m venv venv
source venv/bin/activate       # Mac
venv\Scripts\activate          # Windows

Step 2: Install dependencies
pip install -r requirements.txt

Step 3: Create SQLite database (if not present)

sqlite3 sql_runner.db

Inside SQLite, create required tables:

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
);

INSERT INTO users (username, password)
VALUES ("admin", "admin123");

CREATE TABLE query_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*Also add your sample application tables (Customers, Orders, Shippings, etc.)

Exit SQLite:

.exit

Step 4: Run backend server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 
*Make sure to run this from root folder

BACKEND URL:
http://127.0.0.1:8000


Frontend Setup (React)

Step 1: Install dependencies
Inside /frontend:
npm install

Step 2: Start development server
npm start

Frontend URL:
http://localhost:3000

Make sure your api.js points to:
const BASE_URL = "http://localhost:8000";


LOGIN INFO

Default test credentials:
username: admin
password: admin123

FEATURES

Authentication
User logs in, receives a UUID token
Token stored in localStorage
All API routes protected by header-based auth

Table Browsing
Fetch available SQLite tables
Display list in sidebar
Click to preview schema & first 5 rows

SQL Query Runner
Write custom SQL queries
Run them against the database
Display results in formatted table
Handles errors gracefully

Recent Query History
Automatically stores last executed queries
Re-run queries by clicking
Clear history button included
Scrollable UI to prevent overflow


DEVELOPMENT NOTES

Environment Variables
You can optionally set database location via:
export DATABASE_URL=./sql_runner.db
Or rely on default path inside main.py.

Adding New Tables
To add new tables to SQLite:
sqlite3 sql_runner.db
CREATE TABLE Products (...);
.exit

TESTING

Use Swagger UI to test backend APIs:
http://127.0.0.1:8000/docs

PRODUCTION BUILD

To create a production bundle:
npm run build

LIVE DEMO

The application is deployed and running at:
https://sql-runner-goyx.onrender.com