window.onload = function () {
    /* This code uses the dispersion relation of the wave in vacuum and plasmas, omega in plasma is fixed, and omega of
    the input wave is the only parameter used as an input. The Wave class defines the wave and makes the k vector /
     magnitude so that the refractive index of the input wave is exactly one (eg the dispersive relationship in vacuum)
      /
     */
    // defining constants
    const c = 3e8; //speed of light
    const nu = 4 * Math.PI * 1e7; // nu_0 constant
    const epsilon = 8.85e-12; //epsilon_0 constant

    // defining the Em waves entering plasma
    class Wave {
        constructor(pos, dir, AmpE, w, n1) { // omega needs to be connected to the input on the slider
            this._pos = pos; // empty array that stores position of wavefront
            this._angVel = w; // angular velocity of the wavefront
            this._history = pos; // empty array that stores all pos of the wavefront
            this._dir = dir; //direction of the wavefront
            this._refrIndexWave = n1;
            this._kvector = (n1 * w) / c; // k vector value
            this._AmpEfield = AmpE; //amplitude of the E field
            this._AmpBfield = (AmpE * n1) * 0.229e9 / c;
            this._vPhase = w / this._kvector

        }

        app(newPos, newDir)  { //appends new position and direction of the wave
            this._pos = newPos;
            this._dir = newDir;
            this._history.push(newPos);
            return this;
        }
    }

    class OpticalElement {

        Create_traces(wave , plasma, Nnormvec ) {
            // to find thee angle of incidence
            let wavedir = wave._dir;
            let NwaveDir = math.divide(wavedir, math.sqrt(math.dot(wavedir, wavedir)));
            console.log(NwaveDir);


            let aDotb = math.dot((math.multiply(Nnormvec, -1)), NwaveDir);
            let incidence = Math.PI/2 - Math.acos( aDotb / (math.dot(Nnormvec, Nnormvec) * math.dot(NwaveDir, NwaveDir)));
            console.log(incidence * (180 / Math.PI));
            RefrIndexCalc(wave,plasma);
            let critical = Math.asin(P._refrIndexP);
            console.log(critical);
            let size, start, finish; // for different cases of propagation

            if (incidence === 0) {
                size = 50;
                start = -1;
                finish = 1;
            }

            else if (incidence < critical && incidence > 0){
                console.log("Wave Propagates");
                let DirWave = refractionPlasma(wave, plasma);
                let NDirWave = math.divide(DirWave, math.sqrt(math.dot(DirWave, DirWave)));
                // write code to propagate wave
                size = 50 * math.sqrt(DirWave[0]**2 + DirWave[1]**2 + DirWave[2]**2);
                console.log(size);
            }
            else if (incidence === critical) {
                console.log('Critical angle');
                //write code to prop transmitted wave along normal
                size =0;
            }
            else if (incidence > critical && incidence <= 85) {
                console.log('TIR');
                // write code for TIR case
                size =0 ;
            }

            let x_Range = numeric.linspace(start, finish, size);
            let z_Range = numeric.linspace(start, finish, size);
            let zero = math.zeros(size);
            let kx_sine = math.multiply(1,Get_sine(math.multiply(wave._kvector,x_Range),size));

            let E_sine = [x_Range, math.multiply(wave._AmpEfield, kx_sine), zero._data];
            let B_sine = [x_Range, zero._data, math.multiply(wave._AmpBfield ,kx_sine) ];

            let trace = [];

            trace.push(
                {//add trace for line of field line
                    type: "scatter3d",
                    mode: "lines",
                    name: "E field",
                    //line: {color: "#02893B"},
                    x: E_sine[0],
                    y: E_sine[1],
                    z: E_sine[2],
                    opacity: 1,
                    line: {
                        width: 4,
                        color: "#00F",
                        reversescale: false
                    }
                },
                {//add trace for line of field line
                type: "scatter3d",
                mode: "lines",
                name: "B field",
                //line: {color: "#A51900"},
                x: B_sine[0],
                y: B_sine[1],
                z: B_sine[2],
                opacity: 1,
                line: {
                    width: 4,
                    color: "#A51900",
                    reversescale: false}
                },
                {//dielectric
                    opacity: 0.2,
                    color: '#FF0',
                    type: "mesh3d",
                    name: "plasma",
                    x: [0, 0, 0, 0, -1, -1, -1, -1],
                    y: [1, -1, -1, 1, 1, -1, -1, 1],
                    z: [-1, -1, 1, 1, -1, -1, 1, 1],
                    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
                    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
                }
            );




            return [trace];
        }



        // add ploting fucntion, maybe split plasma into 2 objects, with ang vel more and less than plasma ang vel
        //};
    } // empty parent class if we want to add the variety of media later

    class Plasma extends OpticalElement {
        constructor(Pos, wPlasma) {
            super();
            this._plasmaPos = Pos;
            this._angularVel = wPlasma; // has to be a fixed value
            this._refrIndexP = 0;
            this._attDistance = 0; //attenuation distance
            this._attDirection = [0, 0, 0]; // direction of attenuation
        }

        //calculating effective refrctive index of the plasma depedning on input w and plasma frequency w_p
    }

// plasma functions ---------------------------------------------------------------------------------------------------
    function RefrIndexCalc(wave, plasma)
    {

        if (wave._angVel > plasma._angularVel) {
            plasma._refrIndexP = Math.sqrt(1 - (plasma._angularVel / wave._angVel) ** 2);
            return plasma._refrIndexP;
        }
        else if (wave._angVel < plasma._angularVel) {
            plasma._refrIndexP = Math.sqrt(((plasma._angularVel / wave._angVel) ** 2) - 1);
            return plasma._refrIndexP;
        }

        else {
            return plasma._refrIndexP = 0;
        }
    }

   /* function interceptPlasma(wave, plasma)
    {
        var wavePos = wave._pos;
        var waveDir = wave._dir;

        // ensure all waves starts in the vacuum
        if (wavePos[0] > plasma._plasmaPos[0]) {
            return console.log('The wave starts inside the plasma.');
        }
        else if (wavePos[0] === plasma._plasmaPos[0]) {
            return console.log('The wave starts at the vacuum/plasma barrier');
        }
        else {
            let NwaveDir = math.divide(waveDir, (Math.sqrt(math.dot(waveDir, waveDir))));
            let difInX = plasma._plasmaPos[0] - wavePos[0];
            let yInt = difInX * (NwaveDir[1] / NwaveDir[0]) + wavePos[1];
            let zInt = difInX * (NwaveDir[2] / NwaveDir[0]) + wavePos[2];
            var intr = [plasma._plasmaPos[0], yInt, zInt];
        }
        return intr;
    }*/

    function refractionPlasma(wave, plasma) {
        let RefrVec;
        let cosTheta;
        let Kimaginary; // in case of w < w_p

        // need to make sure the direction vector is normalised
        let waveDir = wave._dir;
        let NwaveDir = math.divide(waveDir, (Math.sqrt(math.dot(waveDir, waveDir))));

        // need to find the vector normal to the boundary
        let NnormVec = [0, 1, 0]; // need to change it if we want to change the shape of the boundary

        if (wave._angVel > plasma._angularVel) {
            let aDotb = math.dot((math.multiply(NnormVec, -1)), NwaveDir);

            if (aDotb === 0) { // propagates through without refraction
                console.log("Wave incident along the normal & transmitted!");
                return RefrVec = waveDir;
            }
            else {
                cosTheta = aDotb / (math.dot(NnormVec, NnormVec) * math.dot(NwaveDir, NwaveDir));
                let Theta1 = (Math.PI/2) - Math.acos(cosTheta); //angle of incidence
                let Theta2 = Math.asin((wave._refrIndexWave / plasma._refrIndexP) * Math.sin(Theta1));
                console.log(Theta2);
                //find the direction of the vector after it goes through boundary
                console.log(plasma._refrIndexP);
                RefrVec = math.add(math.multiply((wave._refrIndexWave / plasma._refrIndexP), NwaveDir), math.multiply(((wave._refrIndexWave / plasma._refrIndexP) * Math.cos(Theta1) - Math.cos(Theta2)), math.multiply(-1,NnormVec)));
                console.log(RefrVec);
                return RefrVec;
            }
        }
        else if (wave._angVel < plasma._angularVel) {
            let aDotb = math.dot((math.multiply(NnormVec, -1)), NwaveDir);
            Kimaginary = (plasma._refrIndexP * wave._angVel) / c;
            plasma._attDistance = 1 / Kimaginary; // attenuation distance
            plasma._attDirection = [1, 0, 0];

            if (aDotb === 0) { // reflected along the normal
                console.log("Wave incident along the normal & refleted!");
                return RefrVec = math.multiply(waveDir[0], -1);
            }
            else {
                return RefrVec = waveDir.set(0, -waveDir[0]); //reflects through yz plane
            }
        }
        else {
            return RefrVec = waveDir.set(0, -waveDir[0]);//reflects through yz plane
        }
    }

    // function propagatePlasma(wave, plasma)
    // {
    //     let intr = [];
    //     let snells = [];
    //
    //
    //     let PlasmaIndex = RefrIndexCalc(wave, plasma);
    //     intr = interceptPlasma(wave, plasma);
    //     snells = refractionPlasma(wave, plasma);
    //     var newWave = wave.app(intr, snells);
    //     return newWave;
    // }
//---------------------------------------------------------------------------------------------------------------------
    function Get_sine(matrix,size) {
        for (let i = 0;i < size;i++){
            matrix[i] = math.sin(matrix[i]);
        }
        return matrix
    }

    W = new Wave([-1, 1, 1], [1, -2, 0], 1, 3.46e15, 1);
    P = new Plasma([0, 0, 0], 1e15);
    OE = new OpticalElement()
    traces = OE.Create_traces(W,P,[0,1,0]);
    Plotly.newPlot('graph', traces[0] , {displayModeBar:false});


}







