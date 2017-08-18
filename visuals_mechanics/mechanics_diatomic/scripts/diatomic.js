/** ============================================ Class Declarations ==============================================*/
/**
 * Class to describe attributes of atoms that can be used to make up molecules.
 * @param pos: Vector with Cartesian position coordinates
 * @param radius: Radius of atom.
 * @param mass: Mass of atom.
 * @param color: Color of atom for phaser code.(cosmetic only)
 * @constructor: Atom
 */
Atom = function(pos, radius, mass, color) {
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
    this.radius = radius;                               // Atom radius.
    this.mass = mass;                                   // Atom mass.
    this.sprite = addAtom(this);
};

/**
 * Class to make molecule out of atoms, with a spring constant that defines strength of bonds, and instantiated with
 * rotational and vibrational E.
 * @param a1: Atom 1.
 * @param a2: Atom 2.
 * @param potential: Potential describing bond between atoms.
 * @param keVib_0: Vibrational kinetic energy at t=0.
 * @param keRot_0: Rotational kinetic energy at t=0.
 * @constructor
 */
Molecule = function(a1, a2, potential, keVib_0, keRot_0) {

    // Checking objects of class Atom passed in in the list.
    if (a1.constructor !== Atom || a2.constructor !== Atom){
        console.error("Can't run simulation without two valid atom objects");
    }

    this.V = potential;                                          // Setting potential between the diatoms.
    this.tot_m = a1.mass + a2.mass;                              // Finding total mass of the system.
    this.reducedM = a1.mass * a2.mass / (this.tot_m);            // Finding system's reduced mass.

    this.init_r_0 = function () {
        var val = this.V.getR_0();

        for (var i =0; i < 10; i++) {
            val -= (this.reducedM * Math.pow(this.omega, 2) * Math.pow(val, 14)
                - 12 * this.V.e * Math.pow(this.V.getR_0() * val, 6) - 12 * this.V.e * Math.pow(this.V.getR_0(), 12))/
                    (14 * this.reducedM * Math.pow(this.omega,2) * Math.pow(val,13)-72 * this.V.e * Math.pow(val, 5) *
                        Math.pow(this.V.getR_0(), 6));
        }
        return val;
    };

    this.I = this.reducedM * Math.pow(this.V.getR_0(),2);       // Calculate initial Moment of Inertia.
    this.omega = Math.sqrt(2 * keRot_0 / this.I);               // Calculate initial angular velocity.
    this.L = this.I * this.omega;                               // Calculate angular momentum (conserved).
    this.r = new Vector([0,1]).multiply(this.init_r_0());       // Initial radius, due to centrifugal distortion
    this.v = Math.sqrt(2 * keVib_0 / this.reducedM);            // Initial linear velocity of molecule.

    // Finding initial coordinates of atoms in CoM frame.
    a1.pos = this.r.multiply(a1.mass / this.tot_m);
    a2.pos = this.r.multiply(-a2.mass / this.tot_m);
};

/** ================================================= Class Methods ==================================================*/
/**
 * Function to calculate extended coordinates due to vibrational energy.
 * @param dT: Time elapsed since previous timestep.
 */
Molecule.prototype.calcExtCoords = function (dT) {
    // Acceleration due to potential.
    var lin_a = this.V.calcF(this.r.mag())/this.reducedM;

    // Centrifugal force due to rotation of molecule.
    var centrifugal_a = Math.pow(this.omega, 2) * this.r.mag();

    var a = lin_a + centrifugal_a;                          // Total linear acceleration.
    this.v += a * dT;                                       // Using "v = u + at"
    var dr = this.r.unit().multiply(this.v * dT);           // Displacement vector.
    this.r = this.r.add(dr);                                // Separation vector updated.
};

/**
 * Updates the separation vector, r, and the coordinates of the atoms.
 * @returns
 */
Molecule.prototype.update = function(deltaTime){

    // Recalculate MoI and angular velocity.
    this.I = this.calcMoI();
    this.omega = this.calcAngVel();

    // Rotate and vibrate.
    this.calcRotCoords(deltaTime);
    this.calcExtCoords(deltaTime);

    // Update atom coordinates in CoM frame.
    a1.pos = this.r.multiply(a1.mass / this.tot_m);
    a2.pos = this.r.multiply(-a2.mass / this.tot_m);
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
    this.E_r = Math.pow(this.L,2) / (2 * this.I);                                 // Using L^2 = 2 * I * KE_rot
    return this.E_r
};

/**
 * Updates CoM coordinates and calculates Moment of Inertia.
 * @returns {number} I
 */
Molecule.prototype.calcMoI = function() {
    return this.reducedM * Math.pow(this.r.mag(),2);                              // Return Moment of Inertia (scalar).
};

/**
 * Calculates angular velocity using KE_rot and MoI.
 * @returns {Number} Angular velocity, rad s^(-1)
 */
Molecule.prototype.calcAngVel = function () {
    return this.L / this.I;
};
