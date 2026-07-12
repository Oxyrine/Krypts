import sqlite3
import os

db_path = r'C:\Users\aakas\AppData\Roaming\krypts-desktop\krypts.db'
if not os.path.exists(db_path):
    print("DB not found at", db_path)
else:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute('SELECT email, account_status, rapid_session_count FROM users')
    print('BEFORE:', cur.fetchall())
    cur.execute("UPDATE users SET account_status='active', rapid_session_count=0")
    conn.commit()
    cur.execute('SELECT email, account_status, rapid_session_count FROM users')
    print('AFTER:', cur.fetchall())
    conn.close()
