window.onload = function() {

    var canvas = document.getElementById("graph"),
        graph = {
            ctx: canvas.getContext('2d'),
            dim: canvas.height
        };
        graph.imageData = graph.ctx.getImageData(0, 0, graph.dim, graph.dim);
        graph.numPixels = graph.dim * graph.dim;

    var cmath = math,
        pi = Math.PI;
        // phase = 0;


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

            this.data = new Array(this.numFrames);
                for (var i = 0; i < this.numFrames; i++) {
                    this.data[i] = new Float32Array(4*graph.numPixels);
                }

            var incident = this.createWave(this.theta, amplitude=1, material=1);
            this.transmit();
            if (interference === true && this.n1 !== this.n2) {
                this.reflect();
            }

        },


        transmit: function() {
            var cosThetaI = Math.cos(this.theta),
                cosThetaT = cosSnell(this.n1, this.n2, this.theta),
                plotThetaT = cmath.acos(cosThetaT);
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
                cosThetaT = cosSnell(this.n1, this.n2, this.theta),
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
                // TODO convert x, y values to actual physical values (not pixels)
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
            function waveFunc(x, y, phase) {
                // x = 2*x/graph.dim - 1;
                // y = -2*y/graph.dim - 1;
                var k_x, k_y;
                if (isComplex(theta)) {
                    k_x = cmath.multiply(n, cmath.cos(theta));
                    k_y = cmath.multiply(n, cmath.sin(theta));
                } else {
                    k_x = n * Math.cos(theta);
                    k_y = n * Math.sin(theta);
                }

                if (reversePhase === false) {
                    return amplitude * Math.cos( (8*pi/graph.dim) * (k_x*x + k_y*y - phase) );
                } else if (reversePhase === true) {
                    return amplitude * Math.cos( (8*pi/graph.dim) * (k_x*x + k_y*y + phase) );
                } else {
                    throw new TypeError("`createWave()` arg `reversePhase` must be of type `bool`");
                }
            }

            // xy =
            for (var frame = 0; frame < this.numFrames; frame++) {
                for (var x = xMin; x < xMax; x++) {
                    for (var y = yMin; y < yMax; y++) {
                        var pixel = coordToPixelIndex(x, y);
                        this.data[frame][4*pixel] += waveFunc(x, y, frame/graph.dim);
                        // this.data[frame][4*pixel + 1] += waveVal;
                        // this.data[frame][4*pixel + 2] += waveVal;
                        this.data[frame][4*pixel + 3] = 255;
                    }
                }
            }
            return;
        },


        updatePlot: function() {
            for (var i = 0; i < graph.numPixels; i++) {
                this.data[this.frame][4*i] = this.data[this.frame][4*i]*127.5 + 127.5;
            }
            graph.imageData.data.set(this.data[this.frame]);
            // console.log(this.data[this.frame][4000], graph.imageData.data[this.frame][4000]);
            graph.ctx.putImageData(graph.imageData, 0, 0);
            this.frame++;
            if (this.frame === this.numFrames) {
                this.frame = 0;
            }
            console.log("Updated plot;");
            console.log(graph.imageData);
        }

    };

    Boundary.init(angle=30, n1=1, n2=1.5, polarisation="s", interference=true);
    Boundary.updatePlot();

    // console.log(np.range(-2, 15));

};
