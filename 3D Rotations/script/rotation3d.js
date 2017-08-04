// Objects:
function Line(point1, point2) {
  this.x = [point1[0], point2[0]];
  this.y = [point1[1], point2[1]];
  this.z = [point1[2], point2[2]];

  this.gObject = function(color) {
    var lineObject = {
      "type": "scatter3d",
      "mode": "lines",
      "x": this.x,
      "y": this.y,
      "z": this.z,
      "line": {"color": color, "width": 7}
    }
    return lineObject;
  }
}

function Point(position) {
  this.position = position;
  this.gObject = function(color) {
    pointObject = {
      "type": "scatter3d",
      "mode": "markers",
      "x": [this.position[0]],
      "y": [this.position[1]],
      "z": [this.position[2]],
      "marker": {"color": color, "size": 7}
    }
    return pointObject;
  }
}

// Rotation Matrices (axis of rotation along x/y/z-axix):
function rotationX(angle) {
  var matrix = [[1, 0, 0], [0, Math.cos(angle), -Math.sin(angle)], [0, Math.sin(angle), Math.cos(angle)]]
  return matrix;
}

function rotationY(angle) {
  var matrix = [[Math.cos(angle), 0, Math.sin(angle)], [0, 1, 0], [-Math.sin(angle), 0, Math.cos(angle)]]
  return matrix;
}

function  rotationZ(angle) {
  var matrix = [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0 ,1]]
  return matrix;
}

var frameSize = 20;

var theta = Math.PI/2;
//var t = numeric.linspace(0, theta, frameSize);
var initialPoint = [2., 2., 2.];

var data = [];

for (var i = 0; i < 8; ++i) {
  data.push(new Line([0.,0.,0.], [0.,0.,0.]).gObject("rgb(0,0,0)"));
}

data.push(new Point(initialPoint).gObject("rgb(0,0,0)"));

for (var i = 0; i < 3; ++i) {
  uvec = [0., 0., 0.];
  uvec[i] = 1;
  data.push(new Line([0.,0.,0], uvec).gObject("rgb(0,0,0)"));
}

console.log(data);
Plotly.plot('graph', data);
