import sqlite3
from flask import Flask, render_template, request, url_for, jsonify
from scraper import scrape
app = Flask(__name__, template_folder = "../templates", static_folder="../static")
conn = sqlite3.connect('kattistracker.db')
c = conn.cursor()
c.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='userprofile' ''')

#if the count is 1, then table exists
if c.fetchone()[0]!=1 :
    c.execute('''CREATE TABLE IF NOT EXISTS userprofile
        (id text, date text, problem text, status text, cpu real, lang text)''')
		
conn.commit()
conn.close()

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@app.route('/', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        # scrape(request.form['user-input'], request.form['token-input'])
        return render_template('stats.html')
    else:
        return render_template('login.html')

@app.route('/api/problemtitles', methods=['GET'])
def api_problemtitles():
    conn = sqlite3.connect('kattistracker.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    all_problemtitles = c.execute('SELECT distinct problem FROM userprofile LIMIT 10;').fetchall()
    return jsonify({'problemtitles': all_problemtitles})

if __name__ == "__main__":
    app.run(debug=True)