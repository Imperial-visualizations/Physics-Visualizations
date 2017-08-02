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
  console.log(x)
  return [x,y];
}

// Scale function returns arrays of similar form to rotation()
// Arguments must go in of the form (vec, scale1, scale2)
function scale() {
  // Define variables and parameters
  var N = 50;
  var vec = arguments[0];
  var x = math.zeros(N);
  var y = math.zeros(N);
  if (arguments.length === 2){
    x = numeric.linspace(vec[0],arguments[1]*vec[0],N);
    y = numeric.linspace(vec[1],arguments[1]*vec[1],N);
  } else if (arguments.length === 3) {
    x = numeric.linspace(vec[0],arguments[1]*vec[0],N);
    y = numeric.linspace(vec[1],arguments[2]*vec[1],N);
  }
  return [x,y]
}

// Custom matrix transformation, arguments form matrix [[a,b],[c,d]]
function custom(vec,a,b,c,d) {
  N = 50;
  var A = [[a,b],[c,d]];
  var x0 = vec[0];
  var y0 = vec[1];
  var newvec = math.multiply(A,math.matrix(vec));
  var x = numeric.linspace(x0,newvec._data[0],N);
  var y = numeric.linspace(y0,newvec._data[1],N);
  return[x,y]
}

// Convert x,y arrays returned from functions in json format for animate
function jsonformat(x,y) {
  var myjson = [];
  var N = x.length;
  for (var i=0; i<N; i++) {
    myjson.push({"data": [{"x": [x[i],0],"y": [y[i],0]}],"name": 'frame'+parseInt(i)})
  }
  return myjson;
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

// Run arguments here for animation, try them all!
var [x,y] = rotation([1,1],Math.PI)
//var [x,y] = scale([0.5,0.3],2,3)
//var [x,y] = custom([1,1],2,1,3,2)

// Convery array to frames, print on console to check values...
var frames = jsonformat(x,y)
console.log(frames)

// Initial plot
Plotly.plot('graph', [{
  x: frames[0].data[0].x,
  y: frames[0].data[0].y,
  line: {simplify: false}}],
  {xaxis: {range: [-2, 2]},
    yaxis: {range: [-2, 2]}}
);

// Animation
Plotly.animate('graph', frames, {
  transition: {
    duration: 100,
    easing: 'linear'
  },
  frame: {
    duration: 100,
    redraw: false,
  },
  mode: 'immediate'
});