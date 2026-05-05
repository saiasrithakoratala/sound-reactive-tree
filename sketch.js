let mic;
let growthLevel = 0;
let targetGrowth = 0;
let micStarted = false;

function setup() {
  let canvas = createCanvas(900, 600);
  canvas.parent("canvas-container");
  angleMode(RADIANS);
  mic = new p5.AudioIn();
}

function draw() {
  backgroundGradient();

  let level = 0;

  if (micStarted) {
    level = mic.getLevel();
  }

  targetGrowth = map(level, 0.012, 0.06, 0, 1);
  targetGrowth = constrain(targetGrowth, 0, 1);

  if (targetGrowth > growthLevel) {
    growthLevel = lerp(growthLevel, targetGrowth, 0.18);
  } else {
    growthLevel = lerp(growthLevel, targetGrowth, 0.03);
  }

  let depth = floor(map(growthLevel, 0, 1, 3, 12));
  let baseLength = map(growthLevel, 0, 1, 70, 190);
  let angle = map(growthLevel, 0, 1, PI / 12, PI / 3);

  showInfo(level);

  push();
  translate(width / 2, height);
  stroke(255);
  strokeWeight(2);
  drawBranch(baseLength, depth, angle);
  pop();
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
  } else {
    drawLeafAndFruit();
  }
}

function drawLeafAndFruit() {
  noStroke();

  // Leaves
  fill(90, 255, 130);
  ellipse(0, 0, 10, 7);

  // Fruits appear earlier and bigger
  if (growthLevel > 0.25) {
    fill(255, 70, 70);
    circle(5, -4, 9);
  }

  if (growthLevel > 0.45) {
    fill(255, 190, 50);
    circle(-5, 4, 9);
  }

  if (growthLevel > 0.65) {
    fill(255, 120, 30);
    circle(0, 7, 10);
  }

  stroke(255);
}

function startMic() {
  userStartAudio();
  getAudioContext().resume();

  mic.start(function () {
    micStarted = true;
  });
}

function resetTree() {
  growthLevel = 0;
  targetGrowth = 0;
}

function testGrowth() {
  growthLevel = 1;
  targetGrowth = 1;
}

function showInfo(level) {
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(16);

  text("Mic Status: " + (micStarted ? "ON" : "OFF"), 20, 30);
  text("Sound Level: " + level.toFixed(5), 20, 55);
  text("Growth Level: " + growthLevel.toFixed(2), 20, 80);

  noFill();
  stroke(255);
  rect(20, 105, 250, 14);

  noStroke();
  fill(100, 255, 150);
  rect(20, 105, growthLevel * 250, 14);
}

function backgroundGradient() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color("#0f2027"), color("#2c5364"), inter);
    stroke(c);
    line(0, i, width, i);
  }
}
