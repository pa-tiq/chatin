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

//req.cookies: {"nick":"a","channel":"#a","server":"ircd","id":"1","io":"JL1ReXHlc7_NLAZiAAAC"}

app.get('/',function(req,res)
{
    if ( req.cookies.server && req.cookies.nick  && req.cookies.channel ) 
	{		
		res.cookie('id', proxy_id);
		res.sendFile(path.join(__dirname, '/index.html'));
	}
	else 
	{
		res.sendFile(path.join(__dirname, '/login.html'));
	}
});

app.post('/login', function (req,res)
{  
    if(req.body.channel && req.body.channel[0]!='#')
	{
		req.body.channel = '#'+req.body.channel;
    }
        
    res.cookie('nick', req.body.name);
	res.cookie('channel', req.body.channel);
	res.cookie('server', req.body.server);
	res.redirect('/');
});

io.on('connection', function(socket)
{
    var irc_client = new irc.Client(socket.server, socket.nick);

    irc_client.addListener('registered', function(message)
    {
        socket.emit('registered', "[IRC] You're registered!");
    });

    irc_client.addListener('motd', function(motd)
    {
        socket.emit('motd', '<pre>'+motd+'</pre>');
    })

    socket.irc_client = irc_client;

    socket.on('message', function(message)
    {

    });
});

server.listen(3000, function()
{
    console.log("listening on port 3000");
});
