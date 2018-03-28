var path = require('path');
var PrivateMessage = require('./PrivateMessage');
var Join = require('./Join');
var Part = require('./Part');

function Message(msg,client)
{
    console.log(client.nick+': '+ msg);  
    
    if(msg.charAt(0) == "/")
    {
        var args = msg.split(' ');
        var message = "";

        if(args[2])
        {    
            for(var i = 2; i < args.length ; i++)
            {
                message += args[i] + " ";
            }
        } 

        if(args[0])
        {
            switch(args[0].toUpperCase())
            {
                case '/JOIN': Join(client, args[1].split(","));
                break;

                case '/PRIVMSG': PrivateMessage(message,client,args[1]);
                break;

                case '/PART': Part(client, args[1].split(","));
                break;

                default: client.emit('error', 'Invalid command.');
                break;
            }   
        }
        
    }
    else
    {
        for(var i = 0; i < client.channels.length; i++)
        {
            PrivateMessage(msg,client,client.channels[i]);
        }
    }
}

module.exports = Message;