let mic;
let smoothedLevel = 0;
let growthLevel = 0;
let started = false;
let statusMessage = "Click Start Microphone";

function setup() {
  let canvas = createCanvas(900, 700);
  canvas.parent("canvas-container");
  angleMode(RADIANS);
  textFont("Arial");

  mic = new p5.AudioIn();

  document.getElementById("startBtn").addEventListener("click", startMic);
  document.getElementById("testBtn").addEventListener("click", testGrowth);
  document.getElementById("resetBtn").addEventListener("click", resetTree);
}

function draw() {
  backgroundGradient();

  let level = 0;

  if (started) {
    level = mic.getLevel();
  }

  smoothedLevel = lerp(smoothedLevel, level, 0.12);

  let amplifiedSound = map(smoothedLevel, 0.012, 0.06, 0, 1);
  amplifiedSound = constrain(amplifiedSound, 0, 1);

  if (amplifiedSound > growthLevel) {
    growthLevel = lerp(growthLevel, amplifiedSound, 0.18);
  } else {
    growthLevel = lerp(growthLevel, amplifiedSound, 0.035);
  }

  growthLevel = constrain(growthLevel, 0, 1);

  let depth = floor(map(growthLevel, 0, 1, 4, 11));
  let baseLength = map(growthLevel, 0, 1, 50, 135);
  let branchAngle = map(growthLevel, 0, 1, PI / 12, PI / 3);

  drawGround();

  push();
  translate(width / 2, height - 100);
  branch(baseLength, depth, branchAngle, growthLevel);
  pop();

  drawInfo(level, growthLevel, depth);

  if (!started) {
    showStartScreen();
  }
}

function startMic() {
  userStartAudio();
  getAudioContext().resume();

  mic.start(
    function () {
      started = true;
      statusMessage = "Microphone ON";
    },
    function () {
      started = false;
      statusMessage = "Microphone blocked. Use Test Growth.";
    }
  );
}

function testGrowth() {
  started = true;
  growthLevel = 1;
  smoothedLevel = 0.06;
  statusMessage = "Test Growth ON";
}

function resetTree() {
  growthLevel = 0;
  smoothedLevel = 0;
  statusMessage = started ? "Microphone ON" : "Click Start Microphone";
}

function showStartScreen() {
  fill(255, 245);
  rect(170, 170, 560, 260, 25);

  fill(20);
  textAlign(CENTER);
  textSize(32);
  text("Sound Reactive Fractal Tree", width / 2, 240);

  textSize(18);
  text(statusMessage, width / 2, 300);
  text("Click Test Growth to check animation", width / 2, 340);
  text("Click Start Microphone to use sound", width / 2, 380);

  textAlign(LEFT);
}

function branch(len, depth, angle, leafAmount) {
  strokeWeight(map(len, 4, 135, 0.7, 9));
  stroke(95, 55, 25);
  line(0, 0, 0, -len);

  translate(0, -len);

  if (depth <= 0 || len < 7) {
    drawLeavesAndFruits(leafAmount);
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

  if (growthLevel > 0.35) {
    push();
    rotate(-angle * 0.35);
    branch(len * 0.58, depth - 1, angle * 0.85, leafAmount);
    pop();
  }

  if (growthLevel > 0.6) {
    push();
    rotate(angle * 0.35);
    branch(len * 0.56, depth - 1, angle * 0.8, leafAmount);
    pop();
  }

  if (growthLevel > 0.8) {
    push();
    rotate(0);
    branch(len * 0.52, depth - 1, angle * 0.7, leafAmount);
    pop();
  }
}

function drawLeavesAndFruits(leafAmount) {
  if (leafAmount < 0.2) return;

  noStroke();

  let leafSize = map(leafAmount, 0.2, 1, 7, 15);

  fill(55, 180, 75, 210);
  ellipse(-5, -3, leafSize, leafSize * 0.75);
  ellipse(5, -3, leafSize, leafSize * 0.75);
  ellipse(0, 3, leafSize, leafSize * 0.75);

  if (leafAmount > 0.55) {
    fill(230, 45, 45);
    circle(0, -7, 4);
  }

  if (leafAmount > 0.72) {
    fill(255, 160, 40);
    circle(-5, 2, 4);
  }

  if (leafAmount > 0.88) {
    fill(255, 220, 70);
    circle(5, 2, 4);
  }

  stroke(95, 55, 25);
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
  rect(20, 20, 390, 150, 15);

  fill(20);
  textSize(22);
  text("Sound Reactive Fractal Tree", 35, 55);

  textSize(15);
  text(statusMessage, 35, 82);
  text("Mic level: " + nf(rawLevel, 1, 4), 35, 108);
  text("Growth: " + nf(growthLevel, 1, 3), 35, 130);
  text("Depth: " + depth, 190, 130);

  fill(220);
  rect(35, 145, 300, 12, 6);

  fill(70, 180, 90);
  rect(35, 145, growthLevel * 300, 12, 6);
}
