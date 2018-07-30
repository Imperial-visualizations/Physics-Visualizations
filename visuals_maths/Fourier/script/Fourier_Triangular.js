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
// coefficient determine the plot in power spectrum
// if label === "a&b", a_n and b_n plot; if label === "alpha&theta", alpha_n and theta_n plot
var label = "a&b";
title1 = "Amplitude of a_n";
title2 = "Amplitude of b_n"

// initialize the Cartesian coordinates for the plots and the functions
function initFourier(type) {
    Plotly.purge("graph");
    Plotly.purge("graph2");
    Plotly.purge("graph3");
    Plotly.purge("graph4");


    if (type === "#maths"){
        Plotly.newPlot("graph", computePlot(z), layout);
    } else if (type === "#plot"){
        Plotly.newPlot("graph", computePlot(z), layout);
    } else if (type ==="#component"){
        Plotly.newPlot("graph", computeComponents(z), setLayout());
    } else if (type==="#derivation"){
        Plotly.newPlot("graph3", plot_triangle_sine(),setLayoutSmall("Sines Function and Triangle Function"));
        Plotly.newPlot("graph4",plot_combination(),setLayoutSmall("Multiplication of the two Functions"));
        console.log("graph 3 and graph 4");
    } else if (type==="#derivation2"){
        Plotly.newPlot("graph", computePlot(z),layout);
    } else if (type==="#spectrum"){
        Plotly.newPlot("graph3", plot_decision1(label),setLayoutSmall(title1));
        Plotly.newPlot("graph4",plot_decision2(label),setLayoutSmall(title2));
    } else if (type==="#combine"){
        Plotly.newPlot("graph3",computePlot(z),setLayoutSmall("Fourier Series Plot"));
        Plotly.newPlot("graph4",computeComponents(z),setLayoutSmall("Fourier Component Plot"));
    }
    console.log(type);
    return;

}

/* set the default layout of the graph to adjust for different amplitudes and different number of terms involved
it changes the range of the y-axis according to the amplitude and number of terms
so the setLayout allows the layout to fit the graph, instead of fixing the layout to some values
*/
function setLayout(){

    const new_layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [], zeroline: true, title: "x"},
    yaxis: {range: [], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
    return new_layout;
}

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

// sum up all the number in the array
function adding(array){
    var result = 0
    for(var i =0; i<array.length; ++i){
        result+=array[i];
    }
    return result;
}

