var distances = [];
var maxDistance;
var spacer;

var matrix = math.matrix([[1/4,0/6], [0 /6, 1/4]]);

var rotate90 = math.matrix([
  [Math.cos(Math.PI / 2), -Math.sin(Math.PI / 2)],
  [Math.sin(Math.PI / 2), Math.cos(Math.PI / 2)]
]);

var rotate180 = math.matrix([
  [Math.cos(Math.PI), -Math.sin(Math.PI)],
  [Math.sin(Math.PI), Math.cos(Math.PI)]
]);

var rotate270 = math.matrix([
  [Math.cos((3 * Math.PI) / 2), -Math.sin((3 * Math.PI) / 2)],
  [Math.sin((3 * Math.PI) / 2), Math.cos( 3 * Math.PI/2)]
]);

function setup() {
  frameRate(10);
  createCanvas(720, 720);
  maxDistance = dist(width / 2, height / 2, width, height);
  for (var x = 0; x < width; x++) {
    distances[x] = []; // create nested array
    for (var y = 0; y < height; y++) {
      var distance = dist(width / 2, height / 2, x, y);
      distances[x][y] = (distance / maxDistance) * 255;
    }
  }
  spacer = 55.5;
  noLoop(); // Run once and stop
}

function draw() {
  background(0);
  // This embedded loop skips over values in the arrays based on
  // the spacer variable, so there are more values in the array
  // than are drawn here. Change the value of the spacer variable
  // to change the density of the points
  stroke(255);
  line(360, 0, 360, 720);
  line(0, 360, 720, 360);
  for (var x = 0; x < width; x += spacer) {
    for (var y = 0; y < height; y += spacer) {
      push();
      stroke(255);
      strokeWeight(5);
      //point(x + spacer / 2, y + spacer / 2);

      var pointMatrix = math.matrix([
        [x + spacer / 2],
        [height - (y + spacer / 2)]
      ]);

      //

      console.log(pointMatrix);
      //

      var pointTransformed = math.multiply(matrix, pointMatrix);
      pop();

      var pointRotated90 = math.multiply(rotate90, pointMatrix);

      var vectorRotated90 = math.matrix([
        [parseFloat(pointRotated90._data[0])],
        [parseFloat(pointRotated90._data[1])]
      ]);

      var pointR90T = math.multiply(matrix, vectorRotated90);

      push();
      stroke("white");
      strokeWeight(9);

      var xy = parseFloat(pointTransformed._data[0]) + 360;

      point(xy, height - pointTransformed._data[1] - 360);

      pop();

      // second quarter

      push();
      stroke("white");
      strokeWeight(9);

      var pointRotated90x = [
        [parseFloat(pointR90T._data[0]) + 360],
        [pointR90T._data[1]]
      ];

      point(pointRotated90x[0], height - pointRotated90x[1] - 360);

      // third quarter
      var pointRotated180 = math.multiply(rotate180, pointMatrix);

      var vectorRotated180 = math.matrix([
        [parseFloat(pointRotated180._data[0])],
        [parseFloat(pointRotated180._data[1])]
      ]);

      var pointR180T = math.multiply(matrix, vectorRotated180);

      var pointRotated180x = [
        [parseFloat(pointR180T._data[0]) + 360],
        [pointR180T._data[1]]
      ];
      point(pointRotated180x[0], height - pointRotated180x[1] - 360);

      // fourth quarter

      var pointRotated270 = math.multiply(rotate270, pointMatrix);

      var vectorRotated270 = math.matrix([
        [parseFloat(pointRotated270._data[0])],
        [parseFloat(pointRotated270._data[1])]
      ]);

      var pointR270T = math.multiply(matrix, vectorRotated270);

      var pointRotated270x = [
        [parseFloat(pointR270T._data[0]) + 360],
        [pointR270T._data[1]]
      ];
      point(pointRotated270x[0], height - pointRotated270x[1] - 360);
    }
  }
}
