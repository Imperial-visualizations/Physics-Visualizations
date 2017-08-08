var frames = (function () {
    var frames = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "rotationtest.json",
        'dataType': "json",
        'success': function (data) {
            frames = data;  // Python data structure is empty but correct structure for Plotly animation plotting
        }
    });
    return frames;
})();


//for (var i = 0; i < 50; i++){
//  var x = frames[i].x
//  var y = frames[i].y
//
//  var trace = {
//    x: x,
//    y: y,
//    type: 'scatter'
//  };
//
//  var layout = {
//    xaxis: {range: [-2, 2]},
//    yaxis: {range: [-2, 2]}
//  }
//  Plotly.plot('graph',[trace],layout);
//  }

function custom(vec) {
  var a = 0
  var b = 1
  var c = -1
  var d = 0

  var rot = math.matrix([[a, b], [c, d]]);
  console.log(math.multiply(rot, vec));
  return vec
}

Plotly.plot('graph', [{
  x: frames[0].x,
  y: frames[0].y,
  line: {simplify: false}}],
  {xaxis: {range: [-2, 2]},
    yaxis: {range: [-2, 2]}}
).then(function () {
  // Add the frames so we can animate them.
  Plotly.addFrames('graph', [frames.x, frames.y]);
});

function randomize() {
  Plotly.animate('graph', {
    //data:
    //  [{x: frames.x,
    //  y: frames.y}],
//        traces: [0],
    //  layout: {}
    //  }, {
    transition: {
      duration: 100,
      easing: 'cubic-in-out'
      }

    })
}

randomize()
custom(math.matrix([23, 45]))
