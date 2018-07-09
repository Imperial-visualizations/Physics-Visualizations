//--------------------------------------------VARIABLES--------------------------------------------

// Defining variables (need to update later anyway so importing from e.g. json is meaningless)
// Wave characteristics:
var comparisonText;

var terms_i = [];  //for fourier
var terms_d = [];  //for fourier
var nb_waves = parseInt($("#slider_waves").val());
var nb_terms = parseInt($("#slider_waves").val()); //for fourier
var v = parseFloat($("#velocityPhase").val());
var k0 = 1; //define k0
$('#k0').text(k0);
var kend = 1.2; //define
$('#kend').text(kend);
var k_array = [];
var omega_nondisp = [];
var omega_disp = [];
$('#dispersionRelation').text('v*k');
var nb  = nb_waves;
// var tab =  $('.tab-pane.active').attr('id');

// x and t coordinates
var n = 400;
var y_i = [], y_d = [];
var x = numeric.linspace(0, 60, n);
var t = 0.0;
var dt = 0.1;
var is_paused = true;
var y_range = 1;
var omega_input = false;
var funct= "v*k";
var focus = 1;

// Colours

const POOL_BLUE = '#00ACD7';
const CHERRY ='#E40043';
const NAVY = '#002147';

//--------------------------------------------INTERACTS--------------------------------------------

$('#playPauseButton').on('click',function() {
    log(this);
    onStart();
});

$('#resetButton').on('click', function() {
    log(this);
    onReset();
});

$(".showHideButton").on("click", spoiler);

function spoiler() {
    log(this);
    var text = ($($(this).attr("for")).hasClass("expanded")) ? "Show" : "Hide";
    $(this).html(text+$(this).attr("data-graph-name"));
    $($(this).attr("for")).slideToggle(250);
    $($(this).attr("for")).toggleClass("expanded");
    if  (text === "Show") {
        $("#waveOnFocus").hide();
    }
    else {
        $("#waveOnFocus").show();
    }
}

$(document).ready(flashGraphs, 900);

function flashGraphs(){
    setTimeout(function() {
        $(".graphs").each(function(){
            if (!$(this).hasClass("expanded")) {
                $(this).slideDown(500);
                $(this).addClass("expanded");
                $("#waveOnFocus").show();
            }

            $(this).slideUp(500);
            $(this).removeClass("expanded");
            $("#waveOnFocus").hide();
        });
    });
}


$('input[type=radio][name=type]').change(function() {

    if (this.value === 'sine') {
        $('#nb_title').text('Number of sine waves:');
        $('#slider_waves').val(nb_waves);
        $("#waves_display").text(" " + nb_waves);
        layout.xaxis.range = [0, 60];
        layout.xaxis2.range = [0, 60];
        $('#wave_number').show();
        $('#slider_focus').attr('max', nb_waves);
        $('#focusMax').text(nb_waves);
        focus = nb_waves;
        $('#focus_display').text(" " + focus);
    }
    else if (this.value === 'fourier') {
        $('#nb_title').text('Number of fourier terms:');
        $('#slider_waves').val(nb_terms);
        $("#waves_display").text(" " + nb_terms);
        layout.xaxis.range = [0, 20];
        layout.xaxis2.range = [0, 20];
        $('#wave_number').hide();
        $('#slider_focus').attr('max', nb_terms);
        $('#focusMax').text(nb_terms);
        focus = nb_terms;
        $('#focus_display').text(" " + focus);

        }
        update_y_range();
        if (is_paused === true) {
        Plotly.relayout('graph', {
         "yaxis.range": [-y_range, y_range],
         "yaxis2.range": [-y_range, y_range]
        })
    }
    onReset();
    log(this);
});
// alert($('#check_fourier').is(":checked"));
// Slider waves
$('#fourier_terms').on('input', function () {
    nb_terms = parseFloat($("#fourier_terms").val());
    $("#fourier_sin").text(" " + nb_terms);
    onReset();
    log(this);
});

// k0
$("#k0_input").on('keyup',function (event) {
    if(event.keyCode === 13) {
        // Check it is a number
        if (isNaN(parseFloat($('#k0_input').val()))) {
            $('#error_k0').text('Invalid input: k0 needs to be a number');
        }
        else {
            k0 = parseFloat($('#k0_input').val());
            log(this);
            onReset();
            $('#k0').text(k0);
            $('#k0_input').val('');
            $('#error_k0').text('');
        }
    }
});

