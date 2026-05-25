function setup() {
  createCanvas(1100, 500);
  noLoop();
}

function draw() {
  background(255);
  
  // Margini del grafico
  let marginL = 100;
  let marginR = 150;
  let marginT = 100;
  let marginB = 100;
  
  // Dimensioni degli assi
  let graphW = width - marginL - marginR;
  let graphH = height - marginT - marginB;

  // --- TITOLI ---
  textAlign(CENTER, CENTER);
  textFont('Helvetica, Arial');
  
  // Titolo principale
  fill(0);
  textSize(22);
  textStyle(BOLD);
  text("Grafico dei Coni L, M e S", width / 2 - 25, 60);
  
  // Sottotitolo
  textSize(14);
  textStyle(NORMAL);
  fill(80);
  text("Sensibilità alla luce dei coni L, M e S per diverse lunghezze d'onda", width / 2 - 25, 90);

  // --- GRIGLIA E ASSI ---
  stroke(230);
  strokeWeight(1);
  
  // Linee orizzontali (Sensibilità da 0.0 a 1.0)
  for (let i = 0; i <= 5; i++) {
    let y = map(i * 0.2, 0, 1.0, height - marginB, marginT);
    line(marginL, y, width - marginR, y);
    
    // Etichette asse Y
    noStroke();
    fill(100);
    textSize(12);
    textAlign(RIGHT, CENTER);
    text((i * 0.2).toFixed(1), marginL - 15, y);
    stroke(230);
  }
  
  // Linee verticali (Lunghezza d'onda da 400 a 800 nm)
  for (let wl = 400; wl <= 800; wl += 100) {
    let x = map(wl, 400, 800, marginL, width - marginR);
    line(x, marginT, x, height - marginB);
    
    // Etichette asse X
    noStroke();
    fill(100);
    textSize(12);
    textAlign(CENTER, TOP);
    text(wl, x, height - marginB + 15);
    stroke(230);
  }

  // Assi principali (Neri)
  stroke(0);
  strokeWeight(1.5);
  // Asse X
  line(marginL, height - marginB, width - marginR, height - marginB);
  // Asse Y
  line(marginL, marginT, marginL, height - marginB);

  // --- TITOLI ASSI ---
  noStroke();
  fill(0);
  textSize(14);
  
  // Titolo Asse Y (Ruotato)
  push();
  translate(40, (marginT + height - marginB) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text("Sensibilità", 0, 0);
  pop();
  
  // Titolo Asse X
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  text("Lunghezza d'onda λ (nm)", (marginL + width - marginR) / 2, height - marginB + 50);

  // --- TRACCIAMENTO CURVE ---
  noFill();
  strokeWeight(3.5);
  
  // Configurazione dei picchi (Approssimazione gaussiana)
  // [Colore, Picco WL, Deviazione Standard, Altezza Massima]
  let cones = {
    'S': { col: color(45, 105, 250), peak: 445, sd: 25, amp: 0.95 },
    'M': { col: color(40, 250, 110), peak: 543, sd: 38, amp: 0.95 },
    'L': { col: color(255, 60, 70),  peak: 566, sd: 42, amp: 0.95 }
  };

  // Disegna curva per curva
  for (let key in cones) {
    let c = cones[key];
    stroke(c.col);
    beginShape();
    
    for (let wl = 400; wl <= 830; wl += 1) {
      let x = map(wl, 400, 800, marginL, width - marginR);
      
      // Funzione Gaussiana per simulare lo spettro dei coni
      let yVal = c.amp * exp(-0.5 * pow((wl - c.peak) / c.sd, 2));
      
      // Correzione asimmetria per i coni M e L sulle lunghe frequenze
      if (key !== 'S' && wl > c.peak) {
        yVal = c.amp * exp(-0.5 * pow((wl - c.peak) / (c.sd * 1.15), 2));
      }
      
      let y = map(yVal, 0, 1.0, height - marginB, marginT);
      
      // Limita il disegno all'area del grafico
      if (x >= marginL && x <= width - marginR) {
        vertex(x, y);
      }
    }
    endShape();
  }

  // --- LEGENDA ---
  let legendX = width - marginR + 10;
  let legendY = marginT + 10;
  let spacing = 22;
  
  textSize(12);
  textAlign(LEFT, CENTER);
  
  // Legenda L
  stroke(cones['L'].col);
  line(legendX, legendY, legendX + 25, legendY);
  noStroke();
  fill(0);
  textStyle(BOLD); text("L: ", legendX + 35, legendY) ;
  textStyle(ITALIC); text("lunghezza d'onda lunga (Long)", legendX + 50, legendY);

  
  // Legenda M
  legendY += spacing;
  stroke(cones['M'].col);
  line(legendX, legendY, legendX + 25, legendY);
  noStroke();
  fill(0);
  textStyle(BOLD); text("M: ", legendX + 35, legendY);
  textStyle(ITALIC); text("lunghezza d'onda media (Medium)", legendX + 53, legendY);
  
  // Legenda S
  legendY += spacing;
  stroke(cones['S'].col);
  line(legendX, legendY, legendX + 25, legendY);
  noStroke();
  fill(0);
  textStyle(BOLD); text("S: ", legendX + 35, legendY);
  textStyle(ITALIC); text("lunghezza d'onda corta (Short)", legendX + 51, legendY);
}
