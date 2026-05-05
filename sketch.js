let mic;
let smoothedLevel = 0;
let growthLevel = 0;
let started = false;
let micStarted = false;

function setup() {
  let canvas = createCanvas(900, 600);
  canvas.parent("canvas-container");
  angleMode(RADIANS);

  mic = new p5.AudioIn();
}

function draw() {
  backgroundGradient();

  if (!started) {
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(24);
    text("Click Start Microphone to begin", width / 2, height / 2);
    return;
  }

  let level = mic.getLevel();

  smoothedLevel = lerp(smoothedLevel, level, 0.35);

  let amplified = smoothedLevel * 700;

  if (amplified > growthLevel) {
    growthLevel = amplified;
  }

  growthLevel *= 0.985;
  growthLevel = constrain(growthLevel, 0, 1);

  let depth = floor(map(growthLevel, 0, 1, 4, 13));
  let baseLength = map(growthLevel, 0, 1, 80, 190);
  let branchAngle = map(growthLevel, 0, 1, PI / 10, PI / 3);

  showSoundInfo(level);

  push();
  translate(width / 2, height);
  stroke(255);
  strokeWeight(2);
  drawBranch(baseLength, depth, branchAngle);
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
    fill(120, 255, 160);
    noStroke();
    ellipse(0, 0, 6, 6);
    stroke(255);
  }
}

function showSoundInfo(level) {
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(16);

  text("Mic Status: " + (micStarted ? "ON" : "OFF"), 20, 30);
  text("Sound Level: " + nf(level, 1, 5), 20, 55);
  text("Growth Level: " + nf(growthLevel, 1, 2), 20, 80);

  let barWidth = map(growthLevel, 0, 1, 0, 250);
  fill(255);
  rect(20, 100, 250, 12);
  fill(100, 255, 150);
  rect(20, 100, barWidth, 12);
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

  mic.start(
    function () {
      started = true;
      micStarted = true;
      console.log("Microphone started successfully");
    },
    function () {
      started = true;
      micStarted = false;
      console.log("Microphone failed. Check browser permission.");
    }
  );
}

function resetTree() {
  growthLevel = 0;
  smoothedLevel = 0;
}
