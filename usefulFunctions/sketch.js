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
  camera = new cameraC(0, 0, 0, 40);
  //createCube(0, 0, 2);
  newCube = createCube(15, 0, 2);
  //new sphere3D(10, 5, 0, 1);
  worldForward = new Direction(0, 0, 0);
  camera.updateScreen();
}

function draw(){
  //themeBackground();
  runtime ++;
   camera.updateScreen();
  //onScreenConsole();
  mouseScrolled = 0;
  camera.constrainSelf();
  newCube.addPosition(0, 0, 0);
  camera.mouseControls();
  camera.keyboardControls();
  //renderedObjects = [];
  //rect(random(100, 200), 200, 100);

  // top down view of scene
  /*
  fill(100);
  rect(500 + (50 * allObjects[0].x), 500 + (50 * allObjects[0].y), 50*7);
  fill(255);
  text(allObjects[0].x + ",  " + allObjects[0].y + ",  " + allObjects[0].z + ",  ", 500 + (50 * allObjects[0].x), 500 + (50 * allObjects[0].y));

  fill(100);
  rect(500 + (50 * allObjects[1].x), 500 + (50 * allObjects[1].y), 50*7);
  fill(255);
  text(allObjects[1].x + ",  " + allObjects[1].y + ",  " + allObjects[1].z + ",  ", 500 + (50 * allObjects[1].x), 500 + (50 * allObjects[1].y));

  text(camera.x + ",  " + camera.y + ",  " + camera.z + ",  " + camera.forward.angleX, 500 + (50 * camera.x), 500 + (50 * camera.y));
  push();
  stroke(200);
  strokeWeight(10);
  translate(500 + (50 * camera.x), 500 + (50 * camera.y));
  rotate(camera.forward.angleX+PI/2);
  rotate(degToRad(30));
  line(0, 0, 50, 0);
  rotate(degToRad(-60));
  line(0, 0, 50, 0);
  pop();
  */
}