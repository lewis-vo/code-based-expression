let font;

let plusSymbols = [];
let dataSymbols = [];
let moonImage;
let logoImage;
let glitchPersistance = 0;

function preload() {
  font = loadFont('./assets/InterVariable.ttf');
  moonImage = loadImage('./assets/moon.png');
  logoImage = loadImage('./assets/logo.png');
}

function setup() {
  createCanvas(1280, 720);
  frameRate(60);
  textFont(font);
  imageMode(CENTER);
  angleMode(DEGREES);

  moonImage.resize(480, 480);
  noStroke();
}

function EFFECT_filmGrain(amountPerFrame) {
  for (let i = 0; i < amountPerFrame; i++) {
    let x = random(windowWidth);
    let y = random(windowHeight);
    let size = random(1.0, 2.8); // Adjust circle size for grain intensity
    let opacity = random(120, 200); // Adjust circle opacity for grain density

    // Decides if grain is black or white
    // Weighted randomization
    fill(random([0, 0, 255]), opacity);
    ellipse(x, y, size, size);
  }
}
function EFFECT_dustScratches(amountPerFrame) {
  if (frameCount % int(random(10,50)) === 0) {
    for (let i = 0; i < amountPerFrame; i++) {
      let x = random(windowWidth);
      let y = random(windowHeight);
      let length = random(50, 130); // Adjust line length for scratch intensity
      let rotation = random(0, 360); // Random rotation for the scratch
      let opacity = random(68, 180); // Adjust line opacity for scratch density

      stroke(255, opacity);
      strokeWeight(1.5);
      push();
      translate(x, y);
      rotate(rotation);
      line(0, 0, length, 0);
      pop();
    }
  }
}
function EFFECT_scanLines() {
  let noiseValue = noise(frameCount * 0.01);
  let scanlineSpacing = map(noiseValue, 0, 1, 1.1, 5.2);
  for (let y = 0; y < height; y += scanlineSpacing) {
    stroke(0, 127);
    strokeWeight(0.72);
    line(0, y, width, y);
  }
}

function updatePlusSymbols(frameRate, amount) {
  if (frameCount % frameRate === 0) {
    plusSymbols = [];

    for (let i = 0; i < amount; i++) {
      plusSymbols.push({
        x: random(width),
        y: random(height)
      });
    }
  }
}
function drawPlusSymbols(size) {
  for (let i = 0; i < plusSymbols.length; i++) {
    const symbol = plusSymbols[i];
    strokeWeight(1);
    stroke(190);
    line(symbol.x - size, symbol.y, symbol.x + size, symbol.y);
    line(symbol.x, symbol.y - size, symbol.x, symbol.y + size);
  }
}

function updateDataSymbols(frameRate, amount) {
  if (frameCount % frameRate === 0) {
    dataSymbols = [];

    for (let i = 0; i < amount; i++) {
      dataSymbols.push({
        x: random(width),
        y: random(height),
        label: int(random(14,40)),
      });
    }
  }
}
function drawDataSymbols() {
  for (let i = 0; i < dataSymbols.length; i++) {
    const symbol = dataSymbols[i];
    noStroke();
    fill(12);
    ellipse(symbol.x, symbol.y, 24, 24);

    fill(127);
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(int(random(14,40)), symbol.x, symbol.y);
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    fill(c);
    rect(x, i+height-h, w, 1);
  }
}


function draw() {
  background(0);

  push();
    setGradient(0, 0, width, 190, color(0, 0, 0), color(64, 64, 64));
  pop();

  push();
    // Draw the arc
    let oscillationAmount = sin(frameCount*0.9) * 50 + 25;
    let oscillationAmount2 = sin(frameCount*0.85) * 50 + 25;
    let oscillationAmount3 = sin(frameCount*0.8) * 50 + 25;

    noFill();
    stroke(255, 125);
    strokeWeight(0.9);
    arc(width / 2, height / 2, 760 + oscillationAmount, 760 + oscillationAmount, -40, 40);
    arc(width / 2, height / 2, 760 + oscillationAmount, 760 + oscillationAmount, -40+180, 40+180);

    arc(width / 2, height / 2, 840 + oscillationAmount2, 840 + oscillationAmount2, -28, 28);
    arc(width / 2, height / 2, 840 + oscillationAmount2, 840 + oscillationAmount2, -28+180, 28+180);

    arc(width / 2, height / 2, 890 + oscillationAmount3, 890 + oscillationAmount3, -20, 20);
    arc(width / 2, height / 2, 890 + oscillationAmount3, 890 + oscillationAmount3, -20+180, 20+180);
  pop();

  push();
  translate(width / 2, height / 2);
  rotate(frameCount / 30);
  image(moonImage, 0, 0);
  blendMode(ADD); 
  if (frameCount % int(random(45,70)) === 0) {
    image(moonImage, random(-10,10), random(-10,10));
  }
  pop();

  push();
  blendMode(DIFFERENCE); 
  image(logoImage, width / 2, height / 2 - 20);
  pop();

  push();
  blendMode(ADD); 
  updatePlusSymbols(int(random(7,11)), random(6,9));
  drawPlusSymbols(8);
  pop();

  push();
  updateDataSymbols(int(random(12,17)), random(3,7));
  drawDataSymbols();
  pop();

  push();
  EFFECT_dustScratches(random(5,9));
  pop();

  push();
  EFFECT_filmGrain(random(220,380));
  pop();
  EFFECT_scanLines();
}