// kend
$("#kend_input").on('keyup',function (event) {
    if(event.keyCode === 13) {
        // Check it is a number
        if (isNaN(parseFloat($('#kend_input').val()))) {
            $('#error_kend').text('Invalid input: kend needs to be a number');
        }
        else {
            kend = parseFloat($('#kend_input').val());
            log(this);
            onReset();
            $('#kend').text(kend);
            $('#kend_input').val('');
            $('#error_kend').text('');
        }
    }
});


// Dispersion relation
$("#function").on('keyup', function (event) {
    if(event.keyCode === 13) {
        try {
            // All the characters allowed are in the square brackets
            if (/[^0-9kv().*/+-^]/.test($('#function').val())) {
                throw new Error;
            }
            funct = $('#function').val();
            eval_omega_disp();
            $('#dispersionRelation').text($('#function').val());
            $('#error_omega').text("");
            omega_input = true;
            log(this);
            onReset();
            $('#function').val("");
        }
        catch (err) {
            $('#error_omega').text("Invalid equation");
        }
    }
});

// Slider waves
$('#slider_waves').on('input', function () {
    if ($('input[name=type]:checked').val()=== "sine") {
        nb_waves = parseFloat($("#slider_waves").val());
        $("#waves_display").text(" " + nb_waves);
        $('#slider_focus').attr('max', nb_waves);
        $('#focusMax').text(nb_waves);
        if (focus > nb_waves) {
            focus = nb_waves;
            $('#focus_display').text(" " + focus);
        }
    }
    else if ($('input[name=type]:checked').val() === "fourier") {
        nb_terms = parseFloat($("#slider_waves").val());
        $("#waves_display").text(" " + nb_terms);
        $('#slider_focus').attr('max', nb_terms);
        $('#focusMax').text(nb_terms);
        if (focus > nb_terms) {
            focus = nb_terms;
            $('#focus_display').text(" " + focus);
        }
    }
    onReset();
    update_y_range();
    if (is_paused === true) {
        Plotly.relayout('graph', {
            "yaxis.range": [-y_range, y_range],
            "yaxis2.range": [-y_range, y_range]
        })
    }

    log(this);
});

// Slider phase velocity
$('#velocityPhase').on('input', function () {
    v = parseFloat($("#velocityPhase").val());
    $("#phaseVelocityDisplay").text(" " + v + " m/s");
    onReset();
    log(this);
});

// Slider focus
$('#slider_focus').on('input', function () {
    focus = parseFloat($("#slider_focus").val());
    $('#focus_display').text(" " + focus);
    update_focus();
    log(this);
});

//--------------------------------------------FUNCTIONS--------------------------------------------

function eval_omega_disp() {
    for (var i = 0; i < nb; i++) {
        if (funct.includes('k')) {
            omega_disp[i] = calculator.parse(funct.replace(/k/g, k_array[i]).replace(/v/g, v));
        }
        else {
            omega_disp[i] = calculator.parse(funct);
        }
    }
}
function sum_sin() {
    for (var i = 0; i < n; i++) {
        y_i[i] = 0;
        y_d[i] = 0;
            for (var j_ = 0; j_ < nb_waves; j_++) {
                y_i[i] += Math.sin(k_array[j_] * x[i] - omega_nondisp[j_] * t);
                y_d[i] += Math.sin(k_array[j_] * x[i] - omega_disp[j_] * t);
            }
    }
}

function sum_fourier() {
    terms_i = [];
    terms_d = [];
    y_i = [];
    y_d = [];
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < nb_terms; j++) {
            terms_i[j] = Math.sin(k_array[j] *x[i]-omega_nondisp[j]*v*t)/k_array[j];
            terms_d[j] = Math.sin(k_array[j] *x[i]-omega_disp[j]*v*t)/k_array[j];
        }
        y_i[i] = (numeric.sum(terms_i));
        y_d[i] = (numeric.sum(terms_d));
    }
}

