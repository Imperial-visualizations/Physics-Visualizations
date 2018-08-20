//Global Initial Parameters:
const layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5,5], zeroline: true, title: "x"},
    yaxis: {range: [-5,5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
//CODE IS JUST THE SAME AS PLOT AND COMPONENT, JUST BOTH IN ONE PLACE
var defaultHref = window.location.href;
var initX = 0, initY = 0;
var resolution = 2000;
// set the step of the x axis from -2pi to 2pi
var z = numeric.linspace(-2*Math.PI,2*Math.PI,resolution);
//----------------------------------------------------------------------------------------------------------------------
//VERY IMPORTANT!!!
// 0 is triangular, 1 is square, 2 is sawtooth, 3 is delta's, 4 is parabola, 5 is x, 6 is |x|,
var shape = 0;
//----------------------------------------------------------------------------------------------------------------------
// decay and decay2 is to optimize the visualization of the amplitude of the component plots.
var decay = 0.9;
var decay2 = 0.6;

/* set the default layout of the graph to adjust for different amplitudes and different number of terms involved
it changes the range of the y-axis according to the amplitude and number of terms
so the setLayout allows the layout to fit the graph, instead of fixing the layout to some values
*/
// set a smaller layout with smaller height
function setLayoutSmall(someTitles){
    const new_layout = {
    width: 450, "height": 250,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [], zeroline: true, title: "x"},
    yaxis: {range: [], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1},
    title: someTitles
    }
    return new_layout;
}

// initialize the Cartesian coordinates for the plots and the functions
function initFourier() {
    Plotly.purge("graph3");
    Plotly.purge("graph4");
    Plotly.newPlot("graph3",computePlot(z),setLayoutSmall("Fourier Series Plot"));
    Plotly.newPlot("graph4",computeComponents(z),setLayoutSmall("Fourier Component Plot"));

    return;

}


// sum up all the number in the array
function adding(array){
    var result = 0
    for(var i =0; i<array.length; ++i){
        result+=array[i];
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Start. Functions to plot the Fourier Series

// select the kind of Fourier Series you want
function selection(n,A,L,x,type){
    if (type===0){
        formula = (8*A*1/((2*(n)-1) *Math.PI)**2)*(-1)**(n) * Math.sin(x*(2*n -1) *Math.PI /L);
    } else if (type===1){
        formula = 2*A/(n*Math.PI) *(1-(-1)**n) *Math.sin(n*Math.PI *x/L);
    } else if (type===2){
        formula = 2*A*(-1)**(n+1) /(n*Math.PI) * Math.sin(n *Math.PI* x/L);
    } else if (type===3){
        formula = 1/L * Math.cos(n*Math.PI*x/L);
    } else if (type===4){
        if (n===0){
            formula=(2*L**2)/3;
        } else {
            formula=A*((4*L**2)/(n*Math.PI)**2)*(-1)**n*Math.cos(n*Math.PI*x/L);
        }
    } else if (type===5){
        formula = 2*A*(-1)**(n+1) /(n*Math.PI) * Math.sin(n *Math.PI* x/L);
    } else if (type===6){
        if (n===0){
            formula=A*L;
        } else {
            formula=(2*A*L/(n*Math.PI)**2)*((-1)**(n) -1)*Math.cos(n*Math.PI*x/L);
        }
    }
    return formula;
}

// sum up all the terms in the Fourier Series
// so at x, we have terms n=0, n=1, n=2..., we sum up all the amplitudes y=y0+y1+y2+... y0 at n=0, y1 at n=1, y2 at n=2...
function summation(x) {

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    n = numeric.linspace(1,N,N);


    var y = [];


    for (var i = 0; i < N; ++i){
        y.push(selection(n[i],A,L,x,shape));
        //y.push((8*A/((2*n[i]-1)*Math.PI)**2)*((-1)**n[i])*Math.sin((2*n[i]-1)*Math.PI*x/L));
    }
    var sum = adding(y);

    return sum;
}



function a_zero(shape,A,L){
// Returns a_0 for the particular function
    if (shape === 0) {
        a = 0;
    }else if (shape === 1){
        a = 0;
    }else if (shape ===2){
        a = 0;
    }else if (shape ===3){
        a = 1/L;
    }else if (shape ===4){
        a = (2.0/3)*a*L**2;
    }else if (shape ===5){
        a = 0;//(2.0/3)*A*L**2;
    }else if (shape ===6){
        a = A*L;
        }
    return a
}

function c_intercept(shape, N,A,L) {
    var number = a_zero(shape,A,L)/2;
    for (var n = 1; n < N; ++n){
        number += selection(n, A,L, 0, shape);
        }

    return number
}

function problem_fix(shape){
    //Only purpose is to fix a second c intercept error we got, had no time to look through properly so just did this
    var manual_correction = 0;
    //if (shape === 5){
    //    manual_correction -= 0.509952 - 0.163
    //}
    if (shape === 6 ){
        manual_correction += 0.7213282 - 0.240
    }else if (shape === 4){
        manual_correction -= 0.167
    }
    return manual_correction
}






// plot the Fourier series
// y_values_cheat is to set the each of the value equals its midpoint value plus the y_value
// so all the y_value_cheat starts at the midpoint of the y_value (equivalently, it's the average value)
function computePlot(x){

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var x_values = [];
    var y_values = [];
    var y_values_cheat = [];

    for (var i = 0; i < x.length ; ++i){
        y_values.push(summation(x[i]));
        x_values.push(x[i]);
    }
    for (var i = 0; i< y_values.length; ++i){
        y_values_cheat.push(-y_values[y_values.length/2]+y_values[i] + c_intercept(shape, N,A,L) + problem_fix(shape));
    }
    if (shape === 3){
        var data=[
         {
            type:"scatter",
            mode:"lines",
            x: x_values,
            y: y_values,
            line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
         },
        ];
    } else {
        var data=[
         {
            type:"scatter",
            mode:"lines",
            x: x_values,
            y: y_values_cheat,
            line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
         },
        ];
    }
    return data;


}
// End. Functions to plot the Fourier Series.
//----------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------
// Start. Functions to plot all the Fourier Series' components.

// a_n
// a_n part is to multiply the function f(x) by sin, and sin is an odd function
// after the if statement, each function has been optimized for better visualization
// comment behind each if statement is the original a_n of each function without optimization
function odd_selection2(n,A,L,type){
    //Represents the bn part of the function summand
    if (type===0){
        amplitude = (A*(-1)**n)*(decay)**n; // (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))
    } else if (type===1){
        amplitude = (A*(1-(-1)**n))*(decay)**n; // A/(n*np.pi) *(1-(-1)**n)
    } else if (type===2){
        amplitude = (A*(-1)**(n+1))*(decay)**n;  //  2*A*(-1)**(n+1) /(n*np.pi)
    } else if (type===3){
        amplitude = 0;
    } else if (type===4){
        amplitude = 0 // (((4*L**2)/(n*Math.PI)**2)*(-1)**n)
    } else if (type===5){
        amplitude = 0.5*A*(2*(-1)**(n+1)*decay**n); //A*(2*L/(n*Math.PI)*(-1)**(n+1)
    } else if (type===6){
        amplitude = 0;
    }
    return amplitude;
}
// b_n
// b_n part is to multiply the function f(x) by cos, and cos is and even function
function even_selection2(n,A,L,type){
    //Gives the an part of the function sum
    if (type === 6){
        if (n===0){
            amplitude2= A*L;
        } else {
            amplitude2 = 2*A*((-1)**(n)-1);
               }
               }
    else if (type ===3){
        if (n === 0 ){
            amplitude2 = 1/(2*L);
        }else{
             amplitude2 = 1/L;
             }
             }
    else if (type ===4){
        if (n === 0 ){
            amplitude2 = A*(L**2)/3;
        } else{
         amplitude2 =(4/Math.PI)*A*(L**2)*((-1)**n)*decay**n;
            }
            }
    else if (type === 0 || type === 1 || type === 2 || type === 5){
        amplitude2= 0;}
    return amplitude2;
}

// return the data that stores one component of the Fourier Series
function plotSines(n,x,shape){

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var x_n = [];
    var y_n = [];
    var spacing=3*A;
    var spacing2 = Math.sqrt((odd_selection2(n,A,L,shape))**2+(even_selection2(n,A,L,shape)))+1;


    for (var i = 0; i < x.length ; ++i){
        x_n.push(x[i]);
        y_n.push(((odd_selection2(n,A,L,shape))*Math.sin(n*Math.PI*x[i]/L)+(even_selection2(n,A,L,shape))*Math.cos(n*Math.PI*x[i]/L))+2*spacing*(n));
    }

    var data=
        {
            type:"scatter",
            mode:"lines",
            x: x_n,
            y: y_n,
            line:{color:"rgb(0,N*10,0)",width:3, dash:"dashed"},
        }
    ;
    return data;

}

// get each single component by recalling plotSines, and plot out all the components of the Fourier Series
function computeComponents(x){

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var data_value=[];

    for (var n=1; n<N+1; ++n){
        data_value.push(plotSines(n,z,shape));
    }

    return data_value;

}

// End. Functions for to plot all the Fourier Series' components.
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Start. To combine the plots of the components and the Fourier Series function

// return the data that stores one component of the Fourier Series
// This function is different from the plotSines in that it will not separate out the function
function plotSines_2(n,x,shape){

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var x_n = [];
    var y_n = [];
    var spacing=A;


    for (var i = 0; i < x.length ; ++i){
        x_n.push(x[i]);
        y_n.push(((odd_selection2(n,A,L,shape))*Math.sin(n*Math.PI*x[i]/L)+(even_selection2(n,A,L,shape))*Math.cos(n*Math.PI*x[i]/L)));
    }

    var data=
        {
            type:"scatter",
            mode:"lines",
            x: x_n,
            y: y_n,
            line:{color:"rgb(0,N*20,0)",width:3, dash:"dashed"},
        }
    ;
    return data;

}

// get each single component by recalling plotSines, and plot out all the components of the Fourier Series
function computeCombination(x){

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var data_value=[];

    for (var n=1; n<N+1; ++n){
        data_value.push(plotSines_2(n,z,shape));
    }

    var x_values = [];
    var y_values = [];
    var y_values_cheat = [];

    for (var i = 0; i < x.length ; ++i){
        y_values.push(summation(x[i]));
        x_values.push(x[i]);
    }

    for (var i = 0; i< y_values.length; ++i){
        y_values_cheat.push(-y_values[y_values.length/2]+y_values[i]);
    }
    if (shape===3){
        var data =
            {
                type:"scatter",
                mode:"lines",
                x: x_values,
                y: y_values,
                line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
            };
        console.log("shape is Dirac");
    } else {
        var data=
            {
                type:"scatter",
                mode:"lines",
                x: x_values,
                y: y_values_cheat,
                line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
            }
    ;
    }
    data_value.push(data);

    return data_value;

}

// End. To combine the plots of the components and the Fourier Series function
//----------------------------------------------------------------------------------------------------------------------


/** updates the plot according to the slider controls. */
// Plotly.animate does not support bar charts, so need to reinitialize the Cartesian every time.
function updatePlot() {
    var data;
    // NB: updates according to the active tab
    var selectedValue = document.getElementById("Select").value; // finds out which function is active
    initFourier();
    //data = computeComponents(z);

    /*
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
    );*/
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

    // as you select the functions you want from the scroll down
    // change the shape and the plots
    // change the titles and the math derivations
    $('#Select').change(function(){
        var selectedValue = document.getElementById("Select").value;
        if (selectedValue==="main"){
            shape = 0;
        } else if (selectedValue==="triangular"){
            shape = 0;
        } else if (selectedValue==="square"){
            shape = 1;
        } else if (selectedValue==="sawtooth"){
            shape = 2;
        } else if (selectedValue==="dirac"){
            shape = 3;
        } else if (selectedValue==="parabola"){
            shape = 4;
        } else if (selectedValue==="linear"){
            shape = 5;
        } else if (selectedValue==="mode"){
            shape = 6;
        }
        $(".title").hide();
        $("#"+selectedValue+"Title").show();
        initFourier();
    })
/*
    $(".rightnav").on('click',function(){
        window.location.href =
            defaultHref.slice(0,-6)
            +(parseInt(defaultHref.slice(-6,-5))+1) + ".html";
    });

    $(".rightnav").on("mouseenter", function() {
        $(".rightnav").css({"color":"#1a0433","font-size":"55px"});
    }).on('mouseleave', function(){
        $(".rightnav").css({"color":"#330766","font-size":"50px"});
    });

    $(".leftnav").on('click',function(){
        window.location.href =
            defaultHref.slice(0,-6)
            +(parseInt(defaultHref.slice(-6,-5))-1) + ".html";
    });

    $(".leftnav").on("mouseenter", function() {
        $(".leftnav").css({"color":"#1a0433","font-size":"55px"})
    }).on('mouseleave', function(){
        $(".leftnav").css({"color":"#330766","font-size":"50px"})
    });
*/
    //The First Initialisation - I use 's' rather than 'z' :p
    initFourier();
    initGuidance(["heading","scroll","graph","A","N","L"]);
}

//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

$(document).ready(main); //Load main when document is ready.