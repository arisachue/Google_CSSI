// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, noFill, color, random,
          rect, ellipse, stroke, image, loadImage, frameRate, collideRectRect, collideRectCircle, text,
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke,
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, noLoop, loop, round,createButton,select,push,pop,translate,textAlign,CENTER,loadImage,loadFont,textFont,key */

// Original code to print a sudoku is from https://github.com/bashmohandes/Javascript, Mike Glover 23 April 2017
// Additional code was added to make it match the formatting of the arcade and so that it could let the user fill it in/check their answers

var board, backgroundImg, myFont, board2,score;
var CELL_SIZE = 24;
var DIFFICULTY = 0.4;
var currentCellX = 0;
var currentCellY = 0;
const innerScreenW = 151;
const innerScreenH = 215;

function setup() {
  var canvas = createCanvas(650, 650);
  board = new Board();
  board.build();
  createMenu();
  backgroundImg = loadImage(
    "https://cdn.glitch.com/56ec4689-c47c-4602-a30f-0a53ca8880f8%2FNew%20Project%20(3).png?v=1627996991365"
  );
  myFont = loadFont(
    "https://cdn.glitch.com/a720cf6b-1b26-426e-8439-f048ca02411b%2FPixeboy-z8XGD.ttf?v=1626717225527"
  );
  textFont(myFont);
  score=0;
}

function draw() {
  background(0);
  highlightCell();
  board.draw();
  image(backgroundImg, 0, 0, 650, 650);
  checkWin();
  textSize(20);
  fill(255);
  text(`Score: ${score}`, width - innerScreenW-85, height-innerScreenH*2+15);
  fill(0);
}

function createMenu() {
  // Level buttons
  var normalButton = createButton("Normal");
  var hardButton = createButton("Hard");
  normalButton.mousePressed(function() {
    level("norm");
  });
  normalButton.position(width - innerScreenW - 110, height - innerScreenH - 20);
  hardButton.mousePressed(function() {
    level("hard");
  });
  hardButton.position(width - innerScreenW - 45, height - innerScreenH - 20);
}

function level(level) {
  score=0;
  var levelname = select("#level");
  if (level == "norm") {
    DIFFICULTY = 0.4;
    board = new Board();
    board.build();
  } else if (level == "hard") {
    DIFFICULTY = 0.6;
    board = new Board();
    board.build();
  }
}

