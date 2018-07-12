//Global Initial Parameters:
const initialPoint = [1, 1];
const layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-7, 7], zeroline: true, title: "x"},
    yaxis: {range: [-6, 6], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
var currentPoint = initialPoint;
var defaultHref = window.location.href;
var initX = 0, initY = 0;
var z = numeric.linspace(-2*Math.PI,2*Math.PI,1000);
// 0 is triangular, 1 is square, 2 is sawtooth, 3 is delta's, 4 is parabola, 5 is x, 6 is |x|,
var shape = 4;
var decay = 0.9;
var decay2 = 0.6;


//Plot
/**
 * Resets and plots initial area element or basis vectors of 2D Cartesian.
 * @param {string} type - basis vectors or area element
 */
function initCarte(type) {
    Plotly.purge("graph");

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);


    if (type === "#maths"){
        Plotly.newPlot("graph", computePlot(z), layout);
    } else if (type === "#plot"){
        Plotly.newPlot("graph", computePlot(z), layout);
    } else if (type ==="#component"){
        Plotly.newPlot("graph", computeComponents(z), setLayout());
    }
    return;
}


/* set the layout of the graph to adjust for different amplitudes and different number of terms involved
it changes the range of the y-axis according to the amplitude and number of therms
*/
function setLayout(){
    var N = parseFloat(document.getElementById('NController').value);
    var A = parseFloat(document.getElementById('AController').value);
    var L = parseFloat(document.getElementById('LController').value);

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

function adding(array){
    var result = 0
    for(var i =0; i<array.length; ++i){
        result+=array[i];
    }
    return result;
}

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

    var data=[
        {
            type:"scatter",
            mode:"lines",
            x: x_values,
            y: y_values_cheat,
            line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
        },
    ];
    return data;


}

function odd_selection2(n,A,L,type){
    if (type===0){
        amplitude = (A*(-1)**n)*(decay)**n; // (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))
    } else if (type===1){
        amplitude = (A*(1-(-1)**n))*(decay)**n; // A/(n*np.pi) *(1-(-1)**n)
    } else if (type===2){
        amplitude = (A*(-1)**(n+1))*(decay)**n;  //  2*A*(-1)**(n+1) /(n*np.pi)
    } else if (type===3){
        amplitude = 1/L;
    } else if (type===4){
        amplitude = A*((-1)**n)*decay**n;  // (((4*L**2)/(n*Math.PI)**2)*(-1)**n)
    } else if (type===5){
        amplitude = 0.5*A*(2*(-1)**(n+1)*decay**n); //A*(2*L/(n*Math.PI)*(-1)**(n+1)
    } else if (type===6){
        amplitude = 0;
    }
    return amplitude;
}

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

function plotSines(n,x,shape){

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var x_n = [];
    var y_n = [];
    var spacing=A;


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
    if (href==="#plot"){
        data = computePlot(z);
    } else if (href==="#component"){
        initCarte(href);
        data = computeComponents(z);
    }


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

    //The First Initialisation - I use 's' rather than 'z' :p
    initCarte("#maths");
}
$(document).ready(main); //Load main when document is ready.