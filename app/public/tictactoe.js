// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, ENTER, textSize, textAlign, LEFT, CENTER, loadFont, textFont, createButton, key, frameCount, collideRectRect, noLoop, drawingContext, countOccurrences*/

// IMPORTANT: you'll need to import the p5 collide2d library in order for this
// code to work. You can do this by doing one of the following:
// - importing a local copy to the HTML
// - importing a hosted copy (from a CDN) to the HTML
// - (last resort) pasting it into this script as the first line

let backgroundColor,
  slots,
  circlePicture,
  crossPicture,
  arcadeBackground,
  count,
  h,
  w,
  tiles,
  player,
  gameFont,
  atStartScreen,
  playerPicked,
  constraints,
  screenX,
  screenY,
  placedTokens,
  gameIsOver,
  playerGoesFirst,
  gameBoard,
  playerTurn,
  lastToken,
  aiTurn,
  aiPlayer;

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

  slots = [
    [w / 6 + screenX, h / 6 + screenY],
    [w / 2 + screenX, h / 6 + screenY],
    [(w / 6) * 5 + screenX, h / 6 + screenY],
    [w / 6 + screenX, h / 2 + screenY],
    [w / 2 + screenX, h / 2 + screenY],
    [(w / 6) * 5 + screenX, h / 2 + screenY],
    [w / 6 + screenX, (h / 6) * 5 + screenY],
    [w / 2 + screenX, (h / 6) * 5 + screenY],
    [(w / 6) * 5 + screenX, (h / 6) * 5 + screenY]
  ];
  tiles = [];
  for (let i = 0; i < 9; i++) {
    tiles.push(new Tile(i));
  }

  circlePicture = loadImage(
    "https://cdn.glitch.com/d0c033c7-ddfc-42f7-ac4f-7a02bb97d222%2Fcircle-neon-blue-tumblr-sticker-by-melissa-camilo-neon-blue-png-1024_1024.png?v=1627678855298"
  );
  crossPicture = loadImage(
    "https://cdn.glitch.com/d0c033c7-ddfc-42f7-ac4f-7a02bb97d222%2F2ece79976bd05ec6fe5f96d2b9b06c29.png?v=1627679006824"
  );
  arcadeBackground = loadImage(
    "https://cdn.glitch.com/d0c033c7-ddfc-42f7-ac4f-7a02bb97d222%2FNew%20Project%20(3).png?v=1627921566021"
  );
  gameFont = loadFont(
    "https://cdn.glitch.com/d67e4408-18fc-4a93-94e9-18a215cadafd%2FPixeboy-z8XGD.ttf?v=1626799772222"
  );
  textFont(gameFont);

  count = 0;
  player = "";
  aiPlayer = "";
  playerPicked = false;
  atStartScreen = true;
  constraints = [];
  placedTokens = [];
  gameIsOver = false;
  playerGoesFirst = false;
  gameBoard = ".........";
  playerTurn = false;
  lastToken = "";
  aiTurn = true;
  build_constraints();
  
}

