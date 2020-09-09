const puppeteer = require('puppeteer');

const loginUrl = 'https://open.kattis.com/login/email?';

async function getData(data) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(loginUrl);

    await login(page, data);
    const result = await scrapeProfile(page, data.address);

    browser.close();
    
    return {result};
}

async function login(page, data) {
    await page.type('#user_input', data.email);
    await page.type('#password_input', data.password);
    await page.click("input[name='submit']");
}

async function scrapeProfile(page, address) {
    await page.waitForSelector('.user-img');
    await page.goto(`https://open.kattis.com/users/${address}`);
    await page.waitForSelector('.table-kattis');

    // await page.screenshot({path: 'profile.png'}); // DEBUG

    // https://stackoverflow.com/questions/49236981/want-to-scrape-table-using-puppeteer-how-can-i-get-all-rows-iterate-through-ro
    let result = await page.$$eval('.table-kattis tr', rows => {
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    let objects = [];
    getObjects(result, objects);

    let i = 1;
    while (result.length > 1) {
        await page.goto(`https://open.kattis.com/users/${address}?page=${i}`);
        await page.waitForSelector('.table-kattis');

        result = await page.$$eval('.table-kattis tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                return Array.from(columns, column => column.innerText);
            });
        });

        getObjects(result, objects);
        i += 1;
    }

    return objects;
}

function getObjects(data, objects) {
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        objects.push({
            id: row[0],
            date: row[1],
            problem: row[2],
            status: row[3],
            cpu: row[4],
            language: row[5]
        });
    }
}

module.exports = { getData }