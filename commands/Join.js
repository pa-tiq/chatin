function Join(client, channel)
{
    if(channel && channel[0]!='#') channel = '#'+channel;
    if(client.channel) client.leave(client.channel); 
    client.channel = channel; 
    client.irc_client.join(client.channel);    
    client.irc_client.emit('join', client.channel);
    client.irc_client.say(client.channel, "[IRC] "+client.nick+" joined "+client.channel);
}

module.exports = Join;