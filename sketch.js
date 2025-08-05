let grid;
let score = 0;
let Im2, Im4, Im8, Im16, Im32, Im64, Im128, Im256, Im512, Im1024, Im2048;
let canMove = true;  // Flag to control single-move per keypress

function preload() {
  Im2 = loadImage("Grape.jpeg");
  Im4 = loadImage("Kiwi.jpeg");
  Im8 = loadImage("Orange.jpeg");
  Im16 = loadImage("Apple.jpeg");
  Im32 = loadImage("Pear.jpeg");
  Im64 = loadImage("Bananas.jpeg");
  Im128 = loadImage("Coco.jpeg");
  Im256 = loadImage("Pineapple.jpeg");
  Im512 = loadImage("Mango.jpeg");
  Im1024 = loadImage("Watermellon.jpeg");
  Im2048 = loadImage("Dragonfruit.jpeg");
}

function blankGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function setup() {
  createCanvas(500, 500);
  grid = blankGrid();
  addNumber();
  addNumber();
}

function draw() {
  background(255);
  drawGrid();
  if (isGameOver()) {
    textSize(60);
    fill(220, 20, 60);
    strokeWeight(3);
    stroke(220, 20, 60);
    text("Game Over!!!!", 200, 200);
  }
}

function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) options.push({ x: i, y: j });
    }
  }
  if (options.length > 0) {
    let spot = random(options);
    let r = random(1);
    grid[spot.x][spot.y] = r > 0.1 ? 2 : 4;  // 90% chance of 2, 10% of 4
  }
}

function drawGrid() {
  let w = 100;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      noFill();
      strokeWeight(5);
      stroke(random(300), random(200), random(200));
      rect(i * w, j * w, w, w);
      let val = grid[i][j];
      if (val !== 0) {
        // Draw images based on value
        switch (val) {
          case 2:   image(Im2,  i*w+25, j*w+20, 60, 60); break;
          case 4:   image(Im4,  i*w+10, j*w+10, 80, 80); break;
          case 8:   image(Im8,  i*w+10, j*w+10, 80, 80); break;
          case 16:  image(Im16, i*w+10, j*w+10, 80, 80); break;
          case 32:  image(Im32, i*w+10, j*w+10, 80, 80); break;
          case 64:  image(Im64, i*w+5,  j*w+15, 90, 70); break;
          case 128: image(Im128,i*w+10, j*w+10, 80, 80); break;
          case 256: image(Im256,i*w+15, j*w+4,  70, 90); break;
          case 512: image(Im512, i*w+10, j*w+10, 80, 80); break;
          case 1024:image(Im1024,i*w+10, j*w+10, 80, 80); break;
          case 2048:image(Im2048,i*w+10, j*w+10, 80, 80); break;
        }
        textAlign(CENTER, CENTER);
        let fs = map(log(val), 0, log(2048), 32, 8);
        textSize(fs);
        fill(0);
        noStroke();
        text(val, i * w + 80, j * w + 85);
      }
    }
  }
  push();
  fill(0);
  text("Score:", 320, 450);
  text(score, 420, 450);
  pop();
}

function keyPressed() {
  if (!canMove) return;
  canMove = false;

  let flipped = false;
  let rotated = false;
  let played = true;

  if (keyCode === DOWN_ARROW) {
    // no transform needed
  } else if (keyCode === UP_ARROW) {
    flipGrid(grid);
    flipped = true;
  } else if (keyCode === RIGHT_ARROW) {
    grid = rotateGrid(grid);
    rotated = true;
  } else if (keyCode === LEFT_ARROW) {
    grid = rotateGrid(grid);
    grid = flipGrid(grid);
    rotated = true;
    flipped = true;
  } else {
    played = false;
  }

  if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = compare(past, grid);

    if (flipped) grid = flipGrid(grid);
    if (rotated) {
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }

    if (changed) addNumber();
  }

  // Re-enable movement after a short delay
  setTimeout(() => { canMove = true; }, 200);
}

function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) return true;
    }
  }
  return false;
}

function copyGrid(grid) {
  let extra = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }
  return extra;
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) grid[i].reverse();
  return grid;
}

function rotateGrid(grid) {
  let newGrid = blankGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  return newGrid;
}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function combine(row) {
  for (let i = 3; i >= 1; i--) {
    if (row[i] === row[i - 1]) {
      row[i] += row[i - 1];
      row[i - 1] = 0;
      score += row[i];
    }
  }
  return row;
}

function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  return zeros.concat(arr);
}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false;
      if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
      if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
    }
  }
  return true;
}
