import sqlite3
import os
from flask import Flask, render_template, request, url_for, jsonify, redirect
from collector import validate_account, collect, delete_data
app = Flask(__name__)

# data table
conn = sqlite3.connect('kattistracker.db')
c = conn.cursor()
c.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='userprofile' ''')

#if the count is 1, then table exists
if c.fetchone()[0]!=1 :
    c.execute('''CREATE TABLE IF NOT EXISTS userprofile
        (id text, user text, date text, time text, problem text, status text, cpu real, lang text)''')
conn.commit()
conn.close()

# users table
conn = sqlite3.connect('users.db')
c = conn.cursor()
c.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='accounts';''')

#if the count is 1, then table exists
if c.fetchone()[0]!=1 :
    c.execute('''CREATE TABLE IF NOT EXISTS accounts (username text primary key, token text unique);''')
conn.commit()
conn.close()

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def store_userinfo(username, token):     
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    results = c.execute('''select username from accounts where username='%s';''' % username).fetchone()
    if not results:
        c.execute('''insert into accounts(username, token) values('%s', '%s');''' % (username, token))
        conn.commit()
    conn.close()

@app.route('/', methods=['POST', 'GET'])
def login():
    usernames = get_usernames()
    if request.method == 'POST':
        username = request.form.get('accountOptions')
        userinfo = get_userinfo(username)
        status = collect(userinfo['username'], userinfo['token'])

        if status != 200:
            return render_template('login.html', usernames = usernames, input_error = True)
        return redirect(url_for('user', username = username))

    return render_template('login.html', input_error = False, usernames = usernames)

# NOTE: not many accounts so rendering the whole page is fine. TODO: just update the user dropdown menu
@app.route('/account', methods=['POST', 'GET'])
def account():
    if request.method == 'POST':
        usernames = get_usernames()
        username, token = request.form['user-input'], request.form['token-input']
        status = validate_account(username, token)

        if status != 200:
            return render_template('login.html', usernames = usernames, input_error = True)

        store_userinfo(username, token)
        usernames = get_usernames()
        return render_template('login.html', usernames = usernames, input_error = False)

@app.route('/<username>')
def user(username):
    return render_template('stats.html', username = username)

@app.route('/api/statuscountgroupbydate', methods=['GET','POST'])
def api_statuscountgroupbydate():
    conn = sqlite3.connect('kattistracker.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    username = request.args.get('user')
    query = '''with usertable as (select * from userprofile where user='{0}'),
        ac as (select count(status) as ac_count, date from usertable where status LIKE 'Accepted%' COLLATE NOCASE and date is not null group by date),
        wa as (select count(status) as wa_count, date from usertable where status LIKE 'Wrong Answer%' COLLATE NOCASE and date is not null group by date),
        tle as (select count(status) as tle_count, date from usertable where status LIKE 'Time Limit Exceeded%' COLLATE NOCASE and date is not null group by date),
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
        (select count(status) as others_count, date from usertable where date not in (select date from ac_wa_tle) and date is not null group by date)
        select ac_count, wa_count, tle_count, others_count, ac_wa_tle.date
            from ac_wa_tle left join others on ac_wa_tle.date = others.date
            union
            select ac_count, wa_count, tle_count, others_count, others.date
            from others left join ac_wa_tle on ac_wa_tle.date = others.date
            where ac_wa_tle.date is null;'''.format(username)

    results = c.execute(query).fetchall()
    return jsonify({'results': results})

@app.route('/api/details', methods=['GET'])
def api_details():
    conn = sqlite3.connect('kattistracker.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    results = c.execute('''select * from userprofile where user='%s' and date='%s' order by time;''' %(request.args.get('user'), request.args.get('date'))).fetchall()
    return jsonify({'results': results})

def get_userinfo(username):
    conn = sqlite3.connect('users.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    return c.execute('''select * from accounts where username='%s';''' %username).fetchone()

def get_usernames():
    conn = sqlite3.connect('users.db')
    conn.row_factory = dict_factory
    c = conn.cursor()
    return list(map(lambda x: x['username'], c.execute('''select username from accounts;''').fetchall()))

if __name__ == "__main__":
    app.run()