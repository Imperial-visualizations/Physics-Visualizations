var arr1 = [];
var arr2 = [];
function setup(){
    var graph1 = createCanvas(400,600);
    //give graph1 an id
    graph1.parent("graph")
    //create a set of arrows pointing to the right
    for (var i=1; i<10; ++i){
        for (var j=1; j<20; ++j){
            arr1.push(new Arrow(20*i,20*j,j**0.25));

       }
    }
    //create a set of arrows pointing to the left
    for (var i=1; i<10; ++i){
        for (var j=1; j<20; ++j){
            arr2.push(new Arrow(20*i+200+0.5*j,20*j,j**0.25));

       }
    }
}

function draw(){
    background(255)
    //draw out all the arrows
    for (var k=0; k<arr1.length; ++k){
        arr1[k].update();
    }
    for (var k=0; k<arr2.length; ++k){
        arr2[k].update();
    }
    push();

    //draw the paddle wheel, make it update with mouse position
    if (mouseY < 400.5){
        translate(mouseX, mouseY);
        if (mouseX<200.5){
            rotate(-frameCount*mouseY / 2000.0);
            fill(200,10,255)
        }else if (mouseX>200.5){
            rotate(frameCount*mouseY / 2000.0);
            fill(200,255,10)
        }
        star(0, 0, 5, 20, 4);
        pop();
    }

    //draw the dot and cross that represent the direction of the curl
    push();
    fill(255,255,255)
    arc(100, 500, 40, 40, 0, TWO_PI)
    push();
    fill(200,10,255)
    ellipse(100,500,20,20)

    push();
    fill(255,255,255)
    arc(300, 500, 40, 40, 0, TWO_PI)

    push();
    translate(300,500)
    fill(200,255,10)
    rotate(QUARTER_PI);
    rect(-15,-3,30,5);
    pop();

    push();
    translate(300,500)
    fill(200,255,10)
    rotate(PI-QUARTER_PI);
    rect(-15,-3,30,5);

}

/**
 * Represents an arrow.
 * @constructor
 * @param {float} x - x position of the first point on the arrow.
 * @param {float} y - y position of the first point on the arrow.
 * @param {float} length - define the size of the arrow.
 */
function Arrow(x,y,length){
    this.x = x;
    this.y = y;
    this.length = length;
    this.update = function(){
    push();
    translate(this.x,this.y);
    if (x<200.5){
        rotate(0)
        fill(0,100,255)
    }else if (x>200.5){
        rotate(PI)
        fill(255,100,0)
    }
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


/**
 * Represents a star.
 * @constructor
 * @param {float} x - x position of the center of the star.
 * @param {float} y - y position of the center of the star.
 * @param {float} radius1 - length of the centre of the star to the inner vertex.
 * @param {float} radius2 - length of the centre of the star to the outer vertex.
 * @param {float} npoints - number of the points of the star.
 */
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


//load main
function main() {

    initGuidance(["graph","curl"]);
}

$(document).ready(main);