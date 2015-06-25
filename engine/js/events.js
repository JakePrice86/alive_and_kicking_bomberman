//-- PUSHER events

function movePlayerEntity(pid, dir) {

	//-- Lets check the player ID, and match to an internal ID
	player = false;

	$.each(Game.players, function(p, e) {		
		//-- Lets check to see if pid is this user
		if (e.n == pid) {
			player = p;
		}
	});

	//-- If a player has not been found :(
		if (player === false) {
			console.log("Player not found");
		} else {

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
		console.log("P: " + player + " X: " + x + " Y: " + y + " On: " + hit + " D: " + dir);

		if ((hit == "ShadowedGrassTile") || (hit == "GrassTile")) {	
			//-- Move Entity
			Game.players[player].move(dir, Game.map_grid.tile.width);
		}
	}

}

function createPlayer(player_id) {

	//-- Player Limit?
	var current_player_amount = Game.players.length;

	//-- Lets check if player currently exists
	var current = false;
	$.each(Game.players, function(p, e) {		
		//-- Lets check to see if pid is this user
		if (e.n == player_id) {
			current = true;
		}
	});

	if (current == false) {

		if (current_player_amount > 19) {
			//-- Too many players - fail
			console.log("To many players already");
		} else {
			//-- Add to screen

			//-- Players get added in certain 'areas'
			if (current_player_amount == 0) {
				Game.players.push( Crafty.e('BlackPlayer').at(21, 13).attr({ z: 100 }).attr({ n: player_id }) );
			} else if (current_player_amount == 1) {
				Game.players.push( Crafty.e('BlackPlayer').at(1, 1).attr({ z: 100 }).attr({ n: player_id }) );
			} else if (current_player_amount == 2) {	
				Game.players.push( Crafty.e('BlackPlayer').at(1, 13).attr({ z: 100 }).attr({ n: player_id }) );
			} else if (current_player_amount == 3) {
				Game.players.push( Crafty.e('BlackPlayer').at(21, 1).attr({ z: 100 }).attr({ n: player_id }) );
			} else {
				var random = findEmptySpot();

				if (random == false) {
					console.log("Not Enough Space!");
				} else {
					console.log();
					Game.players.push( Crafty.e('BlackPlayer').at(random.x, random.y).attr({ z: 100 }).attr({ n: player_id }) );					
				}
			}
		}

	}
	
}

function layBomb(pid) {

	//-- Lets check the player ID, and match to an internal ID
	player = false;

	$.each(Game.players, function(p, e) {		
		//-- Lets check to see if pid is this user
		if (e.n == pid) {
			player = p;
		}
	});

	//-- If a player has not been found
	if (player === false) {
		console.log("Trying to lay a Bomb");
	} else {

		var x = Game.players[player]._x;
		var y = Game.players[player]._y;
		console.log("Bombing @ " + x + " " + y);

		if (Game.players[player].bombs.length < Game.players[player].maxBombs) {
			var x = Math.floor((Game.players[player]._x + 5) / Game.map_grid.tile.width);
			var y = Math.floor((Game.players[player]._y + 26 - 5) / Game.map_grid.tile.height);
			var p;
			for (var i = 0; i < Game.players[player].bombs.length; i++) {
				p = this.bombs[i].getGridPosition();
				if (p.i == x && p.j == y){
					return;
				}
			};

			var bomb = Crafty.e('BombTile').at(x, y).setBombSize(Game.players[player].bombSize);
			Game.players[player].bombs.push(bomb);
			var self = Game.players[player];
			bomb.one('BombExploded', function() {
				console.log("Your Bomb Ploded");
				self.bombs.shift();
			})
			Game.players[player].isOverlappingBomb = true;
		}
	}
}

function whatTypeOfBlockAt(x, y) {

	var ActualX = x / 64;
	var ActualY = y / 64;
	return Game.map_grid.grid[ActualX][ActualY];
}

function findEmptySpot() {

	//-- Loop through the map, and find all the spots we have nothing
	var empty = new Array();
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {

			if ((Game.map_grid.grid[x][y] == "ShadowedGrassTile") || (Game.map_grid.grid[x][y] == "GrassTile")) {
				empty.push({x: x, y: y});
			}
		}
	} 

	if (empty.length == 0) {
		return false;
	}

	var r = empty[Math.floor(Math.random() * empty.length)];
	return r;
}