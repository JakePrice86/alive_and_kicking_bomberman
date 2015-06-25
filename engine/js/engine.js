//-- Engine and Scene files


/*
 * Loading
 *
 * Preloads all the images, otherwise shit gets horrible
*/
Crafty.defineScene("loading", function() {
    Crafty.background("#000");
    Crafty.e("2D, DOM, Text")
          .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
          .text("Loading - need pixel art here!")
          .css({ "text-align": "center"})
          .textColor("#FFFFFF");

	//-- All loaded, lets start the game
    Crafty.scene('gametime');


});

Crafty.load(
	['assets/images/map_tiles_64.png']
	, function() {

		//-- Our map tiles
		Crafty.sprite(Game.map_grid.tile.width, 'assets/images/map_tiles_' + Game.map_grid.tile.width + '.png', {
	        sprite_SolidBlock: [0, 0],
	        sprite_SoftBlock: [1, 0],
	        sprite_ShadowedGrass: [2, 0],
	        sprite_Grass: [3, 0],
      	});

      	//-- Bomberman sprites
      	Crafty.sprite(47, 53, 'assets/images/bomberman_just_1.png', { 
	        sprite_Black: [0, 0],
	    });

	}
);

/*
 * Game Scene
 *
 * The actual gaming screen
*/
Crafty.defineScene("gametime", function() {

	//-- Create the grid
	Game.createGridMap();

	//-- Start allowing players to join me
	Game.players.push( Crafty.e('BlackPlayer').at(Game.map_grid.width - 2, Game.map_grid.height - 2).attr({ z: 100 }) );

}, function() {
	
	//-- End of file

});