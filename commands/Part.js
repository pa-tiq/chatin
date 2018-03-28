function Part(client, channels)
{   
    if(channels)
    {        
        for(var i = 0; i < channels.length; i++)
        {
            if(channels[i][0]!='#') channels[i] = '#'+channels[i];
        }    

        for(var i = 0; i < channels.length; i++)
        {            
            var chindex = client.channels.indexOf(channels[i]);
            if(chindex != -1)
            {
                console.log(client.nick+" leaving "+channels[i]);
                client.channels.splice(chindex,1);
                client.irc_client.part(channels[i]);
            } 
        }      
    }
}

module.exports = Part;