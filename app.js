var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var irc = require('irc');
var socketio_cookieParser = require('socket.io-cookie');
var path = require('path');

io.use(socketio_cookieParser);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/',function(req,res)
{
    
});

app.post('/', function (req,res)
{

});
