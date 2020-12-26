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
            status = s.post(url, login_args)
            pagenumber = 0
            while True:
                page = s.get('https://open.kattis.com/users/{}?page={}'.format(username, pagenumber))
                soup = BeautifulSoup(page.content, 'html.parser')
                results = soup.find_all('table')
                tuples = get_data(results[1])

                if len(tuples) <= 0:
                    break

                c.executemany('INSERT INTO userprofile values (?,?,?,?,?,?,?)', tuples)
                conn.commit()

                pagenumber += 1
            
            conn.close()
        except Exception as e:
            print('Error!!!')
            print(e)
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

# if some data already exist, return list of new data
# def check_exist(c, conn, tuples):
#     args = map(lambda x: x[0], tuples)
    
#     c.execute('SELECT id FROM userprofile WHERE id IN ({})'.format(','.join(['?']*len(list(args)))))
#     ids = set(c.fetchall())
#     conn.commit()
#     return list(filter(lambda x: x[0] not in ids, tuples))