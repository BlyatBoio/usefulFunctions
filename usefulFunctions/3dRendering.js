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
    let a1 = atan2(z - this.z, x - this.x); // Horizontal angle to point
    let a2 = tDist(y, this.y) // Vertical angle to point

    a1 = radToDeg(a1); // convert radians to degrees
    a2 = radToDeg(a2);

    let xPos = width/2 + ((width/2) * ((a1+this.xRotation)/this.FOV));
    let yPos = height/2 + ((height/2) * ((a2+this.yRotation)/this.FOV));

    let totalDist = dist3D(x, y, z, this.x, this.y, this.z); // get the total distance from the camera to the point
    let circleSize = 20-totalDist; // get the final size
    if(circleSize >= 0) ellipse(xPos, yPos, circleSize); // draw the point
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
    this.xRotation -= movedX/10;
    this.yRotation -= movedY/10;
  }
  keyboardControls(){
    if(keyIsDown(87)){
      
    }
  }
}

class vertex3D{
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
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