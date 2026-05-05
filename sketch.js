let mic;
let growthLevel = 0;
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

  let amplified = map(level, 0.005, 0.04, 0, 1);
  amplified = constrain(amplified, 0, 1);

  if (amplified > growthLevel) {
    growthLevel = amplified;
  }

  growthLevel *= 0.97;
  growthLevel = constrain(growthLevel, 0, 1);

  let depth = floor(map(growthLevel, 0, 1, 4, 12));
  let baseLength = map(growthLevel, 0, 1, 80, 190);
  let angle = map(growthLevel, 0, 1, PI / 10, PI / 3);

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
    fill(100, 255, 150);
    noStroke();
    circle(0, 0, 6);
    stroke(255);
  }
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
}

function showInfo(level) {
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(16);

  text("Mic Status: " + (micStarted ? "ON" : "OFF"), 20, 30);
  text("Sound Level: " + level.toFixed(5), 20, 55);
  text("Growth Level: " + growthLevel.toFixed(2), 20, 80);

  fill(255);
  rect(20, 105, 250, 14);

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

function testGrowth() {
  growthLevel = 1;
}
