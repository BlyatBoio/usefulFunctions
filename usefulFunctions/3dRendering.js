let camera;
let worldForward;
class cameraC{
  constructor(x, y, z, FOV){
    this.x = x;
    this.y = y;
    this.z = z;
    this.xRotation = 0;
    this.yRotation = 0;
    this.zRotation = 0; // currently unused, would be more of a head tilt
    this.FOV = FOV;

    this.hasMoved = false;

    this.forward = new Direction(this.xRotation, this.yRotation);
  }
  constrainSelf(){
  }
  mouseControls(){

    let xm = movedX/1000 * deltaTime;
    let ym = movedY/1000 * deltaTime;

    this.xRotation -= ym;
    this.yRotation -= xm;


    this.forward.rotateBy(ym, xm);
  }
  keyboardControls(){
    let moveVec = createVector(0, 0, 0)
    // define a local vector
    if(keyIsDown(87)){
      this.localMove("Forward", 0.1);
    }
    if(keyIsDown(83)){      
      this.localMove("Back", 0.1);
    }
    if(keyIsDown(65)){
      this.localMove("Left", 0.1);
    }
    if(keyIsDown(68)){
      this.localMove("Right", 0.1);
    }
    if(keyIsDown(32)){
      moveVec.y -= 0.1;
      this.hasMoved = true;
    }
    if(keyIsDown(16)){
      moveVec.y += 0.1;
      this.hasMoved = true;
    }
    this.x += moveVec.x;
    this.z += moveVec.z;
    this.y += moveVec.y;

    //console.log("X: " + this.x +"\nY: " + this.y + "\nZ: " + this.z);
  }
  localMove(direction, amnt){
    this.hasMoved = true;
    let appVec = this.forward.applicationVector;
    let xMove = 0;
    let zMove = 0;
    switch(direction){
      case "Forward":
        this.x += appVec.x * amnt;
        this.z += appVec.z * amnt;
        break;
      case "Back":
        this.x -= appVec.x * amnt;
        this.z -= appVec.z * amnt;
        break;
      case "Right":
        xMove = 0;
        zMove = 0;
        this.forward.rotateBy(0, PI/2);
        xMove = appVec.x;
        zMove = appVec.z;
        this.x += xMove * amnt;
        this.z += zMove * amnt;
        this.forward.rotateBy(0, -PI/2);
        break;
      case "Left":
        xMove = 0;
        zMove = 0;
        this.forward.rotateBy(0, -PI/2);
        xMove = appVec.x;
        zMove = appVec.z;
        this.x += xMove * amnt;
        this.z += zMove * amnt;
        this.forward.rotateBy(0, PI/2);
        break;
    }
  }
  distToCamera(x, y, z){
    return dist3D(x, y, z, this.x, this.y, this.z)
    //return dist(x, z, this.x, this.z)
  }
  updateScreen(){
    background(0)
    let resolution = 20;
    let FOV = this.FOV;
    noStroke();
    for(let x = 0; x < width/resolution+1; x++){
      for(let y = 0; y < height/resolution+1; y++){
        let castPosition = createVector(this.x, this.y, this.z);
        let rotAngle = new Direction(this.forward.angleX, this.forward.angleY);
        let xRot = map(x, 0, width/resolution+1, -FOV, FOV) * (PI/180);
        let yRot = map(y, 0, height/resolution+1, -FOV, FOV) * (PI/180);
        rotAngle.rotateBy(yRot, xRot, 0);
        let r = new raycast(castPosition.x, castPosition.y, castPosition.z, rotAngle, 0.5, 50);
        let c = r.checkInteraction();
        if(c != false) {
          fill(c);
          rect(x * resolution, y * resolution, resolution);
          push();
          stroke(100);
          translate(400 + x * 10, 200 + y * 10);
          rotate(rotAngle.angleX);
          line(0, 0, 10, 0);
          pop();
        }
      }
    }
    this.hasMoved = false;
  }
}

