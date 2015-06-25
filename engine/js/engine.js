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

    //-- Load all art assets for use later
	Crafty.load(
		['assets/images/map_tiles_1.png']
		, function() {

			//-- Our map tiles
			Crafty.sprite(32, 'assets/images/map_tiles_1.png', { 
		        sprite_SolidBlock: [0, 0],
		        sprite_SoftBlock: [1, 0],
		        sprite_ShadowedGrass: [2, 0],
		        sprite_Grass: [3, 0],
	      	});


		}
	);

	//-- All loaded, lets start the game
    Crafty.scene('gametime');


});

/*
 * Game Scene
 *
 * The actual gaming screen
*/
Crafty.defineScene("gametime", function() {

	//-- Create the grid
	Game.createGridMap();

	//-- Start allowing players to join me

}, function() {
	
	//-- End of file

});