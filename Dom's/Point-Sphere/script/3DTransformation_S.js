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
function Sphere(radius) {
  this.radius = radius;
  var meshSize = 20;
  var theta = numeric.linspace(0, 2*Math.PI, meshSize);
  var phi = numeric.linspace(0, Math.PI, meshSize);
  this.x = [], this.y = [], this.z = [];
  for(var i = 0; i < meshSize; ++i) {
    this.x[i] = [], this.y[i] = [], this.z[i] = [];
    for(var j = 0; j < meshSize; ++j){
      this.x[i].push(radius*Math.cos(theta[i])*Math.sin(phi[j]));
      this.y[i].push(radius*Math.sin(theta[i])*Math.sin(phi[j]));
      this.z[i].push(radius*Math.cos(phi[j]));
    }
  }
  this.gObject = function(color1, color2) {
    var sphere = {
      "type": "surface",
      "x": this.x,
      "y": this.y,
      "z": this.z,
      "showscale": false,
      "opacity": 0.7,
      "colorscale": [[0.0, color1], [1.0, color2]]
    }
    return sphere;
  }
}

// Rotation Matrices (axis of rotation along x/y/z-axix):
function rotationX(angle) {
  var matrix = [[1, 0, 0], [0, Math.cos(angle), -Math.sin(angle)], [0, Math.sin(angle), Math.cos(angle)]];
  return matrix;
}
function rotationY(angle) {
  var matrix = [[Math.cos(angle), 0, Math.sin(angle)], [0, 1, 0], [-Math.sin(angle), 0, Math.cos(angle)]];
  return matrix;
}
function rotationZ(angle) {
  var matrix = [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0 ,1]];
  return matrix;
}

//Scaling Matrices
function scaleX(factor) {
  var matrix = [[factor, 0, 0], [0, 1, 0], [0, 0, 1]];
  return matrix;
}
function scaleY(factor) {
  var matrix = [[1, 0, 0], [0, factor, 0], [0, 0, 1]];
  return matrix;
}
function scaleZ(factor) {
  var matrix = [[1, 0, 0], [0, 1, 0], [0, 0 ,factor]];
  return matrix;
}
function scaleAll(factorAll) {
  var matrix = [[factorAll[0], 0, 0], [0, factorAll[1], 0], [0, 0, factorAll[2]]];
  return matrix;
}

