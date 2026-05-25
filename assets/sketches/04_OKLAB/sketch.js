function setup() {
	createCanvas(windowWidth, windowHeight)
}

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

function draw() {

	// Crea i controlli per comparare CIELAB e OKLab
  cielabLabel = createDiv("CIELAB: 0.50");
  cielabLabel.style("color", "#ffffff");
  cielabLabel.style("font-family", "Arial");
  cielabLabel.style("font-size", "14px");

  cielabSlider = createSlider(0, 100, 50);
  cielabSlider.style("width", "260px");

  oklabLabel = createDiv("OKLab: 0.50");
  oklabLabel.style("color", "#ffffff");
  oklabLabel.style("font-family", "Arial");
  oklabLabel.style("font-size", "14px");

  oklabSlider = createSlider(0, 100, 50);
  oklabSlider.style("width", "260px");

  diffLabel = createDiv("");
  diffLabel.style("color", "#cccccc");
  diffLabel.style("font-family", "Arial");
  diffLabel.style("font-size", "14px");

  textFont("Arial");
	}
