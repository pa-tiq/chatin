function PrivateMessage(msg, client, receiver)
{
    console.log(client.nick+" sending message to "+receiver);
    client.irc_client.say(receiver, msg) //receiver = channel or nick    
}

module.exports = PrivateMessage;