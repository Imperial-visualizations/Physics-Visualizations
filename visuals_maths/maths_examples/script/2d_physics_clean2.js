var frames = (function () {
    var frames = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "rotationtest2.json",
        'dataType': "json",
        'success': function (data) {
            frames = data;  // Python data structure is empty but correct structure for Plotly animation plotting
        }
    });
    return frames;
})();

console.log(frames);

Plotly.plot('graph', [{
  x: frames[0].data[0].x,
  y: frames[0].data[0].y,
  line: {simplify: false}}],
  {xaxis: {range: [-2, 2]},
    yaxis: {range: [-2, 2]}}
);

  Plotly.animate('graph', frames, {
    transition: {
      duration: 200,
      easing: 'linear'
    },
    frame: {
      duration: 200,
      redraw: false,
    },
    mode: 'immediate'
  });
