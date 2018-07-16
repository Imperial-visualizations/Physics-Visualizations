//Global Initial Parameters:
const initialPoint = [1, 1];
const layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [0, 7], zeroline: true, title: "x"},
    yaxis: {range: [-6, 6], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
var currentPoint = initialPoint;
var initX = 0, initY = 0;
var z = numeric.linspace(0,2*Math.PI,1000);
// 0 is triangular, 1 is square, 2 is sawtooth, 3 is delta's,
var shape = 2;
var decay = 0.9;


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

    const new_layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [0, 7], zeroline: true, title: "x"},
    yaxis: {range: [0, A*N*3], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
    return new_layout;
}

function adding(array){
    var result = 0
    for(var i =0; i<array.length; ++i){
        result+=array[i];
    }
    console.log ('the Final result is '+result);
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

    for (var i = 0; i < x.length ; ++i){
        y_values.push(summation(x[i]));
        x_values.push(x[i]);
    }

    var data=[
        {
            type:"scatter",
            mode:"lines",
            x: x_values,
            y: y_values,
            line:{color:"rgb(0,225,0)", width:3, dash: "dashed"},
        },
    ];
    return data;


}

function selection2(n,A,type){
    if (type===0){
        amplitude = (A*(-1)**n)*(decay)**n; // (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))
    } else if (type===1){
        amplitude = (A*(1-(-1)**n))*(decay)**n; // A/(n*np.pi) *(1-(-1)**n)
    } else if (type===2){
        amplitude = (A*(-1)**(n+1))*(decay)**n;  //  2*A*(-1)**(n+1) /(n*np.pi)
    }
    return amplitude;
}

function plotSines(n,x,shape){

    var N = parseFloat(document.getElementById('NController').value);
    var L = parseFloat(document.getElementById('LController').value);
    var A = parseFloat(document.getElementById('AController').value);

    var x_n = [];
    var y_n = [];
    spacing = 2*A;

    for (var i = 0; i < x.length ; ++i){
        x_n.push(x[i]);
        y_n.push((selection2(n,A,shape))*Math.sin(n*Math.PI*x[i]/L)+spacing*n);
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

    //The First Initialisation - I use 's' rather than 'z' :p
    initCarte("#maths");
}
$(document).ready(main); //Load main when document is ready.