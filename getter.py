import sqlite3
def problem_titles():
    conn = sqlite3.connect('kattistracker.db')
    c = conn.cursor()
    c.execute('''SELECT distinct problem FROM userprofile LIMIT 10''')
    problems = c.fetchall()
    conn.close()
    return problems