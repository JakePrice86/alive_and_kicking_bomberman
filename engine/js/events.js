//-- PUSHER events

function movePlayerEntity(player, dir) {

	//-- Lets check the player ID
	if (player == 1) {player = 0;}
		
	//-- Lets grab my position now
	var x = Game.players[player]._x;
	var y = Game.players[player]._y;

	//-- ADD on player positions
	if (dir == "n") {
		y = y - 64;
	} else if (dir == "e") {
		x = x + 64;
	} else if (dir == "s") {
		y = y + 64;
	} else if (dir == "w") {
		x = x - 64;
	}

	//-- What is at the new place?
	var hit = whatTypeOfBlockAt(x, y);

	//-- Reporting
	console.log("P: " + player + " X: " + x + " Y: " + y + " " + hit);

	if ((hit == "ShadowedGrassTile") || (hit == "GrassTile")) {	
		//-- Move Entity
		Game.players[player].move(dir, Game.map_grid.tile.width);
	}

}



function whatTypeOfBlockAt(x, y) {

	var ActualX = x / 64;
	var ActualY = y / 64;
	return Game.map_grid.grid[ActualX][ActualY];
}