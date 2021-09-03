// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, noFill, color, random,
          rect, ellipse, stroke, image, loadImage, frameRate, collideRectRect, collideRectCircle, text,
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke,
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, noLoop, loop, round ,textAlign,CENTER, myFont,textFont,loadFont, frameCount,ENTER*/

let backgroundColor,
  playerBike,
  player2Bike,
  squareSize,
  myFont,
  backgroundImg,
  startBool, redLose, blueLose, gameIsOver;
const h = 225;
const w = 355;
const innerScreenW = 149;
const innerScreenH = 213;
function setup() {
  // Canvas & color settings
  createCanvas(650, 650);
  colorMode(HSB, 360, 100, 100);
  squareSize = 4;
  backgroundColor = 0;
  playerBike = new Bike(0, "E", squareSize);
  player2Bike = new Bike(240, "W", 355 - squareSize);
  myFont = loadFont(
    "https://cdn.glitch.com/a720cf6b-1b26-426e-8439-f048ca02411b%2FPixeboy-z8XGD.ttf?v=1626717225527"
  );
  backgroundImg = loadImage(
    "https://cdn.glitch.com/56ec4689-c47c-4602-a30f-0a53ca8880f8%2FNew%20Project%20(3).png?v=1627996991365"
  );
  textFont(myFont);
  startBool = true;
  
  frameRate(30);
  redLose = false;
  blueLose = false;
  gameIsOver = false;
}

function draw() {
  if (startBool) {
    startScreen();
  } else {
    background(backgroundColor);
    playerBike.extendTail();
    playerBike.moveSelf();
    playerBike.showSelf();
    playerBike.checkCollisions();
    player2Bike.extendTail();
    player2Bike.moveSelf();
    player2Bike.showSelf();
    player2Bike.checkCollisions();
    checkBBCollide();
  }

  image(backgroundImg, 0, 0, 650, 650);
}
function startScreen() {
  fill(0);
  rect(innerScreenW, innerScreenH, w, h);
  // background(backgroundColor);
  textAlign(CENTER);
  textSize(60);
  fill("YELLOW");
  blink("tron bike", w / 2 + innerScreenW, h / 3 + innerScreenH);
  textSize(20);
  fill("YELLOW");
  text("press enter to start", w / 2 + innerScreenW, h / 3 + 30 + innerScreenH);
}

function blink(s, x, y) {
  if (frameCount % 70 > 20) {
    fill(54, 100, 100);
  } else {
    fill(0);
  }
  text(s, x, y);
}

class Bike {
  constructor(color, direction, addition) {
    this.size = squareSize;
    this.x = innerScreenW + addition;
    this.y = innerScreenH * (3 / 2);
    this.direction = [];
    this.direction.unshift(direction);
    this.speed = 1;
    this.tail = [];
    this.tail.unshift(new TailSegment(this.x, this.y));
    this.color = color;
  }

  moveSelf() {
    let direction = this.direction[0];
    if (this.direction.length > 1) {
      this.direction.shift();
    }
    if (direction === "N") {
      this.y -= this.speed;
      if (this.y < innerScreenH) {
        this.y = innerScreenH + h;
      }
    } else if (direction === "S") {
      this.y = this.y + this.speed;
      if (this.y > innerScreenH + h) {
        this.y = innerScreenH;
      }
    } else if (direction === "E") {
      this.x = this.x + this.speed;
      if (this.x > innerScreenW + w) {
        this.x = innerScreenW + squareSize;
      }
    } else if (direction === "W") {
      this.x -= this.speed;
      if (this.x < innerScreenW) {
        this.x = innerScreenW + w;
      }
    } else {
      console.log("Error: invalid direction");
    }

    //Add new head to front of tail
    this.tail.unshift(new TailSegment(this.x, this.y));
    //Remove last segment of tail
    this.tail.pop();
  }

  showSelf() {
    fill(this.color, 100, 100);
    rect(this.x, this.y, this.size, this.size);
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf();
    }
  }

  checkCollisions() {
    // If there is only one tail segment, no need to check
    if (this.tail.length <= 2) {
      return;
    }

    for (let i = 1; i < this.tail.length; i++) {
      if (this.x == this.tail[i].x && this.y == this.tail[i].y) {
        if(this.color == 0){
          redLose = true;
        }
        else if(this.color == 240){
          blueLose = true;
        }
        gameOver();
      }

    }
    
    
  }

  extendTail() {
    //Add a new tail segment to the end in the same position as current last tail segment
    let lastTailSegment = this.tail[this.tail.length - 1];
    this.tail.push(new TailSegment(lastTailSegment.x, lastTailSegment.y));
  }
}

class TailSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = squareSize;
  }

  showSelf() {
    fill(this.color, 100, 100);
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    noFill();
  }
}
function checkBBCollide(){
  for (let i = 1; i < playerBike.tail.length; i++) {
      if (playerBike.x == player2Bike.tail[i].x && playerBike.y == player2Bike.tail[i].y) {
        gameOver();
      }
  }
  for (let i = 1; i < player2Bike.tail.length; i++) {
      if (player2Bike.x == playerBike.tail[i].x && player2Bike.y == playerBike.tail[i].y) {
        gameOver();
      }
  }
}
function keyPressed() {
  if (keyCode === ENTER && startBool) {
    console.log("start")
    startBool = false;
  }
  if(keyCode === ENTER && gameIsOver){
    restartGame();
    startBool = true;
    gameIsOver = false;
  }
  if (keyCode === UP_ARROW && player2Bike.direction != "S") {
    player2Bike.direction.push("N");
  } else if (keyCode === DOWN_ARROW && player2Bike.direction != "N") {
    player2Bike.direction.push("S");
  } else if (keyCode === RIGHT_ARROW && player2Bike.direction != "W") {
    player2Bike.direction.push("E");
  } else if (keyCode === LEFT_ARROW && player2Bike.direction != "E") {
    player2Bike.direction.push("W");
  } else if (keyCode === 32) {
    restartGame();
  } else {
    console.log("Error: invalid direction");
  }

  if (keyCode === 87 && playerBike.direction != "S") {
    playerBike.direction.push("N");
  } else if (keyCode === 83 && playerBike.direction != "N") {
    playerBike.direction.push("S");
  } else if (keyCode === 68 && playerBike.direction != "W") {
    playerBike.direction.push("E");
  } else if (keyCode === 65 && playerBike.direction != "E") {
    playerBike.direction.push("W");
  } else if (keyCode === 32) {
    restartGame();
  } else {
    console.log("Error: invalid direction");
  }
}

function restartGame() {
 playerBike = new Bike(0, "E", squareSize);
  player2Bike = new Bike(240, "W", 355 - squareSize);
  loop();
}

function gameOver() {
  gameIsOver = true;
  textSize(50);
  stroke("YELLOW");
  fill("YELLOW");
  textAlign(CENTER);
  if(redLose){
    fill(240, 100,100)
    text("BLUE WINS", width / 2, height / 2)
  }
  else if(blueLose){
    fill(0, 100,100)
    text("RED WINS", width / 2, height / 2)
  }
  else{
    text("GAME OVER", width / 2, height / 2);
  }
  textSize(30);
  text("Press enter to start over", width/2, height/2 + 30)
  noLoop();
    
}
