let newCube;
let m1;
let m2;

let renderedObjects = [];
let allObjects = [];

function setup(){
  createCanvas(windowWidth, windowHeight);
  Console = new consoleClass();
  consoleInput = createInput();
  consoleInput.position(Console.logSpacing, height - 50);
  consoleInput.size((width/5)-((2*Console.logSpacing)+10), 30);
  defineThemes();
  camera = new cameraC(0, 0, 0, 60);
  newCube = createCube(0, 0, 2);
  newCube = createCube(5, 0, 2);
  worldForward = new Direction(0, 0, 0);
}

function draw(){
  //themeBackground();
  background(0)
  runtime ++;
  camera.updateScreen();
  onScreenConsole();
  mouseScrolled = 0;
  camera.constrainSelf();
  newCube.addPosition(0, 0, 0);
  camera.mouseControls();
  camera.keyboardControls();
  renderedObjects = [];
  //rect(random(100, 200), 200, 100);
}