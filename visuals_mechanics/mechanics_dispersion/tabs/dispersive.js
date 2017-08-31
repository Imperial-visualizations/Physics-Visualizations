//--------------------------------------------VARIABLES--------------------------------------------

// Defining variables (need to update later anyway so importing from e.g. json is meaningless)
// Wave characteristics:
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
var n = 1000;
var y_i = [], y_d = [];
var x = numeric.linspace(0, 100, n);
var t = 0.0;
var dt = 0.02;
var is_paused = true;
var y_range = 1;
var omega_input = false;
var funct;

// Colours

const IMPERIAL_BLUE = 0x003E74;
const CHERRY = 0xE40043;

//--------------------------------------------INTERACTS--------------------------------------------

 $('input[type=radio][name=type]').change(function() {

     if (this.value === 'sine') {
         $('#nb_title').text('Number of sine waves:');
         $('#slider_waves').val(nb_waves);
         $("#waves_display").text(" " + nb_waves);
         layout.xaxis.range = [0, 100];
         layout.xaxis2.range = [0, 100];
         $('#wave_number').show();

     }
     else if (this.value === 'fourier') {
         $('#nb_title').text('Number of fourier terms:');
         $('#slider_waves').val(nb_terms);
         $("#waves_display").text(" " + nb_terms);
         layout.xaxis.range = [0, 20];
         layout.xaxis2.range = [0, 20];
         $('#wave_number').hide();

     }
     update_y_range();
     if (is_paused === true) {
         Plotly.relayout('graph', {
             "yaxis.range": [-y_range, y_range],
             "yaxis2.range": [-y_range, y_range],
         })
     }
     onReset();

 });
// alert($('#check_fourier').is(":checked"));
// Slider waves
$('#fourier_terms').on('input', function () {
    nb_terms = parseFloat($("#fourier_terms").val());
    $("#fourier_sin").text(" " + nb_terms);
    onReset();
});

// k0
$("#k0_input").on('keyup',function () {
    if(event.keyCode == 13) {
        // Check it is a number
        if (isNaN(parseFloat($('#k0_input').val()))) {
            $('#error_k0').text('Invalid input: k0 needs to be a number');
        }
        else {
            k0 = parseFloat($('#k0_input').val());
            onReset();
            $('#k0').text(k0);
            $('#k0_input').val('');
            $('#error_k0').text('');
        }
    }
});

// kend
$("#kend_input").on('keyup',function () {
    if(event.keyCode == 13) {
        // Check it is a number
        if (isNaN(parseFloat($('#kend_input').val()))) {
            $('#error_kend').text('Invalid input: kend needs to be a number');
        }
        else {
            kend = parseFloat($('#kend_input').val());
            onReset();
            $('#kend').text(kend);
            $('#kend_input').val('');
            $('#error_kend').text('');
        }

    }
});


// Dispersion relation
$("#function").on('keyup', function () {
    if(event.keyCode == 13) {
        try {
            // All the characters allowed are in the square brackets
            if (/[^0-9k().*/+-^]/.test($('#function').val())) {
                throw new Error;
            }
            funct = $('#function').val();
            for (var i = 0; i < nb_waves; i++) {
                if (funct.includes('k')) {
                    k = k_array[i];
                    omega_disp[i] = calculator.parse(funct.replace(/k/g, k));
                }
                else {
                    omega_disp[i] = calculator.parse(funct);
                }
            }

            $('#dispersionRelation').text($('#function').val());
            $('#error_omega').text("");
            omega_input = true;
            onReset();
             $('#function').val("");
        }
        catch (err) {
            $('#error_omega').text("Invalid equation");
        }
    }

})

// Slider waves
$('#slider_waves').on('input', function () {
    if ($('input[name=type]:checked').val()=== "sine") {
        nb_waves = parseFloat($("#slider_waves").val());
        $("#waves_display").text(" " + nb_waves);
    }
    else if ($('input[name=type]:checked').val() === "fourier") {
        nb_terms = parseFloat($("#slider_waves").val());
        $("#waves_display").text(" " + nb_terms);
    }
    onReset();
    update_y_range();
    if (is_paused === true) {
        Plotly.relayout('graph', {
            "yaxis.range": [-y_range, y_range],
            "yaxis2.range": [-y_range, y_range],
        })
    }
});

