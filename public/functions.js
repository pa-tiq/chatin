//client

$(document).ready(function() //JQuery
{
	var iosocket = io(); 
				
	iosocket.on('connect', function () 
	{		
		iosocket.on('motd', (motd)=>{$('#mural').append(motd+' <br>');});
		iosocket.on('registered', (data)=>{$('#mural').append(data+' <br>');});
		iosocket.on('error', (error)=>{$('#mural').append('[IRC] ERROR! '+error+' <br>');});
		iosocket.on('part', function(data)
		{

			$('#mural').append('[IRC] '+data.nick+' left '+data.channel+'. <br>');
		});

		iosocket.on('join', function(data)
		{
			var nick = Cookies.get("nick");
			var server = Cookies.get("server");

			if(nick == data.nick)
			{
				$("#status").text("Connected - irc://"+nick+"@"+server+"/"+data.channel);
				$.post("/login", {"nick":nick, "channel":data.channel, "server":server}, function(whatever){}, "html");		
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
	$("#status").text("Connected - irc://"+	Cookies.get("nick")+"@"+Cookies.get("server")+"/"+Cookies.get("channel"));
}