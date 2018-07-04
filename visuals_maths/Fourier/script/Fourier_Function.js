//Global Initial Parameters:
const initialPoint = [1, 1];
const layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [0, 7], zeroline: true, title: "x"},
    yaxis: {range: [-5, 5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
var currentPoint = initialPoint;
var initX = 0, initY = 0;

//Plot
/**
 * Resets and plots initial area element or basis vectors of 2D Cartesian.
 * @param {string} type - basis vectors or area element
 */
function initCarte(type) {
    Plotly.purge("graph");
    initX = currentPoint[0];
    initY = currentPoint[1];


    $("#xController").val(initX);
    $("#xControllerDisplay").text(initX);
    $("#yController").val(initY);
    $("#yControllerDisplay").text(initY);


    if (type === "#maths"){
        Plotly.newPlot("graph", computeArea(), layout);
    } else if (type === "#area"){
        Plotly.newPlot("graph", computeArea(), layout);
    }
    return;
}

/**
 * Computes the area element.
 * @param {float} x - x value.
 * @param {float} y - y value.
 */
function computeArea() {
    var x = numeric.linspace(0,2*Math.PI,25);
    var y = [];

    for(var i = 0; i < x.length; ++i){
        y.push(Math.cos(x[i]));
    }

    var data = [
        {
            type: "scatter",
            mode: "lines",
            x: x,
            y: y,
            line: {color: "rgb(0,200,50)", width: 3, dash: "dashed"},
        },

    ];

    return data;
}

/** updates the plot according to the slider controls. */
function updatePlot() {
    var data = [];
    // NB: updates according to the active tab
    var href = $('ul.tab-nav li a.active.button').attr('href'); // finds out which tab is active

    /* ~Jquery
    5.  Declare and store the floating values from x/y- sliders.
        Hint: Same is task 2.
    */
    /*
    var N = parseFloat(document.getElementById('NController').value);
    var A = parseFloat(document.getElementById('AController').value);
    var L = parseFloat(document.getElementById('LController').value);
    */

    data = computeArea(x, y);

    //This is animation bit.
    Plotly.animate(
        'graph',
        {data: data},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
}

function main() {
    /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
    $("input[type=range]").each(function () {
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit"));
            //NB: Display values are restricted by their definition in the HTML to always display nice number.
            updatePlot(); //Updating the plot is linked with display (Just My preference)
        });

    });

    /*Tabs*/
    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initCarte(href); //re-initialise when tab is changed
            return false;
        });
    });

    //The First Initialisation - I use 's' rather than 'z' :p
    initCarte("#maths");
}
$(document).ready(main); //Load main when document is ready.