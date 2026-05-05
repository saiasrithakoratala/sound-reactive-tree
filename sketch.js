let mic;
let smoothedLevel = 0;
let growthLevel = 0;
let started = false;

function setup() {
  createCanvas(900, 700);
  angleMode(RADIANS);
  textFont("Arial");

  mic = new p5.AudioIn();
}

function draw() {
  backgroundGradient();

  if (!started) {
    showInstructions();
    return;
  }

  let level = mic.getLevel();
  smoothedLevel = lerp(smoothedLevel, level, 0.12);

  let amplifiedSound = smoothedLevel * 8;

  if (amplifiedSound > growthLevel) {
    growthLevel = amplifiedSound;
  }

  growthLevel *= 0.97;
  growthLevel = constrain(growthLevel, 0, 1);

  let depth = floor(map(growthLevel, 0, 1, 3, 9));
  let baseLength = map(growthLevel, 0, 1, 60, 170);
  let branchAngle = map(growthLevel, 0, 1, PI / 10, PI / 4);
  let leafAmount = map(growthLevel, 0, 1, 0, 1);

  drawGround();

  push();
  translate(width / 2, height - 100);
  branch(baseLength, depth, branchAngle, leafAmount);
  pop();

  drawInfo(level, growthLevel, depth);
}

function showInstructions() {
  fill(255, 245);
  rect(170, 150, 560, 360, 25);

  fill(20);
  textAlign(CENTER);
  textSize(34);
  text("Sound Reactive Fractal Tree", width / 2, 215);

  textSize(18);
  text("Instructions", width / 2, 270);

  textSize(16);
  text("1. Click anywhere on the screen", width / 2, 315);
  text("2. Allow microphone access", width / 2, 350);
  text("3. Speak or clap near your laptop", width / 2, 385);
  text("4. Watch the tree grow with sound", width / 2, 420);

  fill(40, 120, 60);
  rect(350, 455, 200, 45, 15);

  fill(255);
  textSize(18);
  text("Click to Start", width / 2, 485);

  textAlign(LEFT);
}

function mousePressed() {
  if (!started) {
    userStartAudio();
    mic.start();
    started = true;
  }
}

function branch(len, depth, angle, leafAmount) {
  strokeWeight(map(len, 5, 170, 1, 16));
  stroke(100, 60, 25);
  line(0, 0, 0, -len);

  translate(0, -len);

  if (depth <= 0 || len < 10) {
    drawLeaves(leafAmount);
    return;
  }

  push();
  rotate(-angle);
  branch(len * 0.72, depth - 1, angle, leafAmount);
  pop();

  push();
  rotate(angle);
  branch(len * 0.72, depth - 1, angle, leafAmount);
  pop();

  if (growthLevel > 0.45) {
    push();
    rotate(0);
    branch(len * 0.58, depth - 1, angle, leafAmount);
    pop();
  }
}

function drawLeaves(leafAmount) {
  if (leafAmount < 0.2) return;

  noStroke();

  let leafSize = map(leafAmount, 0.2, 1, 6, 18);

  fill(60, 180, 80, 220);
  ellipse(-8, -4, leafSize, leafSize);
  ellipse(8, -4, leafSize, leafSize);
  ellipse(0, 0, leafSize, leafSize);
  ellipse(-5, 7, leafSize, leafSize);
  ellipse(6, 6, leafSize, leafSize);

  if (leafAmount > 0.7) {
    fill(255, 120, 180);
    ellipse(0, -8, 6, 6);
    ellipse(-5, -4, 6, 6);
    ellipse(5, -4, 6, 6);

    fill(255, 220, 80);
    ellipse(0, -5, 4, 4);
  }
}

function drawGround() {
  noStroke();
  fill(35, 100, 35);
  rect(0, height - 100, width, 100);

  fill(25, 80, 25);
  rect(0, height - 70, width, 70);
}

function backgroundGradient() {
  let topColor = color(70, 110, 170);
  let bottomColor = color(180, 220, 255);

  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawInfo(rawLevel, growthLevel, depth) {
  noStroke();
  fill(255, 240);
  rect(20, 20, 360, 140, 15);

  fill(20);
  textSize(22);
  text("Sound Reactive Fractal Tree", 35, 55);

  textSize(15);
  text("Speak loudly or clap to grow the tree", 35, 82);
  text("Mic level: " + nf(rawLevel, 1, 4), 35, 108);
  text("Growth: " + nf(growthLevel, 1, 3), 35, 130);
  text("Depth: " + depth, 180, 130);

  fill(220);
  rect(35, 140, 300, 12, 6);

  fill(70, 180, 90);
  rect(35, 140, growthLevel * 300, 12, 6);
}
