function PrivateMessage(msg, client, receiver)
{
    client.irc_client.say(receiver, msg) //receiver = channel or nick    
}

module.exports = PrivateMessage;