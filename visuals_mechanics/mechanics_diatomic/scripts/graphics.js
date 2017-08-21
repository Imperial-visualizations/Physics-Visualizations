var width = 800;
var height = 480;
width = $("#phaser").width() * window.devicePixelRatio;
height = $("#phaser").width() * window.devicePixelRatio;

var phaserInstance = new Phaser.Game(width,height,Phaser.CANVAS,
    "phaser",{preload: preload,create: create,update: update});

var a1,a2,mol1,potential;
var zoom  = 45;
var initKVib,initKRot;
var WHITE = 0xffffff;
const GREEN = 0x66A40A;
const IMPERIAL_BLUE = 0x003E74;
const CHERRY = 0xE40043;
var running = false;
/**
 * This function is the first function called when phaser starts and should only be used for initialising textures to be used
 * for sprites. All other code that should be called before the first update call should be placed in create. Not all phaser features have loaded
 * at this point so should not be used for any phaser code other than loading textures.
 */
function preload(){

}

$('.inputs').each(function(){

    $(this).on('input',updateLabels);
});


$('#playPauseButton').on('click',function(){
    if(running){
        running = false;
        $('#playPauseButton').text("Play");
        reset();
    }else{
        running = true;
        $('#playPauseButton').text("Stop");
    }
});

function updateLabels(){
    $('.inputs').each(function(){
        var display_id = "#" + $(this).attr("id") + "Display";
        $(display_id).text($(this).val() + $(display_id).attr("data-unit"));

    });
    initKVib = parseFloat($('#vibKE').val());
    initKRot = parseFloat($('#rotKE').val());
    reset();
}


/**
 * Function called after preload and before the first update call. Should be used for initialising objects and variables that will be used
 * in the simulation as well as for creating sprites. phaserInstance has fully loaded at this point so all phaser features can be used.
 */
function create(){
    //phaserInstance.renderer.renderSession.roundedPixels = true;
    //Phaser.Canvas.setImageRenderingCrisp(phaserInstance.canvas);

    phaserInstance.canvasWidth = $("#phaser").width() * window.devicePixelRatio;
    phaserInstance.canvasHeight = $("#phaser").width() * window.devicePixelRatio;
    phaserInstance.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    phaserInstance.scale.setUserScale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
    phaserInstance.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    phaserInstance.stage.backgroundColor = 0xEBEEEE;

    potential = new LJ(2, -10, 2, -10);
    a1 = new Atom([0, 0], 1, 1,CHERRY);
    a2 = new Atom([3, 4], 1, 1,CHERRY);


    updateLabels();
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

    var sprite = phaserInstance.add.sprite(atom.pos.items[0]*zoom + phaserInstance.world.centerX,atom.pos.items[1]*zoom
        + phaserInstance.world.centerY,atomG.generateTexture());
    sprite.anchor.set(0.5,0.5);
    atomG.destroy();
    return sprite;
}

var arrRotKE = [];
var arrTime = [];
var arrPE = [];
var arrVibKE = [];

function plotRotKE() {
    Plotly.newPlot("graphRotE", {data: [{x: arrTime, y: arrRotKE}], traces: [0]},
        {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

function plotPE() {
    Plotly.newPlot("graphPotE", {data: [{x: arrTime, y: arrPE}], traces: [0]},
        {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

function plotVibKE() {
    Plotly.newPlot("graphVibE", {data: [{x: arrTime, y: arrVibKE}], traces: [0]},
        {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}
plotRotKE();
plotPE();
plotVibKE();

function reset(){

    mol1 = new Molecule(a1,a2,potential,initKVib,initKRot);

    a1.sprite.x = a1.pos.items[0] * zoom + phaserInstance.world.centerX;
    a1.sprite.y = a1.pos.items[1] * zoom + phaserInstance.world.centerY;
    a2.sprite.x = a2.pos.items[0] * zoom + phaserInstance.world.centerX;
    a2.sprite.y = a2.pos.items[1] * zoom + phaserInstance.world.centerY;
    arrRotKE = [];
    arrTime = [];
    plotRotKE();
    plotPE();
}

/**
 * This function is called once per frame.
 *
 */
function update(){
    if(running) {
        var dT = 1 / 60;
        mol1.update(dT);//requests molecule update, sends deltaTime to mol1.
        a1.sprite.x = a1.pos.items[0] * zoom + phaserInstance.world.centerX;
        a1.sprite.y = a1.pos.items[1] * zoom + phaserInstance.world.centerY;
        a2.sprite.x = a2.pos.items[0] * zoom + phaserInstance.world.centerX;
        a2.sprite.y = a2.pos.items[1] * zoom + phaserInstance.world.centerY;

        // Calculate Rotational KE and update array.
        var rotKE = 0.5 * mol1.I * Math.pow(mol1.omega, 2);
        arrRotKE.push(rotKE);

        // Calculate PE and update array.
        var PE = mol1.V.calcV(mol1.r.mag());
        arrPE.push(PE);

        // Calculate Vibrational KE and update array.
        var vibKE = mol1.TME - rotKE - PE;
        arrVibKE.push(vibKE);

        // Update time array.
        var t;
        if (arrTime.length > 0) t = arrTime[arrTime.length - 1] + dT;
        else t = dT;
        arrTime.push(t);

        Plotly.restyle("graphRotE", {data: [{x: arrTime, y: arrRotKE}], traces: [0]},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphPotE", {data: [{x: arrTime, y: arrPE}], traces: [0]},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphVibE", {data: [{x: arrTime, y: arrVibKE}], traces: [0]},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}});
    }
}



