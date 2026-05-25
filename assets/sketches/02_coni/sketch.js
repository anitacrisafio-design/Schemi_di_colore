// p5.js — Enhanced Cone Fundamentals Graph
// Versione visual migliorata e moderna

function setup() {
  createCanvas(1600, 950);
  pixelDensity(2);
  noLoop();
}

function draw() {
  drawBackground();

  drawCard();

  drawGrid();

  drawAxes();

  drawCurves();

  drawLegend();

  drawTitles();
}

// --------------------------------------------------
// LAYOUT
// --------------------------------------------------

const graph = {
  x: 180,
  y: 140,
  w: 1180,
  h: 620
};

// --------------------------------------------------
// BACKGROUND
// --------------------------------------------------

function drawBackground() {

  // Gradient background
  for (let y = 0; y < height; y++) {

    let inter = map(y, 0, height, 0, 1);

    let c = lerpColor(
      color(245, 246, 250),
      color(228, 231, 238),
      inter
    );

    stroke(c);
    line(0, y, width, y);
  }
}

// --------------------------------------------------
// CARD CONTAINER
// --------------------------------------------------

function drawCard() {

  noStroke();

  // Ombra
  fill(0, 20);
  rect(
    graph.x - 40,
    graph.y - 50,
    graph.w + 120,
    graph.h + 170,
    30
  );

  // Card
  fill(252);
  rect(
    graph.x - 50,
    graph.y - 60,
    graph.w + 120,
    graph.h + 170,
    28
  );
}

// --------------------------------------------------
// GRIGLIA
// --------------------------------------------------

function drawGrid() {

  stroke(225);
  strokeWeight(1);

  // Verticali
  for (let i = 0; i <= 9; i++) {

    let x = map(i, 0, 9, graph.x, graph.x + graph.w);

    line(x, graph.y, x, graph.y + graph.h);
  }

  // Orizzontali
  for (let i = 0; i <= 10; i++) {

    let y = map(i, 0, 10, graph.y + graph.h, graph.y);

    line(graph.x, y, graph.x + graph.w, y);
  }
}

// --------------------------------------------------
// ASSI
// --------------------------------------------------

function drawAxes() {

  stroke(55);
  strokeWeight(2);

  // asse x
  line(
    graph.x,
    graph.y + graph.h,
    graph.x + graph.w,
    graph.y + graph.h
  );

  // asse y
  line(
    graph.x,
    graph.y,
    graph.x,
    graph.y + graph.h
  );

  drawTicks();
}

function drawTicks() {

  fill(60);
  noStroke();

  textSize(18);
  textAlign(CENTER);

  // Tacche X
  for (let nm = 400; nm <= 800; nm += 100) {

    let x = map(nm, 400, 850, graph.x, graph.x + graph.w);

    stroke(60);
    line(x, graph.y + graph.h, x, graph.y + graph.h + 10);

    noStroke();
    text(nm, x, graph.y + graph.h + 38);
  }

  // Tacche Y
  textAlign(RIGHT);

  for (let v = 0; v <= 1; v += 0.2) {

    let y = map(v, 0, 1, graph.y + graph.h, graph.y);

    stroke(60);
    line(graph.x - 10, y, graph.x, y);

    noStroke();
    text(nf(v, 1, 1), graph.x - 18, y + 6);
  }
}

// --------------------------------------------------
// TITOLI
// --------------------------------------------------

function drawTitles() {

  noStroke();

  // Titolo
  fill(35);

  textAlign(CENTER);

  textSize(34);
  textStyle(BOLD);

  text(
    "Stockman & Sharpe 2° Cone Fundamentals",
    width / 2,
    70
  );

  textSize(24);
  textStyle(NORMAL);

  fill(90);

  text(
    "Colour Matching Functions",
    width / 2,
    105
  );

  // Label asse X
  fill(50);

  textSize(24);

  text(
    "Wavelength λ (nm)",
    graph.x + graph.w / 2,
    graph.y + graph.h + 80
  );

  // Label asse Y
  push();

  translate(75, graph.y + graph.h / 2);

  rotate(-HALF_PI);

  text("Sensitivity", 0, 0);

  pop();

  // Caption
  textAlign(LEFT);

  fill(80);

  textSize(30);
  textStyle(ITALIC);

  text(
    "Sensibilità alla luce dei coni L, M e S per diverse lunghezze d'onda.",
    120,
    height - 55
  );
}

// --------------------------------------------------
// CURVE
// --------------------------------------------------

function drawCurves() {

  drawGlowCurve(
    color(255, 80, 80),
    coneL
  );

  drawGlowCurve(
    color(80, 255, 120),
    coneM
  );

  drawGlowCurve(
    color(70, 120, 255),
    coneS
  );
}

function drawGlowCurve(col, fn) {

  // Glow
  for (let i = 16; i > 0; i--) {

    stroke(
      red(col),
      green(col),
      blue(col),
      7
    );

    strokeWeight(i);

    noFill();

    beginShape();

    for (let nm = 390; nm <= 830; nm++) {

      let s = fn(nm);

      let x = map(
        nm,
        390,
        850,
        graph.x,
        graph.x + graph.w
      );

      let y = map(
        s,
        0,
        1.05,
        graph.y + graph.h,
        graph.y
      );

      vertex(x, y);
    }

    endShape();
  }

  // Linea principale
  stroke(col);
  strokeWeight(5);

  noFill();

  beginShape();

  for (let nm = 390; nm <= 830; nm++) {

    let s = fn(nm);

    let x = map(
      nm,
      390,
      850,
      graph.x,
      graph.x + graph.w
    );

    let y = map(
      s,
      0,
      1.05,
      graph.y + graph.h,
      graph.y
    );

    vertex(x, y);
  }

  endShape();
}

// --------------------------------------------------
// MODELLI CONI
// --------------------------------------------------

function coneL(x) {
  return gaussian(x, 570, 42);
}

function coneM(x) {
  return gaussian(x, 545, 35);
}

function coneS(x) {
  return gaussian(x, 445, 22);
}

function gaussian(x, mean, sd) {

  return exp(
    -pow(x - mean, 2) /
    (2 * pow(sd, 2))
  );
}

// --------------------------------------------------
// LEGENDA
// --------------------------------------------------

function drawLegend() {

  const lx = 1040;
  const ly = 165;

  // Ombra
  noStroke();
  fill(0, 18);

  rect(lx + 5, ly + 5, 300, 120, 20);

  // Box
  fill(255);

  rect(lx, ly, 300, 120, 20);

  drawLegendItem(
    lx,
    ly + 28,
    color(255, 80, 80),
    "L Cone Fundamentals"
  );

  drawLegendItem(
    lx,
    ly + 60,
    color(80, 255, 120),
    "M Cone Fundamentals"
  );

  drawLegendItem(
    lx,
    ly + 92,
    color(70, 120, 255),
    "S Cone Fundamentals"
  );
}

function drawLegendItem(x, y, col, txt) {

  stroke(col);
  strokeWeight(5);

  line(x + 18, y, x + 60, y);

  noStroke();

  fill(50);

  textAlign(LEFT);

  textSize(18);

  text(txt, x + 78, y + 6);
}