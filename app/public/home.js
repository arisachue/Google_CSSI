// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, ENTER, textSize, textAlign, LEFT, CENTER, loadFont, textFont, createButton, key, frameCount, collideRectRect, noLoop, drawingContext, countOccurrences */

// IMPORTANT: you'll need to import the p5 collide2d library in order for this
// code to work. You can do this by doing one of the following:
// - importing a local copy to the HTML
// - importing a hosted copy (from a CDN) to the HTML
// - (last resort) pasting it into this script as the first line

let backgroundColor, arcadeBackground, h, w, gameFont, screenX, screenY;

function setup() {
  // Canvas & color settings
  createCanvas(650, 650);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 0;
  // background(backgroundColor);
  h = 225;
  w = 355;
  screenX = 147;
  screenY = 210;

  arcadeBackground = loadImage(
    "https://cdn.glitch.com/d0c033c7-ddfc-42f7-ac4f-7a02bb97d222%2FNew%20Project%20(3).png?v=1627921566021"
  );
  gameFont = loadFont(
    "https://cdn.glitch.com/d67e4408-18fc-4a93-94e9-18a215cadafd%2FPixeboy-z8XGD.ttf?v=1626799772222"
  );
  textFont(gameFont);

  // let col = color(0, 0, 100);
  // let button = createButton("RESTART");
  // button.style("background-color", col);
  // button.style("font-family", "Courier New");
  // button.position(screenX + 40, screenY + 160);
  // button.mousePressed(tictactoe);
}

function draw() {
  image(arcadeBackground, 0, 0, 650, 650);
  fill(0);
  rect(screenX, screenY, w, h);
  textAlign(CENTER);
  textSize(60);
  blink("home screen", w / 2 + screenX, h / 3 + screenY);
  textSize(20);
  fill(54, 100, 100);
  text("press your choice of game", w / 2 + screenX, h / 3 + 30 + screenY);
}

function blink(s, x, y) {
  if (frameCount % 70 > 20) {
    fill(54, 100, 100);
  } else {
    fill(0);
  }
  text(s, x, y);
}

function tictactoe() {
  console.log("tictactoe");
  $.ajax({
    url: "tictactoe", // goes to .
    type: "get", // use a 'get' type request
    data: { empty: 0 }, //pass to server
    success: function(response) {
      console.log("function ran succesfully!");
    },
    // if some error happens
    error: function(stat, err) {
      console.log("error");
    }
  });
  
}
