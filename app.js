//server

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

var Message = require('./commands/Message'); //all typed messages go through function Message first
var Join = require('./commands/Join');

var clients = [];

app.get('/',function(req,res)
{
    if ( req.cookies.server && req.cookies.nick && req.cookies.id ) 
	{		
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

    res.cookie('nick', req.body.nick);
	res.cookie('channel', req.body.channel);
    res.cookie('server', req.body.server);
    res.cookie('id', '_' + Math.random().toString(36).substr(2, 9));
	res.redirect('/');
});

//runs every time a client connects to the socket
io.on('connection', function(client)
{ 
    client.nick = client.request.headers.cookie.nick;
	client.server = client.request.headers.cookie.server;
    client.channel = client.request.headers.cookie.channel;
    client.id = client.request.headers.cookie.id;

    var irc_client = new irc.Client(client.server, client.nick);

    //irc client listens to updates from the irc server through the events below
    //the response comes goes from here(server side) to the client side(functions.js)
    irc_client.addListener('registered', function(message)
    {
        Join(client,client.channel);
    });

    irc_client.addListener('motd', function(motd)
    {
        client.emit('motd', '<pre>'+motd+'</pre>');
    });
    
    irc_client.addListener('error', function(message)
    {
		client.emit('erro', message.args[2]);
    });

    irc_client.addListener('join', function(channel,nick,message)
	{
        console.log("[app.js] join");
		client.emit('join', {'channel':channel, 'nick':nick});
    });
    
    irc_client.addListener('part', function(channel,nick,reason,message)
    {
        console.log("[app.js] part");
        client.emit('part', {'channel':channel,'nick':nick, 'reason':reason} )
    });

    irc_client.addListener('quit', function(nick, reason, channels, message)
    {
		socket.broadcast.emit('quit', nick);
		client.disconnect();
	});

    irc_client.addListener('message', function(nick, to, text, message)
    {		
		var message = '&lt' + nick + '&gt ' + text;
		console.log('<' + nick + '>' + text);
		client.emit('message',message);
	});

    client.irc_client = irc_client;

    client.on('message', function(msg)
    {
        Message(msg,client);
    });

    clients[client.id] = client;
    console.log(client.id,client.nick,client.channel);

});

server.listen(3000, function()
{
    console.log("listening on port 3000");
});



