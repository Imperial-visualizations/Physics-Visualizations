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
    this.radius = radius;                            // Atom radius.
    this.mass = mass;                              // Atom mass.
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
Molecule = function(a1,a2, potential, keVib_0,keRot_0) {



    // Checking objects of class Atom passed in in the list.
    if (a1.constructor !== Atom || a2.constructor !== Atom){
        console.error("Can't run simulation without two valid atom objects");
    }

    // Sanity check
    if (this.atoms.length !== 2) {
        console.error("Sorry, currently only support diatomic molecules! Please ensure you enter 2 atoms in array.")
    }

    this.V = potential;

    // Finding total mass of the system.
    this.tot_m = function () {
        return a1.mass + a2.mass;
    };
    // Finding system's reduced mass.
    this.reducedM = function () {
        return a1.mass*a2.mass /(a1.mass+a2.mass);
    };

    this.init_r_0 = function () {
        //TODO:Solve the equation needed to calculate this.
    }
    
    this.I_0 = function () {
        return this.reducedM() *  Math.pow(this.V.getR_0(),2);
    };
    this.omega_0 = function () {
        return Math.sqrt( 2* keRot_0/this.I);
    };
    this.I = this.I_0();
    this.L = this.I * this.omega_0();
    this.r = new Vector(0,1).multiply(this.init_r_0());
    this.v = Math.sqrt( 2* keVib_0 / this.reducedM());
    this.omega = this.omega_0();

    a1.pos = this.r.multiply(a1.mass/this.tot_m());
    a2.pos = this.r.multiply(-a2.mass/this.tot_m());

    // // Magnitude of linear speed for each Atom object.
    // this.p_i = Math.sqrt((this.E_v * 2 * this.tot_m()) / (Math.pow(this.atoms.length, 2)));
    // for (var i = 0; i < this.atoms.length; i++) {
    //     this.atoms[i].v = this.p_i / this.atoms[i].m;                   // Setting each atom's speed.
    // }

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
    var a = this.V.calcF(this.r.mag())/this.reducedM() + Math.pow(this.omega,2)*this.r.mag();
    this.v = a*dT;
    this.r = this.r.add(this.v * dT);
};

/**
 * Calculates the potential energy of the system using the potential function instantiated to the molecule.
 * @returns {Number} System PE.
 */
Molecule.prototype.update = function(deltaTime){
    this.I = this.calcMoI();
    this.omega = this.calcAngVel();
    this.calcRotCoords(deltaTime);
    this.calcExtCoords(deltaTime);
    a1.pos = this.r.multiply(a1.mass/this.tot_m());
    a2.pos = this.r.multiply(-a2.mass/this.tot_m());
};



Molecule.prototype.calcPE = function() {
    this.PE = this.V.calcV(this.r.mag());                                // Potential energy calculation.
    return this.PE
};

/**
 * Updates KE_rot and I, and finally outputs rotated separation vector.
 * @param dt: Timestep
 * @returns {Vector} Separation vector, r.
 */
Molecule.prototype.calcRotCoords = function(dt) {
    this.r = this.r.rotate(this.omega * dt);
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
    return this.reducedMass() * Math.pow(this.r,2);                                                       // Return Moment of Inertia (scalar).
};

/**
 * Calculates angular velocity using KE_rot and MoI.
 * @returns {Number} Angular velocity, rad s^(-1)
 */
Molecule.prototype.calcAngVel = function () {
    return this.L / this.I;
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
