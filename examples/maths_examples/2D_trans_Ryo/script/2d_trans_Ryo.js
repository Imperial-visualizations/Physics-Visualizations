// Rotation matrix
function rotmat(th) {
  var rotator = [[Math.cos(th),-Math.sin(th)],[Math.sin(th),Math.cos(th)]];
  return rotator;
}

// Rotation function returns arrays x,y for smooth transition
function rotation(vec,th) {
  // Parameters
  var N = 50;
  var t = numeric.linspace(0,th,N);
  // Rotation matrix
  var x = [];
  var y = [];
  var myvec = math.matrix(vec);
  for (var i=0; i<N; i++) {
    var newvec = math.multiply(rotmat(t[i]),myvec);
      // Pull out x and y components
        x.push(newvec._data[0])
        y.push(newvec._data[1])
  }
  return [x,y];
}

// Scale function returns arrays of similar form to rotation()
// Arguments must go in of the form (vec, scale1, scale2)
function scale() {
  // Define variables and parameters
  var N = 50;
  var vec = arguments[0];
  if (arguments.length === 2){
    var x = numeric.linspace(vec[0],arguments[1]*vec[0],N);
    var y = numeric.linspace(vec[1],arguments[1]*vec[1],N);
  } else if (arguments.length === 3) {
    var x = numeric.linspace(vec[0],arguments[1]*vec[0],N);
    var y = numeric.linspace(vec[1],arguments[2]*vec[1],N);
  }
  return [x,y]
}

function skew(vec,axis) {
  // Number of frames
  var N = 50;
  // If axis = 0 then skew in x-direction
  if (axis === 0) {
    var A = [[1,1],[0,1]];
    var newvec = math.multiply(A,math.matrix(vec));
    var x = numeric.linspace(vec[0],newvec._data[0],N);
    var y = numeric.linspace(vec[1],newvec._data[1],N);
    return [x,y]
  }
  else if (axis === 1) {
    var A = [[1,0],[1,1]];
    var newvec = math.multiply(A,math.matrix(vec));
    var x = numeric.linspace(vec[0],newvec._data[0],N);
    var y = numeric.linspace(vec[1],newvec._data[1],N);
    return [x,y]
  }
}

// Custom matrix transformation, arguments form matrix [[a,b],[c,d]]
function custom(vec,a,b,c,d) {
  var N = 50;
  var A = [[a,b],[c,d]];
  var x0 = vec[0];
  var y0 = vec[1];
  var newvec = math.multiply(A,math.matrix(vec));
  var x = numeric.linspace(x0,newvec._data[0],N);
  var y = numeric.linspace(y0,newvec._data[1],N);
  return[x,y]
}

// Convert x,y arrays returned from functions in json format for animate
function jsonFormat(x,y) {
  var myJson = [];
  var N = x.length;
  for (var i=0; i<N; i++) {
    myJson.push({"data": [{"x": [x[i],0],"y": [y[i],0]}],"name": 'frame'+parseInt(i)})
  }
  return myJson;
}

// Custom linspace function, probably will not need it...
function mylinspace(a,b,n) {
  var h = (b-a)/(n-1);
  var myinterval = [];
  for (var i=0; i<n; i++) {
    myinterval.push(a+i*h);
  }
  return myinterval;
}

///// NOW START TO DEFORM SQUARES WITH FUNCTIONS WE'VE ALREADY WRITTEN /////

