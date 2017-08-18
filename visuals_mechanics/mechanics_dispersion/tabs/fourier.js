// Defining variables (need to update later anyway so importing from e.g. json is meaningless)
// Wave characteristics:
var nb_waves = parseInt($("#fourier_terms").val());
var terms = [];

// x and t coordinates
var n = 10000;
var y = [];
var x = numeric.linspace(0, 20, n);
var t = 0.0;
var dt = 0.02;
var is_paused = true;

//--------------------------------------------INTERACTS--------------------------------------------

// Slider waves
$('#fourier_terms').on('input', function () {
    nb_waves = parseFloat($("#fourier_terms").val());
    $("#fourier_sin").text(" " + nb_waves);
    onReset();
});

//--------------------------------------------FUNCTIONS--------------------------------------------

function initial_data(){
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < nb_waves; j++) {
            var k = (j * 2) + 1;
            terms[j] = Math.sin(k * x[i]) / k;
        }
        y[i] = 0.5 + (2 / Math.PI) * (numeric.sum(terms));
    }
}

function onStart() {
    is_paused = !is_paused;
    document.getElementById('fourier_run_button').value = (is_paused) ? "Play" : "Pause";
    requestAnimationFrame(update);
}

function onReset() {
    is_paused = true;
    t = 0;
    initial_data();

    Plotly.animate('graph',
            {data: [{y: y}]},
            {transition: {duration: 0}, frame: {duration: 0, redraw: false}}
    );
    document.getElementById('fourier_run_button').value = (is_paused) ? "Play" : "Pause";
}

//--------------------------------------------PLOTTING--------------------------------------------

// Data
initial_data();

// Initial plot
var wave = {
    x: x,
    y: y,
    name: "wave",
    line: {width: 2, color: '#960078', simplify: false}
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
            range: [0, 20],
        },
        yaxis: {
            autorange: false,
            range: [-0.3, 1.2],
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
Plotly.plot('graph', [wave], layout);

//--------------------------------------------ANIMATION--------------------------------------------

// Data update function for animation
function compute() {
    t += dt;
    // need to find a way to define time limit
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < nb_waves; j++) {
            var k = (j * 2) + 1;
            terms[j] = Math.sin(k * (x[i]-t)) / k;
        }
        y[i] = 0.5 + (2 / Math.PI) * (numeric.sum(terms));
    }
}

// Looping function that updates plot
function update() {

    if (is_paused === false) {

        compute();

        Plotly.animate('graph',
                {data: [{y: y}]},
                {transition: {duration: 0}, frame: {duration: 0, redraw: false}}
                // vastly speeds up animation but won't update any non-animated properties
        );
        requestAnimationFrame(update);
    }
}
