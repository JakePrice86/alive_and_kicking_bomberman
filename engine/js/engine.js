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
});

