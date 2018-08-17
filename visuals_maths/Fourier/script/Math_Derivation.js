
var resolution = 2000;
// set the step of the x axis from -2pi to 2pi
var z = numeric.linspace(-2*Math.PI,2*Math.PI,resolution);

// initialize the Cartesian coordinates for the plots and the functions
function initFourier(type) {
    Plotly.purge("graph3");
    Plotly.purge("graph4");
    var selectedValue = document.getElementById("Select").value;

    if (selectedValue==="triangular"){
        Plotly.newPlot("graph3", plot_triangle_sine(),setLayoutSmall("Sines Function and Triangle Function"));
        Plotly.newPlot("graph4",plot_combination(),setLayoutSmall("Multiplication of the two Functions"));
        console.log("graph 3 and graph 4");
        }
    return;
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


/** updates the plot according to the slider controls. */
// Plotly.animate does not support bar charts, so need to reinitialize the Cartesian every time.
function updatePlot() {
    // NB: updates according to the active tab
    var selectedValue = document.getElementById("Select").value; // finds out which function is active
    if (selectedValue==="triangular"){
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
    }
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

        if (selectedValue!="triangular"){
            $('.tab-pane.active').removeClass('active');
            $('#maths').addClass('active');
        }

    })
    initGuidance(["heading", "scroll","maths"]);
}
$(document).ready(main); //Load main when document is ready.