/*
// check which types of functions is selected
function checkType(){
    var selectedType = document.getElementById("Select").value
    if (selectedType==="main"){
        shape = 0;
    } else if (selectedType==="triangular"){
        shape = 0;
    } else if (selectedType==="square"){
        shape = 1;
        console.log(shape);
    }
     initFourier(shape);
     return shape;
}
*/
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
        formula = A*(2*L/(n*Math.PI)*(-1)**(n+1)*Math.sin(n*Math.PI*x/L));
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
        y_values_cheat.push(-y_values[y_values.length/2]+y_values[i]);
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
    if (type===0){
        amplitude = (A*(-1)**n)*(decay)**n; // (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))
    } else if (type===1){
        amplitude = (A*(1-(-1)**n))*(decay)**n; // A/(n*np.pi) *(1-(-1)**n)
    } else if (type===2){
        amplitude = (A*(-1)**(n+1))*(decay)**n;  //  2*A*(-1)**(n+1) /(n*np.pi)
    } else if (type===3){
        amplitude = A/L;
    } else if (type===4){
        amplitude = A*((-1)**n)*decay**n;  // (((4*L**2)/(n*Math.PI)**2)*(-1)**n)
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
    if (type === 6){
        if (n===0){
            amplitude2= A*L;
        } else {
            amplitude2 = 2*A*((-1)**(n)-1);
               }
               }
    else if (type === 0 || type === 1 || type === 2 || type === 3 || type === 4 || type === 5){
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
// Start. Functions to illustrate the math derivation part of triangular function.

// return the y values of the sine plot in the first graph
function sine_n (x,n,L){
    sin = [];

    for (var i=0; i<x.length; ++i){
        sin.push(Math.sin(n*Math.PI*x[i]/L));
    }

    return sin;
}

// return both the x and y values of the triangular plot in the first graph
function triangle_function (x,L,A){
    var x_first = [];
    var x_second = [];
    var y_first = [];
    var y_second = [];
    for (var i=0; i<x.length/2;++i){
        y_first.push((5*A/L)*x[i]);
        x_first.push(x[i]);
    }

    for (var i=x.length/2+1; i<=x.length;++i){
        y_second.push((-5*A/L)*(x[i]-L));
        x_second.push(x[i]);
    }

    x_all = x_first.concat(x_second);
    y_all = y_first.concat(y_second);

    return [x_all, y_all];
}


// when you do the integration, you need to multiply the triangular function with the sine function
// so this function is to
// return the product of the triangular function and the sine function
function combination (y_triangle, y_sine){
    var combination = [];
    for (var i = 0; i<y_triangle.length; ++i){
        combination.push(y_triangle[i]*y_sine[i]);
    }
    return combination
}

// By recalling the sine_n function and the triangular_function, plot out but functions in the first graph
function plot_triangle_sine (){
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);
    var n = parseFloat(document.getElementById('N2Controller').value);
    var x = numeric.linspace(0,L,resolution);
    var mid_x = L/2;
    var mid_y

    var [x_value, y_value] = triangle_function(x,L,A);
    var sin = sine_n(x,n,L);
    var data=
        [{
            type:"scatter",
            mode:"lines",
            x: x_value,
            y: y_value,
            line:{color:"rgb(0,225,0)",width:3, dash:"dashed"},
        },
        {
            type:"scatter",
            mode:"lines",
            x: x,
            y: sin,
            line:{color:"rgb(225,0,0)",width:3, dash:"dashed"},
        },
        {
            type: "scatter",
            mode: "lines",
            x: [L/2, L/2],
            y: [-A, 3*A],
            line: {color: "rgb(225,125,25)", width: 2, dash:"dot"}
        },

        ]
    ;
    return data;
}

// separate the functions into two part
// if the function is odd around L/2, then the integration is even around L/2, so two areas are equal, total size just double the area.
// if the function is even around L.2, then the integration is odd around L/2, so just cancel out.
// plot out the product of triangular function and the sine function.
function plot_combination(){
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);
    var n = parseFloat(document.getElementById('N2Controller').value);
    var x = numeric.linspace(0,L,resolution);

    [x_triangle,y_triangle]=triangle_function(x,L,A);
    y_sine = sine_n(x,n,L);

    y_combine = combination(y_triangle,y_sine);

    var leftSide_y = y_combine.splice(0, y_combine.length/2);
    var leftSide_x = x.splice(0, x.length/2);

    var positive_color = "rgb(100,150,200)";
    var negative_color = "rgb(100,150,200)";

    if (n%2===0){
        var negative_color= "rgb(200,100,100)";
    }


    var data =
    [{
            type:"scatter",
            mode:"lines",
            x: leftSide_x,
            y: leftSide_y,
            line:{color:positive_color,width:3, dash:"dashed"},
            fill: "tozeroy" ,
            fillcolor: positive_color,
            opacity: 0.9
    },
    {
            type:"scatter",
            mode:"lines",
            x: x,
            y: y_combine,
            line:{color:negative_color,width:3, dash:"dashed"},
            fill: "tozeroy" ,
            fillcolor: negative_color,
            opacity: 0.9
    },
    {
            type: "scatter",
            mode: "lines",
            x: [L/2, L/2],
            y: [-3*A, 3*A],
            line: {color: "rgb(225,125,25)", width: 2, dash:"dot"}
    },
    ]
    console.log("Something");
    return data;
}
// End. Function of the math derivation of the triangular functions.
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// Start. To plot out the amplitude of each term in the Fourier Series.
// It will plot out the amplitude of a_n and b_n of each term in the Fourier Series.
// It also includes the plot of alpha_n and theta_n of each term if the Fourier Series is converted into the Power Spectrum

