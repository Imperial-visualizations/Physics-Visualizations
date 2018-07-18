let width = $("#art").width(), height = 0.25*$(window).height();

var i=0;

function setup() {
    let art = createCanvas(width,height);
    art.parent("art")
}



function draw() {
    background(255, 255, 255);
    rectMode(CENTER);
    for (var j=0;j<width;++j) {
        if (j%80 === 0) {
            stroke(200,200,200)
            line(j-40,height,j-40,0)
            line(0,j-40,width,j-40)
        };
    };
    noStroke();
    fill(206, 0, 161);
    ellipse(i, height/2,height/10,height/10);
    if (i < width-height/20){
        if (i < (1+width-height/20)) {
            i+=1
        };
        for (var k = 0; k<i; k++) {
            if ((k-2)%20 === 0) {
                stroke(206, 0, 161)
                line(k-8,height/2,k,height/2);
            }
        }
    }

};


function mouseClicked() {
}
