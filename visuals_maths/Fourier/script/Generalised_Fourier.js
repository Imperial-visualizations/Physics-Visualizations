var simpson = require('integrate-simpson');
var resolution=1000;
// slider for N
// slider for L
var L = 10;
var xOriginal = numeric.linspace(-L,L,resolution);

var equation="Math.sin(x**2)";

// sum up all the number in the array
function adding(array){
    var result = 0
    for(var i =0; i<array.length; ++i){
        result+=array[i];
    }
    return result;
}

// convert the string to a numerical function
function y_values(x_range){
    var y = [];
    for (var x in x_range){
        y.push(eval(equation));
    }
    return y;
}

console.log(simpson(x,0,2,100));

var yOriginal = y_values(xOriginal);


function initFourier(){
    Plotly.purge("graph");
    Plotly.purge("graph2");
    Plotly.newPlot("graph", computePlot(xOriginal,yOriginal,N), layout);
    Plotly.newPlot("graph2", computePlot2(xOriginal,yOriginal,N), layout);

    return;
}


function a_n(input_function_values, n, x){
    var integrand = [];
    for (var i = 0; i<input_function_values.length; ++i){
        integrand.push(input_function_values*Math.cos(n*Math.PI*x[i]/L));
    }
    an=simpson(integrand, -L, +L, 2*L/resolution);
    return an;
}

function b_n(input_function_values, n, x){
    var integrand = [];
    for (var i = 0; i<input_function_values.length; ++i){
        integrand.push(input_function_values*Math.sin(n*Math.PI*x[i]/L));
    }
    bn=simpson(integrand, -L, +L, 2*L/resolution);
    return bn;
}

function Fourier_coefficient(input_function_values, N, x){
    var an= [];
    var bn= [];
    var alphan = [];
    var thetan = [];
    for (var i = 0; i < N ; ++i){
        var a= a_n(input_function_values, i, x);
        var b = b_n(input_function_values, i, x);
        a_n.push(a);
        b_n.push(b);
        alphan.push(Math.sqrt(a**2+b**2));
        if (a===0){
            if (b>=0){
                thetan.push(Math.PI/2);
            } else {
                thetan.push(-Math.PI/2);
            }
        } else {
            thetan.push(Math.atan2(b,a));
        }
    }
    return [an, bn, alphan, thetan];
}

function Trig_summation_x (an, bn, x_value, N){
    var single_y = [an[0]/2];
    for (var i = 1; i < N; i++){
        single_y.push(an[i]*Math.cos(i*Math.PI*x_value/L)+bn[i]*Math.sin(i*Math.PI*x_value/L));
    }
    return adding(single_y);
}

function Trig_summation_n (an, bn, x, N){
    var set_y = [];
    for (var i = 0; i < x.length; ++i){
        set_y.push(Trig_summation_x(an, bn, x[i], N));
    }
    return set_y;
}

function computePlot(x,y,N){
    [an, bn, alphan, thetan] = Fourier_coefficient(y, N, x);
    y2 = Trig_summation_n (an, bn, x, N);
    var data=[
         {
            type:"scatter",
            mode:"lines",
            x: x,
            y: y2,
            line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
         },
    ];

    return data;
}

function computePlot2 (x,y,N){
    [an, bn, alphan, thetan] = Fourier_coefficient(y, N, x);
    var n=[];
    for (var i = 0; i<N ; ++i){
        n.push(i);
    }
    var data=[
         {
            type:"scatter",
            mode:"lines",
            x: n,
            y: an,
            line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
         },
    ];

    return data;
}

// convert string to numbers
function converting(string){
    f = eval(string);
    return f;
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
    /*
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
    });*/



    //The First Initialisation - I use 's' rather than 'z' :p
    initFourier();
}
$(document).ready(main); //Load main when document is ready.