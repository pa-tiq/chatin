//client

$(document).ready(function() //JQuery
{
	var iosocket = io(); 
				
	iosocket.on('connect', function () 
	{		
		iosocket.on('motd', (motd)=>{$('#mural').append(motd+' <br>');});
		iosocket.on('registered', (data)=>{$('#mural').append(data+' <br>');});
		iosocket.on('error', (error)=>{$('#mural').append('[IRC] ERROR! '+error+' <br>');});
		iosocket.on('join#channel', (nick, message)=>{$('#mural').append('[IRC] '+message+' <br>');});

		iosocket.on('join', function(channel)
		{
			//$('#mural').append('[IRC] You joined channel '+channel+'.<br>');

			var nick = Cookies.get("nick");
			var server = Cookies.get("server");

			$("#status").text("Connected - irc://"+nick+"@"+server+"/"+channel);
			$.post("/login", {"nick":nick, "channel":channel, "server":server}, function(whatever){}, "html");		
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