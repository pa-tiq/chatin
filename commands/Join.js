function Join(client, channels)
{   
    if(channels)
    {
        console.log("[JOIN]: "+channels);
        console.log("length: "+channels.length);
        
        for(var i = 0; i < channels.length; i++)
        {
            if(channels[i][0]!='#') channels[i] = '#'+channels[i];
        }    

        if(client.irc_client.channels)
        {
            for(var i = 0; i < channels.length; i++)
            {
                if(client.irc_client.channels.indexOf(channels[i]) == -1)
                {
                    console.log(client.nick+" joining "+channels[i]);
                    if(client.channels.indexOf(channels[i]) == -1) client.channels.push(channels[i]);
                    client.irc_client.join(channels[i]);
                }
            }
        }
        else
        {
            for(var i = 0; i < channels.length; i++)
            {
                console.log(client.nick+" joining "+channels[i]);
                if(client.channels.indexOf(channels[i]) == -1) client.channels.push(channels[i]);
                client.irc_client.join(channels[i]);
            }
        }
    
    }
}

module.exports = Join;