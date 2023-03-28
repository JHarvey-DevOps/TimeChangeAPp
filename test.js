// JavaScript source code
const express = require('express');
const app = express();
const port = 3000;
const basicAuth = require('express-basic-auth');
const http = require("http");
const fs = require('fs').promises;
const nocache = require("nocache");
const { PowerShell } = require('node-powershell');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
const moment = require('moment');
const flash = require('connect-flash');
require('date')


let ps = new PowerShell({
    executionPolicy: 'Bypass',
    noProfile: true
});


app.use(nocache())


app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 10000, limit: '50mb', type: ['*/x-www-form-urlencoded', 'application/json', 'text/plain'] }));


app.use(basicAuth({
    users: { 'admin': 'nlsnow13#' },
    challenge: true,
    realm: 'Imb4T3st4pp',
}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.pug.html",)
})

app.get('/current-time', (req, res) => {
    const current = new Date()
    res.send(current)
});


app.get('/servicestatus', function (req, res) {
        exec(`powershell.exe -Command "Get-Service -Name 'vmictimesync' | Select-Object -ExpandProperty Status"`, (err, stdout, stderr) => {
            if (err) {
                console.log(stderr)
            } else {
                const status = stdout.trim();
                console.log(`Service Status: ${status}`);
                res.send(`Service Status: ${status}`);
                console.log(stdout)
            }
        });
});


app.post('/', function(req, res) {
    const time = req.body;
    const { timeentry } = time;
    exec(`powershell.exe -Command "$myVar = '${timeentry}'; set-date $myVar"`, (err, stdout, stderr) => {
        if (err) {
            console.log(stderr)
        } else {
            console.log(stdout)
        }
    });
    console.log(timeentry)
    res.redirect('http://localhost:3000')
});


app.post('/iisreset', function (req, res) {
    const checked = req.body.IISreset;
    if (checked) {
        exec('powershell.exe -Command "iisreset /restart"', (err, stdout, stderr) => {
            if (err) {
                console.log(stderr)
            }
            else {
                console.log(stdout)
            }
            res.redirect('http://localhost:3000')
        });
    };
});


app.post('/servicesubmit', function (req, res) {
    exec(`powershell.exe -Command "Get-Service -Name 'vmictimesync' | Select-Object -ExpandProperty Status"`, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error executing PowerShell command')
            return
        }
        const status = stdout.trim()
        if (status === 'Running') {
            exec(`powershell.exe -Command "Stop-Service 'vmictimesync'"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err)
                    res.status(500).send('Error stopping service')
                    return
                }
                res.send('Service stopped')
            })
        } else if (status === 'Stopped') {
            exec(`powershell.exe -Command "Start-Service 'vmictimesync'"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err)
                    res.status(500).send('Error starting service')
                    return
                }
                res.send('Service started')
            })
        } else {
            res.status(500).send(`Unexpected service status: ${status}`)
        }
    })
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
