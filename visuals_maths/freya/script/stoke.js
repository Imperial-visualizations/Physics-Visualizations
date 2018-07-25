var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: createView([1,1,1]),
        xaxis: {range: [-3, 3], zeroline: true, autorange: false,},
        yaxis: {range: [-3, 3], zeroline: true, autorange: false,},
        zaxis: {range: [-1, 3], zeroline: true, autorange: false,},
        aspectratio: {x:1, y:1, z:1},
    }
};

var initialA = 0;
var isBlackText = false;
var blackTextType = "lines";



//Plot
/**s
 * Resets and plots initial area element or basis vectors of plane polar.
 * @param {string} type - basis vectors or area element
 */
function plotData() {
    Plotly.purge("graph");
    $("#aController").val(initialA);
    $("#aControllerDisplay").text(initialA);
    var a = parseFloat(document.getElementById('aController').value);
    Plotly.newPlot("graph", initCube(a), layout);

    return;
    }
function initCube(a){
    shape=[]

    cube = new Cuboid(2,2,a);
    var freya = cube.gObject(cyan);
    console.log(freya.z);
    shape.push(cube.gObject(cyan));
    edge1 = new Line([[2,2,a],[2,2,0]]);
    shape.push(edge1.gObject(black,7));
    edge2 = new Line([[2,-2,a],[2,2,a]]);
    shape.push(edge2.gObject(black,7));
    edge3 = new Line([[-2,2,a],[2,2,a]]);
    shape.push(edge3.gObject(black,7));
    edge4 = new Line([[-2,-2,0],[2,-2,0]]);
    shape.push(edge4.gObject(black,7));
    arr1 = new Line([[-4,-2,0],[0,-2,0]]);
    shape.push(arr1.arrowHead(magenta,7))
    edge5 = new Line([[-2,-2,a],[-2,-2,0]]);
    shape.push(edge5.gObject(black,7));
    edge6 = new Line([[-2,2,0],[-2,-2,0]]);
    shape.push(edge6.gObject(black,7));
    arr2 = new Line([[2,-4,0],[2,0,0]]);
    shape.push(arr2.arrowHead(magenta,7));
    arr3 = new Line([[4,2,0],[0,2,0]]);
    shape.push(arr3.arrowHead(magenta,7));
    arr4 = new Line([[-2,4,0],[-2,0,0]]);
    shape.push(arr4.arrowHead(magenta,7));
    edge7 = new Line([[2,-2,a],[2,-2,0]]);
    shape.push(edge7.gObject(black,7));
    edge8 = new Line([[2,-2,0],[2,2,0]]);
    shape.push(edge8.gObject(black,7));
    edge9 = new Line([[2,2,0],[-2,2,0]]);
    shape.push(edge9.gObject(black,7));
    edge10 = new Line([[-2,2,0],[-2,2,a]]);
    shape.push(edge10.gObject(black,7));
    edge11 = new Line([[-2,2,a],[-2,-2,a]]);
    shape.push(edge11.gObject(black,7));
    edge12 = new Line([[-2,-2,a],[2,-2,a]]);
    shape.push(edge12.gObject(black,7));
    squash = new Square(2)
    shape.push(squash.gObject(orange,magenta))

    return shape

}
function updatePlot() {
    var data = [];
    var href = $('ul.tab-nav li a.active.button').attr('href'); // finds out which tab is active
    var a = parseFloat(document.getElementById('aController').value);
    data = initCube(a);


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


    plotData();

}
$(document).ready(main); //Load main when document is ready.