function initial_data(){
    // tab =  $('.tab-pane.active').attr('id');
    if ($('input[name=type]:checked').val()=== "sine") {
         nb = nb_waves;
         k_array = numeric.linspace(k0, kend, nb);
         omega_nondisp = numeric.linspace(k0*v, kend*v, nb);
    }
    else if ($('input[name=type]:checked').val() === "fourier") {
        nb = nb_terms;
        k_array = numeric.linspace(1, 1+(nb-1)*2, nb);
        omega_nondisp = numeric.linspace(1*v, (1+(nb-1)*2)*v, nb);
    }

    if (omega_input == false) {
         // Default: non-dispersive
        omega_disp = omega_nondisp.slice();
    }
    else {
        eval_omega_disp();
    }
    if ($('input[name=type]:checked').val()=== "sine") {
         sum_sin();
    }
    else if ($('input[name=type]:checked').val() === "fourier") {
        sum_fourier();
    }
    $('#focus_k').text(k_array[focus-1]);

}

function onStart() {
    is_paused = !is_paused;
    document.getElementById('playPauseButton').value = (is_paused) ? "Play" : "Pause";
    requestAnimationFrame(update);
}

function onReset() {
    is_paused = true;
    t = 0;
    initial_data();
    update_focus();

    Plotly.animate('graph',
            {data: [{y: y_i}, {y: y_d}]},
            {transition: {duration: 10}, frame: {duration: 10, redraw: false}}
    );
    document.getElementById('playPauseButton').value = (is_paused) ? "Play" : "Pause";

    dispRelPlot();
}

function update_y_range() {
    if ($('input[name=type]:checked').val() === "sine") {
        y_range = nb_waves + 0.2;
    }
    else{
        y_range = 1.5;
    }
}
//--------------------------------------------PLOTTING--------------------------------------------

// Data
initial_data();

// Initial plot
var incident = {
    x: x,
    y: y_i,
    name: "non-dispersive",
    line: {width: 2, color: CHERRY, simplify: false}
};

var dispersive = {
    x: x,
    y: y_d,
    xaxis: 'x2',
    yaxis: 'y2',
    name: "dispersive",
    line: {width: 2, color: POOL_BLUE, simplify: false}
};

var layout =
        {
        autosize: false,
        width: 600,
        height: 400,
        margin: {
            l: 60,
            r: 35,
            b: 50,
            t: 40,
            pad: 4
        },
        //plot_bgcolor: '#EBEEEE',
        xaxis: {
            range: [0, x[x.length-1]],
        },
        yaxis: {
            autorange: false,
            range: [-2, 2],
            domain: [0.6, 1],
        },
        xaxis2: {
            range: [0, x[x.length-1]],
            anchor: 'y2',
        },
        yaxis2: {
            autorange: false,
            range: [-2, 2],
            domain: [0, 0.4],
        },
        legend: {
            orientation: 'h',
            x: -0.05,
            y: 1.2,
            fontsize: 25
        },
        font: {
            family: 'Lato',
            size: 16,
            color: '#003E74',
            weight: 900
        }
    };

// Plot graph with interactivity
Plotly.plot('graph', [incident, dispersive], layout);

//--------------------------------------------ANIMATION--------------------------------------------

// Data update function for animation
var t_start = t;

function compute() {
    // tab =  $('.tab-pane.active').attr('id');
    t += dt;
    if ($('input[name=type]:checked').val() === "sine") {
        sum_sin();
    }
    else if ($('input[name=type]:checked').val() === "fourier") {
        sum_fourier();
    }
}

// Looping function that updates plot
function update() {

    if (is_paused === false) {

        compute();

        Plotly.animate('graph',
                {data: [{y: y_i}, {y: y_d}]},
                {transition: {duration: 15}, frame: {duration: 15, redraw: false}}
                // vastly speeds up animation but won't update any non-animated properties
        );
        requestAnimationFrame(update);
    }
}

//--------------------------------------------Dispersion relation plot--------------------------------------
function dispRelPlot() {
    dataNonDisp.x = numeric.linspace(k_array[0]-1, k_array[k_array.length-1]+2, 100);
    dataNonDisp.y = numeric.linspace((k_array[0]-1)*v, (k_array[k_array.length-1]+2)*v, 100);
    dataDisp.x = numeric.linspace(k_array[0]-1, k_array[k_array.length-1]+2, 100);
    for (var i = 0; i < 100; i++) {
        if (funct.includes('k')) {
            omega_disp2[i] = calculator.parse(funct.replace(/k/g, dataDisp.x[i]).replace(/v/g, v));
        }
        else {
            omega_disp2[i] = calculator.parse(funct);
        }
    }
    dataDisp.y = omega_disp2;
    Plotly.redraw('dispersionRelationGraph');
}

