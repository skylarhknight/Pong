const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Paddle objects
const player = {
    x: PLAYER_X,
    y: (canvas.height - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#fff'
};

const ai = {
    x: AI_X,
    y: (canvas.height - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#fff'
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: BALL_RADIUS,
    speed: BALL_SPEED,
    velX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    velY: BALL_SPEED * (Math.random() * 2 - 1),
    color: '#fff'
};

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([6, 12]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Main draw
function render() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Game logic
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.velY = BALL_SPEED * (Math.random() * 2 - 1);
}

function update() {
    // Move the ball
    ball.x += ball.velX;
    ball.y += ball.velY;

    // Ball collision with top and bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velY = -ball.velY;
    }

    // Ball collision with player paddle
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.velX = -ball.velX;
        // add a bit of randomness
        ball.velY += (Math.random() - 0.5) * 2;
        ball.x = player.x + player.width + ball.radius; // Prevent sticky ball
    }

    // Ball collision with ai paddle
    if (
        ball.x + ball.radius > ai.x &&
        ball.y > ai.y &&
        ball.y < ai.y + ai.height
    ) {
        ball.velX = -ball.velX;
        ball.velY += (Math.random() - 0.5) * 2;
        ball.x = ai.x - ball.radius; // Prevent sticky ball
    }

    // Score: ball if missed
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        resetBall();
    }

    // AI paddle movement (simple tracking)
    let aiCenter = ai.y + ai.height / 2;
    if (ball.y < aiCenter - 10) {
        ai.y -= PADDLE_SPEED;
    } else if (ball.y > aiCenter + 10) {
        ai.y += PADDLE_SPEED;
    }
    // Clamp AI paddle inside canvas
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp paddle inside canvas
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
