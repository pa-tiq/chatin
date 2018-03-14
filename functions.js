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

function initialize(elemento_id) 
{
	$("#status").text("Connected - irc://"+	Cookies.get("nick")+"@"+Cookies.get("server")+"/"+Cookies.get("channel"));
}