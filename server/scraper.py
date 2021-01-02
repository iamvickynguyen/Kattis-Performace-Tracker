import sqlite3
import unicodedata
import requests
import bs4
from requests import Request, Session
from bs4 import BeautifulSoup

def scrape(username, token):
    url = 'https://open.kattis.com/login'
    login_args = {'user': username, 'script': 'true', 'token':token}

    conn = sqlite3.connect('kattistracker.db')
    c = conn.cursor()

    print('SCRAPING...')
    with requests.session() as s:
        try:
            c.execute('DELETE FROM userprofile WHERE date IS NULL;')
            conn.commit()
            status = s.post(url, login_args)
            pagenumber = 0
            endscrapping = False
            while True:
                page = s.get('https://open.kattis.com/users/{}?page={}'.format(username, pagenumber))
                soup = BeautifulSoup(page.content, 'html.parser')
                results = soup.find_all('table')
                tuples = get_data(results[1])

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

                c.executemany('INSERT INTO userprofile values (?,?,?,?,?,?,?)', newtuples)

                if endscrapping:
                    break

                pagenumber += 1

            conn.commit()
            conn.close()

        except Exception as e:
            print('Error!!!', e)
            return

def get_data(table):
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
            date,
            time,
            cols[2].get_text(),
            cols[3].get_text(),
            unicodedata.normalize('NFKD', cols[4].get_text()),
            cols[5].get_text()
        ))
    return data