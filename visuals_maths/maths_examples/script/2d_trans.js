// Import data in json file as "frames" variable (same data structure as initially output in Python)
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

//document.writeln(frames)

Plotly.plot('graph', [{
    x: frames[45].x,
    y: frames[45].y,
    line: {simplify: false},
}], {
    xaxis: {range: [-Math.PI, Math.PI]},
    yaxis: {range: [-1.2, 1.2]},
    updatemenus: [{  // This format works well for interactivity
        buttons: [
            {method: 'animate', 'args': [['sine']], label: 'sine'},
            {method: 'animate', 'args': [['cosine']], label: 'cosine'},
            {method: 'animate', 'args': [['circle']], label: 'circle'}
        ]
    }]
}).then(function () {
    Plotly.addFrames('graph', frames);  // The animation (changing the shown frame)
});
