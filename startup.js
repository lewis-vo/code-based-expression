// ****************************
// ***** DIAGLOGUE SYSTEM *****
// ****************************

const dialogue = [
  ["Hello...",
    "Can you hear me?",
    "You are so small...\nJust a tiny seed in the vast field of life.",
    "Let me help you."
  ],
  ["You grew and changed,",
    "like a tree reaching for the sky.",
    "In the darkness of your chrysalis,\nyou underwent a metamorphosis.",
    "Slowly...",
    "slowly...",
    "slowly...",
    "and slowly.",
  ],
  ["Emerging from the chrysalis,\nthe wings on your back burst forth like a supernova.",
    "An explosion.",
    "A beat.",
    "A blip in time.",
    "A failure...",
    "you are anything but."],
  [""]
];

let beepOsc;
let currentScreen = 2;
let currentDialogueIndex=0;
let dialogueDisplayString="";

// ****************************
// ******* INPUT EVENTS *******
// ****************************
function keyPressed() {
  if (keyCode === 32 && currentScreen<0) {
    currentScreen = 0;
    currentDialogueIndex=0;
    dialogueDisplayString="";

    childScale=0;
    feedParticles=[];
  }
  if (key === 'h' && currentScreen>=0) {
    currentScreen = -1;
    currentDialogueIndex=0;
    dialogueDisplayString="";
  }

  if (key === '1') {
    currentScreen=0;
    currentDialogueIndex=0;
    dialogueDisplayString="";

    childScale=0;
    feedParticles=[];
  }
  if (key === '2') {
    currentScreen=1;
    currentDialogueIndex=0;
    dialogueDisplayString="";
  }
  if (key === '3') {
    currentScreen=2;
    currentDialogueIndex=0;
    dialogueDisplayString="";
  }

  if (currentScreen>=0) {
    if (key === 'd') {
      if (dialogueDisplayString.length < dialogue[currentScreen][currentDialogueIndex].length) {
        //return;
      }
      if (currentDialogueIndex === dialogue[currentScreen].length-1) {
        return;
      }
      currentDialogueIndex++;
      //if (currentDialogueIndex > dialogue[currentScreen].length-1) currentDialogueIndex=0;
      dialogueDisplayString="";
    }
    if (key === 'a') {
      currentDialogueIndex--;
      if (currentDialogueIndex<0) {
        currentDialogueIndex=0;
        return;
      }
      dialogueDisplayString="";
    }
  }
}

function mousePressed() {
  if (currentScreen===0) {
    if (currentDialogueIndex===3 && childScale<=0.44) {
      feedParticles.push({
        x: mouseX,
        y: mouseY
      });
      console.log(feedParticles.length, childScale);
    }
  }
}

// ****************************
// ********** CONFIG **********
// ****************************

const textSizeSystem = {
  glitchUI: 14,
  glitchNum: 10,
  dialogue: 16,
  h1: 28,
  h2: 20
};

// ****************************
// ******** DATA INIT  ********
// ****************************
let cursorEasing = 0.18;
let cursorX = 0;
let cursorY = 0;

// Overlay effects
let plusSymbols = [];
let dataSymbols = [];

// Screen -1 (Home)
let moonImage;
let logoImage;
let cursorImage;

// Screen 0
let pulse1Image, pulse2Image, pulse4Image, pulse5Image;
let pulsar = [];
let feedEasing = 0.065;
let feedParticles = [];

// Screen 1
let chrys1Image, chrys2Image;


// ****************************
// ********** SET UP **********
// ****************************
function preload() {
  moonImage = loadImage('./assets/moon.png');
  logoImage = loadImage('./assets/logo.png');
  cursorImage = loadImage('./assets/cursor.png');

  pulse1Image = loadImage('./assets/pulse1.png');
  pulse2Image = loadImage('./assets/pulse2.png');
  pulse4Image = loadImage('./assets/pulse4.png');
  pulse5Image = loadImage('./assets/pulse5.png');


  chrys1Image = loadImage('./assets/chrys1.png');
  chrys2Image = loadImage('./assets/chrys2.png');
}

function randomInfluenceRate() {
  return random(0.01, 0.03);
}

