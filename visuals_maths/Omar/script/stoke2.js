var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        xaxis: {range: [-4, 6], zeroline: true, autorange: false,},
        yaxis: {range: [-4, 6], zeroline: true, autorange: false,},
        zaxis: {range: [-6, 10], zeroline: true, autorange: false,},
        aspectratio: {x:1, y:1, z:1},
    }
};
var initialX = 2;
var initialY = 2;
var isBlackText = false;
var blackTextType = "lines";

function blank(data1, number){
    for (var i=0; i<number; ++i){
        data1.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            lines: {width:0}
        })
    }
    return data1;
}

function initPlot() {
    Plotly.purge("graph");

    $("#xController").val(initialX);
    $("#xControllerDisplay").text(initialX);
    var x = parseFloat(document.getElementById('xController').value);
    
    $("#yController").val(initialY);
    $("#yControllerDisplay").text(initialY);
    var y = parseFloat(document.getElementById('yController').value);

    var data = [];

    var pringles = new Pringles(4, [1,1,1]);
    var cirface = new Sphere(4)

    data.push(cirface.gObject(blue, white, 7,"solid", x,1,y))
    data.push(pringles.gObject(black, 7, "solid",1,y));


    Plotly.newPlot("graph", data, layout);
    return;
}


function updatePlot() {
    var data1 = [];
    var x = parseFloat(document.getElementById('xController').value);
    var y = parseFloat(document.getElementById('yController').value);
    var square = new Square(6);
    data1.push(square.gObject(lilac,lilac))
    var cirface = new Sphere(4)
    data1.push(cirface.gObject(blue, blue, 7,"solid", x,1,y))
    var pringles = new Pringles(4, [1,1,1]);
    data1.push(pringles.gObject(black, 7, "solid",1,y));



    var frames = [], data;

    var step1 = numeric.linspace(0, x, 20)
    H = step1.reverse()

    var step2 = numeric.linspace(0, 1, 20)
    h = step2.reverse()


    for (i=0; i<20; ++i){
        data = [];
        var square = new Square(6);
        data.push(square.gObject(lilac,lilac))
        var cirface = new Sphere(4)
        data.push(cirface.gObject(blue, blue, 7,"solid", H[i],1,y))
        var pringles = new Pringles(4, [1,1,1]);
        data.push(pringles.gObject(black, 7, "solid", 1,y))
        data = blank(data,2)
        frames.push({data: data});
    }
    for (i=0; i<19; ++i){
        data = [];
        var square = new Square(6);
        data.push(square.gObject(lilac,lilac))
        var pringles = new Pringles(4, [1,1,1]);
        data.push(pringles.gObject(black, 7, "solid", h[i],y))
        data = blank(data,2)
        frames.push({data: data});
    }

    data = [];
    var square = new Square(6);
    data.push(square.gObject(lilac,lilac))
    var pringles = new Pringles(4, [1,1,1]);
    data.push(pringles.gObject(black, 7, "solid", 0,y))
    var circle = new Circle(4);
    data.push(circle.gObject(orange))
    var arr1 = new Line([[1,5,0],[-3,1,0]])
    data.push(arr1.arrowHead(magenta,5))
    var arr2 = new Line([[1,-3,0],[5,1,0]])
    data.push(arr2.arrowHead(magenta,5))
    frames.push({data: data});

    Plotly.animate(
        'graph',
        {data: data1},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );

    initAnimation("animate", frames, [], layout, 10, [0,20], true)
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
    updatePlot();
   $("input[type=submit]").click(function () {
        startAnimation();
    });
}
$(document).ready(main); //Load main when document is ready.