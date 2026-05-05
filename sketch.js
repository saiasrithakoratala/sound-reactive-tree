let mic;
let smoothedLevel = 0;
let growthLevel = 0;
let started = false;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("canvas-container");
  angleMode(RADIANS);

  mic = new p5.AudioIn();
}

function draw() {
  backgroundGradient();

  if (!started) {
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Click 'Start Microphone' to begin", width / 2, height / 2);
    return;
  }

  let level = mic.getLevel();

  // Smooth sound
  smoothedLevel = lerp(smoothedLevel, level, 0.1);

  let amplified = smoothedLevel * 10;

  // Grow quickly
  if (amplified > growthLevel) {
    growthLevel = amplified;
  }

  // Slow decay
  growthLevel *= 0.97;
  growthLevel = constrain(growthLevel, 0, 1);

  // Tree parameters
  let depth = floor(map(growthLevel, 0, 1, 3, 9));
  let baseLength = map(growthLevel, 0, 1, 60, 150);
  let angle = map(growthLevel, 0, 1, PI / 10, PI / 4);

  stroke(255);
  translate(width / 2, height);

  drawBranch(baseLength, depth, angle);
}

function drawBranch(len, depth, angle) {
  line(0, 0, 0, -len);
  translate(0, -len);

  if (depth > 0) {
    push();
    rotate(angle);
    drawBranch(len * 0.7, depth - 1, angle);
    pop();

    push();
    rotate(-angle);
    drawBranch(len * 0.7, depth - 1, angle);
    pop();
  }
}

function backgroundGradient() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color("#0f2027"), color("#2c5364"), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

// BUTTON FUNCTIONS
function startMic() {
  userStartAudio();
  mic.start();
  started = true;
}

function resetTree() {
  growthLevel = 0;
}