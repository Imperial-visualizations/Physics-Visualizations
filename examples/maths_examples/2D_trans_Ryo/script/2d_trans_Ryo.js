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
  var x = math.zeros(N);
  var y = math.zeros(N);
  var myvec = math.matrix(vec);
  for (var i=0; i<N; i++) {
    var A = math.multiply(rotmat(t[i]),myvec);
      // Pull out x and y components
      x[i] = A._data[0]
      y[i] = A._data[1]
  }
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

function jsonformat(x,y) {
  var myjson = [];
  var N = x.length;
  for (var i=0; i<N; i++) {
    myjson.push({"data": [{"x": [x[i],0],"y": [y[i],0]}],"name": 'frame'+parseInt(i)})
  }
  return myjson;
}

// Run arguments here for animation, try them all!
//var [x,y] = rotation([1,1],3.14)
//var [x,y] = scale([1,1],2,3)
var [x,y] = custom([1,1],2,1,3,2)

var myjson = jsonformat(x,y)
console.log(myjson)

// custom linspace function, probably will not need it...
function mylinspace(a,b,n) {
  var h = (b-a)/(n-1);
  var myinterval = [];
  for (var i=0; i<n; i++) {
    myinterval.push(a+i*h);
  }
  return myinterval;
}

// Use this to parse JSON file, we don't need this now as we're doing the physics on JS
//var frames = (function () {
//    var frames = null;
//    $.ajax({
//        'async': false,
//        'global': false,
//        'url': "rotationtest.json",
//        'dataType': "json",
//        'success': function (data) {
//            frames = data;  // Python data structure is empty but correct structure for Plotly animation plotting
//        }
//    });
//    return frames;
//})();
//

// Plot
Plotly.plot('graph', [{
  x: [x[0],0],
  y: [y[0],0],
  line: {simplify: false}}],
  {xaxis: {range: [-5, 5]},
    yaxis: {range: [-5, 5]}}
);

// Animation
function replotter() {
  for (var i = 1; i < 50; i++){
    Plotly.animate('graph', {
      data:
        [{x: [x[i],0],
        y: [y[i],0]}]
        }, {
      transition: {
        duration: 100,
        easing: 'cubic-in-out'
      },
      frame: {
        duration: 0,
        redraw: false
      }

    })
  }
}
// Call animation
replotter()