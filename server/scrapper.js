const puppeteer = require('puppeteer');

const loginUrl = 'https://open.kattis.com/login/email?';

async function scrapeProfile(data) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(loginUrl);

    await page.type('#user_input', data.email);
    await page.type('#password_input', data.password);
    await page.click("input[name='submit']");
    
    await page.waitForSelector('.user-img');

    await page.goto(`https://open.kattis.com/users/${data.address}`);

    await page.waitForSelector('.table-kattis');
    await page.screenshot({path: 'profile.png'});
    
    browser.close();
}

module.exports = { scrapeProfile }