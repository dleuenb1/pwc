from flask import Flask, jsonify, request
import sqlite3
import os
import json
import requests

app = Flask(__name__)

DATABASE = "database.db"

def init_db():
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT NOT NULL UNIQUE,
                prompts TEXT
            )
        """)

        cursor.execute("""
            INSERT INTO user (token, prompts) 
            VALUES (?, ?)
        """, ("example_token_123", "some_prompts_here"))

        conn.commit()
        conn.close()
        print("Baza danych została utworzona i zainicjalizowana.")

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def sprawdz_token(token):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql_query = "SELECT prompts FROM user WHERE token = ?"
    cursor.execute(sql_query, (token,))
    result = cursor.fetchone()

    conn.close()

    return bool(result)

@app.route("/api/", methods=['POST'])
def test():
    dataset = request.form.get('dataset')
    kolumna = request.form.get('kolumna')
    token = request.form.get('token')

    print("dataset:", dataset)
    print("kolumna:", kolumna)
    print("token:", token)

    if dataset is None:
        return jsonify({"status": "Bad request - missing dataset"})

    if not isinstance(kolumna, str):
        return jsonify({"status": "Bad request - kolumna not str"})

    if not isinstance(token, str):
        return jsonify({"status": "Bad request - token not str"})

    if not sprawdz_token(token):
        return jsonify({"status": "Bad request - token invalid"})

    try:
        response = requests.post(
            "http://127.0.0.1:8000/analyze/",
            json={
                "column": kolumna,
                "data": json.loads(dataset)
            }
        )

        if response.status_code != 200:
            return jsonify({"status": "FastAPI error", "detail": response.text})

        result = response.json()
        return jsonify({"status": "success", "result": result})

    except Exception as e:
        return jsonify({"status": "internal error", "message": str(e)})

if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5454)