function draw() {
  image(arcadeBackground, 0, 0, 650, 650);
  if (atStartScreen) {
    startScreen();
  } else {
    if (playerGoesFirst) {
      if(count == 0){
        aiTurn = false;
      }
      if (playerTurn) {
        let move = parseInt(lastToken);
        gameBoard =
          gameBoard.substring(0, move) +
          player +
          gameBoard.substring(move + 1, gameBoard.length);
        console.log(gameBoard);
        playerTurn = false;
        if (game_over(gameBoard)) {
          gameIsOver = true;
          gameOver();
        }
        aiTurn = true;
      }
      if(aiTurn) {
        count++;
        if (count % 25 == 0) {
          let move = min_move(gameBoard);
          tiles[move].occupied = true;
          console.log(move);
          gameBoard =
            gameBoard.substring(0, move) +
            aiPlayer +
            gameBoard.substring(move + 1, gameBoard.length);
          console.log(gameBoard);
          placeToken(move, aiPlayer);
          aiTurn = false;
          if (game_over(gameBoard)) {
            gameIsOver = true;
            gameOver();
          }
        }
      }
    } else {
      if (aiTurn) {
        count++;
        if (count % 25 == 0) {
          let move = max_move(gameBoard);
          tiles[move].occupied = true;
          console.log(move);
          gameBoard =
            gameBoard.substring(0, move) +
            aiPlayer +
            gameBoard.substring(move + 1, gameBoard.length);
          console.log(gameBoard);
          placeToken(move, aiPlayer);
          aiTurn = false;
          if (game_over(gameBoard)) {
            gameIsOver = true;
            gameOver();
          }
        }
      }
      if (playerTurn) {
        let move = parseInt(lastToken);
        gameBoard =
          gameBoard.substring(0, move) +
          player +
          gameBoard.substring(move + 1, gameBoard.length);
        console.log(gameBoard);
        playerTurn = false;
        if (game_over(gameBoard)) {
          gameIsOver = true;
          gameOver();
        }
        aiTurn = true;
      }
    }
  }
}

function gameOver() {
  if (gameIsOver) {
    playerPicked = false;
    playerGoesFirst = false;
    playerTurn = false;
    aiTurn = false;
    let w = win(gameBoard);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(3);
    fill(54, 100, 100);
    textSize(80);
    if (w != null) {
      if (player == w) {
        text("you win!!", width / 2, height / 2 + 15);
      } else {
        text("ai wins!!", width / 2, height / 2 + 15);
      }
    } else {
      text("It's a tie!!", width / 2, height / 2 + 15);
    }
    textSize(30);
    strokeWeight(2);
    text("press enter to start over", width/2, height/2 + 45)
  }
}

function computer_X(board, playerMove) {
  //computer play X first (either board empty or next turn is X)
  if (!gameIsOver) {
    let move = max_move(board);
    board =
      board.substring(0, move) + "X" + board.substring(move + 1, board.length);
    if (game_over(board)) {
      gameIsOver = true;
      return;
    }
    board =
      board.substring(0, playerMove) +
      "O" +
      board.substring(playerMove + 1, board.length);
  }
}

function player_X(board, playerMove) {
  //player play X first (either board empty or next turn is X)
  if (!gameIsOver) {
    board =
      board.substring(0, playerMove) +
      "X" +
      board.substring(playerMove + 1, board.length);
    if (game_over(board)) {
      gameIsOver = true;
      return;
    }
    let move = min_move(board);
    board =
      board.substring(0, move) + "O" + board.substring(move + 1, board.length);
  }
}

function min_move(board) {
  // return min move location, play O
  let values = [];
  let nb = next_board(board);
  for (let i = 0; i < nb.length; i++) {
    let next_b = nb[i][0];
    let m = nb[i][1];
    let res = max_step(next_b);
    values.push([m, res]);
  }
  console.log(values);
  let minm = values[0][0];
  let minv = values[0][1];
  for (let i = 0; i < values.length; i++) {
    let move = values[i][0];
    let val = values[i][1];
    if (val < minv) {
      minv = val;
      minm = move;
    }
  }
  return minm;
}

function max_move(board) {
  // return max move location, play X
  let values = [];
  let nb = next_board(board);
  for (let i = 0; i < nb.length; i++) {
    let next_b = nb[i][0];
    let m = nb[i][1];
    let res = min_step(next_b);
    values.push([m, res]);
  }
  let maxm = values[0][0];
  let maxv = values[0][1];
  for (let i = 0; i < values.length; i++) {
    let move = values[i][0];
    let val = values[i][1];
    if (val > maxv) {
      maxv = val;
      maxm = move;
    }
  }
  return maxm;
}

function max_step(board) {
  // return max weight of future outcome
  if (game_over(board)) {
    return score(board);
  }
  let results = [];
  let nb = next_board(board);
  for (let i = 0; i < nb.length; i++) {
    let next_b = nb[i][0];
    let m = nb[i][1];
    results.push(min_step(next_b));
  }
  return Math.max(...results);
}

