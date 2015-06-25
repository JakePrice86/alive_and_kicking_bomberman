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
		this.bombSize = 3;
		this.isLocked = false;
		this.isDead = false;
		this.maxBombs = 1;

		this.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys.SPACE) {
				layBomb(0);
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
		//-- console.log("AH - need to stop!");		
	},

	die: function() {
		if (!this.isDead) {
			this.isDead = true;
			console.log("Player " + this.n + " Ded!");
			placeGameEvent(this.n, "Is Dead!");
			playerHasDied(this.n);
			this.destroy();
		}
	}
});

//-- Player Sprites
Crafty.c('WhitePlayer', {
	init: function() {
		this.requires('Bomberman, sprite_White')
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
	},
});

Crafty.c('RedPlayer', {
	init: function() {
		this.requires('Bomberman, sprite_Red')
	},
});

//-- Bombs

Crafty.c('BombTile', {
	size: null,

	init: function() {
		this.requires('SolidBlockTile, SpriteAnimation, sprite_Bomb')
		.reel('BombTick', 1000, [[0,0], [1,0], [2, 0], [1,0]])
		.setCollision();

		this.bind('AnimationEnd', function() {
			this.setExplosion();
		});

		this.animate('BombTick', 4);
	},

	setCollision: function() {
		hitbox = new Crafty.polygon(
			[0, 0], 
			[16, 0], 
			[16, 16], 
			[0, 16]);
		this.collision(hitbox);
	},

	setBombSize: function(size) {
		this.size = size;
		return this;
	},

	setExplosion: function() {

		Crafty.audio.play("explosion1", 1, 0.8);

		var pos = this.getGridPosition(),
		top = left = right = bottom = 0, toRemove = [];

    	//-- Check each direction for blowing stuff up
    	while (top < this.size - 1) {
    		if (Game.map_grid.grid[pos.i][pos.j - (top + 1)] == 'SolidBlockTile') { break; }
    		if (Game.map_grid.grid[pos.i][pos.j - (top + 1)] == 'SoftBlockTile') { top++;break; }
    		top++;
    	}

    	while (left < this.size - 1) {
    		if (Game.map_grid.grid[pos.i - (left + 1)][pos.j] == 'SolidBlockTile') { break; }
    		if (Game.map_grid.grid[pos.i - (left + 1)][pos.j] == 'SoftBlockTile') { left++;break; }
    		left++;
    	}

    	while (right < this.size - 1) {
    		if (Game.map_grid.grid[pos.i + (right + 1)][pos.j] == 'SolidBlockTile') { break; }
    		if (Game.map_grid.grid[pos.i + (right + 1)][pos.j] == 'SoftBlockTile') { right++; break; }
    		right++;
    	}

    	while (bottom < this.size - 1) {
    		if (Game.map_grid.grid[pos.i][pos.j + (bottom + 1)] == 'SolidBlockTile') { break; }
    		if (Game.map_grid.grid[pos.i][pos.j + (bottom + 1)] == 'SoftBlockTile') { bottom++; break; }
    		bottom++;
    	}

    	for (var i = 1; i < left; i++) {
    		Crafty.e('ExplosionHLeft').at(pos.i - i, pos.j);
    	}

    	for (var i = 1; i < right; i++) {
    		Crafty.e('ExplosionHLeft').at(pos.i + i, pos.j).flip();
    	}

    	for (var i = 1; i < top; i++) {
    		Crafty.e('ExplosionVTop').at(pos.i, pos.j - i);
    	}

    	for (var i = 1; i < bottom; i++) {
    		Crafty.e('ExplosionVTop').at(pos.i, pos.j + i).flip('Y');
    	}

    	Crafty.e('ExplosionLeft').at(pos.i - left, pos.j);
    	Crafty.e('ExplosionLeft').at(pos.i + right, pos.j).flip();
    	Crafty.e('ExplosionTop').at(pos.i, pos.j - top);
    	Crafty.e('ExplosionTop').at(pos.i, pos.j + bottom).flip('Y');
    	Crafty.e('ExplosionCenter').at(pos.i, pos.j);

    	this.trigger('BombExploded');
    	this.destroy();

    }

});

Crafty.c('Explosion', {
	stuffToKill: null,

	init: function() {
		this.requires('SoftMapTiles, SpriteAnimation');

		this.animationSpeed = 1.5;
		this.stuffToKill = [];

		this.bind("EnterFrame", function() {
			this.killStuff();
		});

		this.bind('AnimationEnd', function(reel) {
			var p;
			for (var i = 0; i < this.stuffToKill.length; i++) {
				p = this.stuffToKill[i].getGridPosition();
				Crafty.e('GrassTile').at(p.i, p.j)
				Game.map_grid.grid[p.i][p.j] = 'GrassTile';

				if (this.stuffToKill[i].has('Bomberman') || this.stuffToKill[i].has('BombTile')) {
      }
      else {
      	this.stuffToKill[i].destroy(); 
      }
  }

  this.destroy();
});
	},

	killStuff: function() {
		var hitdata = this.hit('Solid');
		if (hitdata) {
			var obj;
			for (var i = 0; i < hitdata.length; i++) {
				obj = hitdata[i].obj;
				this.stuffToKill.push(obj);
				if (obj.has('Bomberman') && !obj.isLocked) {
					obj.isLocked = true;
					obj.die();
				}
				else if (obj.has('BombTile')) {
					obj.setExplosion();
				}
			}
		}
	}
});

Crafty.c('ExplosionCenter', {
	init: function() {
		this.requires('Explosion, sprite_Explosion_Center')
		.reel('Explode', 1000, [[0,0], [1,0], [2,0], [3,0], [4,0], [3,0], [2,0], [1,0], [0,0]]);
		this.animate('Explode', 1);
	}
});

Crafty.c('ExplosionHLeft', {
	init: function() {
		this.requires('Explosion, sprite_Explosion_H_Left')
		.reel('Explode', 1000, [[0,0], [1,0], [2,0], [3,0], [4,0], [3,0], [2,0], [1,0], [0,0]]);
		this.animate('Explode', 1);
	}
});

Crafty.c('ExplosionLeft', {
	init: function() {
		this.requires('Explosion, sprite_Explosion_Left')
		.reel('Explode', 1000,[[0,0], [1,0], [2,0], [3,0], [4,0], [3,0], [2,0], [1,0], [0,0]]);
		this.animate('Explode', 1);
	}
});

Crafty.c('ExplosionVTop', {
	init: function() {
		this.requires('Explosion, sprite_Explosion_V_Top')
		.reel('Explode', 1200, [[0,0], [1,0], [2,0], [3,0], [4,0], [3,0], [2,0], [1,0], [0,0]]);
		this.animate('Explode', 1);
	}
});

Crafty.c('ExplosionTop', {
	init: function() {
		this.requires('Explosion, sprite_Explosion_V_Top')
		.reel('Explode', 1000, [[0,0], [1,0], [2,0], [3,0], [4,0], [3,0], [2,0], [1,0], [0,0]]);
		this.animate('Explode', 1);
	}
});