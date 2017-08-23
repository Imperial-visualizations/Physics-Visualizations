/** ============================================ Class Declarations ==============================================*/
/**
 * Class to describe attributes of atoms that can be used to make up molecules.
 * @param pos: Vector with Cartesian position coordinates
 * @param radius: Radius of atom.
 * @param mass: Mass of atom.
 * @param color: Color of atom for phaser code.(cosmetic only)
 * @constructor: Atom
 */
Atom = function(radius, mass, color) {
    // Making position and force vectors.
    this.pos = [];                 // Atom position Vector.

    // Checking for unphysical parameters.
    if (radius <= 0 || mass <= 0) {
        console.error("Unphysical system detected! Please check radius, mass and charge values.");

        // Correcting to physical values.
        radius = -radius;
        mass = -mass;
    }
    this.lineSprite;
    this.color = color;
    this.radius = radius;                            // Atom radius.
    this.mass = mass;                              // Atom mass.
    this.sprite = addAtom(this);
};
Atom.prototype.getPos = function(){
    if(this.pos.length === 0 ) return;
    return this.pos[this.pos.length - 1];
};
Atom.prototype.setPos = function(newPos){
    if(this.pos.length > 450) {
        this.pos.shift();
    }
        this.pos.push(newPos);
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
    a1.pos = [];
    a2.pos = [];

    var bondSprite;
    // Checking objects of class Atom passed in in the list.
    if (a1.constructor !== Atom || a2.constructor !== Atom){
        console.error("Can't run simulation without two valid atom objects");
    }

    this.V = potential;                                         // Potential used as a bond between atoms.

    if(keVib_0 + keRot_0 + potential.calcV(this.V.getR_0())> 0){
        console.error("escaping");
    }

    this.tot_m = a1.mass + a2.mass;                             // Finding total mass of the system.
    this.reducedM = a1.mass * a2.mass / (this.tot_m);           // Finding system's reduced mass.

    this.init_r_0 = function () {
        var val = this.V.getR_0();
        for (var i =0; i < 100; i++) {
            val -= (this.reducedM * Math.pow(this.omega, 2) * Math.pow(val, 14)
                    - 12 * this.V.e * Math.pow(this.V.getR_0() * val, 6) + 12 * this.V.e * Math.pow(this.V.getR_0(), 12))/
                    (14 * this.reducedM * Math.pow(this.omega, 2) * Math.pow(val,13)- 72 * this.V.e * Math.pow(val, 5) *
                        Math.pow(this.V.getR_0(), 6));
        }
        return val;
    };

    this.I =  Math.pow(this.V.getR_0(), 2)/4 + this.tot_m;      // Calculate initial Moment of Inertia.
    this.omega = Math.sqrt(2 * keRot_0 / this.I);               // Calculate initial angular velocity.
    this.L = this.I * this.omega;                               // Calculate angular momentum (conserved).
    this.r = new Vector([1, 0]).multiply(this.init_r_0());      // Initial radius, due to centrifugal distortion
    this.v = -Math.sqrt(2 * keVib_0 / this.reducedM);           // Initial linear velocity of molecule.

    this.TME = keVib_0 + keRot_0 + this.V.calcV(this.r.mag());      // Total Mechanical Energy of system - constant.

    // Finding coordinates of atoms in CoM frame.
    a1.setPos(this.r.multiply(a1.mass / this.tot_m));
    a2.setPos(this.r.multiply(-a2.mass / this.tot_m));
};

/** ================================================= Class Methods ==================================================*/
/**
 * Calculates the potential energy of the system using the potential function instantiated to the molecule.
 * @returns {Number} System PE.
 */
Molecule.prototype.update = function(deltaTime){

    // Recalculate MoI and angular velocity.
    this.I = this.calcMoI();
    this.omega = this.calcAngVel();

    // Rotate and vibrate.
    this.calcRotCoords(deltaTime);
    this.calcExtCoords(deltaTime);

    console.log("Total E: " + this.getTotalE().toString());

    // Update atom coordinates in CoM frame.
    a1.setPos(this.r.multiply(a1.mass / this.tot_m));
    a2.setPos(this.r.multiply(-a2.mass / this.tot_m));
};

Molecule.prototype.updateVibKE = function (vibKE) {
    this.v = -Math.sqrt(2 * vibKE / this.reducedM);
};

Molecule.prototype.updateRotKE = function (rotKE) {
    this.omega = Math.sqrt(2 * rotKE / this.I);
    this.L = this.I * this.omega;
};

Molecule.prototype.getTotalE = function(){
    return 0.5 * this.I*Math.pow(this.omega,2) + 0.5*this.reducedM*Math.pow(this.v,2) + this.V.calcV(this.r.mag());
};

/**
 * Function to calculate extended coordinates due to vibrational energy.
 * @param dT: Time elapsed since previous timestep.
 */
Molecule.prototype.calcExtCoords = function (dT) {
    var a = this.V.calcF(this.r.mag())/this.reducedM + Math.pow(this.omega, 2) * this.r.mag();
    this.v += a * dT;
    this.r = this.r.add(this.r.unit().multiply(this.v * dT));
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
 * Updates CoM coordinates and calculates Moment of Inertia.
 * @returns {number} I
 */
Molecule.prototype.calcMoI = function() {
    return (Math.pow(this.r.mag(), 2)/4) * this.tot_m;                            // Return Moment of Inertia (scalar).
};

/**
 * Calculates angular velocity using KE_rot and MoI.
 * @returns {Number} Angular velocity, rad s^(-1)
 */
Molecule.prototype.calcAngVel = function () {
    return this.L / this.I;
};