class raycast {
  constructor(startX, startY, startZ, direction, sampleDensity, maxLength){
  // maximum distance it travels before determining there is nothing to interact with
  this.maxLength = maxLength;
  this.currentSteps = 0;
  this.hasHitObject = false;

  this.direction = direction;

  this.startX = startX;
  this.startY = startY;
  this.startZ = startZ;

  // checking vars
  this.checkX = startX;
  this.checkY = startY;
  this.checkZ = startZ;

  this.sampleDensity = sampleDensity; // the distance between each check
  }
  checkInteraction(){
    // auto exits though use of return whenever it hits an object
    while (this.currentSteps < this.maxLength){
      this.step(); // moves the check position forward
      for(let i = 0; i < allObjects.length; i++){
        // if the checkPosition colides with an object
        if(allObjects[i].isColiding(this.checkX, this.checkY, this.checkZ) == true){
          if(allObjects[i].objType == "Cube"){
          // fill with stroke color if it is a border
          let d = 3 - dist(this.checkX, this.checkZ, this.startX, this.startZ) / 10;
          let xD = (allObjects[i].w/2);
          let yD = (allObjects[i].h/2);
          let zD = (allObjects[i].l/2);

          let xc = 0;
          let yc = 0;
          let zc = 0;
          if(dist(this.checkX, 0, allObjects[i].x + xD, 0) >= xD - 0.5) xc = 1;
          if(dist(this.checkY, 0, allObjects[i].y + yD, 0) >= yD - 0.5) yc = 1;
          if(dist(this.checkZ, 0, allObjects[i].z + zD, 0) >= zD - 0.5) zc = 1;

          if(xc + yc + zc >= 2) return 100 * d;


          // return the distance from the starting location to the interaction point
          return color(allObjects[i].r * d, allObjects[i].g * d, allObjects[i].b * d);
          }
          else{
            let d = 2 - dist(this.checkX, this.checkZ, this.startX, this.startZ) / 10;
            return color(allObjects[i].Cr * d, allObjects[i].Cg * d, allObjects[i].Cb * d);
          }
        }
      }
      this.currentSteps ++;
    }
    return false;
  }
  step(){
    this.checkX += this.direction.getX() * this.sampleDensity;
    this.checkY += this.direction.getY() * this.sampleDensity;
    this.checkZ += this.direction.getZ() * this.sampleDensity;
  }
}

class Direction {
  constructor(angleX, angleY){
    // define starting angles
    this.angleX = 0;
    this.angleY = 0;
    // define vectors
    this.applicationVector = createVector(0, 0, 0); // starts with 0 momentum / direction
    this.xRotationVector = createVector(1, 0);
    this.yRotationVector = createVector(1, 0);
    this.zRotationVector = createVector(0, 1);

    this.rotateBy(angleX, angleY);
  }
  rotateBy(angleX, angleY){
    this.angleX += angleX;
    this.angleY += angleY;
    // apply angles individualy 
    this.xRotationVector.rotate(angleX);
    this.yRotationVector.rotate(angleY);
    this.zRotationVector.rotate(angleY);

    // apply all values to the final vector
    this.applicationVector.x = this.yRotationVector.x;
    this.applicationVector.y = this.xRotationVector.x;
    this.applicationVector.z = this.zRotationVector.x;
  }
  getX(){
    return this.applicationVector.x;
  }
  getY(){
    return this.applicationVector.y;
  }
  getZ(){
    return this.applicationVector.z;
  }
}

class vertex3D{
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.faces = [];
    this.lines = [];
  }
}

class object3D{
  constructor(vertecies){
    this.vertecies = vertecies;
    allObjects.push(this);
    this.x = this.vertecies[0].x;
    this.y = this.vertecies[0].y;
    this.z = this.vertecies[0].z;
    this.w = -tDist(this.x, this.vertecies[1].x);
    this.h = -tDist(this.y, this.vertecies[2].y);
    this.l = -tDist(this.z, this.vertecies[4].z);
    colorMode(RGB);
    this.objType = "Cube";
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
  }
  drawSelf(){
  }
  isColiding(x, y, z){
    return cubePoint(this.x, this.y, this.z, this.w, this.h, this.l, x, y, z);
  }
  addPosition(x, y, z){
    for(let i = 0; i < this.vertecies.length; i++){
      this.vertecies[i].x += x;
      this.vertecies[i].y += y;
      this.vertecies[i].z += z;
    }
    this.x = this.vertecies[0].x;
    this.y = this.vertecies[0].y;
    this.z = this.vertecies[0].z;
    this.w = -tDist(this.x, this.vertecies[1].x);
    this.h = -tDist(this.y, this.vertecies[2].y);
    this.l = -tDist(this.z, this.vertecies[4].z);
  }
  rotateX(){
  
  }
  rotateY(){
    
  }
  rotateZ(){
    
  }
}

class sphere3D{
  constructor(x, y, z, r){
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    this.objType = "Sphere";  
    colorMode(RGB);
    this.Cr = random(0, 255);
    this.Cg = random(0, 255);
    this.Cb = random(0, 255);
    allObjects.push(this);
  }
  isColiding(x, y, z){
    return abs(dist3D(x, y, z, this.x, this.y, this.z)) < this.r;
  }
}

function cubeCube(x, y, z, w, h, l, x2, y2, z2, w2, h2, l2){
  if(
    (x + w > x2 && x2 + w2 > x) && // x collisions
    (y + h > y2 && y2 + h2 > y) && // y collisions
    (z + l > z2 && z2 + l2 > z)  // z collisions
  ) return true;
  return false;
}

function cubePoint(x, y, z, w, h, l, x2, y2, z2){
  if(
    x2 > x && x2 < x + w &&
    y2 > y && y2 < y + h &&
    z2 > z && z2 < z + l
  ) return true;
  return false;
}

function relativeToCenter(x, y){
  return createVector(tDist(x, width/2), tDist(y, height/2));
}

