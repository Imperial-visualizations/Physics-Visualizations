//Global Initial Parameters:
const initialPoint = [1, 1];
const layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5, 5], zeroline: true, title: "x"},
    yaxis: {range: [-5, 5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
var currentPoint = initialPoint;
var initX = 0, initY = 0;
var isBlackText = false;
// x̂x ŷ ẑ  x
//Plot
/**
 * Resets and plots initial area element or basis vectors of 2D Cartesian.
 * @param {string} type - basis vectors or area element
 */
function initCarte(type) {
    Plotly.purge("graph");
    initX = currentPoint[0];
    initY = currentPoint[1];
    console.log(3**2)
    /* ~Jquery
    1.  Assign initial/default x, y values to the sliders and slider displays.
    */

    $("#xController").val(initX);
    $("#xControllerDisplay").text(initX);
    $("#yController").val(initY);
    $("#yControllerDisplay").text(initY);

    /* ~Jquery
    2.  Declare and store the floating values from x/y- sliders.
        Hint:
            - use document.getElementById('idName').value
            - use parseFloat() to make sure you are getting floating points.
    */

    var x = parseFloat(document.getElementById('xController').value);
    var y = parseFloat(document.getElementById('yController').value);

    if (type === "#basis"){
        Plotly.newPlot("graph", computeBasis(x, y), layout);
    } else if (type === "#area"){
        Plotly.newPlot("graph", computeArea(x, y), layout);
    } else if (type === "#polar"){
        Plotly.newPlot("graph", computePolar(x, y), layout);
    }
    return;
}
/**
 * Computes the basis vectors.
 * @param {float} x - x value.
 * @param {float} y - y value.
 */
function computeBasis(x, y) {
    currentPoint = [x, y];

    rho = Math.sqrt(x**2+y**2);
    phi = Math.atan(x/y);
    console.log(phi);

    dx = 1
    dy = 1
    if (x<0 && y>0){
    dx=-dx;
    }else if (x>0 && y<0){
    dy=-dy;
    }else if (x<0 && y<0){
    dx=-dx;
    dy=-dy;
    }else{}

    //This is how we first declare objects
    xVector = new Line2d([[x, y], [x+dx, y]]);
    yVector = new Line2d([[x, y], [x, y+dy]]);

    /*
    3.  I have created new Rectangle Object for you in the objects.js, so do check it out.
        NB: Conventions: the name of the functions start with lower case/ Objects start with UPPER case.
        Create a 'new' rectangle using 'Rectangle' in the objects.js and name it 'dominic'.

        Only then uncomment the line in the graphic object named 'data' below.
    */

    var dominic = new Rectangle(x,y);

    var data = [
        {
            type: "scatter",
            mode: "lines+text",
            x: [x, x+dx/2, x+dx],
            y: [y, y, y],
            line: {color: orange, width: 3, dash: "solid"},
            text: ["", "X̂ ", ""],
            textfont: {color:black, size:16}
        },
        {
            type: "scatter",
            mode: "lines+text",
            x: [x, x, x],
            y: [y, y+dy/2, y+dy],
            line: {color: orange, width: 3, dash: "solid"},
            text: ["", "Ŷ ", ""],
            textfont: {color:black, size:16}
        },
        xVector.gObject(orange, 3),
        xVector.arrowHead(orange, 3),
        yVector.gObject(orange, 3),
        yVector.arrowHead(orange, 3),
        dominic.gObject(), //ONLY uncomment this line when task 3. is completed.
    ];

    return data;
}
/**
 * Computes the area element.
 * @param {float} x - x value.
 * @param {float} y - y value.
 */
function computeArea(x, y) {
    currentPoint = [x, y];

    var dx=0.5;
    var dy=0.5;
    if (x<0 && y>0){
    dx=-dx;
    } else if (x>0&& y<0){
    dy=-dy;
    } else if (x<0&& y<0){
    dx=-dx;
    dy=-dy;
    } else {}

    var data = [
        {
            type: "scatter",
            mode: "lines+text",
            x: [x, x+dx, x+2*dx],
            y: [y, y, y],
            line: {color: orange, width: 3, dash: "solid"},
            text: ["", "dx", ""],
            textfont: {color:orange, size:16}
        },
        {
            type: "scatter",
            mode: "lines+text",
            x: [x, x, x],
            y: [y, y+dy, y+2*dy],
            line: {color: lilac, width: 3, dash: "solid"},
            text: ["", "dy", ""],
            textfont: {color:lilac, size:16}
        },
        {
            type: "scatter",
            mode: "lines+text",
            x: [0, x/2, x],
            y: [0, y/2, y],
            line: {color: "rgb(0,0,0)", width: 2},
            text: ["", "ρ", ""],
            textfont: {color:black, size:15}
        },
        {
            type: "scatter",
            mode: "lines",
            x: [x,x+2*dx,x+2*dx,x,x],
            y: [y,y,y+2*dy,y+2*dy,y],
            line: {simplify: false, color: (213,0,50)},
            fill:'tonexty',
            opacity: 0.5
        }


        /*
        4.  By examining the Rectangle object, add graphic object of a unit square in this data 'list'.
            Hint: Look above, each graphic objects is contained in {}.
            NB: Above labellings are usually referred as Json format, but not important. - irony I know.
        */
    ];

    return data;
}

function computePolar (x, y){
    currentPoint = [x, y];

    rho = Math.sqrt(x**2+y**2);
    phi = Math.atan2(y,x);
    console.log(phi);

    rhoVector = new Line2d([[x,y],[x+Math.cos(phi),y+Math.sin(phi)]]);
    phiVector = new Line2d([[x,y],[x-Math.sin(phi),y+Math.cos(phi)]]);
    /*
    3.  I have created new Rectangle Object for you in the objects.js, so do check it out.
        NB: Conventions: the name of the functions start with lower case/ Objects start with UPPER case.
        Create a 'new' rectangle using 'Rectangle' in the objects.js and name it 'dominic'.

        Only then uncomment the line in the graphic object named 'data' below.
    */

    var circle = new Circle(rho);

    var data = [
 //ONLY uncomment this line when task 3. is completed.
        {
            type: "scatter",
            mode: "lines+text",
            x: [x, x+Math.cos(phi)/2, x+Math.cos(phi)],
            y: [y, y+Math.sin(phi)/2, y+Math.sin(phi)],
            line: {color: orange, width: 3, dash: "solid"},
            text: ["", "r", ""],
            textfont: {color:black, size:16}
        },
        {
            type: "scatter",
            mode: "lines+text",
            x: [x, x-Math.sin(phi)/2, x-Math.sin(phi)],
            y: [y, y+Math.cos(phi)/2, y+Math.cos(phi)],
            line: {color: orange, width: 3, dash: "solid"},
            text: ["", "ρ", ""],
            textfont: {color:black, size:16}
        },
        rhoVector.gObject(cyan, 2),
        rhoVector.arrowHead(cyan,2),
        phiVector.gObject(cyan,2),
        phiVector.arrowHead(cyan,2),

        circle.gObject()
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
    var x = parseFloat(document.getElementById('xController').value);
    var y = parseFloat(document.getElementById('yController').value);


    if (href === "#basis") {
        data = computeBasis(x, y);
    } else if (href === "#area") {
        data = computeArea(x, y);
    } else if (href === "#polar"){
        data = computePolar(x, y);
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
    initCarte("#basis");
}
$(document).ready(main); //Load main when document is ready.

/*
    6.  Your final task is revamp this visualisations. For example, you may:
            -   Add notes.
            -   Change the colour scheme (luckily no one in our group is colour blind).
            -   Change the div layouts.
            -   Add some new functionality.
        I, Dom, am the ultimate judge. If I like your revamping of the visualisation, then
        I will give you bonus points. (Max: 5)
*/