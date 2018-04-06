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
var already_on = false;

app.get('/',function(req,res)
{
    if ( req.cookies.server && req.cookies.nick && req.cookies.id ) 
	{		
        res.sendFile(path.join(__dirname, '/index.html'));""

        if(clients.indexOf(req.cookies.id) != -1) already_on = true;
        console.log("already on: "+already_on.toString());
	}
	else 
	{
		res.sendFile(path.join(__dirname, '/login.html'));
	}
});

app.post('/login', function (req,res)
{  
    if(req.body.channels)
    {
        var chs = req.body.channels.split(",");
        for(var i = 0; i < chs.length; i++)
        {
            if(chs[i][0]!='#') chs[i] = '#'+chs[i];
        }
    }

    res.cookie('nick', req.body.nick);
	res.cookie('channels', chs.toString());
    res.cookie('server', "irc.freenode.net");
    res.cookie('id', '_' + Math.random().toString(36).substr(2, 9));
	res.redirect('/');
});

//runs every time a client connects to the socket
io.on('connection', function(client)
{ 
    client.nick = client.request.headers.cookie.nick;
	client.server = client.request.headers.cookie.server;
    client.channels = client.request.headers.cookie.channels.split(",");
    client.id = client.request.headers.cookie.id;
    
    client.on('message', function(msg)
    {
        Message(msg,client);
    });    

    IRC(client);

    clients.push(client);

    (clients).forEach(cl => {
        console.log("\n>>>>>> nick: "+cl.nick+" id: "+cl.id);
    });
});

function IRC(client)
{
    if(already_on)
    {
        client.irc_client = clients[clients.indexOf(client.id)];
        client.irc_client.connect();
    }
    else
    {
        var irc_client = new irc.Client(client.server, client.nick);

        //irc client listens to updates from the irc server through the events below
        //the response goes from here(server side) to the client side(functions.js)
        irc_client.addListener('registered', function(message)
        {
            Join(client,client.channels);
            client.emit('registered', message);
        });

        irc_client.addListener('motd', function(motd)
        {
            client.emit('motd', '<pre>'+motd+'</pre>');
        });
        
        irc_client.addListener('error', function(message)
        {
            client.emit('error', message.args[2]);
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

        irc_client.addListener('quit', function(nick, reason, channel, message)
        {
            console.log("[app.js] quit");
            client.emit('quit', nick);
            client.disconnect();
            clients.splice(client.id,1);
        });

        irc_client.addListener('selfMessage', function(to, text)
        {
            console.log("[app.js] selfMessage: "+to+" "+text);
        });

        irc_client.addListener('message', function(nick, to, text, message)
        {		
            var message = '&lt' + nick + '&gt ' + text; //&lt = less than = <, &gt = greater than = >
            console.log('<' + nick + '>' + text);
            client.emit('message',message);
        });

        client.irc_client = irc_client;
    }
}

server.listen(3000, function()
{
    console.log("listening on port 3000");
});



