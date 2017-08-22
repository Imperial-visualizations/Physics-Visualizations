var width = 800;
var height = 480;
width = $("#phaser").width() * window.devicePixelRatio;
height = $("#phaser").width() * window.devicePixelRatio;

var phaserInstance = new Phaser.Game(width,height,Phaser.CANVAS,
    "phaser",{preload: preload,create: create,update: update});

var a1,a2,mol1,potential;
var zoom  = 45;
var initKVib,initKRot;
var inits1, inits2, inite1, inite2;
var WHITE = 0xffffff;
const GREEN = 0x66A40A;
const IMPERIAL_BLUE = 0x003E74;
const CHERRY = 0xE40043;
var running = false;

var mainLayer,traceLayer;
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

/**
 * Finds element in body with data-change attribute, and changes text to support input. Reverts to text when clicked
 * off the input field.
 */

/**
 * Play/stop button code.
 */
$('#playPauseButton').on('click',function(){
    if(running) {
        running = false;
        $('#playPauseButton').text("Play");
        reset();
    }
    else {
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

function updateLJparams() {
    inits1 = parseFloat($('#s1').text());
    inits2 = parseFloat($('#s2').text());
    inite1 = parseFloat($('#e1').text());
    inite2 = parseFloat($('#e2').text());
}


/**
 * Function called after preload and before the first update call. Should be used for initialising objects and variables that will be used
 * in the simulation as well as for creating sprites. phaserInstance has fully loaded at this point so all phaser features can be used.
 */
function create(){
    //phaserInstance.renderer.renderSession.roundedPixels = true;
    //Phaser.Canvas.setImageRenderingCrisp(phaserInstance.canvas);
    traceLayer = phaserInstance.add.group();
    mainLayer = phaserInstance.add.group();


    phaserInstance.canvasWidth = $("#phaser").width() * window.devicePixelRatio;
    phaserInstance.canvasHeight = $("#phaser").width() * window.devicePixelRatio;
    phaserInstance.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    phaserInstance.scale.setUserScale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
    phaserInstance.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    phaserInstance.stage.backgroundColor = 0xEBEEEE;

    a1 = new Atom(1, 1, CHERRY);
    a2 = new Atom(1, 1, CHERRY);

    updateLJparams();
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

    var sprite = mainLayer.create(0,0,atomG.generateTexture());
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

var r = [];                                                 // Array to store r values.
var v = [];                                                 // Array to store LJ potential at corresponding r.
var ppu = 90;                                               // Points per unit of separation distance.

plotRotKE();
plotPE();
plotVibKE();

function reset(){

    potential = new LJ(inits1, inite1, inits2, inite2);
    mol1 = new Molecule(a1, a2, potential, initKVib, initKRot);

    a1.sprite.x = a1.getPos().items[0] * zoom + phaserInstance.world.centerX;
    a1.sprite.y = a1.getPos().items[1] * zoom + phaserInstance.world.centerY;
    a2.sprite.x = a2.getPos().items[0] * zoom + phaserInstance.world.centerX;
    a2.sprite.y = a2.getPos().items[1] * zoom + phaserInstance.world.centerY;

    arrRotKE = [];
    arrTime = [];
    plotRotKE();
    plotPE();
    plotVibKE();
}

/**
 * This function is called once per frame.
 *
 */
function update(){
    if(running) {
        dT = 1/60;
        mol1.update(dT);//requests molecule update, sends deltaTime to mol1.
        a1.sprite.x = a1.getPos().items[0] * zoom + phaserInstance.world.centerX;
        a1.sprite.y = a1.getPos().items[1] * zoom + phaserInstance.world.centerY;
        a2.sprite.x = a2.getPos().items[0] * zoom + phaserInstance.world.centerX;
        a2.sprite.y = a2.getPos().items[1] * zoom + phaserInstance.world.centerY;
        drawLine(a1);
        drawLine(a2);


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

        Plotly.restyle("graphVibE", {data: [{x: arrTime, y: arrVibKE}], traces: [0]},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphRotE", {data: [{x: arrTime, y: arrRotKE}], traces: [0]},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphPotE", {data: [{x: arrTime, y: arrPE}], traces: [0]},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}});
    }
}
function drawLine(atom){
    var lineG = phaserInstance.add.graphics(0,0);
    //  lineG.moveTo(atom.pos[0].items[0]*zoom + phaserInstance.world.centerX,
    //                atom.pos[0].items[1]*zoom + phaserInstance.world.centerY);
    lineG.lineStyle(2,IMPERIAL_BLUE,0);
    for(var i = 0; i < atom.pos.length; i+= 5){
        if(i > 0) lineG.lineStyle(2, IMPERIAL_BLUE, 1);
        lineG.lineTo(atom.pos[i].items[0]*zoom + phaserInstance.world.centerX,
                    atom.pos[i].items[1]*zoom + phaserInstance.world.centerY);
    }
    if(typeof atom.lineSprite !== 'undefined') atom.lineSprite.destroy();
    atom.lineSprite = traceLayer.create(0,0,lineG.generateTexture());
    lineG.destroy();

}



