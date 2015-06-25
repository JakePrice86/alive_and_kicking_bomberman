//-- GAME

/*
 * Holds how we start the game, and all the vars inside it.
*/
var Game = {

	//-- Define our space
	map_grid: {
		width:  23,
		height: 15,
		scale: 2,
		tile: {
			width:  32,
			height: 32
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

}