// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, circle, keyIsPressed, pmouseX, pmouseY, key, triangle, sqrt, asin, SHIFT, acos, DELETE, round, textAlign, CENTER, keyCode, ENTER, TAB, loadFont, textFont  */

let ROW_COUNT = 6,
  COLUMN_COUNT = 7,
  BLUE,
  BLACK = 0,
  RED,
  YELLOW,
  PLAYER_PIECE = 1,
  AI_PIECE = 2,
  EMPTY = 0,
  WINDOW_LENGTH = 4,
  board = [],
  game_over = false,
  SQUARESIZE,
  RADIUS,
  PC,
  pvp,
  counter,
  chose = false, playhouse, gameFont, h = 225,
   w = 355,
   innerScreenW = 147,
   innerScreenH = 211, AIgoes;

function setup() {
  // Canvas & color settings
  createCanvas(650, 650);
  colorMode(HSB, 360, 100, 100);
  for (let c = 0; c < COLUMN_COUNT; c++) {
    board.push([]);
    for (let r = 0; r < ROW_COUNT; r++) {
      board[c].push(0);
    }
  }
  counter = 0;
  
  SQUARESIZE = Math.min(w / 7, h / 7)-1;
  RADIUS = SQUARESIZE / 2;
  // console.table(board);
  RED = color(0, 100, 100);
  BLUE = color(240, 80, 80);
  YELLOW = color(60, 100, 100);
  PC = [0, RED, YELLOW];
  textAlign(CENTER);
  textSize(SQUARESIZE / 1.8);
  pvp = true;
  playhouse = loadImage("https://cdn.glitch.com/6178d839-e28f-4470-9363-ffd40325fc3d%2FNew%20Project%20(3).png?v=1628095075544");
  gameFont = loadFont("https://cdn.glitch.com/6178d839-e28f-4470-9363-ffd40325fc3d%2FPixeboy-z8XGD.ttf?v=1628177195697");
  textFont(gameFont);
  AIgoes = false;
}

function draw() {
  
  if (!chose) {
    fill(BLUE);
    rect(innerScreenW, innerScreenH, w, h)
    fill(255);
    text(
      "Press Enter to Play Pass & Play\nPress 1 to Play Against the Computer as Red\nPress 2 to Play Against the Computer as Yellow",
      width / 2,
      height / 2
    );
  } else {
    if(AIgoes){
      counter++;
      if(counter%30 == 0){
        AIMove();
        AIgoes = false;
      }
    }
    fill(BLUE)
    rect(innerScreenW, innerScreenH, w, h)
    draw_board(board);
    check_wins();
  }
  image(playhouse, 0, 0, width, height);
}

function check_wins() {
  if (winning_move(board, 1)) {
    fill(RED)
    textSize(SQUARESIZE/1.5)
    text("Red Wins!", width / 2, SQUARESIZE/2 + innerScreenH);
    text("Press Enter to Restart", width / 2, innerScreenH + SQUARESIZE)
    game_over = true;
  } else if (winning_move(board, 2)) {
    fill(YELLOW)
    textSize(SQUARESIZE/1.5)
    text("Yellow Wins!", width / 2, SQUARESIZE/2 + innerScreenH);
    text("Press Enter to Restart", width / 2, innerScreenH + SQUARESIZE)
    game_over = true;
  } else {
    game_over = true;
    for (let c = 0; c < COLUMN_COUNT; c++) {
      if (is_valid_location(board, c)) {
        game_over = false;
      }
    }
    if (game_over) {
      fill(0)
      textSize(SQUARESIZE)
      text("Draw", width / 2, SQUARESIZE + innerScreenH);
    }
  }
}

function is_valid_location(board, col) {
  if (col >= 0 && col < board.length) return board[col][ROW_COUNT - 1] === 0;
  else {
    return false;
  }
}

function get_next_open_row(board, col) {
  for (let r = 0; r < ROW_COUNT; r++) {
    if (board[col][r] === 0) return r;
  }
}

function drop_piece(board, row, col, piece) {
  board[col][row] = piece;
}

function print_board(board) {
  print(board);
}

