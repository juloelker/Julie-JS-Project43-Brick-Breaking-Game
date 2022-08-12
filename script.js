const rulesBtn = document.getElementById('rules-btn'),
  closeBtn = document.getElementById('close-btn'),
  rules = document.getElementById('rules'),
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');

let score = 0;

//bricks
const brickRowCount = 5,
  brickColumnCount = 9;

//Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

//Create ball properties, pixels
//x and y set up an axis in the middle of the canvas
//size is the radius of the ball in pixels
//speed not sure
//dx moves it 4 px to the right every time we redraw the canvas
//dy moves it 4 px up

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 1,
  dx: 4,
  dy: -4,
};

//Create paddle properties
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

//Create brick properties, all bricks
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

//Create the bricks, array of rows with columns of bricks
const bricks = [];
// loop through the columns
for (let col = 0; col < brickColumnCount; col++) {
  // create an array for each column and append it to the bricks array
  bricks[col] = [];
  // loop through all the rows inside the current column and break the loop after all rows are done and go back to the upper loop, which is the second column of bricks.
  for (let row = 0; row < brickRowCount; row++) {
    // configure the brick's coordinates
    const x = col * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = row * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    // Create row arrays inside each column array. Each row array represets a brick with the assigned properties below. Each column array represents a column of bricks.
    bricks[col][row] = { x, y, ...brickInfo };
  }
}

//Draw paddle on the canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

//Use paths to draw the ball on the canvas using the properties of const ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

//Draw the score on the canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//Draw bricks on the canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

//move paddle on canvas, context is start at center, right is positive movement, left is negative movement
function movePaddle() {
  paddle.x += paddle.dx;

  //wall detection
  //right: if it goes beyond the right edge (x property plus paddle width), we reset x position to be canvas width less paddle width
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  //left: if it goes beyone the left edge, 0, we reset its x position to be the left edge
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //ball/wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; //ball.dx = ball.dx * -1, flip to negative
  }

  //ball/wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //ball/paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //ball/brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && //left brick side check)
          ball.x + ball.size < brick.x + brick.w && //right brick side check
          ball.y + ball.size > brick.y && //bottom brick side check
          ball.y - ball.size < brick.y + brick.h //top brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  //Hit the bottom wall: Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

//Increase the score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

//Make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

//Draw everything
function draw() {
  //clear the canvas every time we draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

//Set up canvas and drawing as an animation
function update() {
  movePaddle();
  moveBall();

  //draw everything
  draw();

  requestAnimationFrame(update);
}

update();

//Keydown
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

//KeyUp
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

//Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//Design plan
//1. create canvas context x
//2. create and draw the ball x
//3. create and draw the paddle x
//4. create bricks, array of an array (rows of columns of bricks) x
//5. draw the score x
//6. add update() function to animate, requestAnimationFrame(cb) x
//7. move paddle x
//8. keyboard event handlers to move the paddle x
//9. move the ball x
//10. add wall boundaries x
//11. increase the score when bricks break
//12. lose: redraw bricks, reset the score
