// Objects:
function Line(points) {
  this.x = [];
  this.y = [];
  this.z = [];
  for (var i = 0; i  < points.length; ++i) {
    this.x.push(points[i][0]);
    this.y.push(points[i][1]);
    this.z.push(points[i][2]);
  }

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

//Transformation algorithms
function computeCompositeFrames(rotation1, rotation2, angle1, angle2, initialPoint, frameSize, color1, color2) {
  intermediate1 = numeric.linspace(0.0, angle1, frameSize);
  intermediate2 = numeric.linspace(0.0, angle2, frameSize);
  var trace1 = [initialPoint];
  var frames = [];

  for (var i = 0, n = intermediate1.length; i < n; ++i) {
    var newPoint = math.multiply(rotation1(intermediate1[i]), initialPoint);
    trace1.push(newPoint);
    var firstTrace = new Line(trace1);
    frames.push(
      [new Point(newPoint).gObject(),
      firstTrace.gObject(color1),
      new Line([[0., 0., 0.], [0., 0., 0.]]).gObject()]);
  }
var trace2 = [newPoint];
  for (var i = 1, n = intermediate2.length; i < n; ++i) {
    var newPoint2 = math.multiply(rotation2(intermediate2[i]), newPoint);
    trace2.push(newPoint2);
    frames.push(
      [new Point(newPoint2).gObject(),
      new Line(trace2).gObject(color2),
      firstTrace.gObject(color1.slice(0, -1) + ",0.7)")]);
  }
  console.log()
  return frames;
}

var frameSize = 20;
var theta = Math.PI/2;
var initialPoint = [2., 2., 2.];

var data = [];

for (var i = 0; i < 8; ++i) {
  data.push(new Line([[0.,0.,0.], [0.,0.,0.]]).gObject("rgb(0,0,0)"));
}

data.push(new Point(initialPoint).gObject("rgb(0,0,0)"));

for (var i = 0; i < 3; ++i) {
  uvec = [0., 0., 0.];
  uvec[i] = 1;
  data.push(new Line([[0.,0.,0], uvec]).gObject("rgb(0,0,0)"));
}

var frameList1 = computeCompositeFrames(
  rotationY,
  rotationZ,
  Math.PI/2,
  Math.PI/2,
  initialPoint,
  frameSize,
  "rgb(255,0,0)",
  "rgb(0,0,255)");

var frameList2 = computeCompositeFrames(
  rotationZ,
  rotationY,
  Math.PI/2,
  Math.PI/2,
  initialPoint,
  frameSize,
  "rgb(0,0,255)",
  "rgb(255,0,0)");

var frames = [];
for (var i = 0; i < frameList1.length; ++i) {
  frames.push({
    "data": [
      frameList1[i][0],
      frameList1[i][1],
      frameList1[i][2],
      frameList2[i][0],
      frameList2[i][1],
      frameList2[i][2]
    ],
    "name": i
  })
}

var steps=[]
for (var i = 0; i < frameSize; ++i) {
  steps.push({
    "label": "R1",
    "method": "animate",
    "args": [
      [i],
      {
        "mode": "immediate",
        "transition": {
          "duration": 300,
        },
        "frame": {
          "duration": 300,
          "redraw": false
        }
      }
    ]
  })
}

for (var i = 0; i < frameSize - 1; ++i) {
  steps.push({
    "label": "R2",
    "method": "animate",
    "args": [
      [i + frameSize],
      {
        "mode": "immediate",
        "transition": {
          "duration": 300,
        },
        "frame": {
          "duration": 300,
          "redraw": false
        }
      }
    ]
  })
}

var sliders= [{
  "active": 0,
  "pad": {"t":5},
  "steps": steps
}];

var layout = {
  "width": 750,
  "height": 600,
  "title": "Non-Communativeness of 3D Rotation",
  "hovermode": "closest",
  "updatemenus": [{
    "x": 0.0,
    "y": 0.15,
    "xanchor": "right",
    "yanchor": "top",
    "showactive": false,
    "type": "buttons",
    "pad": {"t": 87, "r": 10},
    "buttons": [
      {
        "method": "animate",
        "args": [null, {"fromcurrent": true, "transition": {"duration": 50, "easing": "quadratic-in-out"}, "frame": {"duration": 50, "redraw":false}}],
        "label": "Play"
      },
      {
        "method": "animate",
        "args":[[null], {"mode": "immediate", "transition": {"duration": 0}, "frame": {"duration": 0, "redraw": false}}],
        "label": "Pause"
      }
  ]
}],
"showlegend": false,
"sliders": sliders
}

var figure = {
  "data": data,
  "frames": frames,
  "layout": layout
}
console.log(figure);
Plotly.plot('graph', figure);
