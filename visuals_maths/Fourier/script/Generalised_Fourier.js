var layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5,5], zeroline: true, title: "x"},
    yaxis: {range: [-2,2], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
//resolution, number of points on the graph shown
var resolution=10000;
// slider for N
// slider for L
var L = parseFloat(document.getElementById('LController').value);
var xOriginal = numeric.linspace(-L,L,resolution);

// kMax is an integer, the larger it is the better the numerical integration
var kMax=100;
var h=5.0/kMax;

x=2;
var equation="(3**x)/(1+x**2)";

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
    for (var i in x_range){
        x=x_range[i];
        y.push(eval(equation));
        //eval turns the string specified by the user into a command
    }
    return y;
}

var yOriginal = y_values(xOriginal);
//Computes and stores the y values of the specified function

function integration_simps(x,y){
    //Integration by Simpson's rule
    var a = x[0];
    var b = x[x.length-1];
    var N = x.length;
    var h = (b-a)/N;
    var A=0;
    for (var i=1; i<x.length-1; ++i){
        if (i%2===0){
            A+=2*y[i];
        } else {
            A+=4*y[i];
        }
    }
    A+=y[0]+y[y.length-1];
    A = A*h/3;
    return A
}

function integration_ultra(x,y,h,kMax){
    //Numerical integration by tanh-sinh quadrature, at the moment only calculates integrals from -1 to +1, needs changing
    var omega_k = [];
    var x_k = [];
    for (var i = -kMax; i<kMax; ++i){
        x_k.push(Math.tanh(0.5*Math.PI*Math.sinh(i*h)));
        omega_k.push(0.5*h*Math.PI*Math.cosh(i*h)/(cosh(0.5*Math.PI*Math.sinh(i*h)))**2);
    }
    var f_of_xk = y_values(x_k);
    var A = 0;
    for (var i = 0; i<x_k.length; ++i){
        A += (omega_k[i]*f_of_xk[i]);
    }
    console.log(A)
    return A;
}

function integration(x,y){
    //Integration by Riemann sum
    var A=0;
    for (var i =0; i<x.length-1; i++){
        A+=(x[i+1]-x[i])*(y[i+1]+y[i])/2;
    }
    return A;
}

function initFourier(){
    Plotly.purge("graph");
    //Plotly.purge("graph2");
    //console.log(computePlot(xOriginal,yOriginal));
    //console.log(computePlot2(xOriginal,yOriginal));
    Plotly.newPlot("graph", computePlot(xOriginal,yOriginal), layout);
    //Plotly.newPlot("graph2", computePlot2(xOriginal,yOriginal), layout);

    return;
}


function a_n(input_function_values, n, x){
    var L = parseFloat(document.getElementById('LController').value);
    //Updates L so that we can calculate a_n for all necessary n

    var integrand = [];
    for (var i = 0; i<input_function_values.length; ++i){
        integrand.push(input_function_values[i]*Math.cos(n*Math.PI*x[i]/L));
        //For a given n, making a list of values to be integrated
    }
    an=integration_simps(x, integrand)/L;
    //Integrating those values and divide by L by how we've defined a_n
    return an;
}

function b_n(input_function_values, n, x){
    //Same as in an but for bn (sin as opposed to cos)
    var L = parseFloat(document.getElementById('LController').value);

    var integrand = [];
    for (var i = 0; i<input_function_values.length; ++i){
        integrand.push(input_function_values[i]*Math.sin(n*Math.PI*x[i]/L));
    }
    bn=integration_simps(x, integrand)/L;
    //console.log('bn is '+bn +'for n = '+ n);
    return bn;
}

function Fourier_coefficient(input_function_values, x){
    //For all n from 0 to N, calculates a_n and b_n
    var N = parseFloat(document.getElementById('NController').value);

    var an= [];//List of all terms that will be generated
    var bn= [];
    var alphan = [];
    var thetan = [];
    for (var i = 0; i < N ; i++){
        var a = a_n(input_function_values, i, x);
        var b = b_n(input_function_values, i, x);
        an.push(a);
        bn.push(b);
        //Alpha and theta are a different way of constructing the function, can use these instead
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
//Above code was for calculating components, below is for reconstructing the function for given N.

function Trig_summation_x (an, bn, x_value){
    //For a certain x_value in the function domain, uses the values of a_n and b_n
     //up to a given N, to reconstruct the function at that particular x point
    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);

    var single_y = [an[0]/2];//Average function value term
    for (var n = 1; n < N; n++){
        single_y.push(an[n]*Math.cos(n*Math.PI*x_value/L)+bn[n]*Math.sin(n*Math.PI*x_value/L));//
    }
    return adding(single_y);
}

function Trig_summation_n (an, bn, x){
    //Calls up trig_summation_x for every x value, so we reconstruct the function
    //at every point in the domain, returns the y values in order
    var set_y = [];
    for (var i = 0; i < x.length; ++i){
        set_y.push(Trig_summation_x(an, bn, x[i]));
    }
    return set_y;
}
//The above was to reconstruct the function, below is to actually plot

function computePlot(x,y){
    //Retrieves an,bn, then uses those to find the reconstructed function y values
    //then plots this
    [an, bn, alphan, thetan] = Fourier_coefficient(y,x);
    y2 = Trig_summation_n (an, bn, x);

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

function computePlot2 (x,y){
    //Finds the Fourier coefficients and then plots them as a function of n
    [an, bn, alphan, thetan] = Fourier_coefficient(y, x);
    var n = [];
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

function updateFunction(){
    //Looks at equation the user typed in and retrieves this
    equation = document.getElementById("aInput").value;
    return equation;
}

function converting(string){
    //Turns the equation written by the user from a string into a command
    f = eval(string);
    return f;
}

/* updates the plot according to the slider controls. */
// Plotly.animate does not support bar charts, so need to reinitialize the Cartesian every time.

function updatePlot() {
    var data;
    var L = parseFloat(document.getElementById('LController').value);
    var xOriginal = numeric.linspace(-L,L,resolution);
    // NB: updates according to the active tab

    equation = document.getElementById("aInput").value;

    data = computePlot(xOriginal,yOriginal);
    //data2= computePlot2(xOriginal,yOriginal);

    yOriginal = y_values(xOriginal);

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
    //This is animation bit.
    /*
    Plotly.animate(
        'graph2',
        {data: data2},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    ); */
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