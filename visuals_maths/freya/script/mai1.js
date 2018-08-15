var arr = [];

function setup(){
    createCanvas(400,400);
    for (var i=1; i<20; ++i){
        for (var j=1; j<20; ++j){
            arr.push(new Arrow(20*i,20*j,2));
       }
    }
}

function draw(){
    background(255)
    fill(0,100,255)
    for (var k=0; k<arr.length; ++k){
        arr[k].update();
    }
    push();
    translate(mouseX, mouseY);
    rotate(frameCount*mouseX*mouseY / 200.0);
    fill(200,10,255)
    star(0, 0, 5, 20, 4);
    pop();
}
function Arrow(x,y,length){
    this.x = x;
    this.y = y;
    this.length = length;
    this.update = function(){
    var angle = atan2(this.y*this.y,this.x*this.x);
    push();
    translate(this.x,this.y);
    rotate(angle);
    beginShape();
    vertex(0, -this.length);
    vertex(5*this.length,-this.length);
    vertex(5*this.length,-3*this.length);
    vertex(9*this.length,0);
    vertex(5*this.length,3*this.length);
    vertex(5*this.length,this.length);
    vertex(0,this.length);
    endShape(CLOSE);
    pop();
    }
}

function star(x,y,radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}




