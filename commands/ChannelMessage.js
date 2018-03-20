function ChannelMessage(msg, client)
{
    //client.broadcast.to(client.channel).emit('message', client.nick+': ' + msg);
    client.irc_client.say(client.channel, msg);
}
module.exports = ChannelMessage;