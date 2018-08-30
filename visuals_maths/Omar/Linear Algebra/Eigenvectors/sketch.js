function setup() {
  var myCanvas = createCanvas(450, 450);
  myCanvas.parent("MyContainer");
  noSmooth();
}
var x1, y1, x2, y2;
x1 = 27.5;
y1 = 1.1;
x2 = 2;
y2 = 623;
matrix = [[x1, y1], [x2, y2]];

eigLines = numeric.eig(matrix).E;

theta1 = Math.atan2(eigLines.x[0][1], eigLines.x[0][0])
theta2 = Math.atan2(eigLines.x[1][1], eigLines.x[1][0])

console.log(theta1);

function draw() {
  fill(204, 101, 192, 0);
  strokeWeight(2);
  stroke(0);
    
  ellipse(220, 220, 100, 100);
  ellipse(220, 220, 200, 200);
  ellipse(220, 220, 300, 300);
  ellipse(220, 220, 400, 400);
    
  line(220, 220, 220 + 1200 * Math.cos(theta1), 200 - 1200 * Math.sin(theta1));
      line(220, 220, 220 + 1200 * Math.cos(theta2), 200 - 1200 * Math.sin(theta2));

    
  strokeWeight(10);
  stroke("red");
  point(220 + 50 * Math.cos(theta1), 220 - 50 * Math.sin(theta1));
  point(220 + 50 * Math.cos(theta1), 220 - 50 * Math.sin(theta1));
  point(220 + 100 * Math.cos(theta1), 220 - 100 * Math.sin(theta1));
  point(220 + 150 * Math.cos(theta1), 220 - 150 * Math.sin(theta1));
  point(220 + 200 * Math.cos(theta1), 220 - 200 * Math.sin(theta1));
      stroke("blue");

      point(220 + 50 * Math.cos(theta2), 220 - 50 * Math.sin(theta2));
  point(220 + 50 * Math.cos(theta2), 220 - 50 * Math.sin(theta2));
  point(220 + 100 * Math.cos(theta2), 220 - 100 * Math.sin(theta2));
  point(220 + 150 * Math.cos(theta2), 220 - 150 * Math.sin(theta2));
  point(220 + 200 * Math.cos(theta2), 220 - 200 * Math.sin(theta2));

}

console.log(eigLines.x);
