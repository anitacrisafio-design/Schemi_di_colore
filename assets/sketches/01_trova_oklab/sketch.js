// ======================================================
// GIOCO: TROVA LA SFUMATURA OKLAB
// p5.js
//
// IMPORTANTE:
// Per far funzionare OKLAB devi aggiungere
// anche la libreria chroma.js nell'HTML:
//
// <script src="https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.4.2/chroma.min.js"></script>
//
// ======================================================



// Array che contiene i 3 rettangoli
let gradients = [];

// Messaggio mostrato dopo il click
let selectedText = "";


// I 3 schemi colore
// I RETTANGOLI SARANNO SEMPRE 3
const gradientTypes = [
  "sRGB",
  "HSV",
  "OKLab"
];


// Colori iniziali/finali
let colorA;
let colorB;


// Bottone fullscreen
let fullscreenButton;



// ======================================================
// SETUP
// ======================================================

function setup() {

  createCanvas(windowWidth, windowHeight);

  // Genera due colori casuali
  generateColors();

  // Crea i 3 rettangoli
  generateGradients();

  // Bottone fullscreen
  fullscreenButton = createButton("FULLSCREEN");

  fullscreenButton.position(20, 20);

  fullscreenButton.style("background", "#111");
  fullscreenButton.style("color", "white");
  fullscreenButton.style("border", "1px solid white");
  fullscreenButton.style("padding", "10px 16px");
  fullscreenButton.style("cursor", "pointer");

  fullscreenButton.mousePressed(toggleFullscreen);

  textFont("Arial");
}

function draw() {

  // Sfondo nero
  background(0);

  // Titolo
  fill(255);

  noStroke();

  textAlign(CENTER);

  textSize(38);

  text(
    "Trova la sfumatura OKLab",
    width / 2,
    100
  );

  // Sottotitolo
  fill(170);

  textSize(18);

  text(
    
    "Clicca un rettangolo per scoprire lo schema colore",
    width / 2,
    135
  );



  // Disegna SEMPRE E SOLO 3 rettangoli
  for (let g of gradients) {

    drawGradientRect(g);
  }



  // Scritta dopo il click
  if (selectedText !== "") {

    fill(255);

    textSize(32);

    text(
      selectedText,
      width / 2,
      height - 80
    );
  }



  // Istruzioni
  fill(120);

  textSize(16);

  pop ()
  text(
   // noStroke()
    "Premi SPAZIO per cambiare colori",
    width / 2,
    height - 35
  ); push ()
}

// CLICK
function mousePressed() {

  // Controlla tutti i rettangoli
  for (let g of gradients) {

    // Verifica se il mouse è dentro il rettangolo
    if (
      mouseX > g.x &&
      mouseX < g.x + g.w &&
      mouseY > g.y &&
      mouseY < g.y + g.h
    ) {

      // Mostra lo schema colore
      selectedText =
        "Schema colore: " + g.type;
    }
  }
}

// SPAZIO = nuovi colori e rimescola le posizioni
function keyPressed() {

  if (key === " ") {

    generateColors();
    generateGradients();
    selectedText = "";
  }
}

// GENERA COLORI CASUALI
function generateColors() {

  colorA = color(
    random(255),
    random(255),
    random(255)
  );

  colorB = color(
    random(255),
    random(255),
    random(255)
  );
}

// CREA I 3 RETTANGOLI
function generateGradients() {

  gradients = [];

  // Mischia casualmente i 3 schemi
  let shuffled = shuffle([...gradientTypes]);

  // Rettangoli lunghi e stretti
  const rectW = width * 0.22;
  const rectH = 70;

  // Spazio tra rettangoli
  const spacing = width * 0.04;

  // Larghezza totale
  const totalWidth =
    rectW * 3 + spacing * 2;

  // Posizione iniziale
  const startX =
    (width - totalWidth) / 2;

  // CREA SEMPRE 3 RETTANGOLI
  for (let i = 0; i < 3; i++) {

    gradients.push({

      type: shuffled[i],

      x: startX + i * (rectW + spacing),

      y: height / 2,

      w: rectW,

      h: rectH
    });
  }
}

// DISEGNA RETTANGOLO
function drawGradientRect(g) {

  // Disegna la sfumatura
  for (let i = 0; i < g.w; i++) {

    // Valore tra 0 e 1
    let t = i / (g.w - 1);

    let c;

    // Seleziona il metodo colore
    if (g.type === "sRGB") {

      c = interpolateSRGB(t);

    } else if (g.type === "HSV") {

      c = interpolateHSV(t);

    } else if (g.type === "OKLab") {

      c = interpolateOKLab(t);
    }

    stroke(c);

    line(
      g.x + i,
      g.y,
      g.x + i,
      g.y + g.h
    );
  }

  // Bordo bianco
  noFill();

  stroke(255);

  strokeWeight(2);

  rect(
    g.x,
    g.y,
    g.w,
    g.h,
    8
  );
}

// sRGB
function interpolateSRGB(t) {

  return lerpColor(
    colorA,
    colorB,
    t
  );
}

// HSV
function interpolateHSV(t) {

  push();

  colorMode(HSB, 360, 100, 100);

  let h1 = hue(colorA);
  let s1 = saturation(colorA);
  let v1 = brightness(colorA);

  let h2 = hue(colorB);
  let s2 = saturation(colorB);
  let v2 = brightness(colorB);

  let h = lerp(h1, h2, t);
  let s = lerp(s1, s2, t);
  let v = lerp(v1, v2, t);

  let c = color(h, s, v);

  pop();

  return c;
}

// OKLAB
function interpolateOKLab(t) {

  // Converte RGB -> OKLab
  let ok1 = chroma.rgb(
    red(colorA),
    green(colorA),
    blue(colorA)
  ).oklab();

  let ok2 = chroma.rgb(
    red(colorB),
    green(colorB),
    blue(colorB)
  ).oklab();

  // Interpolazione
  let L = lerp(ok1[0], ok2[0], t);
  let a = lerp(ok1[1], ok2[1], t);
  let b = lerp(ok1[2], ok2[2], t);

  // OKLab -> RGB
  let rgb = chroma
    .oklab(L, a, b)
    .rgb();

  return color(
    rgb[0],
    rgb[1],
    rgb[2]
  );
}

// FULLSCREEN

function toggleFullscreen() {

  let fs = fullscreen();

  fullscreen(!fs);
}

// RESIZE
function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  generateGradients();
}