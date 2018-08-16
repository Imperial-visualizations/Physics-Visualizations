var currentHref = window.location.href;
var arr1 = [];
var arr2 = [];
function setup(){
    var graph1 = createCanvas(400,400);
    graph1.parent("graph")
    var graph2 = createCanvas(400,100)
    graph2.parent("graph2")
    for (var i=1; i<10; ++i){
        for (var j=1; j<20; ++j){
            arr1.push(new Arrow(20*i,20*j,j**0.25));

       }
    }
    for (var i=1; i<10; ++i){
        for (var j=1; j<20; ++j){
            arr2.push(new Arrow(20*i+200+0.5*j,20*j,j**0.25));

       }
    }
}

function draw(){
    background(255)
    for (var k=0; k<arr1.length; ++k){
        arr1[k].update();
    }
    for (var k=0; k<arr2.length; ++k){
        arr2[k].update();
    }
    push();
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

function main() {
    draw()
    $(".rightnav").on('click',function(){
        window.location.href =
            currentHref.slice(0,-6)
            +(parseInt(currentHref.slice(-6,-5))+1) + ".html";
    });

    $(".rightnav").on("mouseenter", function() {
        $(".rightnav").css({"color":"#1a0433","font-size":"55px"});
    }).on('mouseleave', function(){
        $(".rightnav").css({"color":"#330766","font-size":"50px"});
    });

    $(".leftnav").on('click',function(){
        window.location.href =
            currentHref.slice(0,-6)
            +(parseInt(currentHref.slice(-6,-5))-1) + ".html";
    });

    $(".leftnav").on("mouseenter", function() {
        $(".leftnav").css({"color":"#1a0433","font-size":"55px"})
    }).on('mouseleave', function(){
        $(".leftnav").css({"color":"#330766","font-size":"50px"})
    });

}
$(document).ready(main);