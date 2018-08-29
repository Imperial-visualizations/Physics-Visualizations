let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
ctx.scale(1, 1); //scale of the canvas
function initPlot_gyro() {
    /** --------------------------------- Set initial plot - drawing - what is displayed initially --------------------------------- **/
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Creates plot for gyroscope by drawing lines
    ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(500, 100);
    ctx.moveTo(0,200);
    ctx.lineTo(500,200);
    ctx.lineTo(500,100);
    ctx.moveTo(0,200);
    ctx.arc(0, 200, 175, 0, (Math.PI/180)*(349),true);
    ctx.stroke();

    //parameters for drawing
    ctx.fillStyle = "black";
    ctx.font = "italic 15pt san-serif";
    ctx.fillText("dL", 507, 150);
    ctx.fillText("L", 400, 190);
    ctx.stroke(); //THIS IS REQUIRED

 // text for the labels on the gyroscope diagram

    ctx.fillStyle = "black";
    ctx.font = "italic 15pt san-serif";
    ctx.fillText("d\u03B8", 100, 195);
    ctx.stroke();
}