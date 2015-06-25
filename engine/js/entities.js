//-- Entities

/*
 * Has all entities for the game
*/

//-- Helper function I found!!
Crafty.c('Grid', {

  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  at: function(x, y) {

    if (x === undefined && y === undefined) {
      return { x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height };
    } else {
      if (this.h > Game.map_grid.tile.height) { 
        this.attr({ x: x * Game.map_grid.tile.width, y: (y * Game.map_grid.tile.height) - (this.h - Game.map_grid.tile.height) });
      }
      else {
        this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      }
      return this;
    }
  },

  getGridPosition: function() {
    var i, j;

    i = Math.round(this.x / Game.map_grid.tile.width);
    if (this.h > Game.map_grid.tile.height) { 
      j = Math.round((this.y + this.h - Game.map_grid.tile.height) / Game.map_grid.tile.height);
    }
    else {
      j = Math.round(this.y / Game.map_grid.tile.height);
    }

    return { i: i, j: j};
  }
});

//-- All tiles should have this info
Crafty.c('BaseMapTile', {
  init: function() {
    this.requires('2D, Canvas, Grid, Collision');
  },
});

//-- Images
Crafty.c('SolidMapTiles', {
  init: function() {
    this.requires('BaseMapTile, Solid');
  },
});

//-- The wall!
Crafty.c('SolidBlockTile', {
  init: function() {
    this.requires('SolidMapTiles, sprite_SolidBlock');
  },
});

Crafty.c('SoftBlockTile', {
  init: function() {
    this.requires('SolidMapTiles, sprite_SoftBlock');
  },
});

Crafty.c('ShadowedGrassTile', {
  init: function() {
    this.requires('SolidMapTiles, sprite_ShadowedGrass');
  },
});

Crafty.c('GrassTile', {
  init: function() {
    this.requires('SolidMapTiles, sprite_Grass');
  },
});

