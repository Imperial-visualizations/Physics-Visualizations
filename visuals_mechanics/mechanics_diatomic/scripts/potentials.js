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

LJ.prototype.plot = function() {
    var x = [];                                                 // Array to store r values.
    var y = [];                                                 // Array to store LJ potential at corresponding r.
    var ppu = 10;                                               // Points per unit of separation distance.

    // Layout of plot.
    var layout = {title: "LJ Potential",
        xaxis: {title: "r / Angstroms", range: [0.5 * this.s, 3 * this.s]},
        yaxis: {title: "Potential / eV", range: [1.1 * this.e, -2 * this.e]},
        line: {color: "blue"}};

    // Generating plot data.
    for (var i = layout.xaxis.range[0] + 1/ppu; i < Math.ceil(layout.xaxis.range[1]) * ppu; i++) {
        var separation = i / ppu;
        x.push(separation);
        y.push(this.calcV(separation));
    }

    // Creating plot-able object.
    var scatter_LJ = {y: y, x: x, mode: "lines+markers", type: "scatter", name: "LJ Pot"};
    Plotly.newPlot("LJ_scatter", {data: [scatter_LJ], traces: [0], layout: layout});
};