function setup() {
  createCanvas(1280, 720);
  frameRate(60);
  angleMode(DEGREES);
  noStroke();

  textFont("NotoSansMono");
  imageMode(CENTER);

  beepOsc = new p5.Oscillator(640, 'square');
  moonImage.resize(480, 480);

  cursorImage.resize(40, 40);

  pulse1Image.resize(2048, 2048);
  pulse2Image.resize(2048, 2048);
  pulse4Image.resize(2048, 2048);
  pulse5Image.resize(2048, 2048);

  influenceParticles = Array(250).fill(0).map(e => { return {x: random(width), y: random(height), rate: randomInfluenceRate() } })
  chrys1Image.resize(600, 600);
  chrys2Image.resize(600, 600);

  initPulsar();
}

function draw() {
  background(0);

  if (mouseIsPressed) {
  }

  push();
  if (currentScreen<0)SCREEN_homeScreen();
  pop();

  push();
    if (currentScreen==0) SCREEN_stateOne();
  pop();

  push();
    if (currentScreen==1) SCREEN_stateTwo();
  pop();

  push();
    if (currentScreen==2) SCREEN_stateThree();
  pop();

  // POST_PROCESSING STUFFS
  // THESE ARE SCREEN OVERLAYS
  // UI Labels overlay
  push();
    fill(255);
    textSize(textSizeSystem.glitchUI);
    textStyle(NORMAL);
    
    textAlign(LEFT, BOTTOM);
    text(`STAT   
DRIVE  L:\\CT_TEST\\
POS_X  ${random(["40", "41", "41", "41", "42"])}.${int(random(100, 300))}
POS_Y  ${random(["12", "13", "14", "14"])}.${int(random(120, 400))}`, width-250, height-50);

    textAlign(LEFT, TOP);
    text(`CHAOS_THEORY_TEST_SUBJECT.lwv`, 80, 60);

    text(`DISP GREYSCL   STARTUP FALSE`, 80, height-60);
  pop();

  push();
  // Draw "+"s
    blendMode(ADD); 
    updatePlusSymbols(int(random(6,12)), random(12,30));
    drawPlusSymbols(6);
  pop();

  push();
  // Random number circles
    updateDataSymbols(int(random(12,17)), random(3,8));
    drawDataSymbols();
  pop();

  // Dialogue Box
  push();
    stroke(255);
    fill(0);
    strokeWeight(0.4);

    if (currentScreen===0) {
      rect(width-80-70,100, 190, 120);
      rect(width-220-30,200, 90, 110);
    }

    if (currentScreen>=0) drawDialogBox();
  pop();

  // Stage Selector
  push();
    if (currentScreen>=0) {
      let stageBoxSize = [180, 340];
      let margin = 80;
      stroke(255);
      fill(0);
      strokeWeight(1);
    
      rect(margin, 240,...stageBoxSize);
    }
  pop();

  // Easing Cursor
  push();
    // But we want it to move TOWARDS the mouse
    let distX = mouseX - cursorX;
    // this increases every frame and eventually catches up
    cursorX += distX * cursorEasing;
  
    let distY = mouseY - cursorY;
    // this increases every frame and eventually catches up
    cursorY += distY * cursorEasing;

    image(cursorImage, cursorX, cursorY);
  pop();

  push();
  // Fake dust scratches
    EFFECT_dustScratches(random(5,9));
  pop();

  push();
  // Fake film grain
    EFFECT_filmGrain(random(170,270));
  pop();
    
  EFFECT_scanLines();

}

// ****************************
// ********* FEATURES *********
// ****************************
function SOUND_playDialogBeep(startFrame) {
  beepOsc.amp(0.07);
  beepOsc.freq(random((50-5)/2.2,(61-5)/2.2)*10);
  beepOsc.start();
  if (frameCount-startFrame>1) beepOsc.stop();
}

