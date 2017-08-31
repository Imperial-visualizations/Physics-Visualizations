/** ============================================ Class Declarations ==============================================*/
/**
 * Class to describe attributes of atoms that can be used to make up molecules.
 * @param radius: Radius of atom.
 * @param mass: Mass of atom.
 * @param color: Color of atom for phaser code.(cosmetic only)
 * @constructor: Atom
 */
Atom = function( mass, color) {
    this.pos = [];                 // Atom position Vector.

    // Checking for unphysical parameters.
    if ( mass <= 0) {
        console.error("Unphysical system detected! Please check radius, mass and charge values.");

        // Correcting to physical values.
        mass = -mass;
    }
    this.lineSprite = null;
    this.color = color;
    this.mass = mass;
    this.radius = Math.sqrt(this.mass);// Atom mass.
    this.sprite = addAtom(this);
};

Atom.prototype.getPos = function(){
    if(this.pos.length === 0 ) return;
    return this.pos[this.pos.length - 1];
};
Atom.prototype.setPos = function(newPos){
    if(this.pos.length > 90) this.pos.shift();      // Storing last 90 positions, deleting older ones
    this.pos.push(newPos);                          // Pushing new position.
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

    this.a1 = a1;
    this.a2 = a2;

    this.V = potential;                                         // Potential used as a bond between atoms.

    this.tot_m =(a1.mass + a2.mass);                             // Finding total mass of the system.
    this.reducedM =  (a1.mass * a2.mass) / (this.tot_m);           // Finding system's reduced mass.

    this.I =  this.reducedM * Math.pow(this.V.getR_0(),2);        // Calculate initial Moment of Inertia.
    this.omega = Math.sqrt(2 * keRot_0 / this.I);               // Calculate initial angular velocity.
    this.L = this.I * this.omega;                               // Calculate angular momentum (conserved).
    this.r = new Vector([1, 0]).multiply(this.init_r_0(keVib_0,keRot_0));      // Initial radius, due to centrifugal distortion
    //this.V.s = this.r.mag() / Math.pow(2, 1 / 6);               // Centrifugal distortion changes potential.
    this.v = Math.sqrt(2 * keVib_0 / this.reducedM);           // Initial linear velocity of molecule.

    a1.setPos(this.r.multiply(a1.mass / this.tot_m));
    a2.setPos(this.r.multiply(-a2.mass / this.tot_m));

    // System's vibrational & rotational KEs, and total energy.
    this.KE_V = this.getKE_V();
    this.KE_R = this.getKE_R();
    this.tot_E = keVib_0 + keRot_0 + this.V.calcCorrV(this.init_r_0(initKVib, initKRot), this.L, this.reducedM);
};

/** ================================================= Class Methods ==================================================*/
/**
 *  Calculates the centrifugally corrected value of r at the time t = 0 seconds.
 * @returns {number} Corrected value of r_0
 */
Molecule.prototype.init_r_0 = function(initVib,initRot) {
        var val = this.V.getR_0();
        if(initVib + initRot + - this.V.e > 0) return val * Math.pow(13/7,1/6);
        for (var i =0; i < 100; i++) {
                val -= (this.reducedM * Math.pow(this.omega, 2) * Math.pow(val, 14)
                - 12 * this.V.e * Math.pow(this.V.getR_0() * val, 6) + 12 * this.V.e * Math.pow(this.V.getR_0(), 12)) /
                (14 * this.reducedM * Math.pow(this.omega, 2) * Math.pow(val, 13) - 72 * this.V.e * Math.pow(val, 5) *
                    Math.pow(this.V.getR_0(), 6));
        }
        return val;
};

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

    this.KE_V = this.getKE_V();
    this.KE_R = this.getKE_R();

    // Update atom coordinates in CoM frame.
    a1.setPos(this.r.multiply(a1.mass / this.tot_m));
    a2.setPos(this.r.multiply(-a2.mass / this.tot_m));
};

/**
 * Function to calculate extended coordinates due to vibrational energy.
 * @param dT: Time elapsed since previous timestep.
 */
Molecule.prototype.calcExtCoords = function (dT) {
    var a = (this.V.calcF(this.r.mag()) / this.reducedM) +  Math.pow(this.omega, 2) * this.r.mag();
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
    return this.reducedM * Math.pow(this.r.mag(),2);                            // Return Moment of Inertia (scalar).
};

/**
 * Calculates angular velocity using KE_rot and MoI.
 * @returns {Number} Angular velocity, rad s^(-1)
 */
Molecule.prototype.calcAngVel = function () {
    return this.L / this.I;
};

Molecule.prototype.calcDir = function() {
    return a1.getPos().subtract(a2.getPos());
};

Molecule.prototype.getKE_R = function () {
    return 0.5 * this.I * Math.pow(this.omega,2);
};

Molecule.prototype.getKE_V = function () {
    return 0.5 * this.reducedM * Math.pow(this.v,2);
};

/**
 * Creates new molecule object with no change in direction or separation.
 * @param ke_vib0: Slider value of KE_vib.
 * @param ke_rot0: Slider value of KE_rot.
 * @returns {Molecule} New molecule.
 */
Molecule.prototype.softReset = function (ke_vib0, ke_rot0) {
    var dir = this.calcDir();

    var new_mol = new Molecule(this.a1, this.a2, this.V, ke_vib0, ke_rot0);

    new_mol.a1.pos.splice(-1, 1); new_mol.a2.pos.splice(-1, 1);
    new_mol.r = dir;
    new_mol.w = this.w;
    new_mol.KE_V = new_mol.tot_E - new_mol.KE_R;
    if (this.v > 0) mol1.v = -mol1.v;

    return new_mol;
};