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
        (id text, date text, time text, problem text, status text, cpu real, lang text)''')
		
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

@app.route('/api/statuscountgroupbydate', methods=['GET'])
def api_problemtitles():
    conn = sqlite3.connect('kattistracker.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    results = c.execute('''
        with ac as (select problem, date from userprofile where status like 'Accepted%' COLLATE NOCASE and date is not null group by problem),
        wa as (select problem, date from userprofile where status like 'Wrong Answer%' COLLATE NOCASE and date is not null group by problem),
        tle as (select problem, date from userprofile where status like 'Time Limit Exceeded%' COLLATE NOCASE and date is not null group by problem),
        countac as (select count(problem) as ac_count, date from ac group by date),
        countwa as (select count(problem) as wa_count, date from wa group by date),
        counttle as (select count(problem) as tle_count, date from tle group by date),
        ac_wa as
        (select ac_count, wa_count, countac.date
            from countac left join countwa on countac.date = countwa.date
            union
            select ac_count, wa_count, countwa.date
            from countwa left join countac on countac.date = countwa.date
            where countac.date is null
        )
        select ac_count, wa_count, tle_count, ac_wa.date
            from ac_wa left join counttle on ac_wa.date = counttle.date
            union
            select ac_count, wa_count, tle_count, counttle.date
            from counttle left join ac_wa on ac_wa.date = counttle.date
            where ac_wa.date is null;
            ''').fetchall()
    return jsonify({'results': results})

if __name__ == "__main__":
    app.run(debug=True)