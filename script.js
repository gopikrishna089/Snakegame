const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const boxSize = 30;
const canvasSize = 600;
const rows = canvasSize / boxSize;
const columns = canvasSize / boxSize;

let snake = [{x: 9 * boxSize, y: 9 * boxSize}];
let direction = {x: 0, y: 0};
let food = {x: Math.floor(Math.random() * columns) * boxSize, y: Math.floor(Math.random() * rows) * boxSize};
let score = 0;
let gameInterval;
let snakeColors = ['#39FF14', '#FFD700', '#FF4500', '#00FFFF', '#FF00FF']; // Array of snake colors
let currentColorIndex = 0;

function drawGrid() {
  ctx.strokeStyle = '#444'; // Grid line color
  for (let x = 0; x <= canvasSize; x += boxSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasSize);
  }
  for (let y = 0; y <= canvasSize; y += boxSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvasSize, y);
  }
  ctx.stroke();
}

function drawSnake() {
  ctx.fillStyle = snakeColors[currentColorIndex]; // Change snake color
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, boxSize, boxSize);
  });
}

function drawFood() {
  ctx.fillStyle = '#FF5733'; // Bright red color for food
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

function moveSnake() {
  const newHead = {x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize};

  // Check if the snake eats the food
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
    food = {x: Math.floor(Math.random() * columns) * boxSize, y: Math.floor(Math.random() * rows) * boxSize};
    
    // Change snake color when it eats food
    currentColorIndex = (currentColorIndex + 1) % snakeColors.length;
  } else {
    snake.pop(); // Remove the last part of the snake if no food is eaten
  }

  // Check for border collision
  if (newHead.x < 0 || newHead.x + boxSize > canvasSize || newHead.y < 0 || newHead.y + boxSize > canvasSize) {
    clearInterval(gameInterval);
    alert('Game Over! Final Score: ' + score);
    document.location.reload();
  }

  // Check for collision with itself
  if (collision(newHead)) {
    clearInterval(gameInterval);
    alert('Game Over! Final Score: ' + score);
    document.location.reload();
  }

  snake.unshift(newHead); // Add new head to the front of the snake
}

function collision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

function updateGame() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  drawGrid(); // Draw grid
  drawSnake(); // Draw the snake
  drawFood(); // Draw the food
  moveSnake(); // Move the snake
}

// Control the snake with arrow keys
document.addEventListener('keydown', event => {
  const key = event.key;

  if (key === 'ArrowUp' && direction.y === 0) {
    direction = {x: 0, y: -1};
  } else if (key === 'ArrowDown' && direction.y === 0) {
    direction = {x: 0, y: 1};
  } else if (key === 'ArrowLeft' && direction.x === 0) {
    direction = {x: -1, y: 0};
  } else if (key === 'ArrowRight' && direction.x === 0) {
    direction = {x: 1, y: 0};
  }
});

// Start the game loop
gameInterval = setInterval(updateGame, 100);
