// JavaScript source code
const express = require('express')
const app = express()
const port = 3000


app.set('view engine', 'pug');


app.use(express.static(__dirname + '/views'));



const server = app.listen(3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});