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

Crafty.c('BaseMapTile', {
  init: function() {
    this.requires('2D, Canvas, Grid, Collision');
  },
});

Crafty.c('SoftMapTiles', {
  init: function() {
    this.requires('BaseMapTile');
  },
});

Crafty.c('SolidMapTiles', {
  init: function() {
    this.requires('BaseMapTile, Solid');
  },
});

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

Crafty.c('GrassTile', {
  init: function() {
    this.requires('SoftMapTiles, sprite_Grass');

    this.bind('EnterFrame', function() {
      var p = this.getGridPosition();
      if (Game.map_grid.grid[p.i][p.j - 1] == 'SoftBlockTile' || Game.map_grid.grid[p.i][p.j - 1] == 'SolidBlockTile') {
        this.destroy();
        Crafty.e('ShadowedGrassTile').at(p.i, p.j);
      }
    });
  },
});

Crafty.c('ShadowedGrassTile', {
  init: function() {
    this.requires('SoftMapTiles, sprite_ShadowedGrass');

    this.bind('EnterFrame', function() {
      var p = this.getGridPosition();
      if (!(Game.map_grid.grid[p.i][p.j - 1] == 'SoftBlockTile' || Game.map_grid.grid[p.i][p.j - 1] == 'SolidBlockTile')) {
        this.destroy();
        Crafty.e('GrassTile').at(p.i, p.j);
      }
    });
  },
});

//-- Player entity
Crafty.c('Bomberman', {
	bombs: null, 
	isOverlappingBomb: null,
	bombSize: null,
	isLocked: null,
	isDead: null,
	maxBombs: null,

	init: function() {
		this.requires('SolidMapTiles, SpriteAnimation, Keyboard')
		.stopOnSolids()
		.setCollision();

		this.bombs = [];
		this.isOverlappingBomb = false;
		this.bombSize = 2;
		this.isLocked = false;
		this.isDead = false;
		this.maxBombs = 1;

		this.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.SPACE) {
				if (this.bombs.length < this.maxBombs) {
					var x = Math.floor((this.x + 5) / Game.map_grid.tile.width);
					var y = Math.floor((this.y + 26 - 5) / Game.map_grid.tile.height);
					var p;
					for (var i = 0; i < this.bombs.length; i++) {
						p = this.bombs[i].getGridPosition();
						if (p.i == x && p.j == y){
							return;
						}
					};

					//var bomb = Crafty.e('BombTile').at(x, y).setBombSize(this.bombSize);
					this.bombs.push(bomb);
					var self = this;
					bomb.one('BombExploded', function() {
						self.bombs.shift();
					})
					this.isOverlappingBomb = true;
				}
			}

			if (e.key == Crafty.keys.LEFT_ARROW) { movePlayerEntity(0, 'w'); }
			if (e.key == Crafty.keys.RIGHT_ARROW) { movePlayerEntity(0, 'e'); }
			if (e.key == Crafty.keys.UP_ARROW) { movePlayerEntity(0, 'n'); }
			if (e.key == Crafty.keys.DOWN_ARROW) { movePlayerEntity(0, 's'); }
		});


		this.bind('Moved', function(from) {

			if (this.isLocked) {
				this.x = from.x;
				this.y = from.y;
				this._speed = 0;
				return;
			}

			if (this.isOverlappingBomb) {
				var hitdata = this.hit('Solid');
				this.isOverlappingBomb = false;
				for (var i = 0; i < hitdata.length; i++) {
					if (hitdata[i].obj === this.bombs[this.bombs.length - 1]) {
						this.isOverlappingBomb = true;
						break;
					}
				}
			}
		});
	},

	setCollision: function() {
		hitbox = new Crafty.polygon(
			[1, 11], 
			[16, 11], 
			[16, 25], 
			[1, 25]);
		this.collision(hitbox);
	},

	stopOnSolids: function() {
		this.onHit('Solid', function(hitdata) { this.stopMovement(hitdata); });
		return this;
	},

	stopMovement: function(hitdata) {
		console.log("AH - need to stop!");		
	},

	die: function() {
		if (!this.isDead) {
			this.isDead = true;
			this.animate('Die', 1);
		}
	}
});

//-- Player Sprites
Crafty.c('WhitePlayer', {
	init: function() {
		this.requires('Bomberman, sprite_White')
		.reel('WalkDown', 700, [[0,0], [1,0], [2,0], [1,0]])
		.reel('WalkLeft', 700, [[3,0], [4,0], [5,0], [4,0]])
		.reel('WalkRight', 700, [[6,0], [7,0], [8,0], [7,0]])
		.reel('WalkUp', 700, [[9,0], [10,0], [11,0], [10,0]])
		.reel('Die',  1400, [[12,0], [13,0], [14,0], [15,0], [12,0], [13,0], [14,0], [15,0], [12,0], [13,0], [14,0], [15,0], [16,0], [17,0], [18,0], [19,0]]);
		this.reel('WalkDown').currentFrame = 1;
	}
});

Crafty.c('BlackPlayer', {
	init: function() {
		this.requires('Bomberman, sprite_Black')
	},
});

Crafty.c('BluePlayer', {
	init: function() {
		this.requires('Bomberman, sprite_Blue')
		.reel('WalkDown', 700, [[0,2], [1,2], [2,2], [1,2]])
		.reel('WalkLeft', 700, [[3,2], [4,2], [5,2], [4,2]])
		.reel('WalkRight', 700, [[6,2], [7,2], [8,2], [7,2]])
		.reel('WalkUp', 700, [[9,2], [10,2], [11,2], [10,2]])
		.reel('Die',  1400, [[12,2], [13,2], [14,2], [15,2], [12,2], [13,2], [14,2], [15,2], [12,2], [13,2], [14,2], [15,2], [16,2], [17,2], [18,2], [19,2]]);
		this.reel('WalkDown').currentFrame = 1;
	},
});

Crafty.c('RedPlayer', {
	init: function() {
		this.requires('Bomberman, sprite_Red')
		.reel('WalkDown', 700, [[0,3], [1,3], [2,3], [1,3]])
		.reel('WalkLeft', 700, [[3,3], [4,3], [5,3], [4,3]])
		.reel('WalkRight', 700, [[6,3], [7,3], [8,3], [7,3]])
		.reel('WalkUp', 700, [[9,3], [10,3], [11,3], [10,3]])
		.reel('Die',  1400, [[12,3], [13,3], [14,3], [15,3], [12,3], [13,3], [14,3], [15,3], [12,3], [13,3], [14,3], [15,3], [16,3], [17,3], [18,3], [19,3]]);
		this.reel('WalkDown').currentFrame = 1;
	},
});