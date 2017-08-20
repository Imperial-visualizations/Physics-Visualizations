window.onload = function() {

    var canvas = document.getElementById("graph"),

        graphDim = canvas.height,
        pixSize = 5,
        pi = Math.PI;

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        // updateGraph(ctx, 150);
        for (phase = 0; phase < 150; phase += 2) {
            timeoutUpdateGraph(ctx, phase);
        }
    }

    function timeoutUpdateGraph(ctx, phase) {
        setTimeout(function() {
            updateGraph(ctx, phase);
        }, 10);
    }

    function returnSinRGB(x, phase) {
        return 'rgb(' + (127.5*Math.sin(8*pi*(x - phase)/graphDim) + 127.5) + ', 0, 0)';
    }

    function updateGraph(ctx, phase) {
        for (var x = 0; x < graphDim; x += pixSize) {
            for (var y = 0; y < graphDim; y += pixSize) {
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = returnSinRGB(x, phase);
                ctx.fillRect(x, y, pixSize, pixSize);
            }
            console.log(x, y, returnSinRGB(x, phase));
        }
    }

};
