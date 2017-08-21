window.onload = function() {

    var canvas = document.getElementById("graph"),

        graphDim = canvas.height,
        pi = Math.PI,
        phase = 0;

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d'),
            imageData = ctx.getImageData(0, 0, graphDim, graphDim),
            sinData = createSinData();

        var animIntervalID = window.setInterval(updateGraph, 50);
        setTimeout(function() {
            clearInterval(animIntervalID);
        }, 15000);
    }


    function returnSinR(x, phase) {
        return 127.5*Math.sin(8*pi*(x - phase)/graphDim) + 127.5;
    }


    function createSinData() {
        var imageDataR = [],
            imageDataLength = imageData.data.length;

        for (var phase = 0; phase < 126; phase += 2) {
            imageDataR[phase] = [];
            for (var pixel = 0; pixel < imageDataLength/4; pixel++) {
                // RGBA:
                imageDataR[phase][4*pixel] = returnSinR(pixel, phase);
                imageDataR[phase][4*pixel + 1] = 0;
                imageDataR[phase][4*pixel + 2] = 0;
                imageDataR[phase][4*pixel + 3] = 255;
            }
        }
        return imageDataR;
    }


    function updateGraph() {
        // console.log(phase);
        imageData.data.set(sinData[phase]);
        // console.log(sinData[phase]);
        // console.log(imageData.data);
        ctx.putImageData(imageData, 0, 0);
        if (phase === 124) {
            phase = 0;
        } else {
            phase += 2;
        }
    }

};