function winning_move(board, piece) {
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT; r++) {
      if (
        board[c][r] == piece &&
        board[c + 1][r] == piece &&
        board[c + 2][r] == piece &&
        board[c + 3][r] == piece
      ) {
        return true;
      }
    }
  }
  // vertical locations
  for (let c = 0; c < COLUMN_COUNT; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[c][r] == piece &&
        board[c][r + 1] == piece &&
        board[c][r + 2] == piece &&
        board[c][r + 3] == piece
      ) {
        return true;
      }
    }
  }
  // positive diagonal locations
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[c][r] == piece &&
        board[c + 1][r + 1] == piece &&
        board[c + 2][r + 2] == piece &&
        board[c + 3][r + 3] == piece
      ) {
        return true;
      }
    }
  }
  // negative diagonal locations

  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 3; r < ROW_COUNT; r++) {
      if (
        board[c][r] == piece &&
        board[c + 1][r - 1] == piece &&
        board[c + 2][r - 2] == piece &&
        board[c + 3][r - 3] == piece
      ) {
        return true;
      }
    }
  }
}

function evaluate_window(window, piece) {
  let score = 0;
  let opponent_piece = (piece % 2) + 1;
  // let opponent_piece = PLAYER_PIECE;
  // if (piece == PLAYER_PIECE) opponent_piece = AI_PIECE;
  if (count(window, piece) == 4) score += 10000;
  else if (count(window, piece) == 3 && count(window, EMPTY) == 1) score += 5;
  else if (count(window, piece) == 2 && count(window, EMPTY) == 2) score += 2;
  if (count(window, opponent_piece) == 3 && count(window, EMPTY) == 1)
    score -= 5;
  else if (count(window, opponent_piece) == 2 && count(window, EMPTY) == 2)
    score -= 2;
  return score;
}

function score_position(board, piece) {
  let score = 0;
  const middle = Math.floor(COLUMN_COUNT / 2);
  let center_array = [];
  for (let i = 0; i < ROW_COUNT; i++) {
    center_array.push(board[middle][i]);
  }
  let center_count = count(center_array, piece);
  score += center_count * 4;

  //Horizontal Windows
  for (let r = 0; r < ROW_COUNT; r++) {
    let row_array = [];
    for (let c = 0; c < COLUMN_COUNT; c++) {
      row_array.push(board[c][r]);
    }
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      let window = [];
      for (let i = 0; i < WINDOW_LENGTH; i++) {
        window.push(row_array[c + i]);
      }
      score += evaluate_window(window, piece);
    }
  }

  //Vertical Windows
  for (let c = 0; c < COLUMN_COUNT; c++) {
    let col_array = board[c];
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      let window = [];
      for (let i = 0; i < WINDOW_LENGTH; i++) {
        window.push(col_array[r + i]);
      }
      score += evaluate_window(window, piece);
    }
  }

  //Positive Slope Windows
  for (let r = 0; r < ROW_COUNT - 3; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      let window = [];
      for (let i = 0; i < WINDOW_LENGTH; i++) {
        window.push(board[c + i][r + i]);
      }
      score += evaluate_window(window, piece);
    }
  }

  //Negative Slope Windows
  for (let r = 0; r < ROW_COUNT - 3; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      let window = [];
      for (let i = 0; i < WINDOW_LENGTH; i++) {
        window.push(board[c + i][r + WINDOW_LENGTH - 1 - i]);
      }
      score += evaluate_window(window, piece);
    }
  }

  return score;
}

function count(array, piece) {
  var amt = 0;
  for (var i = 0; i < array.length; ++i) {
    if (array[i] == piece) amt++;
  }
  return amt;
}

function is_terminal_node(board) {
  return (
    winning_move(board, PLAYER_PIECE) ||
    winning_move(board, AI_PIECE) ||
    get_valid_locations(board).length == 0
  );
}

function pick_best_move(board, piece) {
  let valid_locations = get_valid_locations(board);
  let best_score = -1000;
  let best_col = valid_locations[Math.floor(random(COLUMN_COUNT))];
  for (let col of valid_locations) {
    let row = get_next_open_row(board, col);
    let temp_board = copy_board(board);
    drop_piece(temp_board, row, col, piece);
    if (winning_move(temp_board, piece)) {
      return col;
    }
    let score =
      score_position(temp_board, piece) -
      score_position(temp_board, (piece % 2) + 1);
    let lose = false;
    for (let move of get_valid_locations(temp_board)) {
      let temp2 = copy_board(temp_board);
      drop_piece(
        temp2,
        get_next_open_row(temp_board, move),
        move,
        (piece % 2) + 1
      );
      if (winning_move(temp2, (piece % 2) + 1)) {
        lose = true;
      }
    }
    console.log(
      col,
      score,
      score_position(temp_board, piece),
      score_position(temp_board, (piece % 2) + 1)
    );
    if (score > best_score && !lose) {
      best_score = score;
      best_col = col;
    } else if (score == best_score && !lose && random(3) < 1) {
      best_score = score;
      best_col = col;
    }
  }
  return best_col;
}

