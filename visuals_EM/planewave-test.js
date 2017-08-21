window.onload = function() {

    var canvas = document.getElementById("graph"),

        graphDim = canvas.height,
        // pixSize = 5,
        pi = Math.PI,
        phase = 0;

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d'),
            imageData = ctx.getImageData(0, 0, graphDim, graphDim),
            sinData = createSinData();

        // updateGraph(ctx, imageData, 150);
        // for (phase = 0; phase < 150; phase += 2) {
        //     timeoutUpdateGraph(ctx, imageData, phase);
        // }

        var animIntervalID = window.setInterval(updateGraph, 50);
        setTimeout(function() {
            clearInterval(animIntervalID);
        }, 15000);
    }

    // function timeoutUpdateGraph(ctx, imageData, phase) {
    //     setTimeout(function() {
    //         updateGraph(ctx, imageData, phase);
    //     }, 10000);
    // }

    function returnSinR(x, phase) {
        return 127.5*Math.sin(8*pi*(x - phase)/graphDim) + 127.5;
    }

    function createSinData() {
        var imageDataR = [],
            imageDataLength = imageData.data.length;

        for (var phase = 0; phase < 126; phase += 2) {
            imageDataR[phase] = [];
            for (var pixel = 0; pixel < imageDataLength/4; pixel++) {
                imageDataR[phase][pixel] = returnSinR(pixel, phase);
            }
        }
        return imageDataR;
    }

    function updateGraph() {
        var imageDataLength = imageData.data.length;
        console.log(phase);
        for (var pixel = 0; pixel < imageDataLength/4; pixel++) {
            imageData.data[4*pixel] = sinData[phase][pixel];
            imageData.data[4*pixel + 1] = 0;
            imageData.data[4*pixel + 2] = 0;
            imageData.data[4*pixel + 3] = 255;
            // console.log(x, y, returnSinRGB(x, phase));
        }
        ctx.putImageData(imageData, 0, 0);
        if (phase === 124) {
            phase = 0;
        } else {
            phase += 2;
        }
    }

};
