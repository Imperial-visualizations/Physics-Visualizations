var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        xaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        yaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        zaxis: {range: [-6, 10], zeroline: true, autorange: false,},
        aspectratio: {x:1, y:1, z:1},
    }
};
var initialX = 1;
var isBlackText = false;
var blackTextType = "lines";

//Plots
function initPlot() {
    Plotly.purge("graph");

    $("#xController").val(initialX);
    $("#xControllerDisplay").text(initialX);
    var x = parseFloat(document.getElementById('xController').value);

    var data = [];

    var pringles = new Pringles(4, [1,1,1]);
    var square = new Square(6);
    var circle = new Circle(4);
    var cirface = new Sphere(4)

    data.push(cirface.gObject(blue, white, 7,"solid", x))
    data.push(square.gObject(lilac,black))
    data.push(pringles.gObject(black, 7, "solid",x));
    data.push(circle.gObject(orange))

    var arr1 = new Line([[-3,4,0],[-3,1,0]])
    data.push(arr1.arrowHead(magenta,5))
    var arr2 = new Line([[5,-2,0],[5,1,0]])
    data.push(arr2.arrowHead(magenta,5))

    Plotly.newPlot("graph", data, layout);
    return;
}


function updatePlot() {
    var data = [];
    var href = $('ul.tab-nav li a.active.button').attr('href'); // finds out which tab is active
    var x = parseFloat(document.getElementById('xController').value);
    var cirface = new Sphere(4)
    data.push(cirface.gObject(blue, blue, 7,"solid", x))
    var square = new Square(6);
    data.push(square.gObject())
    var pringles = new Pringles(4, [1,1,1]);
    var circle = new Circle(4);
    data.push(circle.gObject(orange))
    data.push(pringles.gObject(black, 7, "solid", 1x));
    var arr1 = new Line([[1,5,0],[-3,1,0]])
    data.push(arr1.arrowHead(magenta,5))
    var arr2 = new Line([[1,-3,0],[5,1,0]])
    data.push(arr2.arrowHead(magenta,5))
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
        var displayEl;
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );

            updatePlot(); //Updating the plot is linked with display (Just My preference)
        });

    });


    initPlot();

}
$(document).ready(main); //Load main when document is ready.