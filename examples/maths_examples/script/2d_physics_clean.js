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

console.log(frames);

Plotly.plot('graph', [{
  x: frames[0].x,
  y: frames[0].y,
  line: {simplify: false}}],
  {xaxis: {range: [-2, 2]},
    yaxis: {range: [-2, 2]}}
).then(function () {
  // Add the frames so we can animate them.
  Plotly.addFrames('graph', [frames.x[0], frames.y[0]]);
});

function randomize() {
  Plotly.animate('graph', {
    data:
      [{x: frames.x[1],
      y: frames.y[1]}],
//        traces: [0],
      layout: {}
      }, {
    transition: {
      duration: 100,
      easing: 'cubic-in-out'
      }

    })
}

randomize()
