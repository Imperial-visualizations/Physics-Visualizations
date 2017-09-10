var divPhaser = "#phaser";
var width = $(divPhaser).width() * window.devicePixelRatio;
var height = $(divPhaser).width() * 0.7 * window.devicePixelRatio;

var phaserInstance = new Phaser.Game(width,height,Phaser.CANVAS, "phaser",
    {preload: preload,create: create,update: update});

var a1, a2, mol1, potential;                                        // Atoms, molecules and potential to be instantiated
var zoom  = 60;
var initKVib, initKRot;                                             // Initial KEs.
var init_s1 = 2, init_s2 = 2, init_e1 = 10, init_e2 = 10;           // Initial LJ parameters.

// Colours
var IMPERIAL_BLUE = 0x003E74;
var CHERRY = 0xE40043;
var GRAPH_TIME = 5;                                               // x-axis range for Energy against Time plots.

var running = false;                                                // Animation status.
var dT = 1/65;                                                      // Timestep.

// Global Variables to store data for graph-drawing.
var arrRotKE = [];
var arrRotKESlider;
var arrTime = [];
var arrPE = [];
var arrVibKE = [];
var arrVibKESlider;
var scatterLJ, scatterEP, totEPlot;                             // LJ, Effective Potential, Total Energy plots.
var KE_V_T, KE_V_slider, KE_R_T, KE_R_slider, PE_T;             // Slider levels plots.
var currLJ, EP_to_LJ, currEP;                                   // Current LJ & EP and EP - LJ connector plots
var LJ_layout;                                                  // Layout of potential plots.
var layoutE;                                                    // Layout of energy vs time plots.
var titleFontsize = 12, labelFontsize = 10;                     // Text sizes.
var marT = 30, marB = 23, marR = 5, marL = 35;                  // Plotly plot margins.
var options = {
    scrollZoom: false, // lets us scroll to zoom in and out - works
    showLink: false, // removes the link to edit on plotly - works
    modeBarButtonsToRemove: ['sendDataToCloud','zoom2d','pan2d','select2d','lasso2d','zoomIn2d','zoomOut2d',
        'autoScale2d','resetScale2d','hoverClosestCartesian','hoverCompareCartesian'],
    //modeBarButtonsToAdd: ['lasso2d'],
    displayLogo: true, // this one also seems to not work
    displayModeBar: true //this one does work
};

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
    $(this).on('input', updateLabels);
});

/**
 * When button pressed, LJ parameters updated and animation reset.
 */
/**
 * Hides divs to make parts of the page invisible. "Spoiler".
 */
$(".showHideButton").on("click", spoiler);

function spoiler() {
    var text = ($($(this).attr("for")).hasClass("expanded")) ? "Show" : "Hide";
    log(this);
    $(this).html(text+$(this).attr("data-graph-name"));
    $($(this).attr("for")).slideToggle(250);
    $($(this).attr("for")).toggleClass("expanded");
}

/**
 * Hide the graph after the page is loaded, and the element sizes have been allocated according to the css
 */
$(document).ready(flashGraphs, 900);

function flashGraphs(){
    setTimeout(function() {
        $(".graphs").each(function(){
            if (!$(this).hasClass("expanded")) {
                $(this).slideDown(500);
                $(this).addClass("expanded")
            }

            $(this).slideUp(500);
            $(this).removeClass("expanded");
        });
    });
}

/**
 * Finds element in body with data-change attribute, and changes text to support input. Reverts to text when clicked
 * off the input field.
 */
$('body').on('click', '[data-change]', function() {
    // Storing current element and its attributes.
    var $element = $(this);
    var $title = $(this).attr("title");
    var $el_id = $(this).attr("id");
    var $unit = $(this).attr("data-unit");

    // Creating input form.
    var $input = $('<input style="width:50%;"/>').val(parseFloat($element.text()));
    $input.attr("id", $el_id);                                  // Setting ID attribute (same as text).
    $input.attr("title", $title);                               // Setting title attribute (same as text).
    $element.replaceWith($input);                               // Replacing text with input form.

    var save = function save() {
        var $a = $('<a data-change />').text($input.val() + $unit);

        // Restoring text with same attributes as original.
        $a.attr("title", $title);
        $a.attr("id", $el_id);
        $a.attr("data-unit", $unit);
        $input.replaceWith($a);

        // LJ Params
        init_s1 = parseFloat($('#s1').text());
        init_e1 = parseFloat($('#e1').text());
        init_s2 = parseFloat($('#s2').text());
        init_e2 = parseFloat($('#e2').text());
        log(this);

        // Timestep
        dT = parseFloat($('#dT').text());
        reset();
        if ($a.text().indexOf("Display") === -1) {
            var $divSlider = $a.attr("id").replace("Display", "");
            $('#' + $divSlider).attr("value", parseFloat($a.text()));
        }
    };

    // When clicking away from element (blurring), revert from input form to text.
    $input.one('blur', save).focus();
});

