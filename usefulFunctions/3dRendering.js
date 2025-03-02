let camera;
let worldForward;
class cameraC{
  constructor(x, y, z, FOV){
    // global position
    this.x = x;
    this.y = y;
    this.z = z;

    // global rotation, should use this.forward.angle__ instead of these however
    this.xRotation = 0;
    this.yRotation = 0;
    this.zRotation = 0; // currently unused, would be more of a head tilt

    this.FOV = FOV/4; // the angle both to the left and right of the camera is visible

    this.forward = new Direction(this.xRotation, this.yRotation); // direction that the camera is facing
    this.rays = [];
    this.resolution = 15;
    this.defineRayCasts();
  }
  mouseControls(){

    // apply the mouse movement, deltaTime attepts to correct an over-movement in the case of frame drops
    let xm = movedX/1000 * deltaTime;
    let ym = movedY/1000 * deltaTime;

    // apply to the .rotation vars
    this.xRotation -= ym; // "Arround" the x axis, twisting back into the camera so it is up/down
    this.yRotation -= xm; // "Arround" the y axis, effectively circles the horizontal plane.

    this.forward.rotateBy(ym, xm); // update the forward direction
    for(let i = 0; i < this.rays.length; i++){
      this.rays[i].direction.rotateBy(ym, xm);
    }
  }
  keyboardControls(){
    let moveVec = createVector(0, 0, 0); // define a local vector

    // uses localMove for all of the forward, back, left, right directions
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

    // Local move doesent make sense for jumping, just applies a global "upwards" or "downwards" movement
    if(keyIsDown(32)){
      moveVec.y -= 0.1;
      this.hasMoved = true;
    }
    if(keyIsDown(16)){
      moveVec.y += 0.1;
      this.hasMoved = true;
    }

    // apply the moveVector to the position
    this.x += moveVec.x;
    this.z += moveVec.z;
    this.y += moveVec.y;
    for(let i = 0; i < this.rays.length; i++){
      this.rays[i].startX = this.x;
      this.rays[i].startY = this.y;
      this.rays[i].startZ = this.z;
    }
  }
  localMove(direction, amnt){
    let appVec = this.forward.applicationVector; //  "Application Vector" is the directionality of the movement
    let xMove = 0; // amount the x should move
    let zMove = 0; // amount the z should move
    // no yMove because moving localy on the Y axis is not needed for a basic controler
    switch(direction){
      // fwd and back are self-explanatory, just apply the appVec *1 or *-1
      case "Forward":
        xMove += appVec.x * amnt;
        zMove += appVec.z * amnt;
        break;
      case "Back":
        xMove -= appVec.x * amnt;
        zMove -= appVec.z * amnt;
        break;
      case "Right":
        this.forward.rotateBy(0, PI/2);// rotate the forward vector to be parallel
        // update xMove and zMove
        xMove += appVec.x * amnt;
        zMove += appVec.z * amnt;

        // de-rotate the forward direction
        this.forward.rotateBy(0, -PI/2);
        break;
      case "Left":
        this.forward.rotateBy(0, -PI/2);// rotate the forward vector to be parallel
        // update xMove and zMove
        xMove += appVec.x * amnt;
        zMove += appVec.z * amnt;

        // de-rotate the forward direction
        this.forward.rotateBy(0, PI/2);
        break;
    }

    // update the position
    this.x += xMove;
    this.z += zMove;
  }
  distToCamera(x, y, z){
    return dist3D(x, y, z, this.x, this.y, this.z);
  }
  defineRayCasts(){
    // itterate over the screen scaled down by the resolution
    for(let x = 0; x < width/this.resolution; x++){
      for(let y = 0; y < height/this.resolution; y++){
        // all start at the camera position and rotate given their x/y in the itteration

        // get the basic x and y rotation based on screen position
        let yRot = map(x, 0, width/this.resolution, -this.FOV*4, this.FOV*4) * (PI/180); // y rotation is equivalent to the x axis in 2d
        let xRot = map(y, 0, height/this.resolution, -this.FOV*2, this.FOV*2) * (PI/180); // x rotation is the y axis in 2d
        
        // apply this screen based rotation to the forward direction to get the final direction
        let a = new Direction(this.forward.angleX + xRot, this.forward.angleY + yRot);

        this.rays.push(new raycast(this.x, this.y, this.z, a, 0.5, 70, createVector(x, y))); // Define the final raycast
      }
    }
  }
  updateScreen(){
    background(0); // "Make the canvas blank"
    // itterate over the screen scaled down by the resolution
    for(let i = 0; i < this.rays.length; i++){
      // Debug purposes, draw the angles of each raycast when uncommented
      /*
      push();
      stroke(100);
      translate(10 + i * 20, 10 + i * 20);
      rotate(this.forward.angleX);
      line(0, 0, 20, 0);
      pop();
      push();
      fill(this.forward.getX() * 100, this.forward.getY() * 100, this.forward.getZ() * 100);
      //ellipse(20 + x * 10, 20 + y * 10, 10);
      pop();
      push();
      stroke(100);
      translate(10 + this.rays[i].arrayPos.x * 20, 10 + this.rays[i].arrayPos.y * 20);
      line(0, 0, this.rays[i].direction.applicationVector.x * 20, this.rays[i].direction.applicationVector.y * 20);
      pop();
      */
      

      // reset the raycast to default at the starting position
      this.rays[i].checkX = this.x;
      this.rays[i].checkY = this.y;
      this.rays[i].checkZ = this.z;
      this.rays[i].currentSteps = 0;

      let c = this.rays[i].checkInteraction(); // check if it hits anything and save that color or boolean as C

      // returns a color value so == false would be hiting nothing while we cant say == true because it never does
      if(c != false) {
        noStroke();
        fill(c); // fill by the returned color of the raycast
        square(this.rays[i].arrayPos.x * this.resolution, this.rays[i].arrayPos.y * this.resolution, this.resolution); // draw the resolution sized square at that location
        //fill(255);
        //stroke(0);
        //text(r.direction.getY(), (x*resolution) + 10, (y*resolution) + 10);
      }
    }
  }
}

