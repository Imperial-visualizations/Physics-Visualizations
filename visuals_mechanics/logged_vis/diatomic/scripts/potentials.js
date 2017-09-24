/**
 * Checks if n is a number or not.
 * @param n: Input
 * @returns {boolean}
 */
var isNumber = function (n) {
    return isFinite(n) && +n === n;
};

/**
 * Lennard-Jones potential class. If sigma2 and epsilon2 not provided, assuming atom 1 and atom 2 are identical.
 * @param sigma: Separation where potential is 0 for a1-a1 diatom.
 * @param epsilon: Potential at equilibrium distance for a1-a1 diatom.
 * @param sigma2: LJ param sigma for a2-a2 diatom.
 * @param epsilon2: Lj param epsilon for a2-a2 diatom.
 * @constructor
 */
LJ = function (sigma, epsilon, sigma2, epsilon2) {

    // Sanity check.
    if (!isNumber(sigma) || !isNumber(epsilon)) {
        console.error("Error! Sigma and Epsilon values invalid!");
    }
    // LJ parameters initialisation for Atom 1.
    var s1 = sigma;
    var e1 = epsilon;

    // LJ parameters initialisation for Atom 2.
    var s2, e2;
    // Heterogeneous diatomic molecule.
    if (isNumber(sigma2) && isNumber(epsilon2)){
        // LJ parameters for Atom 2.
        s2 = sigma2;
        e2 = epsilon2;
    }

    else {
        s2 = s1;
        e2 = e1;
    }

    // Calculating combined LJ parameters.
    this.calcSigma(s1, s2);
    this.calcEpsilon(e1, e2);
};

LJ.prototype.calcSigma = function(s1, s2) {
    this.s = (s1 + s2) / 2
};

LJ.prototype.calcEpsilon = function(e1, e2) {
    this.e = Math.sqrt(e1 * e2);
};

/**
 * Calculate LJ potential.
 * @param r: Distance from LJ centre.
 * @returns {number} Net potential due to potential
 */
LJ.prototype.calcV = function(r) {
    var repulsive = Math.pow(this.s / r, 12);                   // Repulsive factors.
    var attractive = -1 * Math.pow(this.s / r, 6);              // Attractive factors.
    return 4 * this.e * (repulsive + attractive);
};

/**
 * Calculates LJ potential corrected for centrifugal force effects.
 * @param r: separation of atoms
 * @param L: Angular momentum
 * @param mu: Reduced mass of diatomic molecule.
 * @returns {number} Corrected potential
 */
LJ.prototype.calcCorrV = function(r, L, mu) {
    return (this.calcV(r) + Math.pow(L / r, 2) / (2 * mu));
};

/**
 * Calculates force on each atom in molecule due to LJ potential.
 * @param r: Separation
 * @returns {number} Net force due to potential
 */
LJ.prototype.calcF = function(r) {
    var repulsive = 12 * Math.pow(this.s / r, 12);              // Repulsive force.
    var attractive = -6 * Math.pow(this.s / r, 6);              // Attractive force.
    return 4 * this.e * ((repulsive + attractive) / r);
};

/**
 *
 * @returns {number} Separation at which potential is 0.
 */
LJ.prototype.getR_0 = function(){
    return Math.pow(2, 1/6) * this.s;
};

/**
 * Generates two arrays of points that can be used to plot the potential against separation to visualise the form of the
 * instance of LJ potential.
 * @param ppu: Points per unit of separation.
 * @returns {{x: Array, y: Array, name: string, mode: string, line: {width: number, opacity: number, color: string}}}
 * JS object that can be plotted by Plotly.
 */
LJ.prototype.plotLJ = function(ppu) {
    var r = [];                                                         // Array to store separation in.
    var v = [];                                                         // Array to store corresponding potential in.

    // Taking points upto 3 * sigma.
    for (var i = 1; i < Math.ceil(this.s * 3 * ppu); i++) {
        r.push(i / ppu);
        v.push(this.calcV(i / ppu));
    }
    return {x: r, y: v, name: "V" + "LJ".sub() + "(r)", mode: "lines",
        line: {width: this.e / 10, opacity: 0.8, color: "#003E74"}};
};

/**
 * Generates two arrays of points that can be used to plot the corrected potential against separation to visualise the
 * form of the instance of LJ potential due to centrifugal effects.
 * @param ppu: Points per unit of separation
 * @param L: Angular momentum of molecule.
 * @param mu: Reduced mass of molecule.
 * @returns {{x: Array, y: Array, name: string, mode: string, line: {width: number, opacity: number, color: string}}}
 * JS object that can be plotted by Plotly.
 */
LJ.prototype.plotLJCorr = function (ppu, L, mu) {
    var r = [];
    var v = [];

    for (var i = 1; i < Math.ceil(this.s * 3 * ppu); i++){
        r.push(i / ppu);
        v.push(this.calcCorrV(i / ppu, L, mu));
    }
    return {x:r, y:v, name:"EP", mode:"lines",
        line: {width: this.e / 10, opacity:0.8, color:'#FF0000'}};
};
