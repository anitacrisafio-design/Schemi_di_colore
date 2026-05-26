let inputR;
let inputG;
let inputB;

function setup() {

	createCanvas(500, 500);

	textFont('Arial');

	// INPUT ROSSO
	inputR = createInput("255");
	styleInput(inputR, 20);

	// INPUT VERDE
	inputG = createInput("120");
	styleInput(inputG, 100);

	// INPUT BLU
	inputB = createInput("80");
	styleInput(inputB, 180);
}

function draw() {

	background(8);

	let r = constrain(parseInt(inputR.value()) || 0, 0, 255);
	let g = constrain(parseInt(inputG.value()) || 0, 0, 255);
	let b = constrain(parseInt(inputB.value()) || 0, 0, 255);

	// pannello
	drawPanel();

	push();

	translate(width / 2, height / 2 + 30);

	scale(0.82);

	drawTriangle();

	drawColorPoint(r, g, b);

	pop();

	drawColorPreview(r, g, b);

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

function drawTriangle() {

	let rx = 0;
	let ry = -170;

	let gx = -170;
	let gy = 120;

	let bx = 170;
	let by = 120;

	// triangolo
	strokeWeight(3);

	stroke(255, 70);

	line(rx, ry, gx, gy);
	line(gx, gy, bx, by);
	line(bx, by, rx, ry);

	// vertici RGB
	noStroke();

	fill(255, 0, 0);
	ellipse(rx, ry, 28);

	fill(0, 255, 0);
	ellipse(gx, gy, 28);

	fill(0, 120, 255);
	ellipse(bx, by, 28);
}

function drawColorPoint(r, g, b) {

	let total = r + g + b;

	if (total === 0) {
		total = 1;
	}

	// coordinate baricentriche
	let rn = r / total;
	let gn = g / total;
	let bn = b / total;

	// vertici triangolo
	let rx = 0;
	let ry = -170;

	let gx = -170;
	let gy = 120;

	let bx = 170;
	let by = 120;

	// posizione matematica
	let x =
		rn * rx +
		gn * gx +
		bn * bx;

	let y =
		rn * ry +
		gn * gy +
		bn * by;

	noStroke();

	fill(r, g, b);

	ellipse(x, y, 34);
}

function drawColorPreview(r, g, b) {

	noStroke();

	fill(r, g, b);

	rect(390, 30, 80, 80, 16);
}

function drawLabels() {

	fill(255);

	textSize(15);

	text("R", 42, 75);
	text("G", 122, 75);
	text("B", 202, 75);
}