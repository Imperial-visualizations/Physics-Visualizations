var divPhaser = "#phaser";
var width = $(divPhaser).width() * window.devicePixelRatio;
var height = $(divPhaser).width() * 0.7 * window.devicePixelRatio;

var phaserInstance = new Phaser.Game(width,height,Phaser.CANVAS, "phaser",
    {preload: preload,create: create,update: update});

var a1,a2,mol1,potential;                                           // Atoms, molecules and potential to be instantiated
var zoom  = 30;
var initKVib, initKRot;                                             // Initial KEs.
var init_s1 = 2, init_s2 = 2, init_e1 = 10, init_e2 = 10;           // Initial LJ parameters.

// Colours
const IMPERIAL_BLUE = 0x003E74;
const CHERRY = 0xE40043;

const GRAPH_TIME = 5;                                               // x-axis range for Energy against Time plots.

var running = false;                                                // Animation status.

var mainLayer,traceLayer;

/**
 * This function is the first function called when phaser starts and should only be used for initialising textures to be
 * used or sprites. All other code that should be called before the first update call should be placed in create. Not
 * all phaser features have loaded at this point so should not be used for any phaser code other than loading textures.
 */
function preload() {}

/**
 * On slider change, runs functions to update labels of sliders.
 */
$('.inputs').each(function() {

    $(this).on('input',updateLabels);
});

/**
 * When button pressed, LJ parameters updated and animation reset.
 */
$('#submitLJ').on('click', function() {
    init_s1 = parseFloat($('#s1').text());
    init_e1 = parseFloat($('#e1').text());
    init_s2 = parseFloat($('#s2').text());
    init_e2 = parseFloat($('#e2').text());
    reset();
});

/**
 * Hides divs to make parts of the page invisible. "Spoiler".
 */
$(".showHideButton").on("click",function(){
    var text = ($(this).text() === "Show") ? "Hide" : "Show";
    $(this).text(text);
    $($(this).attr("for")).slideToggle("fast");
});

/**
 * Finds element in body with data-change attribute, and changes text to support input. Reverts to text when clicked
 * off the input field.
 */
$('body').on('click', '[data-change]', function() {

    // Storing current element and its attributes.
    var $element = $(this);
    var $title = $(this).attr("title");
    var $el_id = $(this).attr("id");

    // Creating input form.
    var $input = $('<input style="width: 50%;"/>').val($element.text());
    $input.attr("id", $el_id);                                  // Setting ID attribute (same as text).
    $input.attr("title", $title);                               // Setting title attribute (same as text).
    $element.replaceWith($input);                               // Replacing text with input form.

    var save = function save() {
        var $a = $('<a data-change />').text($input.val());

        // Restoring text with same attributes as original.
        $a.attr("title", $title);
        $a.attr("id", $el_id);
        $input.replaceWith($a);
    };

    // When clicking away from element (blurring), revert from input form to text.
    $input.one('blur', save).focus();
});

/**
 * Start/Pause button code.
 */
$('#playPauseButton').on('click',function() {
    var text = running ? "Start" : "Pause";
    $("#playPauseButton").text(text);
    running = !running;
});

/**
 * Runs reset function when reset button pressed.
 */
$('#resetButton').on('click', function() {
    reset();
});

/**
 * Changes writing on label to reflect value of slider.
 */
function updateLabels() {

    // Updating labels.
    $('.inputs').each(function(){
        var display_id = "#" + $(this).attr("id") + "Display";
        $(display_id).text($(this).val() + $(display_id).attr("data-unit"));

    });

    // Updating KE values and resetting.
    initKVib = parseFloat($('#vibKE').val());
    initKRot = parseFloat($('#rotKE').val());
    reset();
}

/**
 * Function called after preload and before the first update call. Should be used for initialising objects and variables
 * that will be used in the simulation as well as for creating sprites. phaserInstance has fully loaded at this point
 * so all phaser features can be used.
 */
function create() {
    traceLayer = phaserInstance.add.group();
    mainLayer = phaserInstance.add.group();


    phaserInstance.canvasWidth = $(divPhaser).width() * window.devicePixelRatio;
    phaserInstance.canvasHeight = $(divPhaser).width() * window.devicePixelRatio;
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
    var atomG = phaserInstance.add.graphics(0, 0);
    atomG.beginFill(atom.color, 1);
    atomG.drawCircle(0, 0, atom.radius * zoom);

    var sprite = mainLayer.create(0,0,atomG.generateTexture());
    sprite.anchor.set(0.5, 0.5);
    atomG.destroy();
    return sprite;
}