/**
 * Start/Pause button code.
 */
$('#playPauseButton').on('click',function() {
    log(this);
    var text = running ? "Start" : "Pause";
    $("#playPauseButton").text(text);
    running = !running;
});

/**
 * Runs reset function when reset button pressed.
 */
$('#resetButton').on('click', function() {
    a1.pos = []; a2.pos = [];
    running = false;
    log(this);
    $('#playPauseButton').text("Start");
    reset();
});

/**
 * Changes writing on label to reflect value of slider.
 */
function updateLabels() {

    $('.inputs').each(function(){
        var display_id = "#" + $(this).attr("id") + "Display";
        $(display_id).text($(this).val() + $(display_id).attr("data-unit"));
    });

    // Updating KE values and resetting.
    initKVib = parseFloat($('#vibKEDisplay').text());
    initKRot = parseFloat($('#rotKEDisplay').text());
    try {log(this); reset();}
    catch (e) {reset();}
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

    zoom = zoom * window.devicePixelRatio;

    a1 = new Atom(1, CHERRY);
    a2 = new Atom(1, CHERRY);
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


/** ========================== Functions to draw static plots for Energy against time ============================== **/
/**
 * Plots Energy against time plots.
 */
function plotE() {
    layoutE = {
        yaxis: {title: "Energy / eV", titlefont: {size: labelFontsize},
            range: [-1.1 * mol1.V.e, Math.max(initKVib, initKRot) / 0.55], nticks: 20},
        titlefont: {size: titleFontsize}, margin: {l: marL, r: marR, b: marB + 5, t: marT},
        xaxis: {title: "t / s", titlefont: {size: 10}, range: [0, GRAPH_TIME], nticks: 20},
        title: "KE and PE against Time",
        legend: {x: 0.67, y: 1, orientation: "h"},
        showlegend: true
    };

    KE_V_T = {x: arrTime, y: arrVibKE, mode: "lines", line: {width: 2, color: "#FFDD00"}, name: "KE" + "vib".sub()};
    KE_V_slider = {x: [- 1, GRAPH_TIME + 2], y: arrVibKESlider,
        line: {width: 1, color: "#ac8e00", dash: "2px, 2px"}, name: "KE" + "vib, slider".sub(), showlegend: false};
    KE_R_T = {x: arrTime, y: arrRotKE, mode: "lines", line: {width: 2, color: "#66A40A"}, name: "KE" + "rot".sub()};
    KE_R_slider = {x: [- 1, GRAPH_TIME + 2], y: arrRotKESlider,
        line: {width: 1, color: "#49830a", dash: "2px, 2px"}, name: "KE" + "rot, slider".sub(), showlegend: false};
    PE_T = {x: arrTime, y: arrPE, mode: "lines", line: {width: 2, color: "#003E74"}, name: "U" + "LJ".sub()};

    Plotly.newPlot("graphE", [KE_V_T, KE_V_slider, KE_R_T, KE_R_slider, PE_T], layoutE, options);
}

/**
 * Plots Lennard-Jones function and a marker to show current V against current separation using Plotly.
 */
function plotLJ() {
    LJ_layout = {title: "Lennard-Jones Potential", titlefont: {size: 12},
                margin: {l: marL, r: marR, b: marB + 10, t: marT}, legend: {x: 0.46, y: 1, "orientation": "h"},
                showlegend: true,
                yaxis: {range: [-1.1 * potential.e, 0.7 * potential.e],
                    nticks: 20, title: "U / eV", titlefont: {size: 10}},
                xaxis: {range: [0.9 * potential.s, 3 * potential.s],
                    nticks: 20, title: "r" + "AB".sub() + " / nm", titlefont: {size: 10}}};

    // Remove all points outside visible range on graph.
    while (scatterLJ.y[0] > LJ_layout.yaxis.range[1]) {
        scatterLJ.x.shift();
        scatterLJ.y.shift();
        scatterEP.x.shift();
        scatterEP.y.shift();
    }

    LJ_layout.yaxis.range[1] = scatterEP.y[0];     // Re-optimising y-axis scaling.

    // Drawing red marker that shows current LJ potential against current separation.

    totEPlot = {x: [LJ_layout.xaxis.range[0] - 1, LJ_layout.xaxis.range[1] + 1], y: [mol1.tot_E, mol1.tot_E],
        name: "E" + "tot".sub(), mode: "lines", line: {dash: "1px, 2px", width: 2}};
    EP_to_LJ = {x:[mol1.separation,mol1.separation], y:[mol1.PE, Math.max(0, mol1.effPE)], mode:"lines",
        line:{dash:"1px, 2px", width:2}, showlegend: false};
    currLJ = {x: [mol1.separation], y: [mol1.PE], name: "U" + "LJ, curr".sub(), mode: "markers",
        marker: {size: 10, color: CHERRY, symbol: "x"}, showlegend: false};
    currEP = {x: [mol1.separation], y: [mol1.effPE], name: "EP", mode: "markers",
        marker: {size: 10, color: "#ff9030", symbol: "x"}, showlegend: false};

    var data = [scatterLJ, scatterEP, currLJ, currEP, totEPlot, EP_to_LJ];
    Plotly.newPlot("ScatterLJ", data, LJ_layout, options);
}

/**
 * Function to draw a 'spring' between two Atom instances to signify a bond.
 * @param starting {number}: Position where spring starts.
 * @param end {number}: Position where spring ends.
 */
function drawBond(starting, end) {
    if (-mol1.PE / mol1.V.e < 0.01) {
        if(typeof mol1.bondSprite !== 'undefined') {
            mol1.bondSprite.destroy();
        }
        return;
    }

    var widthOfSpring = end.subtract(starting).mag() * zoom;        // The distance between atoms.
    var heightOfSpring = 0.33 * zoom;
    var arrowG = phaserInstance.add.graphics(0,0);

    var wiggles = 2 * Math.ceil(mol1.V.s);
    arrowG.lineStyle(4 * (-mol1.effPE / mol1.V.e), IMPERIAL_BLUE, (-mol1.PE / mol1.V.e));
    arrowG.lineTo(widthOfSpring / (wiggles * 4), 0);
    for (var i = 2; i < wiggles * 4 - 1; i += 2) {
        arrowG.lineTo(i * widthOfSpring / (wiggles * 4), ((i % 4) - 1) * heightOfSpring / 2);
    }
    arrowG.lineTo(((wiggles * 4) - 1) * widthOfSpring / (wiggles * 4), 0);
    arrowG.lineTo(widthOfSpring, 0);

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

    for (var i = 0; i < atom.pos.length; i += 2) {

        // Trail gets thinner and more transparent for older positions.
        if(i > 0) lineG.lineStyle(4 * i / atom.pos.length, IMPERIAL_BLUE, i / atom.pos.length);

        lineG.lineTo(atom.pos[i].items[0] * zoom + phaserInstance.world.centerX,
            atom.pos[i].items[1] * zoom + phaserInstance.world.centerY);
    }

    if (atom.lineSprite !== null) atom.lineSprite.destroy();
    atom.lineSprite = traceLayer.create(0, 0, lineG.generateTexture());
    lineG.destroy();
}

/** ================================================ Time to Run =================================================== **/
/**
 * Re-instantiates all LJ and Molecule parameters, and wipes the graphs clean.
 */
function reset(){

    if (typeof mol1 !== 'undefined') {
        // Updating LJ Params.
        potential.calcSigma(init_s1, init_s2);
        potential.calcEpsilon(init_e1, init_e2);
    }

    else {
        // Creating new LJ potential
        potential = new LJ(init_s1, init_e1, init_s2, init_e2);
    }

    if(typeof mol1 !== 'undefined'){
        if(typeof mol1.bondSprite !== 'undefined'){
            mol1.bondSprite.destroy();

        }
    }

    // Destroying trail.
    if(typeof a1 !== 'undefined'){
        if(a1.lineSprite !== null){
            a1.lineSprite.destroy();
            a2.lineSprite.destroy();
        }
    }

    // Creating new molecule with atoms and instantiated potential. KEs entered by users using sliders.
    // If not running, reset position too.
    if (!running) mol1 = new Molecule(a1, a2, potential, initKVib, initKRot);

    // If running, maintain previous position.
    else mol1 = mol1.softReset(initKVib, initKRot);

    // Creating x and y coordinates to plot.
    scatterLJ  = potential.plotLJ(35);
    scatterEP = potential.plotLJCorr(35, mol1.L, mol1.reducedM);

    a1.sprite.x = a1.getPos().items[0] * zoom + phaserInstance.world.centerX;
    a1.sprite.y = a1.getPos().items[1] * zoom + phaserInstance.world.centerY;
    a2.sprite.x = a2.getPos().items[0] * zoom + phaserInstance.world.centerX;
    a2.sprite.y = a2.getPos().items[1] * zoom + phaserInstance.world.centerY;

    drawBond(a1.getPos(), a2.getPos());

    if (!running) {
        arrTime = [0];
        arrRotKE = [initKRot];
        arrVibKE = [initKVib];
        arrPE = [-mol1.V.e];

    }
    arrVibKESlider = [initKVib, initKVib];
    arrRotKESlider = [initKRot, initKRot];
    plotLJ();
    plotE();
}

/**
 * This function is called once per frame.
 */
function update(){
    if(running) {
        mol1.update(dT);//requests molecule update, sends deltaTime to mol1.
        a1.sprite.x = a1.getPos().items[0] * zoom + phaserInstance.world.centerX;
        a1.sprite.y = a1.getPos().items[1] * zoom + phaserInstance.world.centerY;
        a2.sprite.x = a2.getPos().items[0] * zoom + phaserInstance.world.centerX;
        a2.sprite.y = a2.getPos().items[1] * zoom + phaserInstance.world.centerY;
        drawTrail(a1);
        drawTrail(a2);
        drawBond(a1.getPos(), a2.getPos());

        // Update time array with current time.
        arrTime.push(arrTime[arrTime.length - 1] + dT);

        // Calculate energies and update the respective arrays.
        arrRotKE.push(mol1.KE_R);
        arrPE.push(mol1.PE);
        arrVibKE.push(mol1.KE_V);

        // Delete older data to keep graphs neater and to limit memory usage.
        if (arrRotKE.length > Math.ceil(GRAPH_TIME / dT)) {
            arrRotKE.shift();
            arrTime.shift();
            arrVibKE.shift();
            arrPE.shift();
        }

        // Animating all graphs if shown.
        if ($("#graphE").hasClass("expanded")) {

            // Updating x-axis of Energies vs Time plot to show appropriate data.
            layoutE.xaxis.range[0] = arrTime[0];
            layoutE.xaxis.range[1] = Math.max(arrTime[arrTime.length - 1] + 0.5, GRAPH_TIME);

            //
            if (arrTime[arrTime.length - 1] > GRAPH_TIME - 1) layoutE.showlegend = false;

            // Moving along the slider level line, innit
            KE_R_slider.x[0] = KE_V_slider.x[0] = layoutE.xaxis.range[0] - 1;
            KE_R_slider.x[1] = KE_V_slider.x[1] = layoutE.xaxis.range[1] + 1;

            // Plotting dat energie.
            Plotly.animate("graphE", {data: [KE_V_T, KE_V_slider, KE_R_T, KE_R_slider, PE_T],
                        traces: [0, 1, 2, 3, 4]},
                        {frame: {redraw: false, duration: dT}, transition: {duration: dT}});
        }

        if ($('#ScatterLJ').hasClass("expanded")) {

            // Updating current LJ r and V(r) and LJ_corr(r).
            currLJ.x = [mol1.separation]; currLJ.y = [mol1.PE];
            currEP.x = [mol1.separation]; currEP.y = [mol1.effPE];

            EP_to_LJ.x = [mol1.separation, mol1.separation];
            EP_to_LJ.y = [mol1.PE, Math.max(0, mol1.effPE)];

            // Plotting the LJ and stuff.
            Plotly.animate("ScatterLJ",
                {data: [scatterLJ, scatterEP, currLJ, currEP, totEPlot, EP_to_LJ],
                    traces: [0, 1, 2, 3, 4, 5]},
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});
        }
    }
}
