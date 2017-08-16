/** ============================================ Class Declarations ==============================================*/
/**
 * Class to describe attributes of atoms that can be used to make up molecules.
 * @param pos: Vector with Cartesian position coordinates
 * @param radius: Radius of atom.
 * @param mass: Mass of atom.
 * @param potential: Object defining potential type at atom (e.g. LJ, harmonic, etc.)
 * @param color: Color of atom for phaser code.(cosmetic only)
 * @constructor: Atom
 */
Atom = function(pos, radius, mass, potential, color) {
    // Making position and force vectors.
    this.pos = new Vector(pos);                 // Atom position Vector.

    // Checking for unphysical parameters.
    if (radius <= 0 || mass <= 0) {
        console.error("Unphysical system detected! Please check radius, mass and charge values.");

        // Correcting to physical values.
        radius = -radius;
        mass = -mass;
    }

    this.color = color;
    this.r = radius;                            // Atom radius.
    this.m = mass;                              // Atom mass.
    this.sprite = addAtom(this);
};

/**
 * Class to make molecule out of atoms, with a spring constant that defines strength of bonds, and instantiated with
 * rotational and vibrational E.
 * @param atoms: Array containing all atoms in molecules.
 * @param potential: Potential describing bond between atoms.
 * @param vibrational_E: Vibrational kinetic energy.
 * @param rotational_E: Rotational kinetic energy.
 * @constructor
 */
Molecule = function(atoms, potential, vibrational_E, rotational_E) {

    // Checking objects of class Atom passed in in the list.
    if (atoms.constructor === Array || atoms[0].constructor === Atom)
    {
        this.atoms = atoms;                                               // Atoms
    }

    // Sanity check
    if (this.atoms.length !== 2) {
        console.error("Sorry, currently only support diatomic molecules! Please ensure you enter 2 atoms in array.")
    }

    // Finding total mass of the system.
    this.tot_m = function () {
        var m = 0;
        for (var i = 0; i < this.atoms.length; i++) {
            m += this.atoms[i].m;
        }
        return m
    };
    this.tot_m = this.tot_m();

    // Finding system's reduced mass.
    this.reducedM = function () {
        var muInv = 0;
        for(var i = 0; i < this.atoms.length;i++){
            muInv += 1/this.atoms.m;
        }
        return 1/muInv;
    };

    this.V = potential;                                                 // Only for diatomic molecule for now.

    this.elapsed = 0;
    this.COM = this.calcCOM();                                          // Centre of mass.

    this.I = this.calcMoI();                                            // Moment of inertia initialised as 0.
    this.E_r = rotational_E;                                            // Rotational energy.
    this.Lsq = 2 * rotational_E * this.I;                               // Square of Angular Momentum.
    this.w = this.calcAngVel();                                         // Angular velocity, w.

    this.E_v = vibrational_E;                                           // Vibrational energy.
    this.PE = this.calcPE();                                            // Potential energy.
    this.r = this.V.getR_0();                                           // Separation vector.

    // Magnitude of linear speed for each Atom object.
    this.p_i = Math.sqrt((this.E_v * 2 * this.tot_m) / (Math.pow(this.atoms.length, 2)));
    for (var i = 0; i < this.atoms.length; i++) {
        this.atoms[i].v = this.p_i / this.atoms[i].m;                   // Setting each atom's speed.
    }

};

/** ================================================= Class Methods ==================================================*/
/**
 * Calculates the scalar distance between a pair of atoms.
 * @param atom1: Atom
 * @param atom2: Another atom
 * @returns {Vector} separation, r.
 */
Molecule.prototype.calcSeparation = function(atom1, atom2) {
    var r = atom1.pos.subtract(atom2.pos);
    return new Vector(r)
};

/**
 * Calculates the unit vector between two atom positions.
 * @param atom1: Atom
 * @param atom2: Another atom
 * @returns {Vector} Unit vector
 */
Molecule.prototype.calcUnitVect = function(atom1, atom2) {
    var r = atom1.pos.subtract(atom2.pos);
    return new Vector(r.unit())
};

/**
 * Function to calculate extended coordinates due to vibrational energy.
 * @param dT: Time elapsed since previous timestep.
 */
Molecule.prototype.calcExtCoords = function (dT) {
    // TODO: Calculated separation vector after extension.
    };

/**
 * Calculates the potential energy of the system using the potential function instantiated to the molecule.
 * @returns {Number} System PE.
 */
Molecule.prototype.calcPE = function() {
    this.PE = this.V.calcV(this.r.mag());                                // Potential energy calculation.
    return this.PE
};

/**
 * Updates KE_rot and I, and finally outputs rotated separation vector.
 * @param t: Timestep
 * @returns {Vector} Separation vector, r.
 */
Molecule.prototype.calcRotCoords = function(t) {
    // E_r = 0.5 * I * w ** 2
    this.calcRotKE();                                                    // Update KE_rot value.
    this.calcMoI();                                                      // Update Moment of Inertia.
    this.calcAngVel();                                                   // Updates Angular velocity, w.
    var d_Angle = this.w * t;                                            // Rotation angle around COM (radians).

    // Rotation of separation vector about COM.
    this.r = this.r.subtract(this.COM).rotate(d_Angle).add(this.COM);
    return this.r
};

/**
 * Calculates the rotational kinetic energy of system, using the conservation of Angular Momentum.
 * @returns {Number} Current value of the rotational kinetic energy of the system.
 *
 */
Molecule.prototype.calcRotKE = function() {
    this.E_r = this.Lsq / (2 * this.I);                                 // Using L^2 = 2 * I * KE_rot
    return this.E_r
};

/**
 * Updates CoM coordinates and calculates Moment of Inertia.
 * @returns {number} I
 */
Molecule.prototype.calcMoI = function() {
    this.calcCOM();
    var I = 0;                                                          // Moment of Inertia.
    for (var i = 0; i < this.atoms.length; i++) {                       // Distance between this atom and COM.
        var r_i = this.atoms[i].pos.subtract(this.COM);                 // Distance between this atom and COM
        I += this.atoms[i].m * Math.pow(r_i.mag(), 2);                  // m*r**2 contribution for this atom.
    }
    this.I = I;
    return I;                                                           // Return Moment of Inertia (scalar).
};

/**
 * Calculates angular velocity using KE_rot and MoI.
 * @returns {Number} Angular velocity, rad s^(-1)
 */
Molecule.prototype.calcAngVel = function () {
    this.w = Math.sqrt(2 * this.E_r / this.I);
    return this.w;
};

/**
 * Calculates Centre of Mass coordinates.
 * @returns {Vector} Centre of Mass
 */
Molecule.prototype.calcCOM = function() {
    var total_m = 0;                                                    // Total mass of system.

    var total_mx = [];                                                  // Total mass * position (mx) of system.
    for (var j = 0; j < this.atoms[0].pos.items.length; j++) {
        total_mx.push(0)
    }
    total_mx = new Vector(total_mx);                                    // mx initialised as 0 vector.

    // Summing mx and m.
    for (var i = 0; i < this.atoms.length; i++) {
        total_m += this.atoms[i].m;
        var mx = this.atoms[i].pos.multiply(this.atoms[i].m);
        total_mx = total_mx.add(mx);
    }

    this.COM = total_mx.multiply(1 / total_m);                          // Updating instance COM coords.
    return this.COM;                                                    // Return Vector coordinates of COM.
};
