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

    /** Return intensity value between 0-255 for a given pixel */
    function convertToColorVal(rawValue) {
        return rawValue*127.5 + 127.5;
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
            this.interference = interference;

            this.numSines = 2 * 4;

            this.frame = 0;
            this.numFrames = Math.round(graph.dim/this.numSines);//63; //126

            this.createWaves();

            var animIntervalID = window.setInterval(function() {
                this.updatePlot();
            }.bind(this), 100);
            setTimeout(function() {
                clearInterval(animIntervalID);
            }, 15000);
        },


        createWaves: function() {
            // this.waveImgData = new Float32Array(4*graph.numPixels);
            // this.incident = this.setWaveData(this.theta, amplitude=1, waveType="incident");
            this.incident = new Wave(this.theta, 1, this.n1, this.polarisation);
            this.transmitted = this.incident.transmit(this.n2);
            // this.incident.reflect(this.n2);
            if (this.interference === true && this.n1 !== this.n2) {
                this.reflected = this.incident.reflect(this.n2);
            } else {
                this.reflected = false;
            }
            // this.convertToColorVals();
        },


        updateFrame: function() {
            this.waveImgData = new Float32Array(4*graph.numPixels);
            this.setWaveData();
        },


        setWaveData: function() {
            var phase = 2*this.frame/graph.dim;
            for (var x = 0; x < graph.dim; x++) {
                for (var y = 0; y < graph.dim; y++) {
                    var pixel = coordToPixelIndex(x, y),
                        rawValue;
                    if (x < graph.dim/2) {
                        if (this.reflected) {
                            rawValue = this.incident.waveFunc(x, y, phase) + this.reflected.waveFunc(x, y, phase);
                        } else {
                            rawValue = this.incident.waveFunc(x, y, phase);
                        }
                    } else {
                        rawValue = this.transmitted.waveFunc(x, y, phase);
                    }
                    this.waveImgData[4*pixel] = convertToColorVal(rawValue);
                    // this.waveImgData[4*pixel + 1] += waveVal;
                    // this.waveImgData[4*pixel + 2] += waveVal;
                    this.waveImgData[4*pixel + 3] = 255;
                }
            }
            // console.log("Calculated frame data");
        },


        updatePlot: function() {
            this.updateFrame();
            graph.imageData.data.set(this.waveImgData);
            // console.log(this.waveImgData[4000], graph.imageData.data[4000]);
            graph.ctx.putImageData(graph.imageData, 0, 0);
            this.frame++;
            if (this.frame === this.numFrames) {
                console.log("Reached end of frames");
                this.frame = 0;
            }
            // console.log("Updated plot;");
            // console.log(graph.imageData);
            // console.log(this.waveImgData);
        }

    };



    function Wave(theta, amplitude, n, polarisation, reversePhase) {
        /** @param waveType - "incident", "reflected" or "transmitted" */
        this.init = function() {
            this.theta = theta;
            this.amplitude = amplitude;
            this.n1 = n;
            // this.reversePhase = reversePhase;
            this.coeffs = {};
            this.calculateCoeffs();
        };


        this.calculateCoeffs = function() {
            if (isComplex(this.theta)) {
                // Fast complex sin & cos
                var p = this.theta.re,
                    q = this.theta.im,

                    cosP = Math.cos(p),
                    sinP = Math.sin(p),
                    coshQ = Math.cosh(q),
                    sinhQ = Math.sinh(q);

                this.coeffs.a = cosP * coshQ;
                this.coeffs.b = -sinP * sinhQ;
                this.coeffs.c = -sinP * coshQ;
                this.coeffs.d = -cosP * sinhQ;
            } else {
                this.coeffs.k_x = this.n1 * Math.cos(this.theta);
                this.coeffs.k_y = -this.n1 * Math.sin(this.theta);
            }
        };


        this.waveFunc = function(x, y, phase) {//, refresh) {
            // if (refresh !== true) refresh = false;

            x = 2*x/graph.dim - 1;
            y = -2*y/graph.dim - 1;

            // if (refresh) {
            //     this[waveType] = new Wave(theta, amplitude=1, waveType);
            // }
            // var thisWave = this[waveType];

            if (isComplex(this.theta)) {
                var g = Boundary.numSines*pi*this.n1;
                return this.amplitude * Math.cos( g * (this.coeffs.a*x + this.coeffs.c*y - phase) ) * Math.exp( -g * (this.coeffs.b*x + this.coeffs.d*y) );
            } else {
                if (reversePhase) {
                    return this.amplitude * Math.cos( Boundary.numSines*pi * (this.coeffs.k_x*x + this.coeffs.k_y*y + phase) );
                } else {
                    return this.amplitude * Math.cos( Boundary.numSines*pi * (this.coeffs.k_x*x + this.coeffs.k_y*y - phase) );
                }
            }
        };


        this.transmit = function(n2) {
            var cosThetaI = Math.cos(this.theta),
                cosThetaT = cosSnell(this.n1, n2, this.theta),
                plotThetaT;
            if (isComplex(cosThetaT)) {
                console.log("Total internal reflection");
                plotThetaT = cmath.acos(cosThetaT);
                cosThetaT = 0;
            } else {
                plotThetaT = Math.acos(cosThetaT);
            }

            var amplitude;
            if (polarisation === "s") {
                amplitude = (2 * this.n1 * cosThetaI) / (this.n1 * cosThetaI + n2 * cosThetaT);
            } else {
                amplitude = (2 * this.n1 * cosThetaI) / (this.n1 * cosThetaT + n2 * cosThetaI);
            }
            return new Wave(plotThetaT, amplitude, n2, polarisation);
        };


        this.reflect =  function(n2) {
            if (this.n1 === n2) {
                console.log("Refractive indices equal - no reflection");
                return false;
            }
            var cosThetaI = Math.cos(this.theta),
                thetaR = this.theta,
                cosThetaT = cosSnell(this.n1, n2, this.theta),
                plotThetaR = -thetaR;

            if (isComplex(cosThetaT)) {
                cosThetaT = 0;
            }

            var amplitude;
            if (polarisation === "s") {
                amplitude = (this.n1 * cosThetaI - n2 * cosThetaT) / (this.n1 * cosThetaI + n2 * cosThetaT);
            } else {
                amplitude = (this.n1 * cosThetaT - n2 * cosThetaI) / (this.n1 * cosThetaT + n2 * cosThetaI);
            }
            return new Wave(plotThetaR, amplitude, this.n1, polarisation, true);
        };

        this.init();
    }



    Boundary.init(30, 1, 1.5, "s", true);
    // Boundary.updatePlot();



    // console.log(np.range(-2, 15));

};
