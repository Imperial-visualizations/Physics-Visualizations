let rectX= 100, rectY=100, rectWidth=50, rectHeight = 50;

function setup(){

    createCanvas(200, 200); // dimensions of canvas
    fill(255,0,0); // colour in hex
}

function draw(){

    clear();
    rect(rectX,rectY,rectWidth,rectHeight); // first 2 args relative to top left, last two is size
}
function mouseClicked(){
    fill(random(0,255),random(0,255),random(0,255));

}

function mouseDragged(){
if(mousex < rectX || mouseX > rectX + rectWidth){
    return;
}
else if (mouseY < rectY || mouseY > rectY + rectHeight){

    return;
}
//alert("you tried to drag the box!");

  rectX = mouseX;
  rectY = mouseY;
};
//width + height