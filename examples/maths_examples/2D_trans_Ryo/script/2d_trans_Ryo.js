// Rotation matrix
function rotmat(th) {
  var rotator = [[Math.cos(th),-Math.sin(th)],[Math.sin(th),Math.cos(th)]];
  return rotator;
  }

// Rotation function returns arrays x,y for smooth transition
function rotation(th,vec) {
  // Parameters
  var N = 50;
  var t = numeric.linspace(0,th,N);
  // Rotation matrix
  var x = math.zeros(N);
  var y = math.zeros(N);
  var myvec = math.matrix(vec);
  for (var i=0; i<N; i++) {
    var A = math.multiply(rotmat(t[i]),myvec);
      x[i] = A._data[0]
      y[i] = A._data[1]
  }
  return [x,y];
}

// Run arguments here for aniamtion
var [x,y] = rotation(2,[1,1])

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
  {xaxis: {range: [-2, 2]},
    yaxis: {range: [-2, 2]}}
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