// Global Variables to store data for graph-drawing.
var arrRotKE = [];
var arrTime = [];
var arrPE = [];
var arrVibKE = [];
var LJ_scatter;
var curr_LJ;
var LJ_layout;
var titleFontsize = 12, labelFontsize = 10;                     // Text sizes.
var marT = 30, marB = 23, marR = 5, marL = 23;                  // Margins.

/** ========================== Functions to draw static plots for Energy against time ============================== **/
/**
 * Plots Rotational KE against Time
 */
function plotRotKE() {
    var layoutRot = {yaxis: {title: "Energy / eV", titlefont: {size: labelFontsize}},
        titlefont: {size: titleFontsize}, margin: {l: marL, r: marR, b: marB, t: marT},
        xaxis: {title: "t / s", titlefont: {size: 10}}, title: "KE" + "rot".sub() + " against Time"};

    Plotly.newPlot("graphRotE", {data: [{x: arrTime, y: arrRotKE, mode: "lines", line: {width: 2, color: "#66A40A"}}],
            traces: [0, 1], layout: layoutRot},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

/**
 * Plots Potential Energy against Time.
 */
function plotPE() {
    var layoutPE = {yaxis: {title: "Energy / eV", titlefont: {size: labelFontsize}},
        titlefont: {size: titleFontsize}, margin: {l: marL, r: marR, b: marB, t: marT},
        xaxis: {title: "t / s", titlefont: {size: 10}}, title: "PE against Time"};

    Plotly.newPlot("graphPotE", {data: [{x: arrTime, y: arrPE, mode: "lines",
            line: {width: 2, color: "#003E74"}}],
            traces: [0], layout: layoutPE},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

/**
 * Plots Vibrational KE against time.
 */
function plotVibKE() {
    var layoutVib = {yaxis: {title: "Energy / eV", titlefont: {size: labelFontsize}},
        titlefont: {size: titleFontsize}, margin: {l: marL, r: marR, b: marB, t: marT},
        xaxis: {title: "t / s", titlefont: {size: 10}}, title: "KE" + "vib".sub() + " against Time"};

    Plotly.newPlot("graphVibE", {data: [{x: arrTime, y: arrVibKE, mode: "lines", line: {width: 2, color: "#FFDD00"}}],
            traces: [0], layout: layoutVib},
            {frame: {redraw: false, duration: 0}, transition: {duration: 0}})
}

/**
 * Plots Lennard-Jones function and a marker to show current V against current separation using Plotly.
 */
function plotLJ() {
    LJ_layout = {title: "Lennard-Jones Potential", titlefont: {size: 12}, margin: {l: marL + 5, r: marR, b: marB, t: marT},
                legend: {x: 0.67, y: 1, "orientation": "v"},
                yaxis: {range: [-1.1 * potential.e, 0.7 * potential.e], title: "LJ Potential / eV", titlefont: {size: 10}},
                xaxis: {range: [0, 3 * potential.s], title: "r" + "AB".sub() + " / nm", titlefont: {size: 10}}};

    // Remove all points outside visible range on graph.
    while (LJ_scatter.y[0] > LJ_layout.yaxis.range[1]) {
        LJ_scatter.x.shift();
        LJ_scatter.y.shift();
    }
    LJ_layout.yaxis.range[1] = LJ_scatter.y[0];     // Re-optimising y-axis scaling.

    // Drawing red marker that shows current LJ potential against current separation.
    var curr_sep = mol1.r.mag(); var curr_V = potential.calcV(curr_sep);
    curr_LJ = {x: [curr_sep], y: [curr_V], name: "Current LJ", mode: "markers",
        marker: {size: 10, color: CHERRY, symbol: "circle-open"}};

    Plotly.newPlot("LJ_scatter", {data: [LJ_scatter, curr_LJ], traces: [0, 1], layout: LJ_layout},
        {frame: {redraw: false, duration: 0}, transition: {duration: 0}});
}

/**
 * Function to draw a 'spring' between two Atom instances to signify a bond.
 * @param starting {Vector}: Position where spring starts.
 * @param end {Vector}: Position where spring ends.
 */
function drawBond(starting,end){
    var widthOfSpring = end.subtract(starting).mag()*zoom;          // The distance between atoms.

    var heightOfSpring = 0.3 * zoom;
    var arrowG = phaserInstance.add.graphics(0, 0);
    var wiggles = Math.ceil(potential.s * 3);

    arrowG.lineStyle(2, IMPERIAL_BLUE, -arrPE[arrPE.length - 1] / potential.e);
    arrowG.lineTo(widthOfSpring / (wiggles * 4), 0);

    for (var i = 2; i < (wiggles * 4) - 1; i += 2) {
        arrowG.lineTo(i * widthOfSpring / (wiggles * 4), ((i % 4) - 1) * heightOfSpring / 2);
    }
    arrowG.lineTo(((wiggles * 4) - 1) * widthOfSpring / (wiggles * 4), 0);
    arrowG.lineTo((wiggles * 4) * widthOfSpring / (wiggles * 4), 0);

    if(typeof mol1.bondSprite !== 'undefined') mol1.bondSprite.destroy();

    mol1.bondSprite = traceLayer.create(phaserInstance.world.centerX,
        phaserInstance.world.centerY, arrowG.generateTexture());

    mol1.bondSprite.anchor.set(0.5, 0.5);
    mol1.bondSprite.angle = Phaser.Math.RAD_TO_DEG * Math.atan2(end.subtract(starting).items[1],
        end.subtract(starting).items[0]);
    arrowG.destroy();
}

/**
 * Function to draw trails behind Atom instances to show past positions.
 * @param atom: Instance of Atom to draw trail behind.
 */
function drawTrail(atom){
    var lineG = phaserInstance.add.graphics();
    lineG.lineStyle(4, IMPERIAL_BLUE, 0);

    for (var i = 0; i < atom.pos.length; i+= 5) {

        // Trail gets thinner and more transparent for older positions.
        if(i > 0) lineG.lineStyle(4 * i / atom.pos.length, IMPERIAL_BLUE, i / atom.pos.length);

        lineG.lineTo(atom.pos[i].items[0] * zoom + phaserInstance.world.centerX,
            atom.pos[i].items[1] * zoom + phaserInstance.world.centerY);
    }

    if (typeof atom.lineSprite !== 'undefined') atom.lineSprite.destroy();
    atom.lineSprite = traceLayer.create(0, 0, lineG.generateTexture());
    lineG.destroy();
}

/** ================================================ Time to Run =================================================== **/
/**
 * Re-instantiates all LJ and Molecule parameters, and wipes the graphs clean.
 */
function reset(){

    // Creating new LJ potential
    potential = new LJ(init_s1, init_e1, init_s2, init_e2);

    if(typeof mol1 !== 'undefined'){
        if(typeof mol1.bondSprite !== 'undefined'){
            mol1.bondSprite.destroy();
        }
    }
    // Creating new molecule with atoms and instantiated potential. KEs entered by users using sliders.
    mol1 = new Molecule(a1, a2, potential, initKVib, initKRot);
    // Creating x and y coordinates to plot.
    LJ_scatter  = potential.plotPoints(100);

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
 */
function update(){
    if(running) {
        var dT = 1/60;
        mol1.update(dT);//requests molecule update, sends deltaTime to mol1.
        a1.sprite.x = a1.getPos().items[0] * zoom + phaserInstance.world.centerX;
        a1.sprite.y = a1.getPos().items[1] * zoom + phaserInstance.world.centerY;
        a2.sprite.x = a2.getPos().items[0] * zoom + phaserInstance.world.centerX;
        a2.sprite.y = a2.getPos().items[1] * zoom + phaserInstance.world.centerY;
        drawTrail(a1);
        drawTrail(a2);
        drawBond(a1.getPos(), a2.getPos());

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

        // Animating all graphs.
        Plotly.restyle("graphVibE", {data: [{x: arrTime, y: arrVibKE}],
                traces: [0]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphRotE", {data: [{x: arrTime, y: arrRotKE}],
                traces: [0]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("graphPotE", {data: [{x: arrTime, y: arrPE}],
                traces: [0]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});

        Plotly.restyle("LJ_scatter", {data: [LJ_scatter, curr_LJ],
                traces: [0, 1]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});
    }
}
