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
//Plotly.plot('graph', [{
//  x: [x[0],0],
//  y: [y[0],0],
//  line: {simplify: false}}],
//  {xaxis: {range: [-5, 5]},
//    yaxis: {range: [-5, 5]}}
//);
//
//// Animation
//function replotter() {
//  for (var i = 1; i < 50; i++){
//    Plotly.animate('graph', {
//      data:
//        [{x: [x[i],0],
//        y: [y[i],0]}]
//        }, {
//      transition: {
//        duration: 100,
//        easing: 'cubic-in-out'
//      },
//      frame: {
//        duration: 0,
//        redraw: false
//      }
//
//    })
//  }
//}
//// Call animation
//replotter()