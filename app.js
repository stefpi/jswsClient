const ws = require('ws');
const bodyParser = require("body-parser");
const express = require('express')

const app = express()
const port = 3000

const wsc = new ws('ws://192.168.0.32:4001');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

let ranvierOut = '';
let prologue = [];
let msg = '';
let isConnected = false;

wsc.on('message', function incoming(data) {
        const d = JSON.parse(data);
        ranvierOut = d;
        if (isConnected) {
                console.log(` * [${d.message}] - [${d.type}]`);     
        } else {
                var data = {
                        message: d.message
                }
                prologue.push(data);
        }
});

app.use('/command', function(req, res, next) {
        msg = req.body.msg;
        wsc.send(msg);

        next();
});

app.use('/connect', function(req, res, next) {
        isConnected = true;
        res.send(prologue);
});

app.get('/', function(req, res) {
        res.send(ranvierOut);
});

app.listen(port, () => console.log(`test server listening on port ${port}`))

