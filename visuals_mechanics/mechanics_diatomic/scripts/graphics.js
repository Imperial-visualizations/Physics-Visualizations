
var width = 800;
var height = 480;

var phaserInstance = new Phaser.Game(width,height,Phaser.CANVAS,"phaser",{preload: preload,create: create,update: update});

var a1,a2,mol1,potential;
var zoom  = 10;
var WHITE = 0xffffff;


/**
 * This function is the first function called when phaser starts and should only be used for initialising textures to be used
 * for sprites. All other code that should be called before the first update call should be placed in create. Not all phaser features have loaded
 * at this point so should not be used for any phaser code other than loading textures.
 */
function preload(){

}

/**
 * Function called after preload and before the first update call. Should be used for initialising objects and variables that will be used
 * in the simulation as well as for creating sprites. phaserInstance has fully loaded at this point so all phaser features can be used.
 */
function create(){
    //phaserInstance.renderer.renderSession.roundedPixels = true;
    //Phaser.Canvas.setImageRenderingCrisp(phaserInstance.canvas);


    potential = new LJ(2, 0.4);
    a1 = new Atom([0, 0], 2, 1,WHITE);
    a2 = new Atom([3, 4], 1, 1,WHITE);
    mol1 = new Molecule(a1,a2,potential, 10, 1);

    console.log(" I is " + mol1.I);
}

/**
 * @param atom: object to add to the simulation.
 * @returns {Sprite} sprite object that represents the visual representation of the atom.
 */
function addAtom(atom) {
    if(phaserInstance === null){
        console.error("phaser Instance has not been created yet");
        return -1;
    }
    var atomG = phaserInstance.add.graphics(0,0);
    atomG.beginFill(atom.color,1);
    atomG.drawCircle(0,0,atom.radius*zoom);

    var sprite = phaserInstance.add.sprite(atom.pos.items[0]*zoom + phaserInstance.world.centerX,atom.pos.items[1]*zoom + phaserInstance.world.centerY,atomG.generateTexture());
    sprite.anchor.set(0.5,0.5);
    atomG.destroy();
    return sprite;
}
/**
 * This function is called once per frame.
 *
 */
function update(){
    mol1.update(1/10);//requests molecule update, sends deltaTime to mol1.
    a1.sprite.x = a1.pos.items[0]*zoom + phaserInstance.world.centerX;
    a1.sprite.y = a1.pos.items[1]*zoom + phaserInstance.world.centerY;
    a2.sprite.x = a2.pos.items[0]*zoom + phaserInstance.world.centerX;
    a2.sprite.y = a2.pos.items[1]*zoom + phaserInstance.world.centerY;
}



