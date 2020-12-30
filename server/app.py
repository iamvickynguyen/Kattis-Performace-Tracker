import sqlite3
from flask import Flask, render_template, request, url_for, jsonify, redirect
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
def api_statuscountgroupbydate():
    conn = sqlite3.connect('kattistracker.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    results = c.execute('''
        with ac as (select count(status) as ac_count, date from userprofile where status LIKE 'Accepted%' COLLATE NOCASE and date is not null group by date),
        wa as (select count(status) as wa_count, date from userprofile where status LIKE 'Wrong Answer%' COLLATE NOCASE and date is not null group by date),
        tle as (select count(status) as tle_count, date from userprofile where status LIKE 'Time Limit Exceeded%' COLLATE NOCASE and date is not null group by date),
        ac_wa as
        (select ac_count, wa_count, ac.date
            from ac left join wa on ac.date = wa.date
            union
            select ac_count, wa_count, wa.date
            from wa left join ac on ac.date = wa.date
            where ac.date is null),
        ac_wa_tle as
        (select ac_count, wa_count, tle_count, ac_wa.date
            from ac_wa left join tle on ac_wa.date = tle.date
            union
            select ac_count, wa_count, tle_count, tle.date
            from tle left join ac_wa on ac_wa.date = tle.date
            where ac_wa.date is null),
        others as
        (select count(status) as others_count, date from userprofile where date not in (select date from ac_wa_tle) and date is not null group by date)
        select ac_count, wa_count, tle_count, others_count, ac_wa_tle.date
            from ac_wa_tle left join others on ac_wa_tle.date = others.date
            union
            select ac_count, wa_count, tle_count, others_count, others.date
            from others left join ac_wa_tle on ac_wa_tle.date = others.date
            where ac_wa_tle.date is null;
            ''').fetchall()
    return jsonify({'results': results})

@app.route('/api/details/<date>', methods=['GET'])
def api_details(date):
    conn = sqlite3.connect('kattistracker.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    results = c.execute('''select * from userprofile where date='%s' order by time;''' %date).fetchall()
    return jsonify({'results': results})

if __name__ == "__main__":
    app.run(debug=True)