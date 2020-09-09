const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser')
const scrapper = require('./scrapper');
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get('/', async (req, res) => {
    res.send('success!');
})

app.post('/login', async (req, res) => {
    const result = await scrapper.getData(req.body);
    res.json({result});
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})