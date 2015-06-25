//-- Pusher

var pusher = new Pusher('14e1a479fddb9fc4ec72');
var channel = pusher.subscribe('my-channel');

channel.bind('player_event', function(data) {

	console.log(data);
	var o = JSON.parse(data);
	//-- convert to JSON

	var dir = "s";

	if (o.digit == "5") {

		//-- Drop a bomb!
		layBomb(o.id);

	} else { 

		//-- Convert digits to Directions
		if (o.digit == "2") {dir = "n";} 
		else if (o.digit == "4") {dir = "w";} 
		else if (o.digit == "6") {dir = "e";} 
		else if (o.digit == "8") {dir = "s";} 
		console.log("Direction: " + dir + " Digit: " + o.digit);
		movePlayerEntity(o.id, dir);

	}	

});

channel.bind('player_joined', function(data) {

	var o = JSON.parse(data);
	console.log(data);
	createPlayer(o.id, o.number);
});


//-- 