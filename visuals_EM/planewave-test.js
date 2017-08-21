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


    function returnSinR(pixel, angle, phase) {
        var coord = pixelIndexToCoord(pixel),
            x = coord[0],
            y = coord[1];
        return 127.5*Math.sin(Math.cos(degToRad(angle)) * 8*pi*(x - Math.cos(degToRad(angle))*phase)/graphDim + Math.sin(degToRad(angle)) * 8*pi*(y - Math.sin(degToRad(angle))*phase)/graphDim) + 127.5;
    }


    function createSinData(angle) {
        var imageDataR = [],
            imageDataLength = imageData.data.length;

        for (var phase = 0; phase < 126; phase += 2) {
            imageDataR[phase] = [];
            for (var pixel = 0; pixel < imageDataLength/4; pixel++) {
                // RGBA:
                imageDataR[phase][4*pixel] = returnSinR(pixel, angle, phase);
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


    function pixelIndexToCoord(pixel) {
        return [pixel % graphDim, Math.floor(pixel / graphDim)];
    }


    function degToRad(angle) {
        return (angle / 180) * pi;
    }

};
