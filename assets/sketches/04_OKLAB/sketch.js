// ==========================================
// OKLAB vs RGB — Interactive Laboratory
// Versione completa + Fullscreen
// p5.js
// ==========================================

let lSlider, aSlider, bSlider;
let fullscreenBtn;

const UI = {
  bg: "#0f1115",
  panel: "#181c22",
  text: "#ffffff",
  soft: "#9ca3af",
  accent: "#6ee7ff"
};

function setup() {

  createCanvas(windowWidth, windowHeight);

  textFont("Arial");

  // =========================
  // SLIDERS
  // =========================

  lSlider = createSlider(0, 1, 0.7, 0.01);
  styleSlider(lSlider, 50, 130);

  aSlider = createSlider(-0.4, 0.4, 0, 0.01);
  styleSlider(aSlider, 50, 240);

  bSlider = createSlider(-0.4, 0.4, 0, 0.01);
  styleSlider(bSlider, 50, 350);

  // =========================
  // FULLSCREEN BUTTON
  // =========================

  fullscreenBtn = createButton("FULLSCREEN");

  fullscreenBtn.position(20, 20);

  fullscreenBtn.style("background", "#111");
  fullscreenBtn.style("color", "white");
  fullscreenBtn.style("border", "1px solid white");
  fullscreenBtn.style("padding", "10px 16px");
  fullscreenBtn.style("cursor", "pointer");

  fullscreenBtn.mousePressed(toggleFullscreen);
}

function draw() {

  background(UI.bg);

  drawTitle();

  drawControlPanel();

  drawMainColor();

  drawGradientComparison();

  drawABPlane();

  drawBottomDescription();
}

// ==========================================
// FULLSCREEN
// ==========================================

function toggleFullscreen() {

  let fs = fullscreen();

  fullscreen(!fs);
}

// ==========================================
// TITLE
// ==========================================

function drawTitle() {

  fill(UI.text);
  noStroke();

  textSize(36);
  textStyle(BOLD);

  text("OKLAB vs RGB", 50, 60);

  textStyle(NORMAL);

  fill(UI.soft);

  textSize(18);

  text(
    "Comprendere la differenza tra colore matematico e percezione visiva",
    50,
    95
  );
}

// ==========================================
// CONTROL PANEL
// ==========================================

function drawControlPanel() {

  drawPanel(30, 110, 370, 340);

  fill(UI.text);

  textSize(22);
  textStyle(BOLD);

  text("Controlli Oklab", 50, 150);

  textStyle(NORMAL);

  drawSliderLabel(
    "L — Luminosità percepita",
    lSlider.value(),
    50,
    190
  );

  drawSliderLabel(
    "a — Verde ↔ Rosso",
    aSlider.value(),
    50,
    300
  );

  drawSliderLabel(
    "b — Blu ↔ Giallo",
    bSlider.value(),
    50,
    410
  );
}

function drawSliderLabel(label, value, x, y) {

  fill(UI.text);

  textSize(16);

  text(label, x, y);

  fill(UI.accent);

  text(
    nf(value, 1, 2),
    x + 250,
    y
  );
}

// ==========================================
// MAIN COLOR PREVIEW
// ==========================================

function drawMainColor() {

  let rgb = getCurrentColor();

  drawPanel(450, 110, 320, 340);

  fill(UI.text);

  textSize(22);
  textStyle(BOLD);

  text("Anteprima Colore", 470, 150);

  noStroke();

  fill(rgb[0], rgb[1], rgb[2]);

  rect(470, 180, 280, 180, 24);

  fill(UI.soft);

  textSize(15);

  text(
    "Questo colore è generato utilizzando\nlo spazio colore Oklab.",
    470,
    390
  );

  fill(UI.text);

  text(
    `RGB(${floor(rgb[0])}, ${floor(rgb[1])}, ${floor(rgb[2])})`,
    470,
    430
  );
}

// ==========================================
// GRADIENT COMPARISON
// ==========================================

function drawGradientComparison() {

  drawPanel(820, 110, 560, 340);

  fill(UI.text);

  textSize(22);
  textStyle(BOLD);

  text("Confronto Gradienti", 840, 150);

  textStyle(NORMAL);

  // RGB LABEL

  fill(UI.soft);
  textSize(16);

  text("RGB", 840, 190);

  drawRGBGradient(840, 210, 500, 60);

  fill(UI.soft);

  text(
    "Transizione matematica → può generare colori sporchi",
    840,
    295
  );

  // OKLAB LABEL

  fill(UI.soft);

  text("Oklab", 840, 350);

  drawOklabGradient(840, 370, 500, 60);

  fill(UI.soft);

  text(
    "Transizione percettiva → più naturale e uniforme",
    840,
    455
  );
}

