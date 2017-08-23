var width = 800;
var height = 480;
var phaser_id = "#phaser";
width = $(phaser_id).width() * window.devicePixelRatio;
height = $(phaser_id).width() * window.devicePixelRatio;

var phaserInstance = new Phaser.Game(width,height,Phaser.CANVAS,
    "phaser",{preload: preload,create: create,update: update});

var a1,a2,mol1,potential;
var zoom  = 45;
var initKVib,initKRot;
var init_s1 = 2, init_s2 = 2, init_e1 = 10, init_e2 = 10;
var WHITE = 0xffffff;
const GREEN = 0x66A40A;
const IMPERIAL_BLUE = 0x003E74;
const CHERRY = 0xE40043;
const GRAPH_TIME = 5;
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

$('#submitLJ').on('click', function() {
    init_s1 = parseFloat($('#s1').text());
    init_e1 = parseFloat($('#e1').text());
    init_s2 = parseFloat($('#s2').text());
    init_e2 = parseFloat($('#e2').text());
    reset();
});

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

/**
 * Function called after preload and before the first update call. Should be used for initialising objects and variables
 * that will be used in the simulation as well as for creating sprites. phaserInstance has fully loaded at this point
 * so all phaser features can be used.
 */
function create(){
    traceLayer = phaserInstance.add.group();
    mainLayer = phaserInstance.add.group();


    phaserInstance.canvasWidth = $(phaser_id).width() * window.devicePixelRatio;
    phaserInstance.canvasHeight = $(phaser_id).width() * window.devicePixelRatio;
    phaserInstance.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    phaserInstance.scale.setUserScale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
    phaserInstance.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    phaserInstance.stage.backgroundColor = 0xEBEEEE;

    a1 = new Atom(1, 1, CHERRY);
    a2 = new Atom(1, 1, CHERRY);
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
var LJ_scatter;
var curr_LJ;
var LJ_layout;
var EPlotsLayout = {yaxis: {title: "Energy / eV"}, xaxis: {title: "t / s"}, autosize: true};

function plotRotKE() {
    var layout = EPlotsLayout;
    layout.title = "KE" + "rot".sub() + " against Time";
    Plotly.newPlot("graphRotE", {data: [{x: arrTime, y: arrRotKE, mode: "lines", line: {width: 2, color: "#66A40A"}}],
            traces: [0], layout: layout},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

function plotPE() {
    var layout = EPlotsLayout;
    layout.title = "PE against Time";

    Plotly.newPlot("graphPotE", {data: [{x: arrTime, y: arrPE, mode: "lines", line: {width: 2, color: "#003E74"}}],
            traces: [0], layout: layout},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

function plotVibKE() {
    var layout = EPlotsLayout;
    layout.title = "KE" + "vib".sub() + " against Time";
    Plotly.newPlot("graphVibE", {data: [{x: arrTime, y: arrVibKE, mode: "lines", line: {width: 2, color: "#FFDD00"}}],
            traces: [0], layout: layout},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

function plotLJ() {
    LJ_layout = {title: "Lennard-Jones Potential",
                yaxis: {range: [-1.1 * potential.e, potential.e], title: "LJ Potential / eV"},
                xaxis: {range: [0, 3 * potential.s], title: "r" + "AB".sub() + " / nm"}};

    // Remove all points outside visible range on graph.
    while (LJ_scatter.y[0] > LJ_layout.yaxis.range[1]) {
        LJ_scatter.x.shift();
        LJ_scatter.y.shift();
    }
    LJ_layout.yaxis.range[1] = LJ_scatter.y[0];     // Re-optimising y-axis scaling.

    var curr_sep = mol1.r.mag(); var curr_V = potential.calcV(curr_sep);
    curr_LJ = {x: [curr_sep], y: [curr_V], name: "Current LJ", mode: "markers",
        marker: {size: 10, color: CHERRY, symbol: "circle-open"}};

    Plotly.newPlot("LJ_scatter", {data: [LJ_scatter, curr_LJ], traces: [0, 1], layout: LJ_layout},
        {frame: {redraw: false, duration: 0}, transition: {duration: 0}});
}

plotRotKE();
plotPE();
plotVibKE();

function reset(){

    // Creating new LJ potential
    potential = new LJ(init_s1, init_e1, init_s2, init_e2);

    // Creating x and y coordinates to plot.
    LJ_scatter  = potential.plotPoints(100);

    // Creating new molecule with atoms and instantiated potential. KEs entered by users using sliders.
    mol1 = new Molecule(a1, a2, potential, initKVib, initKRot);

    a1.sprite.x = a1.getPos().items[0] * zoom + phaserInstance.world.centerX;
    a1.sprite.y = a1.getPos().items[1] * zoom + phaserInstance.world.centerY;
    a2.sprite.x = a2.getPos().items[0] * zoom + phaserInstance.world.centerX;
    a2.sprite.y = a2.getPos().items[1] * zoom + phaserInstance.world.centerY;

    arrRotKE = [];
    arrTime = [];
    arrPE = [];
    arrVibKE = [];
    plotLJ();
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
        var dT = 1/60;
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
        var curr_sep = mol1.r.mag();                    // Current separation
        var curr_V = mol1.V.calcV(curr_sep);            // Current potential
        arrPE.push(curr_V);

        // Calculate Vibrational KE and update array.
        var vibKE = mol1.TME - rotKE - curr_V;
        arrVibKE.push(vibKE);

        // Updating current LJ r and V(r).
        curr_LJ.x = [curr_sep]; curr_LJ.y = [curr_V];

        // Update time array.
        var t;
        if (arrTime.length > 0) t = arrTime[arrTime.length - 1] + dT;
        else t = dT;
        arrTime.push(t);

        // Delete older data to keep graphs neater and to limit memory usage.
        if (arrRotKE.length > Math.ceil(GRAPH_TIME / dT)) {
            arrRotKE.shift();
            arrTime.shift();
            arrVibKE.shift();
            arrPE.shift();
        }

        Plotly.restyle("graphVibE", {data: [{x: arrTime, y: arrVibKE}],
                traces: [0]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphRotE", {data: [{x: arrTime, y: arrRotKE}], traces: [0]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphPotE", {data: [{x: arrTime, y: arrPE}], traces: [0]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("LJ_scatter", {data: [LJ_scatter, curr_LJ], traces: [0, 1]},
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



