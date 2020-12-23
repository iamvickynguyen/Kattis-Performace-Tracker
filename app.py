import sqlite3
from flask import Flask, render_template, request, url_for
from scraper import scrape
app = Flask(__name__)
conn = sqlite3.connect('kattistracker.db')
c = conn.cursor()
c.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='userprofile' ''')

#if the count is 1, then table exists
if c.fetchone()[0]!=1 :
    c.execute('''CREATE TABLE IF NOT EXISTS userprofile
        (id text, date text, problem text, status text, cpu real, lang text)''')
		
conn.commit()
conn.close()

@app.route('/', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        scrape(request.form['user-input'], request.form['token-input'])
        return render_template('stats.html', username = 'jkljaslf', token = 'jfaijf')
    else:
        return render_template('login.html')

if __name__ == "__main__":
    app.run(debug=True)