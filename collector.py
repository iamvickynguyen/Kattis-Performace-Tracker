import sqlite3
import unicodedata
import requests
import bs4
from requests import Request, Session
from bs4 import BeautifulSoup

def validate_account(username, token):
    url = 'https://open.kattis.com/login'
    login_args = {'user': username, 'script': 'true', 'token':token}
    with requests.session() as s:
        try:
            status = s.post(url, login_args)
            if status.status_code != 200:
                return status.status_code
            return 200
        except Exception as e:
            print('Error!!!', e)
            return 500

def collect(username, token):
    url = 'https://open.kattis.com/login'
    login_args = {'user': username, 'script': 'true', 'token':token}

    conn = sqlite3.connect('kattistracker.db')
    c = conn.cursor()
    
    print('Collecting data...')
    with requests.session() as s:
        try:
            c.execute('DELETE FROM userprofile WHERE date IS NULL;')
            conn.commit()
            status = s.post(url, login_args)

            # validate
            if status.status_code != 200:
                return status.status_code

            pagenumber = 0
            endscrapping = False
            while True:
                page = s.get('https://open.kattis.com/users/{}?page={}'.format(username, pagenumber))
                soup = BeautifulSoup(page.content, 'html.parser')
                results = soup.find_all('table')
                tuples = get_data(results[1], username)

                if len(tuples) <= 0:
                    break

                # insert new data
                newtuples = []
                for item in tuples:
                    result = c.execute('''select * from userprofile where id='%s';''' %item[0]).fetchone()
                    if result is not None:
                        endscrapping = True
                        break
                    newtuples.append(item)

                c.executemany('INSERT INTO userprofile(id, userid, date, time, problem, status, cpu, lang) values (?,?,?,?,?,?,?,?)', newtuples)

                if endscrapping:
                    break

                pagenumber += 1

            conn.commit()
            conn.close()
            return 200

        except Exception as e:
            print('Error!!!', e)
            return 500

def get_data(table, username):
    data = []
    body = table.find('tbody')
    rows = body.find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        datetime = cols[1].get_text().split()
        date = datetime[0] if len(datetime) > 1 else None
        time = datetime[0] if len(datetime) < 2 else datetime[1]
        data.append((
            cols[0].get_text(),
            username,
            date,
            time,
            cols[2].get_text(),
            cols[3].get_text(),
            unicodedata.normalize('NFKD', cols[4].get_text()),
            cols[5].get_text()
        ))
    return data