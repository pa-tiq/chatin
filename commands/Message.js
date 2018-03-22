var path = require('path');
var PrivateMessage = require('./PrivateMessage');
var Join = require('./Join');

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
                case '/JOIN': Join(client, args[1]);
                break;

                case '/PRIVMSG': PrivateMessage(message,client,args[1]);
                break;

                default: client.emit('error', 'Invalid command.');
            }   
        }
        
    }
    else PrivateMessage(msg,client,client.channel);
}

module.exports = Message;