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
 * @param sigma: Radius where potential is 0 for a1-a1 diatom.
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
    // LJ parameters initialisation.
    this.s = sigma;
    this.e = epsilon;

    // Heterogeneous diatomic molecule.
    if (isNumber(sigma2) && isNumber(epsilon2)){
        // LJ combined parameter calculation.
        this.s = (this.s + sigma2)/2;
        this.e = Math.sqrt(this.e * epsilon2)
    }
};

/**
 * Calculate LJ potential.
 * @param r: Distance from LJ centre.
 * @returns {number|*}
 */
LJ.prototype.calcV = function(r) {
    var repulsive = Math.pow(this.s / r, 12);                   // Repulsive factors.
    var attractive = -1 * Math.pow(this.s / r, 6);              // Attractive factors.
    return 4 * this.e * (repulsive + attractive);     // Calculating LJ potential at distance r.
};

LJ.prototype.calcF = function(r) {
    var repulsive = 12 * Math.pow(this.s / r, 12);
    var attractive = -6 * Math.pow(this.s / r, 6);
    return 4 * this.e * ((repulsive + attractive) / r);
};

LJ.prototype.getR_0 = function(){
    return Math.pow(2, 1/6) * this.s;
};



/**
 * Harmonic potential class.
 * @param equilibrium: Equilibrium distance of pair of atoms.
 * @param force_constant: Hooke's Law, spring/force constant.
 * @constructor
 */
Parabolic = function (equilibrium, force_constant) {

    // Sanity check.
    if (!isNumber(equilibrium) || !isNumber(force_constant)) {
        console.error("Error! Equilibrium and k values invalid!");
    }

    if (equilibrium < 0 || force_constant < 0) {
        console.error("Error! Equilibrium and/or force constant values negative (unphysical)!");
        equilibrium = -equilibrium;
        force_constant = -force_constant;
    }

    // Harmonic potential parameters intialisation.
    this.eqR = equilibrium;
    this.k = force_constant;
};

/**
 * Calculate harmonic potential.
 * @param r: Distance from harmonic potential centre.
 * @returns {number}
 */
Parabolic.prototype.calcV = function (r) {
    var parabola = Math.pow(r - this.eqR, 2);                   // Shape of harmonic potential
    return this.k * parabola;                                   // Calculating harmonic potential at distance r.
};

Parabolic.prototype.calcF = function(r) {
    return -1 * this.k * r;
};
