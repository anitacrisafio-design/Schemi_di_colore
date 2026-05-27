/* =========================
   VARIABILI GLOBALI
   ========================= */

// Array input CMYK
let inputs = [];

// Colore corrente
let currentCMYK = {
  c: 100,
  m: 40,
  y: 20,
  k: 0
};

// Movimento col mouse attivo
let movePoint = false;

// Dimensione quadrato
const squareSize = 260;

/* =========================
   SETUP
   ========================= */
function setup() {

  createCanvas(600, 600);

  textFont('Arial');

  ["100", "40", "20", "0"].forEach((value, i) => {

    let input = createInput(value);

    styleInput(input, 20 + i * 75);

    inputs.push(input);
  });
}


/* =========================
   DRAW
   ========================= */
function draw() {

  background(8);

  // Se NON stiamo usando il mouse
  // usa i valori degli input
  if (!movePoint) {

    let values = inputs.map(input =>
      constrain(parseInt(input.value()) || 0, 0, 100)
    );

    currentCMYK.c = values[0];
    currentCMYK.m = values[1];
    currentCMYK.y = values[2];
    currentCMYK.k = values[3];
  }

  // Se SPACE è premuto
  // aggiorna dal mouse
  if (movePoint) {
    updateCMYKFromMouse();
  }

  // Conversione RGB
  let rgb = cmykToRgb(
    currentCMYK.c,
    currentCMYK.m,
    currentCMYK.y,
    currentCMYK.k
  );

  drawPanel();

  push();

  translate(255, 325, -40);

  scale(0.82);

  drawCMYKSquare();

  drawColorPoint(
    currentCMYK.c,
    currentCMYK.m,
    currentCMYK.y,
    currentCMYK.k
  );

  pop();

  drawColorPreview(rgb);

  drawLabels();
}

/* =========================
   STYLE INPUT
   ========================= */
function styleInput(input, x) {

  input.position(x, 20);

  input.size(45);

  input.style('background', '#1e1e1e');
  input.style('color', 'white');
  input.style('border', '1px solid #444');
  input.style('border-radius', '8px');
  input.style('padding', '8px');
  input.style('font-size', '16px');
}

/* =========================
   DRAW PANEL
   ========================= */
function drawPanel() {

  noStroke();

  fill(25);

  rect(0, 0, 600, 600);
}

/* =========================
   DRAW CMYK SQUARE
   ========================= */
function drawCMYKSquare() {

  let s = squareSize;

  let left = -s / 2;
  let top = -s / 2;

  // Bordo quadrato
  stroke(255, 70);

  strokeWeight(2);

  noFill();

  rect(left, top, s, s);

  // Vertici colore
  const points = [
    { x: left, y: top, color: [0, 255, 255] }, // C
    { x: -left, y: top, color: [255, 0, 255] }, // M
    { x: -left, y: -top, color: [255, 255, 0] }, // Y
    { x: left, y: -top, color: [20] }           // K
  ];

  points.forEach((p, i) => {

    if (i === 3) {
      stroke(180);
      strokeWeight(1);
    } else {
      noStroke();
    }

    fill(...p.color);

    ellipse(p.x, p.y, 30);
  });

  noStroke();
}

/* =========================
   DRAW COLOR POINT
   =========================
   Disegna il pallino colore.
*/
function drawColorPoint(c, m, y, k) {

  let x = map(m - c, -100, 100, -130, 130);

  let yy = map(y - k, -100, 100, -130, 130);

  let rgb = cmykToRgb(c, m, y, k);

  noStroke();

  fill(rgb.r, rgb.g, rgb.b);

  ellipse(x, yy, 34);
}

/* =========================
   UPDATE CMYK FROM MOUSE
   =========================
   Quando SPACE è premuto:
   - prende il mouse
   - lo converte in CMYK
*/
function updateCMYKFromMouse() {

  // Coordinate mouse nel quadrato
  let mx = (mouseX - width / 2) / 0.82;
  let my = (mouseY - (height / 2 + 20)) / 0.82;

  // Limiti quadrato
  let half = squareSize / 2;

  // Controlla se il mouse è dentro
  if (
    mx >= -half &&
    mx <= half &&
    my >= -half &&
    my <= half
  ) {

    // Conversione posizione → CMYK
    currentCMYK.m = map(mx, -130, 130, 0, 100);
    currentCMYK.c = 100 - currentCMYK.m;

    currentCMYK.y = map(my, -130, 130, 0, 100);
    currentCMYK.k = 100 - currentCMYK.y;

    // Arrotonda
    Object.keys(currentCMYK).forEach(key => {
      currentCMYK[key] =
        constrain(round(currentCMYK[key]), 0, 100);
    });

    // Aggiorna input
    inputs[0].value(currentCMYK.c);
    inputs[1].value(currentCMYK.m);
    inputs[2].value(currentCMYK.y);
    inputs[3].value(currentCMYK.k);
  }
}

/* =========================
   DRAW COLOR PREVIEW
   ========================= */
function drawColorPreview(rgb) {

  noStroke();

  fill(rgb.r, rgb.g, rgb.b);

  rect(370, 20, 90, 90, 16);
}

/* =========================
   DRAW LABELS
   ========================= */
function drawLabels() {
  drawInstructions();
  fill(255);

  textSize(15);

  ["C", "M", "Y", "K"].forEach((label, i) => {

    text(label, 42 + i * 70, 75);
  });
}
/* =========================
   DRAW INSTRUCTIONS
   =========================
   Disegna il testo istruzioni per CMYK.
*/
function drawInstructions() {

  fill(180);

  textSize(12);

  textAlign(LEFT);

  text(
    "Puoi cambiare colore scrivendo i valori CMYK oppure tenendo premuto SPACE mentre muovi il mouse nel quadrato.",
    20,
    105,
    200
  );
}
/* =========================
   CMYK TO RGB
   ========================= */
function cmykToRgb(c, m, y, k) {

  [c, m, y, k] = [c, m, y, k].map(v => v / 100);

  return {
    r: 255 * (1 - c) * (1 - k),
    g: 255 * (1 - m) * (1 - k),
    b: 255 * (1 - y) * (1 - k)
  };
}

/* =========================
   KEY EVENTS
   =========================
   SPACE attiva/disattiva
   il movimento col mouse.
*/
function keyPressed() {

  if (key === ' ') {
    movePoint = true;
  }
}

function keyReleased() {

  if (key === ' ') {
    movePoint = false;
  }
} 