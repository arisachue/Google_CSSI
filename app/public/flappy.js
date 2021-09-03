// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, ENTER, textSize, textAlign, LEFT, CENTER, loadFont, textFont, createButton, key, frameCount, collideRectRect */

// IMPORTANT: you'll need to import the p5 collide2d library in order for this
// code to work. You can do this by doing one of the following:
// - importing a local copy to the HTML
// - importing a hosted copy (from a CDN) to the HTML
// - (last resort) pasting it into this script as the first line

let backgroundColor, bird, pipes, topPipe, bottomPipe, flappy, back, gameIsOver, gameFont, score, flappyPepper,backgroundImg;

const h = 225;
const w = 355;
const innerScreenW = 147;
const innerScreenH = 211;
function setup() {
  // Canvas & color settings
  createCanvas(650, 650);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  
  bird = new Bird();
  pipes = [];
  pipes.push(new Pipe());
  gameIsOver = false;
  score = 0;
  
  topPipe = loadImage("https://cdn.glitch.com/156184ff-235b-4002-9588-1414696f574f%2Ftoppipe.png?v=1627578687809")
  bottomPipe = loadImage("https://cdn.glitch.com/156184ff-235b-4002-9588-1414696f574f%2Fbotpipe.png?v=1627578683367");
  flappy = loadImage("https://cdn.glitch.com/156184ff-235b-4002-9588-1414696f574f%2F63d398213bb9163.png?v=1627579030198");
  flappyPepper = loadImage("https://cdn.glitch.com/156184ff-235b-4002-9588-1414696f574f%2FNew%20Project%20(1).png?v=1627675567684");
  back = loadImage("https://cdn.glitch.com/156184ff-235b-4002-9588-1414696f574f%2FCSSIFlappyNight.PNG?v=1628098380340")
  gameFont = loadFont(
    "https://cdn.glitch.com/d67e4408-18fc-4a93-94e9-18a215cadafd%2FPixeboy-z8XGD.ttf?v=1626799772222"
  );
   backgroundImg = loadImage(
    "https://cdn.glitch.com/56ec4689-c47c-4602-a30f-0a53ca8880f8%2FNew%20Project%20(3).png?v=1627996991365"
  );
  textFont(gameFont);
  
}

// IMPORTANT: Don't edit the contents of this function. Instead, add code to the
// named functions below.
function draw() {
  background(backgroundColor);
  image(back, innerScreenW, innerScreenH, w, h)
  
  for ( var i = pipes.length-1; i >=0; i--){
    pipes[i].show();
    pipes[i].update();
    
   pipes[i].hits(bird);
    pipes[i].increase(bird);
    if (pipes[i].offscreen()){
      pipes.splice(i, 1);
    }
  }
  
  bird.update();
  bird.show();
  
  if( frameCount % 100 == 0){
    pipes.push(new Pipe());
  }
  fill(0, 0, 100);
  textSize(22);
  textAlign(LEFT);
  text(`Score: ${score}`, innerScreenW + 7, innerScreenH + 17);
  textSize(13);
  text("press space to jump, enter to restart", innerScreenW + 7, innerScreenH + 17 + 13)
  gameOver();
  
  image(backgroundImg, 0, 0, 650, 650);
}

function keyPressed() {
  if(key === ' '){
    bird.up();
  }
  if(keyCode === ENTER){
    restart()
  }
}

function gameOver(){
  if (gameIsOver) {
    fill(0, 0, 100);
    textSize(75);
    textAlign(CENTER);
    text("Game Over", width/2, height/2);
  }
}

function restart(){
  bird = new Bird();
  pipes = [];
  // pipes.push(new Pipe());
  gameIsOver = false;
  score = 0;
}

class Pipe {
  constructor(){
    this.top = random(innerScreenH+5, innerScreenH+h- 70);
    this.space = random(45, innerScreenH+h-this.top-5);
    this.bottom = this.top+this.space;
    this.x = innerScreenW+w;
    this.w = 30;
    this.speed = 2;
    this.passed = false;
    
  }
  
  show(){
    image(topPipe, this.x, innerScreenH, this.w, this.top-innerScreenH)
    // image(bottomPipe, this.x, height-this.space-this.top, this.w, this.space+this.top)
    image(bottomPipe, this.x, this.bottom, this.w, innerScreenH+h-this.bottom);
    //rect(this.x, 0, this.w, this.top);
    //rect(this.x, height-this.bottom, this.w, this.bottom);
  }
  
  update(){
    if(!gameIsOver){
      this.x -= this.speed; 
    }
    
  }
  
  offscreen() {
    if(this.x < -this.w){
      return true;
    }
    else{
      return false;
    }
  }
  
  hits(bd){
    if(collideRectCircle(this.x, innerScreenH, this.w, this.top-innerScreenH, bd.x+(bd.w/2), bd.y+(bd.h/2), bd.h) || collideRectCircle(this.x, this.bottom, this.w, innerScreenH+h- this.bottom, bd.x+(bd.w/2), bd.y+(bd.h/2), bd.h)){
      // console.log("collided")
      gameIsOver = true;
    }

  }
  increase(bd){
    if(bd.x > this.x && this.passed != true){
      this.passed = true;
      score++;
    }
  }
}

class Bird {
  constructor() {
    this.y = innerScreenH+ h/2;
  this.x = innerScreenW+20;
    this.w = 24;
    this.h = 19;
    
    this.gravity = 0.3;
    this.lift = -9;
    this.velocity = 0;
    
  }
  
  show() {
    fill(255);
    image(flappyPepper, this.x, this.y, this.w, this.h);
    // ellipse(this.x, this.y, 16, 16);
  }
  
  update(){
    if(!gameIsOver){
      this.velocity += this.gravity;
    this.velocity *= 0.9;
      this.y += this.velocity;
      
      if(this.y > innerScreenH+h-this.h ){
        this.y = innerScreenH+h-this.h;
        this.velocity = 0;
      }
      if(this.y < 0){
        this.y = 0;
        this.velocity = 0;
      }
    }
    
  }
   
  up(){
    this.velocity += this.lift;
    
  }
  
}