function min_step(board) {
  // return min weight of future outcome
  if (game_over(board)) {
    return score(board);
  }
  let results = [];
  let nb = next_board(board);
  for (let i = 0; i < nb.length; i++) {
    let next_b = nb[i][0];
    let m = nb[i][1];
    results.push(max_step(next_b));
  }
  return Math.min(...results);
}

function score(board) {
  //  returns weight of board
  if (win(board) == null) {
    // tie
    return 0;
  }

  if (win(board) == "X") {
    return 1;
  }

  return -1;
}
function build_constraints() {
  let con = [];
  for (let r = 0; r < 9; r += 3) {
    let row = [];
    for (let c = 0; c < 3; c++) {
      row.push(c + r);
    }
    con.push(row);
  }
  for (let c = 0; c < 3; c++) {
    let col = [];
    for (let r = 0; r < 9; r += 3) {
      col.push(c + r);
    }
    con.push(col);
  }
  let dia = [0, 4, 8];
  con.push(dia);
  dia = [2, 4, 6];
  con.push(dia);
  constraints = con;
  return con;
}

function win(board) {
  for (let c of constraints) // go through each col, row, diagonal
    if (
      board[c[0]] != "." &&
      board[c[0]] == board[c[1]] &&
      board[c[0]] == board[c[2]]
    ) {
      return board[c[0]]; // return X or O win
    }
  return null; // no win
}

function game_over(board) {
  if (win(board) != null) {
    // X or O
    return true;
  }
  if (!board.includes(".")) {
    // tie
    return true;
  }
  return false;
}

function next_board(board) {
  let moves = [];
  if (countOccurrences(board, ".") % 2 == 0) {
    // O move
    for (let i = 0; i < board.length; i++) {
      if (board[i] == ".") {
        let temp =
          board.substring(0, i) + "O" + board.substring(i + 1, board.length);
        moves.push([temp, i]);
      }
    }
  } else {
    // X move
    for (let i = 0; i < board.length; i++) {
      if (board[i] == ".") {
        let temp =
          board.substring(0, i) + "X" + board.substring(i + 1, board.length);
        moves.push([temp, i]);
      }
    }
  }
  return moves;
}

function countOccurrences(string, word) {
  return string.split(word).length - 1;
}

function startScreen() {
  fill(0);
  rect(screenX, screenY, w, h);
  // background(backgroundColor);
  textAlign(CENTER);
  textSize(60);
  blink("tic-tac-toe", w / 2 + screenX, h / 3 + screenY);
  textSize(20);
  fill(54, 100, 100);
  text("press X or O key: x will start", w / 2 + screenX, h / 3 + 30 + screenY);
  textSize(25);
  text(`you chose: ${player}`, w / 2 + screenX, (h / 3) * 2 + 15 + screenY);
  textSize(30);
  blink("press enter to start", w / 2 + screenX, (h / 4) * 3 + 30 + screenY);
}

function blink(s, x, y) {
  if (frameCount % 70 > 20) {
    fill(54, 100, 100);
  } else {
    fill(0);
  }
  text(s, x, y);
}

function keyPressed() {
  if (keyCode === 88 && atStartScreen) {
    // x
    player = "X";
    playerPicked = true;
  } else if (keyCode === 79 && atStartScreen) {
    player = "O";
    playerPicked = true;
  } else if (keyCode === ENTER && playerPicked) {
    atStartScreen = false;
    playerPicked = false;
    aiPlayer = "X";
    if (player == "X") {
      aiPlayer = "O";
      playerGoesFirst = true;
    }
    drawBoard();
  }
  else if( keyCode === ENTER && gameIsOver){
    gameIsOver = false;
    player = "";
  aiPlayer = "";
  gameBoard = ".........";
  lastToken = "";
    atStartScreen = true;
    for(let i = 0; i< tiles.length; i++){
      tiles[i].occupied = false;
    }
    
  }
}