// Slider phase velocity
$('#velocityPhase').on('input', function () {
    v = parseFloat($("#velocityPhase").val());
    $("#phaseVelocityDisplay").text(" " + v + " m/s");
    onReset();
});

//--------------------------------------------FUNCTIONS--------------------------------------------

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
        for (var j = 0; j < nb; j++) {
            if (funct.includes('k')) {
                omega_disp[j] = calculator.parse(funct.replace(/k/g, k_array[j]));
            }
            else {
                omega_disp[j] = calculator.parse(funct);
            }
        }
    }
    if ($('input[name=type]:checked').val()=== "sine") {
         sum_sin();
    }
    else if ($('input[name=type]:checked').val() === "fourier") {
        sum_fourier();
    }

}

function onStart() {
    is_paused = !is_paused;
    document.getElementById('run_button').value = (is_paused) ? "Play" : "Pause";
    requestAnimationFrame(update);
}

function onReset() {
    is_paused = true;
    t = 0;
    initial_data();

    Plotly.animate('graph',
            {data: [{y: y_i}, {y: y_d}]},
            {transition: {duration: 0}, frame: {duration: 0, redraw: false}}
    );
    document.getElementById('run_button').value = (is_paused) ? "Play" : "Pause";

    dispRelPlot();
}

function update_y_range() {
    if ($('input[name=type]:checked').val() === "sine") {
        if (nb_waves < 4) {
            y_range = 4;
        }
        else {
            y_range = (nb_waves - (nb_waves % 5)) + 5;
        }
    }
    else{
        y_range = 1.3;
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
    line: {width: 2, color: '#E40043', simplify: false}
};

var dispersive = {
    x: x,
    y: y_d,
    xaxis: 'x2',
    yaxis: 'y2',
    name: "dispersive",
    line: {width: 2, color: '#00ACD7', simplify: false}
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
            range: [0, x[-1]],
        },
        yaxis: {
            autorange: false,
            range: [-4, 4],
            domain: [0.6, 1],
        },
        xaxis2: {
            range: [0, x[-1]],
            anchor: 'y2',
        },
        yaxis2: {
            autorange: false,
            range: [-4, 4],
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
    // need to find a way to define time limit
    if (t < t_start + 50) {
        if ($('input[name=type]:checked').val() === "sine") {
            sum_sin();
        }
        else if ($('input[name=type]:checked').val() === "fourier") {
            sum_fourier();
        }
    }
}

// Looping function that updates plot
function update() {

    if (is_paused === false) {

        compute();

        Plotly.animate('graph',
                {data: [{y: y_i}, {y: y_d}]},
                {transition: {duration: 0}, frame: {duration: 0, redraw: false}}
                // vastly speeds up animation but won't update any non-animated properties
        );
        requestAnimationFrame(update);
    }
}

//--------------------------------------------Dispersion relation plot--------------------------------------
function dispRelPlot() {
    dataNonDisp.x = numeric.linspace(k0-1, kend+3, nb);
    dataNonDisp.y = numeric.linspace((k0-1)*v, (kend+3)*v, nb);
    dataDisp.x = k_array;
    dataDisp.y = omega_disp;
    Plotly.redraw('dispersionRelationGraph');
}
var marT = 30, marB = 23, marR = 5, marL = 35;
var dispRel_layout = {title: "Dispersion Relation", titlefont: {size: 12}, margin: {l: marL, r: marR, b: marB + 10, t: marT},
                legend: {x: 0.67, y: 1, "orientation": "v"},
                yaxis: { title: "omega", titlefont: {size: 10}},
                xaxis: { title: "wave number (k)", titlefont: {size: 10}}};
var dataNonDisp = {x: numeric.linspace(k0-1, kend+3, nb), y: numeric.linspace((k0-1)*v, (kend+3)*v, nb), name: "non-dispersive", mode: "lines" };
var dataDisp = {x: k_array, y: omega_disp, name: "dispersive", mode: "markers",
        marker: {size: 10, color: CHERRY, symbol: "circle-open"}};
Plotly.newPlot('dispersionRelationGraph',[dataDisp, dataNonDisp], dispRel_layout);


// ToDo: Tooltips for input boxes
// ToDo: change nb_waves or terms to nb.
// ToDo: when I change k equation doesn't update

// Maybe at beginning: need to specify v (ratio of w and k) and how w (/k cause they are
// proportional) changes with the added sine wave

