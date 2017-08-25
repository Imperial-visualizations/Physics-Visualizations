var np = {
    linspace: function(start, stop, num) {
        if (typeof num === "undefined") num = 50;
        if (start > stop) {
            throw new RangeError("Start value must be lower than stop value");
        }
        var arr = [],
            stepSize = (stop - start) / (num - 1);

    },

    range: function(start, stop) {
        /* Only works for step size 1 */
        if (start > stop) {
            throw new RangeError("Start value must be lower than stop value");
        }
        var arr = [],
            i = stop - start;
        while (i--) {
            arr[i] = --stop;
        }
        return arr;
    }
};


window.onload = function() {

    var canvas = document.getElementById("graph"),
        graphDim = canvas.height,

        cmath = math,
        pi = Math.PI,

        phase = 0;

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d'),
            imageData = ctx.getImageData(0, 0, graphDim, graphDim),
            sinData = createSinData(70);

        // var animIntervalID = window.setInterval(updateGraph, 50);
        // setTimeout(function() {
        //     clearInterval(animIntervalID);
        // }, 15000);
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
    function coordToPixelIndex(x, y) {
        return y * graphDim + x;
    }


    function degToRad(angle) {
        return (angle / 180) * pi;
    }


    function cosSnell(n1, n2, thetaI) {
        var cosSquaredThetaT = 1 - Math.pow((n1/n2) * Math.sin(thetaI), 2);
        if (cosSquaredThetaT < 0) {
            return cmath.sqrt(cosSquaredThetaT);
        } else {
            return Math.sqrt(cosSquaredThetaT);
        }
    }




    var Boundary = {
        init: function(angle, n1, n2, polarisation, interference) {
            this.theta = degToRad(angle);
            this.n1 = n1;
            this.n2 = n2;
            this.polarisation = polarisation;

            this.frame = 0;
            this.numFrames = 126;
            this.imgData = [];

        },


        createWave: function(theta, amplitude, material, reversePhase) {
            if (typeOf(reversePhase) === "undefined") reversePhase = false;

            var xMin, xMax, n;
            if (material === 1) {
                xMin = 0;
                xMax = graphDim / 2;
                n = this.n1;
            } else if (material === 2) {
                xMin = graphDim / 2;
                xMax = graphDim;
                n = this.n2;
            } else {
                throw new RangeError("material must be 1 or 2");
            }
            var yMin = 0,
                yMax = graphDim;

                // xRange = np.range(xMin, xMax),
                // yRange = np.range(0, graphDim),

            /** Return intensity value between 0-255 for a given pixel */
            function clampedWaveFunc(x, y, phase) {
                var k_x = n * Math.cos(theta),
                    k_y = n * Math.sin(theta);
                if (reversePhase === false) {
                    return 127.5 * amplitude * Math.sin( (8*pi/graphDim) * (k_x*x + k_y*y - phase) ) + 127.5;
                } else if (reversePhase === true) {
                    return 127.5 * amplitude * Math.sin( (8*pi/graphDim) * (k_x*x + k_y*y + phase) ) + 127.5;
                }
            }

            // xy =
            for (var phase = 0; phase < this.numFrames; phase += 2) {
                imgData[phase] = [];
                for (var x = xMin; x < xMax; x++) {
                    // for (var y in yRange) {
                    for (var y = yMin; y < yMax; y++) {
                        var pixel = coordToPixelIndex(x, y);
                        imgData[phase][4*pixel] = clampedWaveFunc(x, y, phase);
                        imgData[phase][4*pixel + 1] = 0;
                        imgData[phase][4*pixel + 2] = 0;
                        imgData[phase][4*pixel + 3] = 255;
                    }
                }
            }
            return imageDataArray;
        },



    };

    Boundary.init(angle=30, n1=1, n2=1.5, polarisation="s", interface=true);
    console.log(Boundary.theta, Boundary.n1, Boundary.n2, Boundary.polarisation);

    // console.log(np.range(-2, 15));

};