// Structure of this function goes:
// (string for transformation, parameters)
function squareTrans() {
  if (arguments[0] === "rotate") {
    var th = arguments[1];
    var [x0,y0] = rotation([1,0],th);
    var [x1,y1] = rotation([1,1],th);
    var [x2,y2] = rotation([0,1],th);
    return [x0,x1,x2,y0,y1,y2]
  }
  else if (arguments[0] === "scale") {
    // If only 1 scale argument given
    if (arguments.length === 2) {
      var s = arguments[1];
      var [x0,y0] = scale([1,0],s);
      var [x1,y1] = scale([1,1],s);
      var [x2,y2] = scale([0,1],s);
      return [x0,x1,x2,y0,y1,y2]
    }
    else if (arguments.length === 3){
      var s1 = arguments[1];
      var s2 = arguments[2];
      var [x0,y0] = scale([1,0],s1,s2);
      var [x1,y1] = scale([1,1],s1,s2);
      var [x2,y2] = scale([0,1],s1,s2);
      return [x0,x1,x2,y0,y1,y2]
    }
  }
  else if (arguments[0] === "custom") {
    var a = arguments[1], b = arguments[2],
     c = arguments[3], d = arguments[4];
    var [x0,y0] = custom([1,0],a,b,c,d);
    var [x1,y1] = custom([1,1],a,b,c,d);
    var [x2,y2] = custom([0,1],a,b,c,d);
    return [x0,x1,x2,y0,y1,y2]
  }
  else if (arguments[0] === "skew") {
    var axis = arguments[1];
    var [x0,y0] = skew([1,0],axis);
    var [x1,y1] = skew([1,1],axis);
    var [x2,y2] = skew([0,1],axis);
    return [x0,x1,x2,y0,y1,y2]
  }

}

// Convert x,y arrays returned from functions in json format for animate
function jsonFormat2(x0,x1,x2,y0,y1,y2) {
  var myJson = [];
  var N = x0.length;
  for (var i=0; i<N; i++) {
    myJson.push({"data": [{"x": [0,x0[i],x1[i],x2[i],0],
      "y": [0,y0[i],y1[i],y2[i],0]}],"name": 'frame'+parseInt(i)})
  }
  return myJson;
}

// Layout object to be used for all plots
var layout = {xaxis: {range: [-4, 4], title:"x"},
    yaxis: {range: [-4, 4], title:"y"},
    margin: {l:30, r:30, t:30, b:30}
    };

// Plots a 1x1 square on the grid
function squarePlotter(){
  Plotly.newPlot('graph', [{
    x : [0,1,1,0,0],
    y : [0,0,1,1,0],
    line: {simplify: false, color: 'rgb(0,62,116)'},
    fill:'tonexty',
    mode: 'lines'
  }],
  layout
  )
}

// Plots animated skew
function plotterSkew(axis) {
  var myArray = squareTrans("skew",axis);
  var frames = jsonFormat2(...myArray);
  // Initial plot
  Plotly.newPlot('graph', [{
    x: frames[0].data[0].x,
    y: frames[0].data[0].y,
    line: {simplify: false, color: 'rgb(0,62,116)'},
    fill:'tonexty',
    mode: 'lines'
    }],
    layout
  );

  // Animation
  Plotly.animate('graph', frames, {
    transition: {
      duration: 25,
      easing: 'linear'
    },
    frame: {
      duration: 25,
      redraw: false,
    },
    mode: 'immediate'
  });
}

// Plots animated scale
function plotterScale(s1,s2) {
  var myArray = squareTrans("scale",s1,s2);
  var frames = jsonFormat2(...myArray);
  // Initial plot
  Plotly.newPlot('graph', [{
    x: frames[0].data[0].x,
    y: frames[0].data[0].y,
    line: {simplify: false, color: 'rgb(0,62,116)'},
    fill:'tonexty',
    mode: 'lines'
    }],
    layout
  );

  // Animation
  Plotly.animate('graph', frames, {
    transition: {
      duration: 25,
      easing: 'linear'
    },
    frame: {
      duration: 25,
      redraw: false,
    },
    mode: 'immediate'
  });
}

// Plots animated rotation
function plotterRotate(th) {
  var myArray = squareTrans("rotate",th);
  var frames = jsonFormat2(...myArray);
  // Initial plot
  Plotly.newPlot('graph', [{
    x: frames[0].data[0].x,
    y: frames[0].data[0].y,
    line: {simplify: false, color: 'rgb(0,62,116)'},
    fill:'tonexty',
    mode: 'lines'
    }],
    layout
  );

  // Animation
  Plotly.animate('graph', frames, {
    transition: {
      duration: 25,
      easing: 'linear'
    },
    frame: {
      duration: 25,
      redraw: false,
    },
    mode: 'immediate'
  });
}