// return the amplitude of a_n of the Fourier Series
function a_n (shape, n){
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var amplitude;
    if (shape === 0) {
        amplitude = 0;
    } else if (shape === 1){
        amplitude = 0;
    } else if (shape === 2){
        amplitude = 0;
    } else if (shape === 3){
        amplitude = 1/L;
    } else if (shape === 4){
        if (n===0){
            amplitude = 2*L**2/3;
        } else {
            amplitude = (4*L**2/(n*Math.PI)**2)*(-1)**n;
        }
    } else if (shape === 5){
        amplitude = 0;
    } else if (shape === 6){
        if (n===0){
            amplitude = L;
        } else {
            amplitude = (2*A*L/(n*Math.PI)**2)*((-1)**n - 1);
        }
    }
    return amplitude;
}

// return the amplitude of b_n of the Fourier Series
function b_n(shape,n){
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var amplitude;
    if (n===0){
        amplitude = 0;
    } else {
        if (shape === 0){
            amplitude=(8*A*1/((2*(n)-1) *Math.PI)**2)*((-1)**(n));
        } else if (shape === 1){
            amplitude=A/(n*Math.PI) *(1-(-1)**n);
        } else if (shape === 2){
            amplitude = 2*A*(-1)**(n+1) /(n*Math.PI)
        } else if (shape === 3){
            amplitude = 0;
        } else if (shape === 4){
            amplitude = 0;
        } else if (shape === 5){
            amplitude = A*(2*L/(n*Math.PI)**1 *(-1)**(n+1));
        } else if (shape === 6){
            amplitude = 0;
        }
    }

    return amplitude;
}

// return the amplitude/magnitude of a_n, b_n, alpha_n, theta_n
function coefficient (N){
    var n = [];
    var an = [];
    var bn = [];
    var alpha_n = [];
    var theta_n = [];

    for (var i = 0; i < N; ++i){
        n.push(i);
        an.push(a_n(shape,i));
        bn.push(b_n(shape,i));
        alpha_n.push(Math.sqrt(a_n(shape,i)**2+b_n(shape,i)**2));
        if (a_n(shape,i)===0){
            if (b_n(shape,i)>0) {
                theta_n.push(Math.PI/2);
            } else if (b_n(shape,i)<0) {
                theta_n.push(-Math.PI/2);
            } else if (b_n(shape,i)===0){
                theta_n.push(0);
            }
        } else {
            theta_n.push(Math.atan2(b_n(shape,i),a_n(shape,i)));
        }
    }

    return [n, an, bn, alpha_n, theta_n];
}

// plot the bar charts to visualize the amplitude of a_n
function plot_an(){
    var N = parseFloat(document.getElementById('NController').value);

    [n, an, bn, alpha_n, theta_n] = coefficient(N);

    var data =
    [{
            type:"bar",
            x: n,
            y: an,
            name: 'Secondary Product',
            marker: {
                color: 'rgb(180,120,60)',
                opacity: 0.7
            }
    },
    ];
    return data;
}

// plot the bar charts to visualize the amplitude of b_n
function plot_bn(){
    var N = parseFloat(document.getElementById('NController').value);

    [n, an, bn, alpha_n, theta_n] = coefficient(N);

    var data =
    [{
            type:"bar",
            x: n,
            y: bn,
            marker: {
                color:'rgb(60,120,180)',
                opacity: 0.7
            },

    },
    ];
    return data;
}

// plot the bar charts to visualize the amplitude of alpha_n
function plot_alpha(){
    var N = parseFloat(document.getElementById('NController').value);

    [n, an, bn, alpha_n, theta_n] = coefficient(N);

    var data =
    [{
            type:"bar",
            x: n,
            y: alpha_n,
            marker: {
                color:'rgb(200,100,0)',
                opacity: 0.7
            },

    },
    ];
    return data;
}


// plot the bar charts to visualize the amplitude of theta_n
function plot_theta(){
    var N = parseFloat(document.getElementById('NController').value);

    [n, an, bn, alpha_n, theta_n] = coefficient(N);

    var data =
    [{
            type:"bar",
            x: n,
            y: theta_n,
            marker: {
                color:'rgb(0,100,200)',
                opacity: 0.7
            },

    },
    ];
    return data;
}

function plot_decision1(label){
    if (label==="a&b"){
        data = plot_an();
    } else {
        data = plot_alpha();
    }
    return data;
}