class raycast {
  constructor(startX, startY, startZ, direction, sampleDensity, maxLength, arrayPos){
  // maximum distance it travels before determining there is nothing to interact with / returning 0
  this.maxLength = maxLength;
  
  // the amount of "Steps" the ray has taken in order to use the max-length effectively
  this.currentSteps = 0;

  this.direction = direction; // the direction in which it moves

  // the starting position of the raycast
  this.startX = startX;
  this.startY = startY;
  this.startZ = startZ;

  // checking vars that are itterated on every step
  this.checkX = startX;
  this.checkY = startY;
  this.checkZ = startZ;

  this.sampleDensity = sampleDensity; // the distance between each check
  this.arrayPos = arrayPos;
  }
  checkInteraction(){
    // auto exits though use of return whenever it hits an object
    let xc = 0;
    let yc = 0;
    let zc = 0;
    while (this.currentSteps < this.maxLength){
      this.step(); // moves the check position forward
      for(let i = 0; i < allObjects.length; i++){
        // if the checkPosition colides with an object
        if(allObjects[i].isColiding(this.checkX, this.checkY, this.checkZ) == true){
          if(allObjects[i].objType == "Cube"){
          // fill with stroke color if it is a border
          let d = 5 - dist3D(this.checkX, this.checkY, this.checkZ, this.startX, this.startY, this.startZ) / 10;
          // x, y, z collisions
          xc = 0;
          yc = 0;
          zc = 0;
          if(dist(this.checkX, 0, allObjects[i].cX, 0) >= allObjects[i].halfW - 0.7) xc = 1; // x "collisions" or just correct distance
          if(dist(this.checkY, 0, allObjects[i].cY, 0) >= allObjects[i].halfH - 0.7) yc = 1; // y "collisions" or just correct distance
          if(dist(this.checkZ, 0, allObjects[i].cZ, 0) >= allObjects[i].halfL - 0.7) zc = 1; // z "collisions" or just correct distance

          if(xc + yc + zc >= 2) return 20 * d // if it is a border, return border color

          // return the distance from the starting location to the interaction point
          return color(allObjects[i].r * d, allObjects[i].g * d, allObjects[i].b * d);
          }
          else{
            // sphere has no border currently
            let d = 5 - dist3D(this.checkX, this.checkY, this.checkZ, this.startX, this.startY, this.startZ) / 10;
            return color(allObjects[i].Cr * d, allObjects[i].Cg * d, allObjects[i].Cb * d);
          }
        }
      }
      this.currentSteps ++;
    }
    return false;
  }
  step(){
    // update all movement directions for the raycast.
    this.checkX += this.direction.getX() * this.sampleDensity;
    this.checkY += this.direction.getY() * this.sampleDensity;
    this.checkZ += this.direction.getZ() * this.sampleDensity;
  }
}