function createCube(startX, startY, startZ){
  let cubeSize = 7;
  let v1 = new vertex3D(startX, startY, startZ);
  let v2 = new vertex3D(startX+cubeSize, startY, startZ);
  let v3 = new vertex3D(startX+cubeSize, startY+cubeSize, startZ);
  let v4 = new vertex3D(startX, startY+cubeSize, startZ);
  let v5 = new vertex3D(startX, startY, startZ+cubeSize);
  let v6 = new vertex3D(startX+cubeSize, startY, startZ+cubeSize);
  let v7 = new vertex3D(startX+cubeSize, startY+cubeSize, startZ+cubeSize);
  let v8 = new vertex3D(startX, startY+cubeSize, startZ+cubeSize);
  let cube = new object3D([v1, v2, v3, v4, v5, v6, v7, v8]);
  return cube;
}

function dist3D(x, y, z, x2, y2, z2){
  return abs(tDist(x, x2)) + abs(tDist(y, y2)) + abs(tDist(z, z2));
}

function degToRad(a){
  return a * (TWO_PI/180);
}

function radToDeg(a){
  return a * (180/TWO_PI);
}

function mousePressed(){
  requestPointerLock();
}

class matrix {
  constructor(resolutionX, resolutionY, items){
    this.resolutionX = resolutionX;
    this.resolutionY = resolutionY;
    this.itemArray = []; // define total array
    
    // define rows array, pre-filled with arrays because the filler on later lines
    // itterates from row to row, not one at a time
    this.rows = [];
    for(let i = 0; i < resolutionY; i++){
      this.rows.push([]);
    }

    // define columns array
    this.cols = [];

    // itterate "Horizontaly" across the first layer of the array
    for(let i = 0; i < resolutionX; i++){
      // push the second layer of arrays
      this.itemArray.push([]);

      // itterate "Verticaly" across the second layer of the array
      for(let i2 = 0; i2 < resolutionY; i2++){

        // set the index of the overall item array to the correct value
        this.itemArray[i][i2] = items[i + (i2*resolutionX)];

        // update the rows, goes one "X" position at a time
        this.rows[i2].push(this.itemArray[i][i2]);
      }

      // update the columns array with a new column
      this.cols.push(this.itemArray[i]);
    }
  }
  getIndex(x, y){
    return this.itemArray[x][y];
  }
  setIndex(x, y, value){
    this.itemArray[x][y] = value; 
    this.cols[x][y] = value;
    this.rows[y][x] = value;
  }
  getRow(x){
    return this.rows[x];
  }
  getCol(x){
    return this.itemArray[x];
  }
  mult(inputMatrix){
    // define new matrix
    let newMatrix = new matrix(inputMatrix.cols.length, this.rows.length, 0);
    
    // get the dot product of each row and column
    for(let i = 0; i < this.rows.length; i++){
      for(let i2 = 0; i2 < inputMatrix.cols.length; i2++){
        newMatrix.setIndex(i2, i, dotProduct(this.rows[i], inputMatrix.cols[i2]));
      }
    }
    // apply new resulting matrix to itself.
    return newMatrix;
  }
  add(inputMatrix){
    for(let i = 0; i < this.itemArray.length; i++){
      for(let i2 = 0; i2 < this.itemArray[i].length; i2++){
        this.itemArray[i][i2] += inputMatrix.itemArray[i][i2];
        this.rows[i2][i] = this.itemArray[i][i2];
      }
      this.cols[i] = this.itemArray[i];
    }
  }
  sub(inputMatrix){
    for(let i = 0; i < this.itemArray.length; i++){
      for(let i2 = 0; i2 < this.itemArray[i].length; i2++){
        this.itemArray[i][i2] -= inputMatrix.itemArray[i][i2];
        this.rows[i2][i] = this.itemArray[i][i2];
      }
      this.cols[i] = this.itemArray[i];
    }
  }
  print(){
    let rowStrings = [];
    for(let i = 0; i < this.rows.length; i++){
      let newStr = "";
      for(let i2 = 0; i2 < this.rows[i].length; i2++){
        newStr += this.rows[i][i2] + ", ";
      }
      rowStrings.push(newStr);
    }
    rowStrings[rowStrings.length-1] += "]";
    Console.log("[" + rowStrings[0]);
    for(let i = 1; i < rowStrings.length; i++){
      Console.log(rowStrings[i]);
    }
  }
  rowNumMult(row, value){
    let a = value;
    for(let i = 0; i < this.rows[row].length; i++){
      a *= this.rows[row][i];
    }
    return a;
  }
  colNumMult(col, value){
    let a = value;
    for(let i = 0; i < this.cols[col].length; i++){
      a *= this.cols[col][i];
    }
    return a;
  }
}

function dotProduct(row, col){
  let finalTotal = 0;
  for(let i = 0; i < row.length; i++){
    finalTotal += (row[i] * col[i]);
  }
  return finalTotal;
}