function plot_decision2(coefficient){
    if (label==="a&b"){
        data = plot_bn();
    } else {
        data = plot_theta();
    }
    return data;
}
// End. To plot out the amplitude of each term in the Fourier Series.
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
    var href = $('ul.tab-nav li a.active.button').attr('href'); // finds out which tab is active
    var selectedValue = document.getElementById("Select").value; // finds out which function is active
    if (href==="#spectrum"){
        initFourier(href);
    } else if (href==="#combine"){
        initFourier(href);
    }  else if (href==="#maths" && selectedValue==="triangular"){
    // in this case, only the triangular math part2 would have displayed the graph
    // because there's no sliders for other functions
            data = plot_triangle_sine();
            data2 = plot_combination();
            Plotly.animate(
                'graph3',
                {data:data},
                {
                    fromcurrent:true,
                    transition: {duration:0,},
                    frame: {duration:0, redraw: false},
                    mode:"afterall"
                }
            );
            Plotly.animate(
                'graph4',
                {data:data2},
                {
                    fromcurrent: true,
                    transition: {duration: 0,},
                    frame:{duration:0, redraw: false,},
                    mode: "afterall"
                }
            );
    } else {
        if (href==="#plot"){
            data = computePlot(z);
    } else if (href==="#component"){
            data = computeComponents(z);
            initFourier(href);
    }else if (href==="#derivation2"){
        data = computePlot(z);
    } else if (href==="#combine"){
        initFourier(href);
        data = computePlot(z);
    }

    console.log(data);
    console.log(href);

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
    );}
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

            initFourier(href); //re-initialise when tab is changed
            return false;
        });
    });

    // hide the sliders in Math part
    $('ul.tab-nav li a.button').click(function(){
        var href = $(this).attr('href');
        if (href === "#maths" || href === "#derivation2"){
            $('.allSliders').hide();
            //document.getElementsByClassName('allSliders')[0].style.visibility='hidden';
        } else {
            $('.allSliders').show();
            //document.getElementsByClassName('allSliders')[0].style.visibility='visible';
        }
    })

    // graph3 and graph4 have smaller sizes than graph and graph2
    // graph3 and graph4 are adjusted so that users can visualize both without the need to scroll down
    $('ul.tab-nav li a.button').click(function(){
        var href = $(this).attr('href');
        var selectedValue = document.getElementById("Select").value; // finds out which function is active
        // graph3 and graph4 are smaller graphs
        // so users are able to visualize two graphs at the same time without scrolling down
        if (href === '#combine' || href=== '#spectrum' || href==="#derivation"){
            $("#graph").hide();
            $("#graph2").hide();
            $("#graph3").show();
            $("#graph4").show();
            console.log("showing graphs");
        } else {
            $("#graph").show();
            $("#graph2").show();
            $("#graph3").hide();
            $("#graph4").hide();

            //document.getElementsByClassName('I-define')[0].style.visibility = 'shown';
        }

    });

    // to select either a_n and b_n or alpha_n and theta_n in the power spectrum tab
    $('#Coefficient').change(function(){
        var selectedValue = document.getElementById("Coefficient").value;
        if (selectedValue==="an&bn"){
            label = "a&b";
            title1="Amplitude of a_n";
            title2="Amplitude of b_n"
            console.log("selected an and bn");
        } else if (selectedValue==="powerSpectrum"){
            label = "alpha&theta";
            console.log("selected alpha and theta");
            title1="Amplitude of α_n";
            title2="Amplitude of θ_n"
        }
        var href = $('ul.tab-nav li a.active.button').attr('href');
        initFourier(href);
    })

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

        $(".derivation").hide();
        $("#"+selectedValue).show();
        $(".title").hide();
        $("#"+selectedValue+"Title").show();

        // we have three math tabs in the triangular Math tabs
        // so we have to clear all the active pane everytime we select a new functions from scroll down
        $('.tab-pane.active').removeClass('active');
        var href = $('ul.tab-nav li a.active.button').attr('href');
        $(href).addClass('active');


        // make sure that when you change the function from the scroll down
        // the sliders vanished in the math part
        if (selectedValue!="triangular" && href==="#maths"){
            $(".allSliders").hide();
        }
        initFourier(href);
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
    initFourier("#maths");
}
$(document).ready(main); //Load main when document is ready.
