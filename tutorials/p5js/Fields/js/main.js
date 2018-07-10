/*
*********************************************************************************************************************************************************************************************************
888888  8888 8888  8888888  888888  88888888  888888     88      88          88       88  888888  888888  88  88     88     88      888888  888888     88     88888888  888888    88    88    88  888888
  88    88 888 88  88   88  88      88    88    88     88  88    88           88     88     88    88      88  88   88  88   88        88       88    88  88      88       88    88  88  8888  88  88
  88    88     88  8888888  888888  88888888    88    888888888  88            88   88      88    888888  88  88  88888888  88        88      88    88888888     88       88    88  88  88 88 88  888888
  88    88     88  88       88      88  88      88    88     88  88             88 88       88        88  88  88  88    88  88        88     88     88    88     88       88    88  88  88  8888      88
888888  88     88  88       888888  88    88  888888  88     88  888888          888      888888  888888  888888  88    88  888888  888888  888888  88    88     88     888888    88    88   888  888888
*********************************************************************************************************************************************************************************************************
*
* Tutorial for setting up a simple field visualization using the p5.js library
*
* Made by Robert King
*
 */


//Initalization functionx
let charges = [];
const width = 500;
const height = 500;
const resolution = 10;

function setup() {
    let cav = createCanvas(width, height);
    cav.parent("p5canvas");

}

//Runtime function - This is called each frame of the animations.
function draw() {
    /*
    Clear the Background ready for drawing
     */
    clear();
    background(255);

    /*
    Loop through a grid of points to draw the force arrows
     */
    for (let x = 0; x <= width; x += resolution) {
        for (let y = 0; y <= height; y += resolution) {
            if (charges.length < 1) break;
            let F_r = [0, 0];
            charges[0].x = 200*Math.cos(millis()/500)+250;
            for (let i = 0; i < charges.length; i++) {
                //Calculate net field for each point in array
                let F_r_mag = charges[i].charge / (Math.pow(charges[i].x - x, 2) + Math.pow(charges[i].y - y, 2));
                F_r[0] += F_r_mag * Math.cos(Math.atan2(charges[i].y - y, charges[i].x - x));
                F_r[1] += F_r_mag * Math.sin(Math.atan2(charges[i].y - y, charges[i].x - x));
            }
            //Normalise vectors to make them intuitive to understand
            let F_mag = Math.sqrt(Math.pow(F_r[0], 2) + Math.pow(F_r[1], 2));
            F_r[0] /= F_mag * 0.25;
            F_r[1] /= F_mag * 0.25;
            line(x, y, x + F_r[0], y + F_r[1]); //Draw the line!
            //line(x+F_r[0],y+F_r[Fields],x+F_r[0]-0.5,y+F_r[Fields] + 0.5);
            //line(x+F_r[0],y+F_r[Fields],x+F_r[0]-0.5,y+F_r[Fields] - 0.5);
        }
    }
    for (let i = 0; i < charges.length; i++) {
        charges[i].drawellipse();
    }
}
function clearCanvas(){
    //This is called when the button is clicked!
    charges = [];
}
function mouseClicked() {
    //Called whenever there is a mouse click
    if (mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) {//Constrain our mouse click to the canvas
        return;
    }
    //Add a charge (this is a class but don't worry about it) to the array.
    charges.push({
        charge: (document.getElementById('nve').checked)? -1*parseFloat(document.getElementById('chargeSlider').value):parseFloat(document.getElementById('chargeSlider').value),
        x: mouseX,
        y: mouseY,
        drawellipse: function () {

            fill((this.charge>0)?255:0, 0, (this.charge<0)?255:0);
            ellipse(this.x, this.y, 10*Math.abs(this.charge), 10*Math.abs(this.charge));
        }

    });
}