function mousePressed() {
  if (!atStartScreen && !gameIsOver && !aiTurn) {
    if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseX < w / 3 + screenX &&
      mouseY < h / 3 + screenY
    ) {
      console.log(0);
      if (tiles[0].occupied == false) {
        // placedTokens.push([0, player]);
        placeToken(0, player);
        tiles[0].occupied = true;
        lastToken = 0;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseX < (w / 3) * 2 + screenX &&
      mouseY < h / 3 + screenY
    ) {
      console.log(1);
      if (tiles[1].occupied == false) {
        // placedTokens.push([1, player]);
        placeToken(1, player);
        tiles[1].occupied = true;
        lastToken = 1;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseY < h / 3 + screenY
    ) {
      console.log(2);
      if (tiles[2].occupied == false) {
        // placedTokens.push([2, player]);
        placeToken(2, player);
        tiles[2].occupied = true;
        lastToken = 2;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseX < w / 3 + screenX &&
      mouseY < (h / 3) * 2 + screenY
    ) {
      console.log(3);
      if (tiles[3].occupied == false) {
        // placedTokens.push([3, player]);
        placeToken(3, player);
        tiles[3].occupied = true;
        lastToken = 3;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseX < (w / 3) * 2 + screenX &&
      mouseY < (h / 3) * 2 + screenY
    ) {
      console.log(4);
      if (tiles[4].occupied == false) {
        // placedTokens.push([4, player]);
        placeToken(4, player);
        tiles[4].occupied = true;
        lastToken = 4;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseY < (h / 3) * 2 + screenY
    ) {
      console.log(5);
      if (tiles[5].occupied == false) {
        // placedTokens.push([5, player]);
        placeToken(5, player);
        tiles[5].occupied = true;
        lastToken = 5;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseX < w / 3 + screenX
    ) {
      console.log(6);
      if (tiles[6].occupied == false) {
        // placedTokens.push([6, player]);
        placeToken(6, player);
        tiles[6].occupied = true;
        lastToken = 6;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (
      mouseX > screenX &&
      mouseY > screenY &&
      mouseX < (w / 3) * 2 + screenX
    ) {
      console.log(7);
      if (tiles[7].occupied == false) {
        // placedTokens.push([7, player]);
        placeToken(7, player);
        tiles[7].occupied = true;
        lastToken = 7;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    } else if (mouseX > screenX && mouseY > screenY) {
      console.log(8);
      if (tiles[8].occupied == false) {
        // placedTokens.push([8, player]);
        placeToken(8, player);
        tiles[8].occupied = true;
        lastToken = 8;
        playerTurn = true;
      } else {
        console.log("click another square");
      }
    }
  }
}

function drawBoard() {
  noStroke();
  fill(0);
  rect(147, 210, 355, 220);
  stroke(54, 100, 100);
  strokeWeight(3);
  drawingContext.setLineDash([5, 10]);
  line(w / 3 + screenX, 0 + screenY, w / 3 + screenX, h + screenY);
  line((w / 3) * 2 + screenX, 0 + screenY, (w / 3) * 2 + screenX, h + screenY);
  line(0 + screenX, h / 3 + screenY, w + screenX, h / 3 + screenY);
  line(0 + screenX, (h / 3) * 2 + screenY, w + screenX, (h / 3) * 2 + screenY);
  drawingContext.setLineDash([5, 0]);
}

function placeToken(i, player) {
  let token = new Token("circle");
  if (player === "X") {
    token = new Token("cross");
  }
  let x = slots[i][0];
  let y = slots[i][1];
  token.show(x, y);
}

class Tile {
  constructor(i) {
    this.index = i;
    this.occupied = false;
  }
}
class Token {
  constructor(v) {
    this.size = 75;
    this.value = v;
  }

  show(x, y) {
    if (this.value == "circle") {
      image(
        circlePicture,
        x - this.size / 2,
        y - this.size / 2,
        this.size,
        this.size
      );
    } else {
      image(
        crossPicture,
        x - this.size / 2,
        y - this.size / 2,
        this.size,
        this.size
      );
    }
  }
}
