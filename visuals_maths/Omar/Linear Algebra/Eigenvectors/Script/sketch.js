function setup() {
  var myCanvas = createCanvas(500, 500);
  myCanvas.parent("MyContainer");
  noSmooth();
}
var x1, y1, x2, y2;
x1 = 0.0543;
y1 = 0.05;
x2 = 0.03;
y2 = 0.03;
matrix = [[x1, y1], [x2, y2]];

eigLines = numeric.eig(matrix).E;

theta1 = Math.atan2(eigLines.x[0][1], eigLines.x[0][0]);
theta2 = Math.atan2(eigLines.x[1][1], eigLines.x[1][0]);

function draw() {
  fill(204, 101, 192, 0);
  //plotting the reference circles
  strokeWeight(1);
  stroke(0);
  ellipse(250, 250, 100, 100);
  ellipse(250, 250, 200, 200);
  ellipse(250, 250, 300, 300);
  ellipse(250, 250, 400, 400);

  //plotting the eigenvector lines
  strokeWeight(2);
  stroke(0);
  line(250, 250, 250 + 1200 * Math.cos(theta1), 250 - 1200 * Math.sin(theta1));
  line(250, 250, 250 + 1200 * Math.cos(theta2), 250 - 1200 * Math.sin(theta2));

  //plotting axes
  strokeWeight(0.5);
  stroke("gray");
  line(250, 0, 250, 500);
  line(0, 250, 500, 250);

  //plotting grid
  strokeWeight(1);
  for (var i = 0; i < 11; i++) {
    line((500 * i) / 10, 0, (500 * i) / 10, 500);
    line(0, (500 * i) / 10, 500, (500 * i) / 10);
  }

  //def
  strokeWeight(7);
  stroke("red");

  //plotting the points of intersection of the iegenvectos with the circles. 

    
    point(250 + 50 * Math.cos(theta1), 250 - 50 * Math.sin(theta1));
    
  point(250 + 50 * Math.cos(theta1), 250 - 50 * Math.sin(theta1));

  point(250 + 100 * Math.cos(theta1), 250 - 100 * Math.sin(theta1));

  point(250 + 150 * Math.cos(theta1), 250 - 150 * Math.sin(theta1));

  point(250 + 200 * Math.cos(theta1), 250 - 200 * Math.sin(theta1));

  stroke("blue");

  point(250 + 50 * Math.cos(theta2), 250 - 50 * Math.sin(theta2));

  point(250 + 50 * Math.cos(theta2), 250 - 50 * Math.sin(theta2));

  point(250 + 100 * Math.cos(theta2), 250 - 100 * Math.sin(theta2));

  point(250 + 150 * Math.cos(theta2), 250 - 150 * Math.sin(theta2));

  point(250 + 200 * Math.cos(theta2), 250 - 200 * Math.sin(theta2));

  //plotting general points:
  stroke("green");

  for (var i = 0; i < 5; ++i) {
    for (var j = 1; j < 9; ++j) {
      if (theta1 + (j * Math.PI) / 4 === theta2) {
      }
      point(
        250 + 50 * i * Math.cos(0 + (j * Math.PI) / 4),
        250 - 50 * i * Math.sin(0 + (j * Math.PI) / 4)
      );
        
    }
  }
    
//transforming points
    
   var point1 = math.matrix([250 + 50 * math.cos(theta1),250 - 50 * math.sin(theta1)]) 
   var point1t = math.multiply(point1, matrix)

   strokeWeight(30)
   point(point1t._data[0], point1t._data[1])
    console.log(point1t)
    
//plotting transformed points: 
    

}
