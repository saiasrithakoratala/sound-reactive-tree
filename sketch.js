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
    textSize(22);
    textAlign(CENTER);
    text("Click Start Microphone to begin", width / 2, height / 2);
    return;
  }

  let level = mic.getLevel();
  smoothedLevel = lerp(smoothedLevel, level, 0.2);

  let amplified = smoothedLevel * 80;

  if (amplified > growthLevel) {
    growthLevel = amplified;
  }

  growthLevel *= 0.985;
  growthLevel = constrain(growthLevel, 0, 1);

  let depth = floor(map(growthLevel, 0, 1, 4, 11));
  let baseLength = map(growthLevel, 0, 1, 80, 190);
  let angle = map(growthLevel, 0, 1, PI / 8, PI / 3);

  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("Sound Level: " + nf(level, 1, 4), 20, 30);
  text("Growth Level: " + nf(growthLevel, 1, 2), 20, 55);

  stroke(255);
  strokeWeight(2);
  translate(width / 2, height);
  drawBranch(baseLength, depth, angle);
}

function drawBranch(len, depth, angle) {
  line(0, 0, 0, -len);
  translate(0, -len);

  if (depth > 0) {
    push();
    rotate(angle);
    drawBranch(len * 0.68, depth - 1, angle);
    pop();

    push();
    rotate(-angle);
    drawBranch(len * 0.68, depth - 1, angle);
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

function startMic() {
  userStartAudio();
  mic.start(function () {
    started = true;
  });
}

function resetTree() {
  growthLevel = 0;
  smoothedLevel = 0;
}