function Board() {
  this.cells = [];
  this.builder = new Builder(this);

  // Makes the cells for the board
  for (var x = 0; x < 9; x++) {
    this.cells[x] = [];
    for (var y = 0; y < 9; y++) {
      this.cells[x][y] = new Cell(x, y);
    }
  }

  this.draw = function() {
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        this.cells[x][y].valid = this.isValid(x, y);
        this.cells[x][y].draw();
      }
    }
    push();
    strokeWeight(4);
    stroke(255);
    for (var i = 0; i <= 3; i++) {
      line(
        3 * CELL_SIZE * i + innerScreenW,
        innerScreenH,
        3 * CELL_SIZE * i + innerScreenW,
        9 * CELL_SIZE + innerScreenH
      );
      line(
        innerScreenW,
        3 * CELL_SIZE * i + innerScreenH,
        9 * CELL_SIZE + innerScreenW,
        3 * CELL_SIZE * i + innerScreenH
      );
    }
    pop();
  };

  this.next = function(x, y) {
    if (x === 8 && y === 8) {
      return [0, 0];
    }

    if (x + 1 > 8) {
      return [0, y + 1];
    }

    return [x + 1, y];
  };

  this.isValid = function(x, y) {
    for (var i = 0; i < 9; i++) {
      if (i == y) continue;
      if (this.cells[x][i].val === this.cells[x][y].val) {
        return false;
      }
    }

    for (i = 0; i < 9; i++) {
      if (i === x) continue;
      if (this.cells[i][y].val === this.cells[x][y].val) {
        return false;
      }
    }

    var row = Math.floor(x / 3) * 3;
    var col = Math.floor(y / 3) * 3;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var r = i + row;
        var c = j + col;
        if (r === x && c === y) continue;
        if (this.cells[r][c].val === this.cells[x][y].val) {
          return false;
        }
      }
    }

    return true;
  };

  this.build = function() {
    this.builder.build();
  };
}
function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.val = undefined;
  this.fixed = true;
  this.valid = true;

  this.draw = function() {
    push();
    translate(this.x * CELL_SIZE, this.y * CELL_SIZE);
    stroke(155);
    rect(innerScreenW, innerScreenH, CELL_SIZE, CELL_SIZE);
    textAlign(CENTER);
    textSize(20);
    if (this.val) {
      if (this.fixed) {
        fill(255);
      } else {
        fill("YELLOW");
      }
      text(
        this.val,
        CELL_SIZE / 2 + innerScreenW,
        CELL_SIZE / 2  + innerScreenH +5
      );
    }
    pop();
  };
}
function Builder(board) {
  this.board = board;

  this.build = function() {
    var startX = Math.floor(random(0, 9));
    var startY = Math.floor(random(0, 9));
    this.board.cells[startX][startY].val = Math.floor(random(1, 10));
    var n = this.board.next(startX, startY);
    this.buildRec(n[0], n[1], startX, startY);
    board2 = [];
    for (let x = 0; x < 9; x++) {
      board2[x] = [];
      for (let y = 0; y < 9; y++) {
        board2[x][y] = this.board.cells[x][y].val;
      }
    }
    console.table(board2);
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        if (random() <= DIFFICULTY) {
          this.board.cells[x][y].val = undefined;
          this.board.cells[x][y].fixed = false;
        }
      }
    }
  };

  this.buildRec = function(x, y, startX, startY) {
    for (var i = 1; i <= 9; i++) {
      this.board.cells[x][y].val = i;
      this.board.cells[x][y].fixed = true;
      if (this.board.isValid(x, y)) {
        var n = this.board.next(x, y);
        if (n[0] === startX && n[1] === startY) {
          return true;
        }
        if (this.buildRec(n[0], n[1], startX, startY)) {
          return true;
        }
      }
    }

    this.board.cells[x][y].val = undefined;
    return false;
  };
}

function mouseClicked() {
  if (
    mouseX > innerScreenW &&
    mouseX < innerScreenW + CELL_SIZE * 9 &&
    mouseY > innerScreenH &&
    mouseY < innerScreenH + CELL_SIZE * 9
  ) {
    currentCellX = Math.floor((mouseX - innerScreenW) / CELL_SIZE);
    currentCellY = Math.floor((mouseY - innerScreenH) / CELL_SIZE);
  }

}
function keyTyped() {
  if (key === "1") {
    inputNumber(1);
  } else if (key === "2") {
    inputNumber(2);
  } else if (key === "3") {
    inputNumber(3);
  } else if (key === "4") {
    inputNumber(4);
  } else if (key === "5") {
    inputNumber(5);
  } else if (key === "6") {
    inputNumber(6);
  } else if (key === "7") {
    inputNumber(7);
  } else if (key === "8") {
    inputNumber(8);
  } else if (key === "9") {
    inputNumber(9);
  }
  return false;
}
function highlightCell() {
  fill(255, 255, 0, 75);
  rect(
    currentCellX * CELL_SIZE + innerScreenW,
    currentCellY * CELL_SIZE + innerScreenH,
    CELL_SIZE,
    CELL_SIZE
  );
  noFill();
}
function selectCell() {}
function inputNumber(num) {
  if (checkCell(num)) {
    if (board.cells[currentCellX][currentCellY].val == undefined) {
      board.cells[currentCellX][currentCellY].val = num;
    }
  }
}
function checkCell(num) {
  if (board2[currentCellX][currentCellY] == num) {
    score++;
    return true;
  } else {
    score--;
    return false;
  }
}
function checkWin(){
  let winBool=true;
  for(let x=0;x<9;x++){
    for(let y=0;y<9;y++){
      if(board.cells[x][y].val==undefined){
        winBool= false;
      }
    }
  }
  if(winBool){
    textSize(80);
    fill("YELLOW");
    text("You Won!", innerScreenW+50, innerScreenH+120);
    fill(0);
    textSize(12);
    console.log("won");
  }
}