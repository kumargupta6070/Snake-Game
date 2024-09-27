const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set initial variables for grid size and scale
let gridSize = 20; // This grid size will dynamically change based on screen size
let canvasSize, score = 0, snake, direction, food, growSnake;

// Function to dynamically resize the canvas based on the screen size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasSize = Math.min(canvas.width, canvas.height);
    gridSize = Math.floor(canvasSize / 30); // Adjust grid size dynamically
    resetGame();
}

// Function to reset the game when it starts or restarts
function resetGame() {
    score = 0;
    snake = [{ x: Math.floor(canvas.width / 2 / gridSize) * gridSize, y: Math.floor(canvas.height / 2 / gridSize) * gridSize }];
    direction = { x: 0, y: 0 };
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
    growSnake = false;
}

// Function to update the snake's position
function updateSnake() {
    const head = {
        x: snake[0].x + direction.x * gridSize,
        y: snake[0].y + direction.y * gridSize
    };

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        growSnake = true;
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
        score++;
    }

    // Move the snake
    snake.unshift(head);
    if (!growSnake) {
        snake.pop();
    } else {
        growSnake = false;
    }
}

// Function to draw the snake
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Function to draw the food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to update the score
function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Game loop to update and render the game
function gameLoop() {
    updateSnake();
    checkCollision();
    clearCanvas();
    drawSnake();
    drawFood();
    updateScore();
    setTimeout(gameLoop, 150); // Control game speed
}

// Function to check for collisions with walls or the snake itself
function checkCollision() {
    const head = snake[0];

    // Check if the snake hits the walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        resetGame(); // Reset game on collision
    }

    // Check if the snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// Handle keypresses to change the snake's direction
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
});

// Handle touch events for mobile users (for swiping)
let touchStartX = 0, touchStartY = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Left or right swipe
        if (dx > 0 && direction.x === 0) direction = { x: 1, y: 0 }; // Right
        else if (dx < 0 && direction.x === 0) direction = { x: -1, y: 0 }; // Left
    } else {
        // Up or down swipe
        if (dy > 0 && direction.y === 0) direction = { x: 0, y: 1 }; // Down
        else if (dy < 0 && direction.y === 0) direction = { x: 0, y: -1 }; // Up
    }
});

// Resize canvas when window resizes
window.addEventListener('resize', resizeCanvas);

// Initialize game and start the game loop
resizeCanvas();
gameLoop();
