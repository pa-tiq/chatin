//client

$(document).ready(function() //JQuery
{
	var iosocket = io(); 
				
	iosocket.on('connect', function () 
	{		
		iosocket.on('motd', (motd)=>{$('#mural').append(motd+' <br>');});
		iosocket.on('registered', (data)=>{$('#mural').append("[IRC] You're registered. <br>");});
		iosocket.on('error', (error)=>{$('#mural').append('[IRC] ERROR! '+error+' <br>');});
		iosocket.on('quit', (nick)=>{$('#mural').append('[IRC] '+nick+' disconnected. <br>');});

		iosocket.on('part', function(data)
		{
			var nick = Cookies.get("nick");
			var server = Cookies.get("server");
			var channels = Cookies.get("channels").split(",");

			var chindex = channels.indexOf(data.channel);
            if(chindex != -1)
            {
                channels.splice(chindex,1);
            }			

			console.log("[PART] nick: "+nick+" <br> channels: "+channels);

			if(nick == data.nick)
			{
				$("#status").text("Connected - irc://"+nick+"@"+server+"/"+channels.toString());
				$.post("/login", {"nick":nick, "channels":channels.toString(), "server":server}, function(whatever){}, "html");
				$('#mural').append('[IRC] You left '+data.channel+'. <br>');	
			}
			else
			{
				$('#mural').append('[IRC] '+data.nick+' left '+data.channel+'. <br>');
			}
		});

		iosocket.on('join', function(data)
		{
			var nick = Cookies.get("nick");
			var server = Cookies.get("server");
			var channels = Cookies.get("channels").split(",");
			
			if(channels.indexOf(data.channel) == -1) 
					channels.push(data.channel);

			console.log("[JOIN] nick: "+nick+" <br> channels: "+channels);

			if(nick == data.nick)
			{
				$("#status").text("Connected - irc://"+nick+"@"+server+"/"+channels.toString());
				$.post("/login", {"nick":nick, "channels":channels.toString(), "server":server}, function(whatever){}, "html");	
				$('#mural').append('[IRC] You joined '+data.channel+'. <br>');
			}
			else
			{
				$('#mural').append('[IRC] '+data.nick+' joined '+data.channel+'. <br>');
			}
		});

		iosocket.on('message', function(message) 
		{
			$('#mural').append('['+timestamp()+'] '+message+' <br>');
		});

	});
	
	$('#message').keypress(function(event) 
	{
		if(event.which == 13) 
		{						
			event.preventDefault(); 
			iosocket.emit('message', $('#message').val());						
			$('#mural').append('['+timestamp()+']: '+$('#message').val()+'<br>');						
			$('#message').val('');
		}
	});

	$('#send').on('click',function(event)
	{
		iosocket.emit('message', $('#message').val());					
		$('#mural').append('['+timestamp()+']: '+$('#message').val()+'<br>');
		$('#message').val('');
	});
});

function timestamp() 
{
	var date = new Date();
	var hours = date.getHours();
	var s_hours = hours < 10 ? "0"+hours : ""+hours;
	var minutes = date.getMinutes();
	var s_minutes = minutes < 10 ? "0"+minutes : ""+minutes;
	return s_hours + ":" + s_minutes;
}

function initialize(element_id) 
{
	$("#status").text("Connected - irc://"+	Cookies.get("nick")+"@"+Cookies.get("server")+"/"+Cookies.get("channels"));
}