
var width = 800;
var height = 480;

var phaserInstance = new Phaser.Game(width,height,Phaser.CANVAS,"phaser",{preload: preload,create: create,update: update});

var a1,a2,mol1,potential;
var zoom  = 20;

function preload(){

}

function create(){
    potential = new LJ(2, 4);
    a1 = new Atom([0, 0], 2, 1, potential,0xffffff);
    a2 = new Atom([3, 4], 1, 1, potential,0xffffff);
    mol1 = new Molecule([a1, a2], 2, 2);

    console.log(" COM is " + mol1.COM.items);
    console.log(" I is " + mol1.I);
}

function addAtom(atom) {
    if(phaserInstance === null){
        console.error("phaserInstance has not been created yet");
        return -1;
    }
    var atomG = phaserInstance.add.graphics(0,0);
    atomG.beginFill(atom.color,1);
    atomG.drawCircle(0,0,atom.r*zoom);
    var sprite = phaserInstance.add.sprite(atom.pos.items[0]*zoom + phaserInstance.world.centerX,atom.pos.items[1]*zoom + phaserInstance.world.centerY,atomG.generateTexture());
    sprite.anchor.set(0.5,0.5);
    atomG.destroy();
    return sprite;
}

function update(){
    mol1.update(phaserInstance.time.elapsed/1000);//requests molecule update, sends deltaTime to mol1.

    //TODO:Update a1 and a2 sprite position based off chanegs in mol1.

}

