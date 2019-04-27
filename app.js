const ws = require('ws');
const bodyParser = require("body-parser");
const express = require('express');

const app = express();
const port = 3000;

const wsc = new ws('ws://localhost:4001');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

let msg = '';
let msObj = {};
var send = [];
let isConnected = false;
let msgNumber = 0;
let number = 0

app.use('/connect', function(req, res, next) {
        // const wsc = new ws('ws://localhost:4001');
});

wsc.on('message', function incoming(data) {
        const d = JSON.parse(data);
        msgObj = { [msgNumber]: { message: d.message }};
        send.push(msgObj);
        msgNumber = msgNumber + 1
});

app.use('/command', function(req, res, next) {
        msg = req.body.msg;
        wsc.send(msg);

        next();
});

app.get('/', function(req, res) {
        res.send(send);
        
        console.log('sent to /: * ' + send  + ' *');
});

app.listen(port, () => console.log(`test server listening on port ${port}`))
