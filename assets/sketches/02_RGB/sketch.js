// Array che contiene gli input RGB
let inputs = [];

// Colore corrente
let currentColor = {
	r: 255,
	g: 120,
	b: 80
};

// Attiva movimento col mouse quando SPACE è premuto
let movePoint = false;

// Coordinate dei vertici RGB
const vertices = [
	{ x: 0, y: -170, color: [255, 0, 0] },
	{ x: -170, y: 120, color: [0, 255, 0] },
	{ x: 170, y: 120, color: [0, 120, 255] }
];

/* =========================
   SETUP
   ========================= */
function setup() {

	createCanvas(600, 600);

	textFont('Arial');

	// Crea input RGB
	["255", "120", "80"].forEach((value, i) => {

		let input = createInput(value);

		styleInput(input, 20 + i * 80);

		inputs.push(input);
	});
}

/* =========================
   DRAW
   ========================= */
function draw() {

	background(8);

	// Se NON stiamo muovendo il pallino
	// usa i valori degli input
	if (!movePoint) {

		let values = inputs.map(input =>
			constrain(parseInt(input.value()) || 0, 0, 255)
		);

		currentColor.r = values[0];
		currentColor.g = values[1];
		currentColor.b = values[2];
	}

	// Se SPACE è premuto
	// aggiorna colore dal mouse
	if (movePoint) {
		updateColorFromMouse();
	}

	drawPanel();

	push();

	translate(260, 320 + 40);

	scale(0.82);

	drawTriangle();

	drawColorPoint(
		currentColor.r,
		currentColor.g,
		currentColor.b
	);

	pop();

	drawColorPreview(
		currentColor.r,
		currentColor.g,
		currentColor.b
	);

	drawLabels();
}

/* =========================
   STYLE INPUT
   ========================= */
function styleInput(input, x) {

	input.position(x, 20);

	input.size(50);

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
   DRAW TRIANGLE
   ========================= */
function drawTriangle() {

	strokeWeight(2);

	stroke(255, 70);

	// Disegna lati triangolo
	for (let i = 0; i < 3; i++) {

		let a = vertices[i];
		let b = vertices[(i + 1) % 3];

		line(a.x, a.y, b.x, b.y);
	}

	// Disegna vertici RGB
	noStroke();

	vertices.forEach(v => {

		fill(...v.color);

		ellipse(v.x, v.y, 28);
	});
}

/* =========================
   DRAW COLOR POINT
   =========================
   Posiziona il pallino RGB
   usando coordinate baricentriche.
*/
function drawColorPoint(r, g, b) {

	let total = r + g + b || 1;

	let weights = [r, g, b].map(v => v / total);

	let x = 0;
	let y = 0;

	vertices.forEach((v, i) => {

		x += weights[i] * v.x;
		y += weights[i] * v.y;
	});

	noStroke();

	fill(r, g, b);

	ellipse(x, y, 34);
}

/* =========================
   UPDATE COLOR FROM MOUSE
   =========================
   Quando SPACE è premuto:
   - prende posizione mouse
   - converte in RGB
*/
function updateColorFromMouse() {

	// Coordinate mouse nel triangolo
	let mx = (mouseX - width / 2) / 0.82;
	let my = (mouseY - (height / 2 + 20)) / 0.82;

	// Vertici
	let A = vertices[0];
	let B = vertices[1];
	let C = vertices[2];

	// Formula coordinate baricentriche
	let det =
		(B.y - C.y) * (A.x - C.x) +
		(C.x - B.x) * (A.y - C.y);

	let r =
		((B.y - C.y) * (mx - C.x) +
		(C.x - B.x) * (my - C.y)) / det;

	let g =
		((C.y - A.y) * (mx - C.x) +
		(A.x - C.x) * (my - C.y)) / det;

	let b = 1 - r - g;

	// Solo se il mouse è dentro il triangolo
	if (r >= 0 && g >= 0 && b >= 0) {

		currentColor.r = floor(r * 255);
		currentColor.g = floor(g * 255);
		currentColor.b = floor(b * 255);

		// Aggiorna input
		inputs[0].value(currentColor.r);
		inputs[1].value(currentColor.g);
		inputs[2].value(currentColor.b);
	}
}

/* =========================
   DRAW COLOR PREVIEW
   ========================= */
function drawColorPreview(r, g, b) {

	noStroke();

	fill(r, g, b);

	rect(350, 20, 90, 90, 16);
}

/* =========================
   DRAW LABELS
   ========================= */
function drawLabels() {
	drawInstructions();
	fill(255);

	textSize(15);

	["R", "G", "B"].forEach((label, i) => {

		text(label, 42 + i * 80, 75);
	});
}
/* =========================
   DRAW INSTRUCTIONS
   =========================
   Disegna il testo istruzioni sotto RGB.
*/
function drawInstructions() {

	fill(180);

	textSize(13.5);

	textAlign(LEFT);

	text(
		"Puoi cambiare colore scrivendo i valori RGB oppure tenendo premuto SPACE mentre muovi il mouse nel triangolo (per farlo seleziona il LAB).",
		20,
		110,
		250
	);
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