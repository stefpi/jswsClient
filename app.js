const ws = require('ws');
const bodyParser = require("body-parser");
const express = require('express');
const flatCache = require('flat-cache');
const fs = require('fs');

const msgLogs = flatCache.load('cacheID');
const app = express();
const port = 3000;

const wsc = new ws('ws://localhost:4001');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

let ranvierOut = '';
let msg = '';
let isConnected = false;
let msgNumber = 0;
let number = 0

app.use('/connect', function(req, res, next) {
        // const wsc = new ws('ws://localhost:4001');
});

wsc.on('message', function incoming(data) {
        const d = JSON.parse(data);
        msgLogs.setKey(msgNumber, {message: d.message});
        msgNumber = msgNumber + 1
});

app.use('/command', function(req, res, next) {
        msg = req.body.msg;
        wsc.send(msg);

        next();
});

app.get('/', function(req, res) {
        // res.writeHead(200, {"Content-Type": "application/json"});
        while (number <= msgNumber) {
                var send = JSON.stringify(msgLogs.getKey(number));
                var type = typeof send;
                res.json(send);
                console.log('sent to /: * ' + send  + ' *' + type + '');
                number++;
        }
        res.end();
        console.log('no more messages detected!');
});

app.listen(port, () => console.log(`test server listening on port ${port}`))