//Transformation algorithms
function computeFrames(transformation, start, end, initialPoint, frameSize) {
  var intermediate = numeric.linspace(start, end, frameSize);
  var traceLine = [initialPoint];
  var frames =[];
  var name;
  var newPoint;

  for (var i = 0, n = intermediate.length; i < n; ++i) {
    newPoint = math.multiply(transformation(intermediate[i]), initialPoint);
    traceLine.push(newPoint);
    name = 'frame' + i;
    frames.push({
      "name": name,
      "data": [
        {
          "x": [newPoint[0]],
          "y": [newPoint[1]],
          "z": [newPoint[2]]
        },
        new Line(traceLine).gObject("rgb(255,0,0)")
      ]
    })
  }
  return frames;
}
function computeCompositeFrames(rotation1, rotation2, angle1, angle2, initialPoint, frameSize, color1, color2) {
  var intermediate1 = numeric.linspace(0.0, angle1, frameSize);
  var intermediate2 = numeric.linspace(0.0, angle2, frameSize);
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
  return frames;
}
function computeCommute(rotation1, rotation2, theta1, theta2, frameSize) {
  var frameList1 = computeCompositeFrames(
    rotation1, rotation2,
    theta1, theta2,
    initialPoint, frameSize,
    "rgb(255,0,0)", "rgb(0,0,255)");

  var frameList2 = computeCompositeFrames(
    rotation2, rotation1,
    theta1, theta2,
    initialPoint, frameSize,
    "rgb(0,0,255)", "rgb(255,0,0)");

  var frames = [];
  for (var i = 0; i < frameList1.length; ++i) {
    frames.push({
      "data": [
        frameList1[i][0], frameList1[i][1], frameList1[i][2],
        frameList2[i][0], frameList2[i][1], frameList2[i][2]
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
    "currentvalue": {"prefix": "Trasformation: "},
    "pad": {"t":10},
    "steps": steps
  }];

  var layout = {
    "width": 700, "height": 600,
    "margin": {l:0, r:0, t:0, b:0},
    "hovermode": "closest",
    "updatemenus": [
      {
        "x": 0.0, "y": 1,
        "xanchor": "left", "yanchor": "top",
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
      }
    ],
    "showlegend": false,
    "sliders": sliders,
    "scene": {
      "camera": createView(initialPoint),
      "xaxis": {range: [-4, 4]},
      "yaxis": {range: [-4, 4]},
      "zaxis": {range: [-4, 4]}
    }
  }
  return [frames, layout];
}

//Global Initial Parameters:
var initialPoint = [2., 2., 2.];
var radius = 2*Math.sqrt(3);
var animatePause = false;
var layout = {
  "width": 700, "height": 600,
  "margin": {l:0, r:0, t:0, b:0},
  "hovermode": "closest",
  "showlegend": false,
  "scene": {
    camera: createView(initialPoint),
    xaxis: {range: [-4, 4]},
    yaxis: {range: [-4, 4]},
    zaxis: {range: [-4, 4]}
  }
}

//Hide/Show Option (Rotation) - for better interface
// Rotation
var rotationType = 0; //To keep track of which button is active also keep track of toggle
function hideRotate() {
  $('.rotateCP1').hide();
  $('.rotateCP2').hide();
  $('.rotateCP3').hide();
  $('.rotateCommute').hide();
}
function showRotate(axis) {
  if (axis === 1 & axis !== rotationType){
    hideRotate();
    $('.rotateCP1').slideToggle(600);
  } else if (axis === 2 & axis !== rotationType){
    hideRotate();
    $('.rotateCP2').slideToggle(600);
  } else if (axis === 3 & axis !== rotationType){
    hideRotate();
    $('.rotateCP3').slideToggle(600);
  }
  rotationType = axis;
}
var rotateMain = true;
function revealRotate(axis) {
  hideCommute();
  plotInit();
  showRotate(axis);
}
//Commute
function hideCommute() {
  $('.rotateCommute').hide();
}
function showCommute() {
  $('.rotateCommute').slideToggle(600);
}
function revealCommute() {
  $('.rotate3D').slideToggle(600);
  $('.rotateSlider').slideToggle(600);
  hideRotate();
  showCommute();
  plotCommute();
  rotationType = 0;
  $('.tab-nav').hide();
}
function unrevealCommute() {
  $('.tab-nav').slideToggle(600);
  $('.rotate3D').slideToggle(600);
  $('.rotateSlider').slideToggle(600);
  revealRotate(1);
}

//Animation Options
function startAnimation (frames) {
  Plotly.animate('graph', frames,{
    fromcurrent: true,
    transition: {
      duration: 55,
      easing: "quadratic-in-out"
    },
    frame: {
      duration: 55,
      redraw: false,
    },
    mode: "immediate"
  });
}
function stopAnimation () {
  Plotly.animate('graph', [], {mode: 'next'});
}

//Plots
function init() {
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

  sphere = new Sphere(radius);
  data.push(sphere.gObject("rgb(0,62,116)", "rgb(255,255,255)"));

  return data;
} //Initialise
function plotInit() {
  var data = init();
  var figure = {"data": data, "layout": layout}
  Plotly.newPlot('graph', figure,);
}
function plotInitialSphere(frames) {
  sphere = new Sphere(radius);

  Plotly.newPlot('graph', [
    {
      x: frames[0].data[0].x,
      y: frames[0].data[0].y,
      z: frames[0].data[0].z,
      marker: {size:7, color:"rgb(0,0,0)"},
      type: "scatter3d",
      mode: "markers"
    },
    {
      x: frames[0].data[1].x,
      y: frames[0].data[1].y,
      z: frames[0].data[1].z,
      marker: {width:7, color:"rgb(255,0,0)"},
      type: "scatter3d",
      mode: "lines"
    },
    {
      x: frames[0].data[0].x,
      y: frames[0].data[0].y,
      z: frames[0].data[0].z,
      marker: {size:7, color:"rgb(0,0,0,0.5)"},
      type: "scatter3d",
      mode: "markers"
  },
    sphere.gObject("rgb(0,62,116)", "rgb(255,255,255)"),
    new Line([[0.,0.,0], [1,0,0]]).gObject("rgb(0,0,0)"),
    new Line([[0.,0.,0], [0,1,0]]).gObject("rgb(0,0,0)"),
    new Line([[0.,0.,0], [0,0,1]]).gObject("rgb(0,0,0)")],
    layout
  )
}
function plotRotate(axis) {
  var slider = document.getElementById('rotator').value;
  var angle = slider * Math.PI;
  var frames;
  var frameSize = 24 * Math.abs(slider); //frameSize proportional to angle. multi of "8"
  if (axis === 1) {
    frames = computeFrames(rotationX, 0, angle, initialPoint, frameSize);
  } else if (axis === 2) {
    frames = computeFrames(rotationY, 0, angle, initialPoint, frameSize);
  } else if (axis === 3) {
    frames = computeFrames(rotationZ, 0, angle, initialPoint, frameSize);
  }
  plotInitialSphere(frames);
  startAnimation(frames);
  displayRotationMatrix();
}
function plotReflect(plane) {
  var frames;
  var frameSize = 10;
  if (plane === 1) {
    frames = computeFrames(scaleX, 1, -1, initialPoint, frameSize);
  } else if (plane === 2) {
    frames = computeFrames(scaleY, 1, -1, initialPoint, frameSize);
  } else if (plane === 3) {
    frames = computeFrames(scaleZ, 1, -1, initialPoint, frameSize);
  }

  plotInitialSphere(frames);
  //Plotly.plot('graph', [new Line([[0.,0.,0], [2,2,2]]).gObject("rgb(0,0,0)")]);
  startAnimation(frames);
}
function plotScale(direction) {
  var factor  = document.getElementById('scaler').value;
  var frames;
  var frameSize = 10;
  var scaling = [1, 1, 1];
  if (direction === 1) {
    frames = computeFrames(scaleX, 1, factor, initialPoint, frameSize);
  } else if (direction === 2) {
    frames = computeFrames(scaleY, 1, factor, initialPoint, frameSize);
  } else if (direction === 3) {
    frames = computeFrames(scaleZ, 1, factor, initialPoint, frameSize);
  }

  plotInitialSphere(frames);
  startAnimation(frames);
}
//Plot for commute
function plotGraph(data, [frames, layout]) {
  var figure = {
    "data": data,
    "frames": frames,
    "layout": layout
  }
  Plotly.newPlot('graph', figure);
} //only to plot commute!
function plotCommute() {
  var data1, data2;
  var theta1 = document.getElementById('rotator1').value * Math.PI;
  var theta2 = document.getElementById('rotator2').value * Math.PI;
  var frameSize = 20;
  data1 = init();
  data2 = computeCommute(rotationY, rotationZ, theta1, theta2, frameSize);
  plotGraph(data1, data2);
}
//Layout
function createView(point) {
  var norm = Math.sqrt(point[0]**2 + (5*point[1])**2 + point[2]**2);
  var a = 0.5 + point[0]/norm, b = 1 +  5*point[1]/norm, c = 0.5 + point[2]/norm;
  var camera = {
    eye: {x: a, y: b, z: c}
  }
  return camera
}

//Slider Value and Matrix grid Value
function makeTableHTML(myArray) {
    var result = "<table><tbody>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}
function displayRotationMatrix() {
  var angle = document.getElementById("rotator").value;
  var cosAngle = "cos("+String(Math.abs(angle))+"π"+")";
  var sinAngle1 = "sin(0)", sinAngle2 = "-sin(0)";
  if (angle > 0) {
    sinAngle1 = "sin(" + String(angle)+"π)"; sinAngle2 = "-sin(" + String(angle)+"π)";
  } else if (angle < 0) {
    sinAngle1 = "-sin(" + String(-angle)+"π)"; sinAngle2 = "sin(" + String(-angle)+"π)";
  }
  if (rotationType === 1) {
    document.getElementById("rotateMatrix").innerHTML=makeTableHTML(
      [
        ["1", "0", "0"],
        ["0", cosAngle, sinAngle2],
        ["0", sinAngle1, cosAngle]
      ]
    )
  } else if (rotationType === 2) {
    document.getElementById("rotateMatrix").innerHTML=makeTableHTML(
      [
        [cosAngle, "0", sinAngle1],
        ["0", "1", "0"],
        [sinAngle2, "0", cosAngle]
      ]
    )
  } else if (rotationType === 3) {
    document.getElementById("rotateMatrix").innerHTML=makeTableHTML(
      [
        [cosAngle, sinAngle2, "0"],
        [sinAngle1, cosAngle, "0"],
        ["0", "0" ,"1"]
      ]
    )
  }
}
function displayReflectionMatrix() {
}
function displayScaleMatrix() {
}

function main() {
  $("input[type=range]").each(function () {
    $(this).on('input', function(){
          $("#"+$(this).attr("id") + "Display").text(  $(this).val() + $("#"+$(this).attr("id")+"Display").attr("data-unit")  );
    });
  });
  plotInit();
  revealRotate(1); //Since Rotate is the active tab (html)
}
$(document).ready(main);
