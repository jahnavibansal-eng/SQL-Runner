from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Dict
import sqlite3
import uuid
import os

app = FastAPI()

DIST_PATH = os.path.join(os.path.dirname(__file__), "dist")

app.mount("/assets", StaticFiles(directory=os.path.join(DIST_PATH, "assets")), name="assets")

@app.get("/")
def serve_root():
    return FileResponse(os.path.join(DIST_PATH, "index.html"))

@app.get("/{path:path}")
def catch_all(path: str):
    return FileResponse(os.path.join(DIST_PATH, "index.html"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "sql_runner.db")

# Query history table setup
def init_history_table():
    conn = sqlite3.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS query_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()

init_history_table()

TOKENS = {}

def get_db():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn

# Authentication
def require_auth(token: str = Header(None)):
    if token not in TOKENS:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return TOKENS[token]


@app.post("/login")
def login(data: Dict[str, str]):
    username = data.get("username")
    password = data.get("password")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE username=? AND password=?", (username, password))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = str(uuid.uuid4())
    TOKENS[token] = row["id"]

    return {"token": token, "user_id": row["id"]}


@app.get("/tables")
def get_tables(user_id: int = Depends(require_auth)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = [row[0] for row in cur.fetchall()]
    conn.close()
    return tables

@app.get("/table/{name}")
def table_info(name: str, user_id: int = Depends(require_auth)):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    valid_tables = [r[0] for r in cur.fetchall()]
    if name not in valid_tables:
        raise HTTPException(status_code=400, detail="Invalid table name")

    try:
        cur.execute(f"PRAGMA table_info('{name}')")
        columns = [{"name": r[1], "type": r[2]} for r in cur.fetchall()]

        cur.execute(f"SELECT * FROM '{name}' LIMIT 5")
        rows = [dict(r) for r in cur.fetchall()]

        return {"columns": columns, "sample_data": rows}

    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        conn.close()


@app.post("/query")
def execute_query(data: Dict[str, str], user_id: int = Depends(require_auth)):
    sql = data.get("sql", "")
    if not sql.strip():
        raise HTTPException(status_code=400, detail="No SQL query provided")

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute(sql)
        results = cur.fetchall()
        conn.commit()

        cur.execute("INSERT INTO query_history (query) VALUES (?)", (sql,))
        conn.commit()

        return {"results": [dict(r) for r in results]}

    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        conn.close()


@app.get("/history")
def get_query_history(user_id: int = Depends(require_auth)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT query, created_at FROM query_history ORDER BY id DESC LIMIT 20")
    rows = cur.fetchall()
    conn.close()

    return [{"query": r["query"], "created_at": r["created_at"]} for r in rows]


@app.delete("/history")
def clear_history(user_id: int = Depends(require_auth)):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM query_history")
    conn.commit()
    conn.close()
    return {"message": "Query history cleared"}
