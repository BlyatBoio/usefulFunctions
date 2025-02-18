function setup(){
  createCanvas(windowWidth, windowHeight);
  Console = new consoleClass();
  consoleInput = createInput();
  consoleInput.position(Console.logSpacing, height - 40);
  consoleInput.size((width/5)-((2*Console.logSpacing)+10));
  defineThemes();
}

function draw(){
  themeBackground();
  runtime ++;
  onScreenConsole();
  mouseScrolled = 0;
  if(mouseHasScrolled) scrollTimer ++;
  if(scrollTimer > 500){
    mouseHasScrolled = false;
    scrollTimer = 0;
    logStartPos = Console.logs.length - 80;
  }
}