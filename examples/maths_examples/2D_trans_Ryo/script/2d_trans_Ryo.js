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

Plotly.plot('graph', [{
  x: frames[0].x,
  y: frames[0].y,
  line: {simplify: false}}],
  {xaxis: {range: [-2, 2]},
    yaxis: {range: [-2, 2]}}
);

function randomize() {
  for (var i = 1; i < 50; i++){
    Plotly.animate('graph', {
      data:
        [{x: frames[i].x,
        y: frames[i].y}],
//        traces: [0],
        layout: {}
        }, {
      transition: {
        duration: 100,
        easing: 'cubic-in-out'
      }

    })
  }
}

randomize()