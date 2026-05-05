let mic;
let smoothedLevel = 0;
let growthLevel = 0;
let targetGrowth = 0;
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
    smoothedLevel = lerp(smoothedLevel, level, 0.12);

    // Ignore background noise
    if (smoothedLevel < 0.012) {
      targetGrowth = 0;
    } else {
      targetGrowth = map(smoothedLevel, 0.012, 0.05, 0, 1);
    }

    targetGrowth = constrain(targetGrowth, 0, 1);
  }

  // Smooth growth and smooth faster decay
  if (targetGrowth > growthLevel) {
    growthLevel = lerp(growthLevel, targetGrowth, 0.10);
  } else {
    growthLevel = lerp(growthLevel, targetGrowth, 0.08);
  }

  growthLevel = constrain(growthLevel, 0, 1);

  let depth = floor(map(growthLevel, 0, 1, 4, 7));
  let baseLength = map(growthLevel, 0, 1, 50, 135);
  let branchAngle = map(growthLevel, 0, 1, PI / 12, PI / 3);

  drawGround();

  push();
  translate(width / 2, height - 100);
  branch(baseLength, depth, branchAngle, growthLevel);
  pop();

  drawInfo(level, growthLevel, depth);

  if (!started && growthLevel < 0.02) {
    showStartScreen();
  }
}

function startMic() {
  userStartAudio();
  getAudioContext().resume();

  mic.start(
    function () {
      started = true;
      statusMessage = "Microphone ON - speak or clap";
    },
    function () {
      started = false;
      statusMessage = "Microphone failed - check permission";
    }
  );
}

function testGrowth() {
  started = true;
  targetGrowth = 1;
  statusMessage = "Test Growth";
}

function resetTree() {
  growthLevel = 0;
  targetGrowth = 0;
  smoothedLevel = 0;
  started = false;
  statusMessage = "Click Start Microphone";
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
  text("Click Start Microphone to use sound", width / 2, 340);
  text("Click Test Growth to preview animation", width / 2, 380);

  textAlign(LEFT);
}

function branch(len, depth, angle, leafAmount) {
  if (!(growthLevel > 0.6 && len < 20)) {
  strokeWeight(map(len, 4, 135, 0.7, 9));
  stroke(75, 45, 20, 180);
  line(0, 0, 0, -len);
}

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
}

function drawLeavesAndFruits(leafAmount) {
  if (leafAmount < 0.3) return;

  noStroke();

  let leafSize = map(leafAmount, 0.3, 1, 8, 14);

  // leaves
  fill(60, 180, 80, 230);
  ellipse(0, 0, leafSize, leafSize * 0.75);

  if (leafAmount > 0.5) {
    ellipse(-5, -3, leafSize * 0.9, leafSize * 0.65);
    ellipse(5, -3, leafSize * 0.9, leafSize * 0.65);
  }

  if (leafAmount > 0.75) {
    ellipse(-3, 4, leafSize * 0.8, leafSize * 0.6);
    ellipse(3, 4, leafSize * 0.8, leafSize * 0.6);
  }

  // clear fruits with outline
  if (leafAmount > 0.65 && random(1) < 0.02) {
    stroke(120, 20, 20);
    strokeWeight(1);
    fill(230, 40, 40);
    circle(0, -8, 6);
    noStroke();
  }

  if (leafAmount > 0.85 && random(1) < 0.015) {
    stroke(140, 80, 10);
    strokeWeight(1);
    fill(255, 170, 40);
    circle(-6, 1, 6);
    noStroke();
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
