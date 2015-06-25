//-- GAME

/*
 * Holds how we start the game, and all the vars inside it.
 * Code structure based around project found on GH
 */
 var Game = {

	//-- Define our space
	map_grid: {
		width:  23,
		height: 15,
		scale: 2,
		tile: {
			width:  64,
			height: 64
		},
		grid: []
	},

	//-- Define the game's width
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	//-- Define the game's height
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

	//-- Lets START crafty, and setup stuff
	start: function() {

		//-- Start Crafty
		Crafty.init(Game.width(), Game.height());
		Crafty.canvas.init();

		//-- Setup scene
		stage = Crafty.stage.elem,
		canvas = Crafty.stage.elem.getElementsByTagName('canvas')[0];
		Crafty.scene('loading');

	},

	//-- Create the map
	createGridMap: function() {

		//console.log("Create Grid");

		//-- CREATE OUT ARRAY AS IT KEEPS FAILING WHEN I ADD
		//-- STUFF TO ITTT
		Game.map_grid.grid = new Array(Game.map_grid.width);
		for (var i = 0; i < Game.map_grid.width; i++) {
			Game.map_grid.grid[i] = new Array(Game.map_grid.height);
			for (var y = 0; y < Game.map_grid.height; y++) {
				Game.map_grid.grid[i][y] = '';
			}
		}

		//-- Lets create the grid LOL
		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				//-- Check if we are at an edge of the canvas. If so, put a block
				var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
				if (at_edge) {
					//-- Place a block
					Crafty.e('SolidBlockTile').at(x, y).color('rgb(255,0,0)');
					Game.map_grid.grid[x][y] = 'SolidBlockTile';
				} else {
					var isCorner = (x == 1 && (y == 1 || y == 2) || x == 2 && y == 1) || 
					(x == Game.map_grid.width - 2 && (y == 1 || y == 2) || x == Game.map_grid.width - 3 && y == 1) ||
					(x == 1 && (y == Game.map_grid.height - 2 || y == Game.map_grid.height - 3) || x == 2 && y == Game.map_grid.height - 2) || 
					(x == Game.map_grid.width - 2 && (y == Game.map_grid.height - 2 || y == Game.map_grid.height - 3) || x == Game.map_grid.width - 3 && y == Game.map_grid.height - 2);
					if (!isCorner && Math.random() > 0.35) { 
						Crafty.e('SoftBlockTile').at(x, y).color('rgb(149,165,165)');
						Game.map_grid.grid[x][y] = 'SoftBlockTile';
					}
					else if (Game.map_grid.grid[x][y - 1] == 'SoftBlockTile' || Game.map_grid.grid[x][y - 1] == 'SolidBlockTile') {
						Crafty.e('ShadowedGrassTile').at(x, y).color('rgb(39,174,96)');
						Game.map_grid.grid[x][y] = 'ShadowedGrassTile';
					}
					else {
						Crafty.e('GrassTile').at(x, y).color('rgb(39,174,96)');
						Game.map_grid.grid[x][y] = 'GrassTile';

					}
				}
			}
		}	

		//console.log("Finish Grid");		
	}

}