// ==========================================
// RGB GRADIENT
// ==========================================

function drawRGBGradient(x, y, w, h) {

  let base = getCurrentColor();

  for (let i = 0; i < w; i++) {

    let t = i / w;

    let r = lerp(0, base[0], t);
    let g = lerp(0, base[1], t);
    let b = lerp(0, base[2], t);

    stroke(r, g, b);

    line(x + i, y, x + i, y + h);
  }
}

// ==========================================
// OKLAB GRADIENT
// ==========================================

function drawOklabGradient(x, y, w, h) {

  let L = lSlider.value();
  let A = aSlider.value();
  let B = bSlider.value();

  for (let i = 0; i < w; i++) {

    let t = i / w;

    let c = oklabToSRGB(
      lerp(0.2, L, t),
      lerp(0, A, t),
      lerp(0, B, t)
    );

    stroke(c[0], c[1], c[2]);

    line(x + i, y, x + i, y + h);
  }
}

// ==========================================
// AB PLANE
// ==========================================

function drawABPlane() {

  drawPanel(30, 500, 740, 280);

  fill(UI.text);

  textSize(22);
  textStyle(BOLD);

  text("Spazio Cromatico a / b", 50, 540);

  push();

  translate(390, 650);

  stroke(90);

  line(-220, 0, 220, 0);
  line(0, -100, 0, 100);

  fill(UI.soft);
  noStroke();

  text("VERDE", -270, 5);
  text("ROSSO", 235, 5);

  text("BLU", -15, -120);
  text("GIALLO", -25, 125);

  let a = aSlider.value();
  let b = bSlider.value();

  let x = map(a, -0.4, 0.4, -200, 200);
  let y = map(b, -0.4, 0.4, 90, -90);

  fill("#6ee7ff");

  ellipse(x, y, 22);

  pop();
}

// ==========================================
// DESCRIPTION
// ==========================================

function drawBottomDescription() {

  drawPanel(820, 500, 560, 280);

  fill(UI.text);

  textSize(22);
  textStyle(BOLD);

  text("Perché Oklab è importante", 840, 540);

  textStyle(NORMAL);

  fill(UI.soft);

  textSize(17);

  text(
    "RGB descrive i colori per il computer.\n\n" +
    "Oklab descrive i colori come vengono\n" +
    "percepiti dalle persone.\n\n" +
    "Questo permette di creare gradienti,\n" +
    "palette e interfacce più naturali,\n" +
    "uniformi e leggibili.",
    840,
    590
  );
}

// ==========================================
// UTILITIES
// ==========================================

function styleSlider(slider, x, y) {

  slider.position(x, y);

  slider.style("width", "280px");
}

function drawPanel(x, y, w, h) {

  noStroke();

  fill(UI.panel);

  rect(x, y, w, h, 28);
}

function getCurrentColor() {

  return oklabToSRGB(
    lSlider.value(),
    aSlider.value(),
    bSlider.value()
  );
}

// ==========================================
// OKLAB → RGB
// ==========================================

function oklabToSRGB(L, a, b) {

  let l = L + 0.3963377774 * a + 0.2158037573 * b;
  let m = L - 0.1055613458 * a - 0.0638541728 * b;
  let s = L - 0.0894841775 * a - 1.2914855480 * b;

  l = l * l * l;
  m = m * m * m;
  s = s * s * s;

  let r =
    +4.0767416621 * l
    -3.3077115913 * m
    +0.2309699292 * s;

  let g =
    -1.2684380046 * l
    +2.6097574011 * m
    -0.3413193965 * s;

  let bb =
    -0.0041960863 * l
    -0.7034186147 * m
    +1.7076147010 * s;

  r = linearToSrgb(r);
  g = linearToSrgb(g);
  bb = linearToSrgb(bb);

  return [
    constrain(r * 255, 0, 255),
    constrain(g * 255, 0, 255),
    constrain(bb * 255, 0, 255)
  ];
}

function linearToSrgb(x) {

  return x <= 0.0031308
    ? 12.92 * x
    : 1.055 * pow(x, 1 / 2.4) - 0.055;
}

// ==========================================
// RESPONSIVE
// ==========================================

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  fullscreenBtn.position(20, 20);
}