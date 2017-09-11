window.onload = function() {

    var canvas = document.getElementById("graph"),
        graphDim = canvas.height,
        pi = Math.PI,
        phase = 0;

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d'),
            imageData = ctx.getImageData(0, 0, graphDim, graphDim),
            sinData = createSinData(70);

        var animIntervalID = window.setInterval(updateGraph, 50);
        setTimeout(function() {
            clearInterval(animIntervalID);
        }, 15000);
    }


    function returnSin255(pixel, angle, phase) {
        var coord = pixelIndexToCoord(pixel),
            x = coord[0],
            y = coord[1],
            k_x = Math.cos(degToRad(angle)),
            k_y = Math.sin(degToRad(angle));
        return 127.5*Math.sin((8*pi/graphDim) * (k_x*x + k_y*y - phase)) + 127.5;
    }


    function createSinData(angle) {
        var imageDataArray = [],
            imageDataLength = imageData.data.length;

        for (var phase = 0; phase < 126; phase += 2) {
            imageDataArray[phase] = [];
            for (var pixel = 0; pixel < imageDataLength/4; pixel++) {
                // RGBA:
                imageDataArray[phase][4*pixel] = returnSin255(pixel, angle, phase);
                imageDataArray[phase][4*pixel + 1] = 0;
                imageDataArray[phase][4*pixel + 2] = 0;
                imageDataArray[phase][4*pixel + 3] = 255;
            }
        }
        return imageDataArray;
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


    function pixelIndexToCoord(pixel) {
        return [pixel % graphDim, Math.floor(pixel / graphDim)];
    }


    function degToRad(angle) {
        return (angle / 180) * pi;
    }

};
