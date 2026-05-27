// =======================================
// HSV COLOR SPACE - GUIDED VERSION
// p5.js
// =======================================

// Input HSV
let inputs = [];

// HSV corrente
let currentHSV = {
	h: 25,
	s: 80,
	v: 100
};

// Movimento mouse
let movePoint = false;

// Raggio wheel (ridotto del 10% due volte)
const wheelRadius = 138; // 153 * 0.9

// Densità punti
const step = 14;

/* =========================
   SETUP
   ========================= */
function setup() {

	createCanvas(600, 600);

	colorMode(HSB, 360, 100, 100);

	textFont('Arial');

	// Input H S V
	["25", "80", "100"].forEach((value, i) => {

		let input = createInput(value);

		styleInput(input, 20 + i * 80);

		inputs.push(input);
	});
}

/* =========================
   DRAW
   ========================= */
function draw() {

	background('black');

	drawPanel();

	// Se NON stiamo usando mouse
	if (!movePoint) {

		currentHSV.h =
			constrain(parseInt(inputs[0].value()) || 0, 0, 360);

		currentHSV.s =
			constrain(parseInt(inputs[1].value()) || 0, 0, 100);

		currentHSV.v =
			constrain(parseInt(inputs[2].value()) || 0, 0, 100);
	}

	// SPACE + mouse
	if (movePoint) {
		updateHSVFromMouse();
	}

	push();

	// Align composition with 02_RGB (slight vertical offset + scale)
	translate(280, 290 + 45);

	scale(0.90);

	drawHSVPoints();

	drawHSVGuide();

	drawConnections();

	drawColorPoint();

	pop();

	drawPreview();

	drawLabels();
}

/* =========================
   INPUT STYLE
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
   PANEL
   ========================= */
function drawPanel() {

	noStroke();

	fill(11);

	rect(0, 0, 600, 600);
}

/* =========================
   HSV DOTS
   =========================
*/
function drawHSVPoints() {

	noStroke();

	// Cerchi concentrici
	for (let r = 0; r <= wheelRadius; r += step) {

		let circumference = TWO_PI * r;

		let count = max(8, floor(circumference / step));

		for (let i = 0; i < count; i++) {

			let angle =
				map(i, 0, count, 0, TWO_PI);

			let x = cos(angle) * r;
			let y = sin(angle) * r;

			// Hue = angolo
			let hueValue =
				degrees(angle);

			// Saturation = distanza
			let satValue =
				map(r, 0, wheelRadius, 0, 100);

			fill(
				hueValue,
				satValue,
				currentHSV.v
			);

			circle(x, y, 8);
		}
	}

	// Bordo
	noFill();

	stroke(35);

	strokeWeight(2);

	circle(0, 0, wheelRadius * 1.95);
}

/* =========================
   HSV GUIDE
   ========================= */
function drawHSVGuide() {

	push();

	textAlign(CENTER, CENTER);

	// =====================
	// GUIDE HUE
	// =====================

	let labels = [
		// { a: 0, txt: "0°" },
		// { a: 60, txt: "60°" },
		// { a: 120, txt: "120°" },
		// { a: 180, txt: "180°" },
		// { a: 240, txt: "240°" },
		// { a: 300, txt: "300°" }
	];

	stroke(255, 25);
	strokeWeight(0.5);

	labels.forEach(l => {

		let angle = radians(l.a);

		let x1 = cos(angle) * (wheelRadius + 8);
		let y1 = sin(angle) * (wheelRadius + 8);

		let x2 = cos(angle) * (wheelRadius + 24);
		let y2 = sin(angle) * (wheelRadius + 24);

		line(x1, y1, x2, y2);

		noStroke();

		fill(255, 120);

		textSize(11);

		let tx = cos(angle) * (wheelRadius + 42);
		let ty = sin(angle) * (wheelRadius + 42);

		text(l.txt, tx, ty);
	});

	

	// =====================
	// SATURATION
	// =====================

	stroke(120, 255, 120, 140);

	strokeWeight(2);

	line(0, 0, wheelRadius, 0);

	// Punta freccia
	line(
		wheelRadius,
		0,
		wheelRadius - 10,
		-5
	);

	line(
		wheelRadius,
		0,
		wheelRadius - 10,
		5
	);

	noStroke();

	fill(255);

	textSize(13);

	text(
		"S = Saturation",
		200,
		-18
	);

	// =====================
	// VALUE
	// =====================


	for (let i = 0; i < 100; i += 2) {

		fill(
			currentHSV.h,
			currentHSV.s,
			i
		);

		rect(
			-85 + i * 1.7,
			wheelRadius + 22,
			4,
			14
		);
	}

	pop();
}

/* =========================
   CONNECTIONS
   ========================= */
function drawConnections() {

	let angle = radians(currentHSV.h);

	let radius =
		map(currentHSV.s, 0, 100, 0, wheelRadius);

	let x = cos(angle) * radius;
	let y = sin(angle) * radius;

	// Linea hue
	stroke(255, 30);

	strokeWeight(2);

	line(0, 0, x, y);

	// Centro
	noStroke();

	fill(255, 30);

	circle(0, 0, 10);
}

/* =========================
   COLOR POINT
   ========================= */
function drawColorPoint() {

	let angle = radians(currentHSV.h);

	let radius =
		map(currentHSV.s, 0, 100, 0, wheelRadius);

	let x = cos(angle) * radius;
	let y = sin(angle) * radius;

	stroke(255);

	strokeWeight(2);

	fill(
		currentHSV.h,
		currentHSV.s,
		currentHSV.v
	);

	circle(x, y, 25);
}

/* =========================
   UPDATE FROM MOUSE
   ========================= */
function updateHSVFromMouse() {

	let mx = (mouseX - width / 2) / 0.82;
	let my = (mouseY - (height / 2 + 20)) / 0.82;

	let d = dist(0, 0, mx, my);

	if (d <= wheelRadius) {

		let angle =
			degrees(atan2(my, mx));

		if (angle < 0) angle += 360;

		currentHSV.h = floor(angle);

		currentHSV.s = floor(
			map(d, 0, wheelRadius, 0, 100)
		);

		// Update input
		inputs[0].value(currentHSV.h);
		inputs[1].value(currentHSV.s);
	}
}

/* =========================
   PREVIEW
   ========================= */
function drawPreview() {

	noStroke();

	fill(
		currentHSV.h,
		currentHSV.s,
		currentHSV.v
	);

	rect(380, 20, 90, 90, 16);
}

/* =========================
   LABELS
   ========================= */
function drawLabels() {

	fill(255);

	textSize(15);

	["H", "S", "V"].forEach((label, i) => {

		text(label, 42 + i * 80, 75);
	});

	drawInstructions();
}

/* =========================
   INSTRUCTIONS
   ========================= */
function drawInstructions() {

	fill(75);

	textSize(12);

	textAlign(LEFT);
	text(
		"Ogni pallino rappresenta un colore HSV. Hue = direzione | Saturation = distanza | Value = luminosità.\nTieni premuto SPACE e muovi il mouse nella ruota per cambiare colore.",
		25,
		110,
		200
	);
}

/* =========================
   KEY EVENTS
   ========================= */
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