class Direction {
  // only X and Y because Z would be a head tilt and is not currently implemented
  constructor(angleX, angleY){
    // define starting angles
    this.angleX = 0;
    this.angleY = 0;

    // define vectors
    this.applicationVector = createVector(0, 0, 0); // starts with 0 momentum / direction
    this.xRotationVector = createVector(1, 0);
    this.yRotationVector = createVector(1, 0);
    this.zRotationVector = createVector(0, 1); // flipped because it applies Y rotation and math, not a bug

    // set the initial direction
    this.rotateBy(angleX, angleY);
  }
  rotateBy(angleX, angleY){
    // update angleX angleY vars
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
  // get the different values from the application Vector
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
    // position
    this.x = x;
    this.y = y;
    this.z = z;
  }
  setPosition(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  addPosition(x, y, z){
    this.x += x;
    this.y += y;
    this.z += z;
  }
}

class object3D{
  constructor(vertecies){
    this.vertecies = vertecies; // array of vertex3D objects

    // get the "starting point" for cubeCube or cubePoint collisions
    this.x = this.vertecies[0].x;
    this.y = this.vertecies[0].y;
    this.z = this.vertecies[0].z;

    // get the w/h/l for the same reasongs
    this.w = abs(tDist(this.x, this.vertecies[1].x));
    this.h = abs(tDist(this.y, this.vertecies[3].y));
    this.l = abs(tDist(this.z, this.vertecies[4].z));
    
    // also pre-computations for raycaster
    this.halfW = this.w/2;
    this.halfH = this.h/2;
    this.halfL = this.l/2;

    // get the center position so that the raycast doesent need to compute it
    this.cX = this.x + this.halfW;
    this.cY = this.y + this.halfH;
    this.cZ = this.z + this.halfL;
    
    // define the color that is returned when a raycast intersects with it
    colorMode(RGB);
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
    this.objType = "Cube"; // used for raycast collisions
    allObjects.push(this); // add self to allObjects array
  }
  isColiding(x, y, z){
    return cubePoint(this.x, this.y, this.z, this.w, this.h, this.l, x, y, z);
  }
  addPosition(x, y, z){

    // itterate over all vertecies and add the provided position
    for(let i = 0; i < this.vertecies.length; i++){
      this.vertecies[i].addPosition(x, y, z);
    }

    // update x, y, z, w, l, h, variables for colisions
    this.x = this.vertecies[0].x;
    this.y = this.vertecies[0].y;
    this.z = this.vertecies[0].z;
    this.w = -tDist(this.x, this.vertecies[1].x);
    this.h = -tDist(this.y, this.vertecies[2].y);
    this.l = -tDist(this.z, this.vertecies[4].z);

    // for raycasting
    this.cX = this.x + this.w/2;
    this.cY = this.y + this.h/2;
    this.cZ = this.z + this.l/2;
    this.halfW = this.w/2;
    this.halfH = this.w/2;
    this.halfL = this.w/2;
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
    // position
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r; // radius

    // for colisions
    this.objType = "Sphere";  

    // define color to return when a raycast intersects it
    colorMode(RGB);
    this.Cr = random(0, 255); // because this.r is already radius
    this.Cg = random(0, 255);
    this.Cb = random(0, 255);

    allObjects.push(this); // add self to all objects array for viewing colisions.
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
    x2 > x && x2 < x + w && // x collissions
    y2 > y && y2 < y + h && // y collissions
    z2 > z && z2 < z + l // z collissions
  ) return true;
  return false;
}

// get the distance of a point to the center of the screen 
function relativeToCenter(x, y){
  return createVector(tDist(x, width/2), tDist(y, height/2));
}

function createCube(startX, startY, startZ, W, H, L){
  //let cubeSize = 7;
  let v1 = new vertex3D(startX, startY, startZ); // top left
  let v2 = new vertex3D(startX+W, startY, startZ); // top right
  let v3 = new vertex3D(startX+W, startY+H, startZ); // bottom right
  let v4 = new vertex3D(startX, startY+H, startZ); // bottom left
  let v5 = new vertex3D(startX, startY, startZ+L); // back top left
  let v6 = new vertex3D(startX+W, startY, startZ+L); // back top right
  let v7 = new vertex3D(startX+W, startY+H, startZ+L); // back bottom right
  let v8 = new vertex3D(startX, startY+H, startZ+L); // back bottom left
  let cube = new object3D([v1, v2, v3, v4, v5, v6, v7, v8]); // create the cube
  return cube; // return if it needs to be used as a defined object.
}

// distance between 2 points in 3d space
function dist3D(x, y, z, x2, y2, z2){
  // uses dist to compare individual x, y, z distances
  return dist(x, 0, x2, 0) + dist(y, 0, y2, 0) + dist(z, 0, z2, 0);
}

// degrees to radians
function degToRad(a){
  return a * (TWO_PI/180);
}

// raidans to degrees
function radToDeg(a){
  return a * (180/TWO_PI);
}

// lock the mouse to the screen
function mousePressed(){
  requestPointerLock();
}

class matrix {
  constructor(resolutionX, resolutionY, items){
    // the size of the matrix
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
      // push the second "vertical" layer of arrays
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
    return this.itemArray[x][y]; // returns the item at a given 2d location
  }
  setIndex(x, y, value){
    // updates both the item array and the rows / cols arrays with the new value
    this.itemArray[x][y] = value; 
    this.cols[x][y] = value;
    this.rows[y][x] = value;
  }
  getRow(x){
    return this.rows[x]; // returns the entire row
  }
  getCol(x){
    return this.cols[x]; // returns the entire column
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
    // return the new matrix
    return newMatrix;
  }
  add(inputMatrix){
    // itterate over the entire array
    for(let i = 0; i < this.itemArray.length; i++){
      for(let i2 = 0; i2 < this.itemArray[i].length; i2++){
        // both need to be the same size so the [x][y] of this.item array correlates to [x][y] of the other array
        this.itemArray[i][i2] += inputMatrix.itemArray[i][i2];
        this.rows[i2][i] = this.itemArray[i][i2]; // update rows arr
      }
      this.cols[i] = this.itemArray[i]; // update cols arr
    }
  }
  sub(inputMatrix){
    // itterate over the entire array
    for(let i = 0; i < this.itemArray.length; i++){
      for(let i2 = 0; i2 < this.itemArray[i].length; i2++){
        // both need to be the same size so the [x][y] of this.item array correlates to [x][y] of the other array
        this.itemArray[i][i2] -= inputMatrix.itemArray[i][i2];
        this.rows[i2][i] = this.itemArray[i][i2]; // update rows arr
      }
      this.cols[i] = this.itemArray[i]; // update cols arr
    }
  }
  print(){
    let rowStrings = []; // the string version of each row
    for(let i = 0; i < this.rows.length; i++){
      let newStr = ""; // define a new string for the rows
      for(let i2 = 0; i2 < this.rows[i].length; i2++){
        newStr += this.rows[i][i2] + ", "; // add the current index to the new string
      }
      rowStrings.push(newStr); // add the new string to the array of strings
    }
    rowStrings[rowStrings.length-1] += "]"; // add a ] as a cap to the matrix
    Console.log("[" + rowStrings[0]); // log the first row of the matrix

    for(let i = 1; i < rowStrings.length; i++){
      Console.log(rowStrings[i]); // log the rest of the matrix
    }
  }
  // multiply a given number by an entire row
  rowNumMult(row, value){
    let a = value;
    for(let i = 0; i < this.rows[row].length; i++){
      a *= this.rows[row][i];
    }
    return a;
  }
  // multiply a given number by an entire column
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