// Plots animated custom
function plotterCustom(a,b,c,d) {
  var myArray = squareTrans("custom",a,b,c,d);
  var frames = jsonFormat2(...myArray);
  // Initial plot
  Plotly.newPlot('graph', [{
    x: frames[0].data[0].x,
    y: frames[0].data[0].y,
    line: {simplify: false, color: 'rgb(0,62,116)'},
    fill:'tonexty',
    mode: 'lines'
    }],
    layout
  );

  // Animation
  Plotly.animate('graph', frames, {
    transition: {
      duration: 25,
      easing: 'linear'
    },
    frame: {
      duration: 25,
      redraw: false,
    },
    mode: 'immediate'
  });
}

// Main function to run when page is ready
function main() {
  squarePlotter();
  skewMatrix();
  rotateMatrix();
  scaleMatrix();
  customMatrix();
}

// Function which takes array as input and returns a table
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

// Plot the graphs after reading data from sliders
function plotRotate() {
  var x = document.getElementById('rotateID').value;
  var th = Math.PI*x;
  plotterRotate(th);
}

function plotSkew() {
  var axis = document.getElementById('skewID').value;
  var numaxis = Number(axis);
  plotterSkew(numaxis);
  }

function plotScale() {
  var scale1 = document.getElementById('scale1ID').value;
  var scale2 = document.getElementById('scale2ID').value;
  plotterScale(scale1,scale2);
}

function plotCustom() {
  var a = document.getElementById('aID').value;
  var b = document.getElementById('bID').value;
  var c = document.getElementById('cID').value;
  var d = document.getElementById('dID').value;
  plotterCustom(a,b,c,d);
}

// Create tables which show the transformation matrices
function skewMatrix() {
  var axis = document.getElementById('skewID').value;
  var numaxis = Number(axis);
  if (numaxis === 0){
    document.getElementById("skewmatrix").innerHTML=makeTableHTML([[1,1],[0,1]]);
  }
  else {
    document.getElementById("skewmatrix").innerHTML=makeTableHTML([[1,0],[1,1]]);
  }
}

function rotateMatrix() {
  var x = document.getElementById('rotateID').value;
  var th = Math.PI*x;
  var rotmatrix = roundedmat(rotmat(th))
  console.log(rotmatrix)
  document.getElementById('rotatematrix').innerHTML=makeTableHTML(rotmatrix);
  th = Math.round(th*100)/100;
  document.getElementById('rotatematrix2').innerHTML=makeTableHTML([["cos("+String(x)+"π"+")","-sin("+String(x)+"π"+")"],
    ["sin("+String(x)+"π"+")","cos("+String(x)+"π"+")"]])
  document.getElementById('showtheta').innerHTML = "θ = ";
  document.getElementById('showtheta').innerHTML+=th;
  document.getElementById('showtheta').innerHTML+=" rad or θ =  ";
  document.getElementById('showtheta').innerHTML+=x.toString();
  document.getElementById('showtheta').innerHTML+="π rad";
}

function scaleMatrix() {
  var scale1 = document.getElementById('scale1ID').value;
  var scale2 = document.getElementById('scale2ID').value;
  document.getElementById('scalematrix').innerHTML=makeTableHTML([[scale1,0],[0,scale2]])
}

function customMatrix() {
  var a = document.getElementById('aID').value;
  var b = document.getElementById('bID').value;
  var c = document.getElementById('cID').value;
  var d = document.getElementById('dID').value;
  document.getElementById('custommatrix').innerHTML=makeTableHTML([[a,b],[c,d]])
}

// Rounds all elements in a mxn array to 2 d.p.
function roundedmat(A) {
  m = A.length
  n = A[0].length
  for (i=0; i<m; i++) {
    for (j=0; j<n; j++) {
      A[i][j] =  Math.round(A[i][j]*100)/100
    }
  }
  return A
}

function resetStuff() {
  squarePlotter();
  $(".skewID").slider('refresh')
}

$(document).ready(main);