//client

$(document).ready(function() //JQuery
{
	var iosocket = io(); 
				
	iosocket.on('connect', function () 
	{		
		iosocket.on('motd', (motd)=>{$('#mural').append(motd+'<br>');});
		iosocket.on('registered', (data)=>{$('#mural').append(data+' <br>');});
		iosocket.on('error', (error)=>{$('#mural').append(''+error+' <br>');});

		iosocket.on('join', function(channel)
		{
			$('#mural').append('[IRC] You joined channel '+channel+'.<br>');

			var nick = Cookies.get("nick");
			var servidor = Cookies.get("servidor");

			$("#status").text("Conectado - irc://"+nick+"@"+server+"/"+channel);
			$.post("/login", {"nick":nick, "channel":channel, "server":server}, function(whatever){}, "html");		
		});

		iosocket.on('message', function(message) 
		{
			var date = new Date();
			$('#mural').append('['+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'] '+message+'<br>');
		});

	});
	
	$('#message').keypress(function(event) 
	{
		var date = new Date();
		
		if(event.which == 13) 
		{						
			event.preventDefault(); 
			iosocket.emit('message', $('#message').val());						
			$('#mural').append('['+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+']: '+$('#message').val()+'<br>');						
			$('#message').val('');
		}
	});

	$('#send').on('click',function(event)
	{
		var date = new Date();
		iosocket.emit('message', $('#message').val());					
		$('#mural').append('['+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+']: '+$('#message').val()+'<br>');
		$('#message').val('');
	});
});

function timestamp_to_date( timestamp ) 
{
	var date = new Date( timestamp );
	var hours = date.getHours();
	var s_hours = hours < 10 ? "0"+hours : ""+hours;
	var minutes = date.getMinutes();
	var s_minutes = minutes < 10 ? "0"+minutes : ""+minutes;
	var seconds = date.getSeconds();
	var s_seconds = seconds < 10 ? "0"+seconds : ""+seconds;
	return s_hours + ":" + s_minutes + ":" + s_seconds;
}

function initialize(element_id) 
{
	$("#status").text("Connected - irc://"+	Cookies.get("nick")+"@"+Cookies.get("server")+"/"+Cookies.get("channel"));
}