//-- Pusher

var pusher = new Pusher('14e1a479fddb9fc4ec72');
var channel = pusher.subscribe('my-channel');

channel.bind('player_event', function(data) {

	console.log(data);

	var dir = "s";

	if (data.digit == "5") {

	} else {		
 
		if (data.digit == "2") {
			dir = "n";
		} else if (data.digit == "4") {
			dir = "w";
		} else if (data.digit == "6") {
			dir = "e";
		} else if (data.digit == "8") {
			dir = "s"
		} 

		movePlayerEntity(data.id, dir);

	}	

});