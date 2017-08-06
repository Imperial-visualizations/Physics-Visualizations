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

//// Run arguments here for animation, try them all!
//var [x,y] = rotation([3,4],Math.PI)
//var [x,y] = scale([2,1],2,3)
//var [x,y] = custom([1,1],2,-1,3,2)
//var [x,y] = skew([1,1],0);

//// Adjust x and y axes accordingly, remember to spread
//var xmax = Math.max(Math.max(...x),Math.abs(Math.min(...x)));
//var ymax = Math.max(Math.max(...y),Math.abs(Math.min(...y)));
//// Include a bit of margin
//var supermax = Math.max(xmax,ymax)+1;
//
//
//// Convert array to frames, print on console to check values...
//var frames = jsonFormat(x,y)

//// Initial plot
//Plotly.plot('graph', [{
//  x: frames[0].data[0].x,
//  y: frames[0].data[0].y,
//  line: {simplify: false}}],
//  {xaxis: {range: [-supermax, supermax]},
//    yaxis: {range: [-supermax, supermax]}}
//);
//
//// Animation
//Plotly.animate('graph', frames, {
//  transition: {
//    duration: 50,
//    easing: 'linear'
//  },
//  frame: {
//    duration: 50,
//    redraw: false,
//  },
//  mode: 'immediate'
//});

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

// Test all sub functions
//var myarray = squareTrans("rotate",2);
//var myarray = squareTrans("scale",2);
//var myarray = squareTrans("scale",2,3);
//var myarray = squareTrans("custom",1,0,1,1);


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

layout = {xaxis: {range: [-3, 3]},
    yaxis: {range: [-3, 3]},
    margin: {l:0, r:0, t:0, b:0}
    };

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

function main() {
//  $('.sliderSkew').hide();
//  $('.sliderRotate').hide();
//  $('.sliderScale').hide();
  squarePlotter();
}

function revealSkew() {
  squarePlotter();
  $('.sliderRotate').hide();
  $('.sliderScale').hide();
  $('.sliderCustom').hide();
  $('.sliderSkew').slideToggle(600);

}

function revealRotate() {
  squarePlotter();
  $('.sliderSkew').hide();
  $('.sliderScale').hide();
  $('.sliderCustom').hide();
  $('.sliderRotate').slideToggle(600);
}

function revealScale() {
  squarePlotter();
  $('.sliderRotate').hide();
  $('.sliderSkew').hide();
  $('.sliderCustom').hide();
  $('.sliderScale').slideToggle(600)
}

function revealCustom() {
  squarePlotter();
  $('.sliderRotate').hide();
  $('.sliderSkew').hide();
  $('.sliderScale').hide();
  $('.sliderCustom').slideToggle(600);
}

// Terrible function names...
function plotRotate() {
  var x = document.getElementById('rotateID').value;
  var th = Math.PI*x;
  plotterRotate(th);
}

function plotSkew() {
  var axis = document.getElementById('skewID').value;
  plotterSkew(Number(axis));
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
$(document).ready(main);