function setup(){
  createCanvas(windowWidth, windowHeight);
  Console = new consoleClass();
  consoleInput = createInput();
  consoleInput.position(Console.logSpacing, height - 50);
  consoleInput.size((width/5)-((2*Console.logSpacing)+10), 30);
  defineThemes();
  camera = new cameraC(0, 0, 0, 60);
}

function draw(){
  //themeBackground();
  background(200)
  runtime ++;
  //camera.drawPointToScreen(0, 0, 1);
  //camera.drawPointToScreen(runtime/50, 0, 0);
  camera.drawPointToScreen(0, 0, 1);
  camera.drawPointToScreen(1, 0, 1);
  camera.drawPointToScreen(1, 1, 1);
  camera.drawPointToScreen(0, 1, 1);
  camera.drawPointToScreen(0, 0, 2);
  camera.drawPointToScreen(1, 0, 2);
  camera.drawPointToScreen(1, 1, 2);
  camera.drawPointToScreen(0, 1, 2);
  onScreenConsole();
  mouseScrolled = 0;
  camera.constrainSelf();
  camera.mouseControls();
}