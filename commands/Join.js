function Join(client, channel)
{
    if(channel && channel[0]!='#') channel = '#'+channel;
    if(client.canal) client.leave(client.canal);
    client.join(channel);
    client.canal = channel;    
    client.irc_client.join(client.canal);
    client.irc_client.emit('join', client.canal);
    client.broadcast.to(client.canal).emit('join-channel', client.nick);
}

module.exports = Join;