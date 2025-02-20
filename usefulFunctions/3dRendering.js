let camera;
class cameraC{
  constructor(x, y, z, FOV){
    this.x = x;
    this.y = y;
    this.z = z;
    this.xRotation = 0;
    this.yRotation = 0;
    this.zRotation = 0; // currently unused
    this.FOV = FOV;
  }
  drawPointToScreen(x, y, z){
    let pos = this.worldToScreen(x, y, z);
    let xPos = pos.x;
    let yPos = pos.y;
    let totalDist = dist3D(x, y, z, this.x, this.y, this.z); // get the total distance from the camera to the point
    let circleSize = 20-totalDist; // get the final size
    if(circleSize >= 0) ellipse(xPos, yPos, circleSize); // draw the point
  }
  worldToScreen(x, y, z){
    let a1 = atan2(z - this.z, x - this.x); // Horizontal angle to point
    let a2 = tDist(y, this.y) // Vertical angle to point

    // convert radians to degrees
    a1 = radToDeg(a1); 
    a2 = radToDeg(a2);

    let xPos = width/2 + ((width/2) * ((a1+this.xRotation)/this.FOV));
    let yPos = height/2 + ((height/2) * ((a2+this.yRotation)/this.FOV));

    return createVector(xPos, yPos);
  }
  constrainSelf(){
    // constrain horizontal rotation
    if(this.xRotation >= 180) this.xRotation = -179;
    if(this.xRotation <= -180) this.xRotation = 179;
    
    // constrain vertical rotation
    if(this.yRotation >= 180) this.yRotation = -179;
    if(this.yRotation <= -180) this.yRotation = 179;
  }
  mouseControls(){
    this.xRotation -= movedX/5;
    this.yRotation -= movedY/5;
  }
  keyboardControls(){
    let moveVec = createVector(0, 0);
    // define a local vector
    let xMultVector = createVector(0.1, 0.1); // x movements are multiplied by the localization vector
    let yMultVector = createVector(0.1, 0.1); // y movements are multiplied by the localization vector
    xMultVector.rotate(this.xRotation);
    yMultVector.rotate(this.yRotation);
    if(keyIsDown(87)){
      moveVec.x += xMultVector.z;
      moveVec.z += xMultVector.x;
    }
    if(keyIsDown(83)){
      moveVec.x -= xMultVector.z;
      moveVec.z -= xMultVector.x;
    }
    if(keyIsDown(65)){
      moveVec.x += xMultVector.x;
      moveVec.z += xMultVector.z;
    }
    if(keyIsDown(68)){
      moveVec.x -= xMultVector.x;
      moveVec.z -= xMultVector.z;
    }
    if(keyIsDown(32)){
      moveVec.y -= 0.1;
    }
    if(keyIsDown(16)){
      moveVec.y += 0.1;
    }
    this.x += moveVec.x;
    this.z += moveVec.z;
    this.y += moveVec.y;

    //console.log("X: " + this.x +"\nY: " + this.y + "\nZ: " + this.z);
  }
  distToCamera(x, y, z){
    //return dist3D(x, y, z, this.x, this.y, this.z)
    return dist(x, z, this.x, this.z)
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
    this.constructFaces();
  }
  constructFaces(){
    this.faces = [];
    for(let i = 0; i < this.vertecies.length; i++){
      
    }
  }
  drawSelf(){
    let positions = [];
    fill(0);
    stroke(0);
    for(let i = 0; i < this.vertecies.length; i++){
      let pos = camera.worldToScreen(this.vertecies[i].x, this.vertecies[i].y, this.vertecies[i].z);
      ellipse(pos.x, pos.y, 50 - 10*camera.distToCamera(this.vertecies[i].x, this.vertecies[i].y, this.vertecies[i].z));
      text(this.vertecies[i].x + ", " + this.vertecies[i].y, + ", ", pos.x, pos.y - 20);
      positions.push(pos);
    }
    for(let i = 0; i < positions.length; i++){
      for(let i2 = 0; i2 < positions.length; i2++){
        let totalSimilarities = 0;
        if(this.vertecies[i].x == this.vertecies[i2].x) totalSimilarities ++;
        if(this.vertecies[i].y == this.vertecies[i2].y) totalSimilarities ++;
        if(this.vertecies[i].z == this.vertecies[i2].z) totalSimilarities ++;
        if(totalSimilarities >= 2) line(positions[i].x, positions[i].y, positions[i2].x, positions[i2].y);
      }
    }
  }
}

function createCube(startX, startY, startZ){
  let v1 = new vertex3D(startX, startY, startZ);
  let v2 = new vertex3D(startX+1, startY, startZ);
  let v3 = new vertex3D(startX+1, startY+1, startZ);
  let v4 = new vertex3D(startX, startY+1, startZ);
  let v5 = new vertex3D(startX, startY, startZ+1);
  let v6 = new vertex3D(startX+1, startY, startZ+1);
  let v7 = new vertex3D(startX+1, startY+1, startZ+1);
  let v8 = new vertex3D(startX, startY+1, startZ+1);
  let cube = new object3D([v1, v2, v3, v4, v5, v6, v7, v8]);
  return cube;
}

function dist3D(x, y, z, x2, y2, z2){
  return tDist(x, 0, x2, 0) + tDist(y, 0, y2, 0) + tDist(z, 0, z2, 0);
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