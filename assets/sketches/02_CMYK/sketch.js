let inputC;
let inputM;
let inputY;
let inputK;

function setup() {

  createCanvas(500, 500);

  textFont('Arial');

  // INPUT CMYK
  inputC = createInput("100");
  styleInput(inputC, 20);

  inputM = createInput("40");
  styleInput(inputM, 100);

  inputY = createInput("20");
  styleInput(inputY, 180);

  inputK = createInput("0");
  styleInput(inputK, 260);
}

function draw() {

  background(8);

  // valori CMYK
  let c = constrain(parseInt(inputC.value()) || 0, 0, 100);
  let m = constrain(parseInt(inputM.value()) || 0, 0, 100);
  let y = constrain(parseInt(inputY.value()) || 0, 0, 100);
  let k = constrain(parseInt(inputK.value()) || 0, 0, 100);

  // conversione matematica
  let rgb = cmykToRgb(c, m, y, k);

  drawPanel();

  push();

  translate(width / 2, height / 2 + 30);

  scale(0.72);

  drawCMYKSquare();

  drawColorPoint(c, m, y, k);

  pop();

  drawColorPreview(rgb.r, rgb.g, rgb.b);

  drawLabels();
}

function styleInput(input, x) {

  input.position(x, 20);

  input.size(60);

  input.style('background', '#1e1e1e');
  input.style('color', 'white');
  input.style('border', '1px solid #444');
  input.style('border-radius', '8px');
  input.style('padding', '8px');
  input.style('font-size', '16px');
  input.style('outline', 'none');
}

function drawPanel() {

  noStroke();

  fill(18);

  rect(10, 10, 480, 480, 24);
}

/*
====================================================
QUADRATO CMYK
====================================================

Ogni angolo rappresenta:

alto-sinistra  = Cyan
alto-destra    = Magenta
basso-destra   = Yellow
basso-sinistra = Black

====================================================
*/

function drawCMYKSquare() {

  let s = 260;

  let left = -s / 2;
  let right = s / 2;

  let top = -s / 2;
  let bottom = s / 2;

  // quadrato
  stroke(255, 70);

  strokeWeight(3);

  noFill();

  rect(left, top, s, s);

  // vertici CMYK
  noStroke();

  // C
  fill(0, 255, 255);
  ellipse(left, top, 30);

  // M
  fill(255, 0, 255);
  ellipse(right, top, 30);

  // Y
  fill(255, 255, 0);
  ellipse(right, bottom, 30);

  // K
 fill(20);

stroke(180);

strokeWeight(1);

ellipse(left, bottom, 30);

noStroke();
}

function drawColorPoint(c, m, y, k) {

  /*
  Coordinate matematiche nel quadrato
  */

  let x =
    map(
      m - c,
      -100,
      100,
      -130,
      130
    );

  let yy =
    map(
      y - k,
      -100,
      100,
      -130,
      130
    );

  // colore risultante
  let rgb = cmykToRgb(c, m, y, k);

  noStroke();

  fill(rgb.r, rgb.g, rgb.b);

  ellipse(x, yy, 34);
}

function drawColorPreview(r, g, b) {

  noStroke();

  fill(r, g, b);

  rect(390, 30, 80, 80, 16);
}

function drawLabels() {

  fill(255);

  textSize(15);

  text("C", 42, 75);
  text("M", 122, 75);
  text("Y", 202, 75);
  text("K", 282, 75);
}

/*
====================================================
MODELLO MATEMATICO CMYK
====================================================

CMYK è uno spazio colore sottrattivo.

Formula:

R = 255 × (1 − C) × (1 − K)
G = 255 × (1 − M) × (1 − K)
B = 255 × (1 − Y) × (1 − K)

====================================================
*/

function cmykToRgb(c, m, y, k) {

  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;

  let r =
    255 * (1 - c) * (1 - k);

  let g =
    255 * (1 - m) * (1 - k);

  let b =
    255 * (1 - y) * (1 - k);

  return {
    r: r,
    g: g,
    b: b
  };
}