var tangent_y = [];
var tangent_x = [];
var vpLine_x = [];
var vpLine_y = [];
var slope_tangent;
var t;
var vp = omega_disp[focus-1]/k_array[focus-1];
var vg = vp; //default: non-dispersive
var omega_disp2 = [];
var marT = 30, marB = 23, marR = 5, marL = 35;
var dispRel_layout = { margin: {l: marL, r: marR, b: marB + 10, t: marT},
                legend: {x: 0.01, y: 1},
                yaxis: { title: "omega", titlefont: {size: 10}},
                xaxis: { title: "wave number (k)", titlefont: {size: 10}}};
var dataNonDisp = {x: numeric.linspace(k_array[0]-1, k_array[k_array.length-1]+2, 100), y: numeric.linspace((k_array[0]-1)*v, (k_array[k_array.length-1]+2)*v, 100), name: "non-dispersive", mode: "lines", line: {width: 2, color: CHERRY}};
var dataDisp = {x: numeric.linspace(k_array[0]-1, k_array[k_array.length-1]+2, 100), y: numeric.linspace((k_array[0]-1)*v, (k_array[k_array.length-1]+2)*v, 100), name: "dispersive", mode: "lines", line: {width: 2, color: POOL_BLUE}};
var dataFocus = { x:[], y:[], name:"focus", mode:'markers+text',showlegend: false, marker: {size: 10, color: NAVY, symbol: "circle-open"},
    text: [comparisonText], textposition: 'bottom_right'};
var dataTangent = {x: [], y: [],  name: "tangent (V_g)", mode: "lines", line: {width: 2, color: NAVY}};
var dataVpLine = {x: [], y: [],  name: "line from origin (V_p)", mode: "lines", line: {width: 2, color: NAVY, dash:'dot'}};
Plotly.newPlot('dispersionRelationGraph',[dataDisp, dataNonDisp, dataFocus, dataTangent, dataVpLine], dispRel_layout);
update_focus();

// //-------------------------------------Tangent------------------------------------------------------------------

//plot point on focus
function update_focus()  {
    dataFocus.x = [k_array[focus-1]];
    dataFocus.y = [omega_disp[focus-1]];
    vp = omega_disp[focus-1]/k_array[focus-1];
    tangent();
    vpLine();
    if (vp === slope_tangent) {
        comparisonText = 'V_group = V_phase: <br>non-dispersive';
    }
    else if (vp > slope_tangent){
        comparisonText = 'V_group < V_phase: <br>normal dispersion';
    }
    else {
        comparisonText = 'V_group > V_phase: <br>anomalous dispersion';
    }
    dataFocus.text = [comparisonText];
    Plotly.redraw('dispersionRelationGraph');
    $('#focus_k').text(Math.round(k_array[focus-1]*100)/100);
    $('#focus_omega').text(Math.round(omega_disp[focus-1]*100)/100);
    $('#focus_vp').text(Math.round(vp*100)/100); // gradient line with origin
    $('#focus_vg').text(Math.round(slope_tangent*100)/100); //gradient of tangent

}

function tangent() {
    slope_tangent = math.derivative(funct.replace(/v/g,v), 'k').eval({k: k_array[focus-1]});
    for (var i=0; i<10; i++) {
        tangent_x[i] = k_array[focus-1] - 0.5 + i*0.1;
        tangent_y[i] = slope_tangent*(tangent_x[i] - k_array[focus-1]) + omega_disp[focus-1];
    }
    dataTangent.x = tangent_x;
    dataTangent.y = tangent_y;

}

function vpLine() {
    for (var i = 0; i<100; i++){
        vpLine_x[i] = i*k_array[focus-1]/100;
        vpLine_y[i] = vp*vpLine_x[i];
    }
    dataVpLine.x = vpLine_x;
    dataVpLine.y = vpLine_y;
}
// ToDo: Tooltips for input boxes
// ToDo; dispersion relation accepts 2k. solve this.