function copy_board(board) {
  let newb = [];
  for (let i = 0; i < board.length; i++) {
    newb.push([]);
    for (let j = 0; j < board[i].length; j++) {
      newb[i][j] = board[i][j];
    }
  }
  return newb;
}

function get_valid_locations(board) {
  let valid_locations = [];
  for (let col = 0; col < COLUMN_COUNT; col++) {
    if (is_valid_location(board, col)) valid_locations.push(col);
  }
  return valid_locations;
}

function draw_board(board) {
  fill(PC[PLAYER_PIECE]);
  ellipse(mouseX, SQUARESIZE/1.5 +innerScreenH, SQUARESIZE - 2);

  for (let c = 0; c < COLUMN_COUNT; c++) {
    for (let r = 0; r < ROW_COUNT; r++) {
      if (board[c][r] == 0) {
        fill(255);
      } else if (board[c][r] == 1) {
        fill(RED);
      } else if (board[c][r] == 2) {
        fill(YELLOW);
      } else {
        fill(BLUE);
      }
      ellipse(
        c * SQUARESIZE + width/2 - SQUARESIZE*3,
        innerScreenH + h - ((r + 1) * SQUARESIZE + SQUARESIZE / 2) + SQUARESIZE - 1,
        SQUARESIZE - 2
      );
    }
  }
}

function AIMove(){
  if (winning_move(board, 1)) {
    textSize(SQUARESIZE/1.5)
        text("Red Wins!", width / 2, SQUARESIZE/2 + innerScreenH);
    text("Press Enter to Restart", width / 2, innerScreenH + SQUARESIZE)
        game_over = true;
      }
  if (winning_move(board, 2)) {
    textSize(SQUARESIZE/1.5)
        text("Yellow Wins!", width / 2, SQUARESIZE/2 + innerScreenH);
    text("Press Enter to Restart", width / 2, innerScreenH + SQUARESIZE)
        game_over = true;
      }else {
        let played = false;
        if (!played) {
          // let col = minmax(board, 3, -100000, 100000, true)[0];
          // console.log(minmax(board, 3, -100000, 100000, true));
          let col = pick_best_move(board, AI_PIECE);
          if (is_valid_location(board, col)) {
            let row = get_next_open_row(board, col);
            drop_piece(board, row, col, PLAYER_PIECE);
            played = true;
            PLAYER_PIECE %= 2;
            PLAYER_PIECE += 1;
          }
        }
      }
}

function mouseClicked() {
  if (chose && !game_over && mouseX > width/2 - SQUARESIZE*3.5 && mouseX < width/2 + SQUARESIZE*3.5) {
    let col = Math.floor((mouseX - width/2 + SQUARESIZE*3.5)  / SQUARESIZE);
    if (is_valid_location(board, col)) {
      let row = get_next_open_row(board, col);
      drop_piece(board, row, col, PLAYER_PIECE);
      PLAYER_PIECE %= 2;
      PLAYER_PIECE += 1;
    }
    if (!pvp) {
      AIgoes = true;
    }
  }
}

function keyPressed() {
    console.log(keyCode);
  if (keyCode === ENTER && !game_over) {
    chose = true;
    pvp = true;
  }
  else if (keyCode === 49) {
    chose = true;
    pvp = false;
  }
  else if (keyCode === 50){
    chose = true;
    pvp = false;
    PLAYER_PIECE = PLAYER_PIECE%2+1;
    AI_PIECE= AI_PIECE%2+1;
    AIgoes = true;
  }
  if(keyCode === ENTER && game_over){
      restart();
  }
}

function restart(){
  pvp = true;
  chose = false;
  board = []
 for (let c = 0; c < COLUMN_COUNT; c++) {
    board.push([]);
    for (let r = 0; r < ROW_COUNT; r++) {
      board[c].push(0);
    }
  }
  counter = 0; 
  textSize(SQUARESIZE/1.8)
  PLAYER_PIECE = 1
  AI_PIECE = 2
    game_over = false;
}