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

	    //-- Explosion?
	    Crafty.sprite(64, 64, 'assets/images/particle_largeBall1.png', { 
	        sprite_Explosion_Center: [0, 0],
	        sprite_Explosion_H_Left: [0, 0],
	        sprite_Explosion_Left: [0, 0],
	        sprite_Explosion_V_Top: [0, 0],
	        sprite_Explosion_Top: [0, 0],
	    });

	    //-- Bombs
	    Crafty.sprite(64, 64, 'assets/images/bombs_64.png', { 
	        sprite_Bomb: [0, 0]
	    });

	    Crafty.audio.add("bg_music", "assets/airbrushed.mp3");

	    //-- Explosions
	    Crafty.audio.add("explosion1", "assets/explosion1.mp3");
	    Crafty.audio.add("explosion2", "assets/explosion2.mp3");
	    Crafty.audio.add("explosion3", "assets/explosion3.mp3");
	    Crafty.audio.add("explosion4", "assets/explosion4.mp3");

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
	Game.Starting = true;

	//-- Music!
	//Crafty.audio.play("bg_music", -1, 0.4);

}, function() {
	
	//-- End of file

});