function EFFECT_filmGrain(amountPerFrame) {
  for (let i = 0; i < amountPerFrame; i++) {
    let x = random(windowWidth);
    let y = random(windowHeight);
    let size = random(1.6, 3); // Adjust circle size for grain intensity
    let opacity = random(105, 189); // Adjust circle opacity for grain density

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
  let scanlineSpacing = map(noiseValue, 0, 1, 1.1, 4.2);
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
      let x = random(width);
      let y = random(height);  

      for (let j = 0; j < plusSymbols.length; j++) {
        let distance = dist(x, y, plusSymbols[j].x, plusSymbols[j].y);
        let minDistance = 210;
        let clumpRadius = 45;
        if (distance < minDistance) {
          x = random(plusSymbols[j].x - clumpRadius, plusSymbols[j].x + clumpRadius);
          y = random(plusSymbols[j].y - clumpRadius, plusSymbols[j].y + clumpRadius);
          break;
        }
      }
      plusSymbols.push({
        x: x,
        y: y
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
    textSize(textSizeSystem.glitchNum);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text(int(random(14,40)), symbol.x, symbol.y);
  }
}
function blinkingString(text1, text2, durationInFrames) {
  return fract(frameCount/durationInFrames)>0.5?text1:text2;
}

function initPulsar() {
  for (let i = 0; i < 12; i++) {
    let angle = random(360); // Random angle for each line
    let length = random(220, 640); // Random length for each line
    let width = 0.5; // Random width for each line

    pulsar.push({
      width: width,
      angle: angle,
      rate: random(0.9,2.1),
      length: length,
    });
  }
}
function drawPulsar(x,y) {
  pulsar.forEach(p => {
    if (mouseX>width/2) growth = width/2 - mouseX+width/2;
    let newLength = p.length - sin(frameCount * p.rate) * p.length/10;  // Calculate the new end points based on the angle and length
    
    let endX = x + newLength * cos(p.angle);
    let endY = y + newLength * sin(p.angle);

    strokeWeight(p.width);
    stroke(255, 180);
    line(x, y, endX, endY);
  });
}
function drawDialogBox() {
  // DIALOG BOX
  let dialogBoxSize = [520, 95];
  let margin = 48;
  stroke(255);
  fill(0);
  strokeWeight(1);

  translate(width/2, height);
  rect(-dialogBoxSize[0]/2,-dialogBoxSize[1]-margin,...dialogBoxSize);
  rect(-dialogBoxSize[0]/2,-dialogBoxSize[1]-margin-28, 100, 28);


  fill(255);
  rect(-width/2,-26, width, 27);

  noStroke();
  fill(0);
  textStyle(NORMAL);
  textSize(12);
  text("Home [H]   Dialog [A][D]   MUSIC [M]", -width/2 + 80, -9);

  fill(255);
  textSize(textSizeSystem.glitchUI);
  text(`MIC. FEED`, -dialogBoxSize[0]/2+10,-dialogBoxSize[1]-margin-9);

  // SPECIAL: Screen 0
  push();
    textAlign(CENTER, CENTER);
    textSize(textSizeSystem.h2);
    if (currentDialogueIndex===3 && currentScreen===0)
      text(`${blinkingString(">","-", 60)} CLICK TO ADD INFLUENCE ${blinkingString("<","-", 60)}`, 0,-dialogBoxSize[1]-margin-48);
  pop();


  textSize(textSizeSystem.dialogue);
  translate(0, -dialogBoxSize[1]/2-margin);

  let referenceSoundFrame = 0;
  if (dialogueDisplayString.length<dialogue[currentScreen][currentDialogueIndex].length) {
    if (frameCount%2===0 && currentScreen>=0) {
      dialogueDisplayString += dialogue[currentScreen][currentDialogueIndex].charAt(dialogueDisplayString.length);
      referenceSoundFrame = frameCount;
      //beepOsc.start();
    }
  } else {
    beepOsc.stop();
  }

  SOUND_playDialogBeep(referenceSoundFrame);

  textAlign(CENTER, CENTER);
  text(`"${dialogueDisplayString}"`, 0, 0);

  push();
    translate(dialogBoxSize[0]/2-30, 0);
    rotate(90);

    let sideLength = 9;
    let centerX = 0;
    let centerY = 0;
    let angle = 60; // Angle between sides of an equilateral triangle

    let vertex1X = centerX;
    let vertex1Y = centerY - sideLength / 2;
    let vertex2X = centerX + sideLength * cos(angle);
    let vertex2Y = centerY + sideLength * sin(angle);
    let vertex3X = centerX + sideLength * cos(angle * 2);
    let vertex3Y = centerY + sideLength * sin(angle * 2);

    if (currentDialogueIndex<dialogue[currentScreen].length-1 && dialogueDisplayString.length===dialogue[currentScreen][currentDialogueIndex].length) triangle(vertex1X, vertex1Y, vertex2X, vertex2Y, vertex3X, vertex3Y);
  pop();
  push();
    translate(-(dialogBoxSize[0]/2-30), 0);
    rotate(-90);

    let sideLength1 = 9;
    let centerX1 = 0;
    let centerY1 = 0;
    let angle1 = 60; // Angle between sides of an equilateral triangle

    let vertex1X1 = centerX1;
    let vertex1Y1 = centerY1 - sideLength1 / 2;
    let vertex2X1 = centerX1 + sideLength1 * cos(angle1);
    let vertex2Y1 = centerY1 + sideLength1 * sin(angle1);
    let vertex3X1 = centerX1 + sideLength1 * cos(angle1 * 2);
    let vertex3Y1 = centerY1 + sideLength1 * sin(angle1 * 2);

    if (currentDialogueIndex>0 && dialogueDisplayString.length===dialogue[currentScreen][currentDialogueIndex].length) triangle(vertex1X1, vertex1Y1, vertex2X1, vertex2Y1, vertex3X1, vertex3Y1);
  pop();
}
// ****************************
// ****************************
// ****************************
// ****************************
// ****************************
// ****************************
// ****************************
// ****************************
// ********* SCREENS **********
// ****************************
// ****************************
// ****************************
// ****************************
// ****************************
function SCREEN_homeScreen() {
  beepOsc.stop();
  background(0);
  push();
  // Draw the arc
    let oscillationAmount = sin(frameCount*0.9) * 50 + 25;
    let oscillationAmount2 = sin(frameCount*0.85) * 50 + 25;
    let oscillationAmount3 = sin(frameCount*0.8) * 50 + 25;

    noFill();
    stroke(255, 125);
    strokeWeight(1.5);
    arc(width / 2, height / 2, 780 + oscillationAmount, 780 + oscillationAmount, -40, 40);
    arc(width / 2, height / 2, 780 + oscillationAmount, 780 + oscillationAmount, -40+180, 40+180);

    arc(width / 2, height / 2, 840 + oscillationAmount2, 840 + oscillationAmount2, -28, 28);
    arc(width / 2, height / 2, 840 + oscillationAmount2, 840 + oscillationAmount2, -28+180, 28+180);

    arc(width / 2, height / 2, 890 + oscillationAmount3, 890 + oscillationAmount3, -20, 20);
    arc(width / 2, height / 2, 890 + oscillationAmount3, 890 + oscillationAmount3, -20+180, 20+180);
  pop();

  push();
  // Draw the moon
    translate(width / 2, height / 2);
    rotate(frameCount / 30);
    image(moonImage, 0, 0);
    blendMode(ADD); 
    if (frameCount % int(random(45,70)) === 0) {
      image(moonImage, random(-10,10), random(-10,10));
    }
  pop();

  push();
  // Logo
    blendMode(DIFFERENCE); 
    image(logoImage, width / 2, height / 2 - 20);
  pop();

  push();
    let now = new Date();
    // Extract the date components
    let year = now.getFullYear();
    let month = now.toLocaleString('default', { month: 'short' }).toLocaleUpperCase();
    let day = now.getDate();
    // Create a formatted date string
    let formattedDate = year + "-" + month + "-" + day;

    fill(255);
    textSize(textSizeSystem.glitchUI);
    textStyle(NORMAL);
    
    textAlign(RIGHT, TOP);
    text(`NOTE${blinkingString("_", " ", 60)}             
A SIMULATION OF HOW GROWING UP 
AFFECTS THE WORLD AROUND US. 
SUBJECT IS SENSITIVE TO CHANGE.`, width-80, 60);

    textAlign(LEFT, TOP);
    text(`CHAOS_THEORY_TEST_SUBJECT.lwv`, 80, 60);

    text(`DATE       ${formattedDate}
ROTATION   ${int(frameCount / 30)}DEG
SIMULATION ON
STAB       AUTO`, 80, 200);

  textAlign(CENTER, TOP);
    textSize(textSizeSystem.h2);
    text(`${blinkingString(">","-", 60)} PRESS SPACE TO BEGIN EXPERIMENT ${blinkingString("<","-", 60)}`, width/2, height-66);
  pop();
}

let childScaleEasing = 0.03;
let childScale = 0;
function SCREEN_stateOne() {
  background(0);

  fill(255);
  textSize(textSizeSystem.glitchUI);
  textStyle(NORMAL);
  
  textAlign(LEFT, CENTER);
  text(`STAGE 01`, 80, 140);
  textSize(textSizeSystem.h1);
  text(`THE BIRTH${blinkingString("_", " ", 60)}`, 80, 175);
  
  push();
    stroke(255, 255);
    strokeWeight(0.5);

    let originX = width/2;
    let originY = height/2-30;

    feedParticles.forEach(p => {
      let distX = originX - p.x;
      p.x += distX * feedEasing;
    
      let distY = originY - p.y;
      p.y += distY * feedEasing;

      if (dist(originX, originY, p.x, p.y)>2) {
        circle(p.x, p.y, 20);
      }
    });

    translate(originX, originY);


    let boundaryX = (width-200) / 2;
    let boundaryY = (height-80) / 2;

    line(-boundaryX, 0, boundaryX, 0);
    line(0, -boundaryY, 0, boundaryY);

    let increment = 19;
    let unitHeight = 6;

    for (let i=0; i<=boundaryX; i+=increment) {
      line(i, unitHeight, i, -unitHeight);
      line(-i, unitHeight, -i, -unitHeight);
    }
    for (let i=0; i<=boundaryY; i+=increment) {
      line(unitHeight, i, -unitHeight, i);
      line(unitHeight, -i, -unitHeight, -i);
    }

    drawPulsar(0,0);

    push();

    let childScaleDist = (0.12+feedParticles.length/40) - childScale;
    childScale += childScaleDist*childScaleEasing;
    scale(childScale);

    blendMode(ADD);
    rotate(frameCount / 15);
    image(pulse1Image, random(-0.5,0.5), random(-0.5,0.5));
    rotate(frameCount / 30);
    image(pulse2Image, random(-0.5,0.5), random(-0.5,0.5));

    blendMode(BLEND);
    image(pulse4Image, random(-12,12), random(-12,12));
    image(pulse5Image, random(-2,2), random(-2,2));
    blendMode(ADD); 
    if (frameCount % int(random(45,70)) === 0) {
      image(pulse5Image, random(-10,10), random(-10,10));
    }
    if (frameCount % int(random(45,70)) === 0) {
      image(pulse5Image, random(-20,20), random(-20,20));
    }
    if (frameCount % int(random(45,70)) === 0) {
      image(pulse5Image, random(-32,32), random(-32,32));
    }
    if (frameCount % int(random(45,70)) === 0) {
      image(pulse5Image, random(-10,10), random(-10,10));
    }
    if (frameCount % int(random(45,70)) === 0) {
      image(pulse5Image, random(-20,20), random(-20,20));
    }
    if (frameCount % int(random(45,70)) === 0) {
      image(pulse5Image, random(-32,32), random(-32,32));
    }
    pop();
  pop();
}

let influenceParticles;
function SCREEN_stateTwo() {
  background(0);

  fill(255);
  textSize(textSizeSystem.glitchUI);
  textStyle(NORMAL);
  
  textAlign(LEFT, CENTER);
  text(`STAGE 02`, 80, 140);
  textSize(textSizeSystem.h1);
  text(`THE GROWTH${blinkingString("_", " ", 60)}`, 80, 175);

  push();
  // Draw the arc
    translate(0,-40);
    let oscillationAmount = sin(frameCount*0.9) * 50 + 25;
    let oscillationAmount2 = sin(frameCount*0.85) * 50 + 25;
    let oscillationAmount3 = sin(frameCount*0.8) * 50 + 25;

    noFill();
    stroke(255, 125);
    strokeWeight(1.5);
    arc(width / 2, height / 2, 780-400 + oscillationAmount, 780-400 + oscillationAmount, -40, 40);
    arc(width / 2, height / 2, 780-400 + oscillationAmount, 780-400 + oscillationAmount, -40+180, 40+180);

    arc(width / 2, height / 2, 840-400 + oscillationAmount2, 840-400 + oscillationAmount2, -28, 28);
    arc(width / 2, height / 2, 840-400 + oscillationAmount2, 840-400 + oscillationAmount2, -28+180, 28+180);

    arc(width / 2, height / 2, 890-400 + oscillationAmount3, 890-400 + oscillationAmount3, -20, 20);
    arc(width / 2, height / 2, 890-400 + oscillationAmount3, 890-400 + oscillationAmount3, -20+180, 20+180);
  pop();

  push();
    stroke(255, 255);
    strokeWeight(0.5);

    let originX = width/2;
    let originY = height/2-30;

    influenceParticles.forEach(p => {
      let distX = originX - p.x;
      p.x += distX * p.rate + random(0, 0.01);
    
      let distY = originY - p.y;
      p.y += distY * p.rate + random(0, 0.01);
      

      if (dist(originX, originY, p.x, p.y)<=random(5,40) || dist(originX, originY, p.x, p.y)>320) {
        p.x = random(width);
        p.y = random(height);
        p.rate = randomInfluenceRate();
      } else {
        push();
          fill(0, 255);
          stroke(255, 255);
          strokeWeight(0.7);
          square(p.x, p.y, 3);
        pop();
      }
    });

    translate(originX, originY);
    let boundaryX = (width-200) / 2;
    let boundaryY = (height-80) / 2;

    line(-boundaryX, 0, boundaryX, 0);
    line(0, -boundaryY, 0, boundaryY);

    let increment = 19;
    let unitHeight = 6;

    for (let i=0; i<=boundaryX; i+=increment) {
      line(i, unitHeight, i, -unitHeight);
      line(-i, unitHeight, -i, -unitHeight);
    }
    for (let i=0; i<=boundaryY; i+=increment) {
      line(unitHeight, i, -unitHeight, i);
      line(unitHeight, -i, -unitHeight, -i);
    }


    
    drawPulsar(0,0);

    let childScaleDist = (0.3) - childScale;
    childScale += childScaleDist*childScaleEasing;
    scale(childScale);
    blendMode(ADD);
    rotate(frameCount / 15);
    image(pulse1Image, random(-0.5,0.5), random(-0.5,0.5));
    rotate(frameCount / 30);
    image(pulse2Image, random(-0.5,0.5), random(-0.5,0.5));
  pop();

  translate(width/2,height/2);
  push();
    let chrysOffset =  -80;
    if (frameCount % int(random(24,45)) === 0) {
      scale(0.5+map(currentDialogueIndex, 0, dialogue[1].length, 0, 0.5));
    } else {
      scale(0.3+map(currentDialogueIndex, 0, dialogue[1].length, 0, 0.5));
    }
    if (frameCount % int(random(24,45)) === 0) {
      rotate(-2+random([12,-12])*map(currentDialogueIndex, 0, dialogue[1].length, 0, 1));
    } else {
      rotate(-2);
    }
    
    tint(255, 255);
    image(chrys1Image, random(-3,3), chrysOffset);

    tint(255, random(0, 70));
    image(chrys2Image, 0, chrysOffset);

    tint(255, map(currentDialogueIndex, 0, dialogue[1].length, 0, 255));
    image(chrys2Image, 0, chrysOffset);

    blendMode(ADD);
    if (frameCount % int(random(24,45)) === 0) {
      tint(255, 127);
      image(chrys2Image, random(-10,10), random(-10,10)+chrysOffset);
    }
  pop();

}

function SCREEN_stateThree() {
  background(0);

  fill(255);
  textSize(textSizeSystem.glitchUI);
  textStyle(NORMAL);
  
  textAlign(LEFT, CENTER);
  text(`STAGE 02`, 80, 140);
  textSize(textSizeSystem.h1);
  text(`THE GROWTH${blinkingString("_", " ", 60)}`, 80, 175);

  push();
  // Draw the arc
    if (currentDialogueIndex===0) {
      translate(0,-40);
      let oscillationAmount = sin(frameCount*0.9) * 50 + 25;
      let oscillationAmount2 = sin(frameCount*0.85) * 50 + 25;
      let oscillationAmount3 = sin(frameCount*0.8) * 50 + 25;

      noFill();
      stroke(255, 125);
      strokeWeight(1.5);
      arc(width / 2, height / 2, 780-400 + oscillationAmount, 780-400 + oscillationAmount, -40, 40);
      arc(width / 2, height / 2, 780-400 + oscillationAmount, 780-400 + oscillationAmount, -40+180, 40+180);
  
      arc(width / 2, height / 2, 840-400 + oscillationAmount2, 840-400 + oscillationAmount2, -28, 28);
      arc(width / 2, height / 2, 840-400 + oscillationAmount2, 840-400 + oscillationAmount2, -28+180, 28+180);
  
      arc(width / 2, height / 2, 890-400 + oscillationAmount3, 890-400 + oscillationAmount3, -20, 20);
      arc(width / 2, height / 2, 890-400 + oscillationAmount3, 890-400 + oscillationAmount3, -20+180, 20+180);
    }
  pop();

  push();
    stroke(255, 255);
    strokeWeight(0.5);

    let originX = width/2;
    let originY = height/2-30;

    if (currentDialogueIndex===0) {
      influenceParticles.forEach(p => {
        let distX = originX - p.x;
        p.x += distX * p.rate + random(0, 0.01);
      
        let distY = originY - p.y;
        p.y += distY * p.rate + random(0, 0.01);
        
  
        if (dist(originX, originY, p.x, p.y)<=random(5,40) || dist(originX, originY, p.x, p.y)>320) {
          p.x = random(width);
          p.y = random(height);
          p.rate = randomInfluenceRate();
        } else {
          push();
            fill(0, 255);
            stroke(255, 255);
            strokeWeight(0.7);
            square(p.x, p.y, 4);
          pop();
        }
      });
    } else {
      influenceParticles.forEach(p => {
        let distX = p.x - originX;
        p.x += distX * (p.rate+0.05) + random(0, 0.01);
      
        let distY = p.y - originY;
        p.y += distY * (p.rate+0.05) + random(0, 0.01);
        
  
        if (dist(originX, originY, p.x, p.y)<=random(5,40) || dist(originX, originY, p.x, p.y)>600) {
          p.x = random(width);
          p.y = random(height);
          p.rate = randomInfluenceRate();
        } else {
          push();
            fill(0, 255);
            stroke(255, 255);
            strokeWeight(0.7);
            square(p.x, p.y, 4);
          pop();
        }
      });
    }

    translate(originX, originY);
    let boundaryX = (width-200) / 2;
    let boundaryY = (height-80) / 2;

    line(-boundaryX, 0, boundaryX, 0);
    line(0, -boundaryY, 0, boundaryY);

    let increment = 19;
    let unitHeight = 6;

    for (let i=0; i<=boundaryX; i+=increment) {
      line(i, unitHeight, i, -unitHeight);
      line(-i, unitHeight, -i, -unitHeight);
    }
    for (let i=0; i<=boundaryY; i+=increment) {
      line(unitHeight, i, -unitHeight, i);
      line(unitHeight, -i, -unitHeight, -i);
    }


    
    //drawPulsar(0,0);

    let childScaleDist = (0) - childScale;
    childScale += childScaleDist*childScaleEasing;
    scale(childScale);
    blendMode(ADD);
    rotate(frameCount / 15);
    image(pulse1Image, random(-0.5,0.5), random(-0.5,0.5));
    rotate(frameCount / 30);
    image(pulse2Image, random(-0.5,0.5), random(-0.5,0.5));
  pop();

  translate(width/2,height/2);
  push();

  pop();

}