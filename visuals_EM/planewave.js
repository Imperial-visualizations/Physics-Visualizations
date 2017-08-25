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
        graph = {
            ctx: canvas.getContext('2d'),
            dim: canvas.height,
            get imageData() {
                return this.ctx.getImageData(0, 0, this.dim, this.dim);
            }
        },

        cmath = math,
        pi = Math.PI;

        // phase = 0;

    // if (canvas.getContext) {
    //     var ctx = canvas.getContext('2d'),
    //         imageData = ctx.getImageData(0, 0, graphDim, graphDim),
    //         sinData = createSinData(70);
    //
    //     // var animIntervalID = window.setInterval(updateGraph, 50);
    //     // setTimeout(function() {
    //     //     clearInterval(animIntervalID);
    //     // }, 15000);
    // }



    function pixelIndexToCoord(pixel) {
        return [pixel % graph.dim, Math.floor(pixel / graph.dim)];
    }
    function coordToPixelIndex(x, y) {
        return y * graph.dim + x;
    }

    function degToRad(angle) {
        return (angle / 180) * pi;
    }

    function isComplex(number) {
        if (typeof number === "number") {
            return false;
        } else if (typeof number === "object"){
            return true;
        } else {
            throw new TypeError("isComplex() only takes type `number` or `object`");
        }
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
            this.numFrames = 50; //126

            this.imgData = new Array(this.numFrames);
                for (var i = 0; i < this.numFrames; i++) {
                    this.imgData[i] = new Uint8Array(graph.dim * graph.dim);
                }

            var incident = this.createWave(this.theta, amplitude=1, material=1);
            this.transmit();
            if (interference === true && this.n1 !== this.n2) {
                this.reflect();
            }

        },


        transmit: function() {
            var cosThetaI = Math.cos(this.theta),
                cosThetaT = cosSnell(this.n1, this.n2, cosThetaI),
                plotThetaT = math.acos(cosThetaT);

            if (isComplex(cosThetaT)) {
                console.log("Total internal reflection");
                cosThetaT = 0;
            }

            var t;
            if (this.polarisation === "s") {
                t = (2 * this.n1 * cosThetaI) / (this.n1 * cosThetaI + this.n2 * cosThetaT);
            } else {
                t = (2 * this.n1 * cosThetaI) / (this.n1 * cosThetaT + this.n2 * cosThetaI);
            }
            return this.createWave(theta=plotThetaT, amplitude=t, material=2);
        },


        reflect: function() {
            if (this.n1 === this.n2) {
                console.log("Refractive indices equal - no reflection");
                return;
            }
            var cosThetaI = Math.cos(this.theta),
                thetaR = this.theta,
                cosThetaT = cosSnell(this.n1, this.n2, cosThetaI),
                plotThetaR = -thetaR;

            if (isComplex(cosThetaT)) {
                cosThetaT = 0;
            }

            var r;
            if (this.polarisation === "s") {
                r = (this.n1 * cosThetaI - this.n2 * cosThetaT) / (this.n1 * cosThetaI + this.n2 * cosThetaT);
            } else {
                r = (this.n1 * cosThetaT - this.n2 * cosThetaI) / (this.n1 * cosThetaT + this.n2 * cosThetaI);
            }
            return this.createWave(theta=plotThetaR, amplitude=r, material=1);
        },


        createWave: function(theta, amplitude, material, reversePhase) {
            if (typeof reversePhase === "undefined") reversePhase = false;

            var xMin, xMax, n;
            if (material === 1) {
                xMin = 0;
                xMax = graph.dim / 2;
                n = this.n1;
            } else if (material === 2) {
                xMin = graph.dim / 2;
                xMax = graph.dim;
                n = this.n2;
            } else {
                throw new RangeError("material must be 1 or 2");
            }
            var yMin = 0,
                yMax = graph.dim;

                // xRange = np.range(xMin, xMax),
                // yRange = np.range(0, graph.dim),

            /** Return intensity value between 0-255 for a given pixel */
            function clampedWaveFunc(x, y, phase) {
                // x = 2*x/graph.dim - 1;
                // y = -2*y/graph.dim - 1;
                var k_x = n * Math.cos(theta),
                    k_y = n * Math.sin(theta);
                if (reversePhase === false) {
                    // TODO: Sort out this expression:
                    return 127.5 * amplitude * Math.exp( (8*pi/graph.dim) * (k_x*x + k_y*y - phase) ) + 127.5;
                } else if (reversePhase === true) {
                    return 127.5 * amplitude * Math.sin( (8*pi/graph.dim) * (k_x*x + k_y*y + phase) ) + 127.5;
                } else {
                    throw new TypeError("`createWave()` arg `reversePhase` must be of type `bool`");
                }
            }

            // xy =
            for (var frame = 0; frame < this.numFrames; frame++) {
                for (var x = xMin; x < xMax; x++) {
                    for (var y = yMin; y < yMax; y++) {
                        var pixel = coordToPixelIndex(x, y);
                        this.imgData[frame][4*pixel] += clampedWaveFunc(x, y, frame);
                        // this.imgData[frame][4*pixel + 1] = 0;
                        // this.imgData[frame][4*pixel + 2] = 0;
                        this.imgData[frame][4*pixel + 3] = 255;
                    }
                }
            }
            return;
        },


        updatePlot: function() {
            graph.imageData.data.set(this.imgData[this.frame]);
            graph.ctx.putImageData(graph.imageData, 0, 0);
            this.frame++;
            if (this.frame === this.numFrames) {
                this.frame = 0;
            }
            console.log("Updated plot;");
        }

    };

    Boundary.init(angle=30, n1=1, n2=1.5, polarisation="s", interference=true);
    Boundary.updatePlot();

    // console.log(np.range(-2, 15));

};
