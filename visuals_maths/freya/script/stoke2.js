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
var initialX = 2;
var initialY = 1;
var isBlackText = false;
var blackTextType = "lines";

//Plots
function initPlot() {



    var data = [];


    var pringles = new Pringles(4, [1,1,1]);
    data.push(pringles.gObject(black, 7, "solid", 1))

    var cirface = new Sphere(4)
    data.push(cirface.gObject(blue, blue, 7,"solid", 2))

    Plotly.purge("graph");
    Plotly.newPlot("graph", data, layout);



    return;
}


function updatePlot() {
    var frames = [], data;

    var step1 = numeric.linspace(0, 2, 20)
    H = step1.reverse()

    var step2 = numeric.linspace(0, 1, 20)
    h = step2.reverse()


    for (i=0; i<20; ++i){
        data = [];
        var square = new Square(6);
        data.push(square.gObject(lilac,lilac))
        var circle = new Circle(4);
        data.push(circle.gObject(orange))
        var arr1 = new Line([[1,5,0],[-3,1,0]])
        data.push(arr1.arrowHead(magenta,5))
        var arr2 = new Line([[1,-3,0],[5,1,0]])
        data.push(arr2.arrowHead(magenta,5))
        var cirface = new Sphere(4)
        data.push(cirface.gObject(blue, blue, 7,"solid", H[i]))
        var pringles = new Pringles(4, [1,1,1]);
        data.push(pringles.gObject(black, 7, "solid", 1))
        frames.push({data: data});
    }
    for (i=0; i<20; ++i){
        data = [];
        var square = new Square(6);
        data.push(square.gObject(lilac,lilac))
        var circle = new Circle(4);
        data.push(circle.gObject(orange))
        var arr1 = new Line([[1,5,0],[-3,1,0]])
        data.push(arr1.arrowHead(magenta,5))
        var arr2 = new Line([[1,-3,0],[5,1,0]])
        data.push(arr2.arrowHead(magenta,5))
        var pringles = new Pringles(4, [1,1,1]);
        data.push(pringles.gObject(black, 7, "solid", h[i]))
        data.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            lines: {width:0}
        });
        frames.push({data: data});
    }

    initAnimation("animate", frames, [], layout, 10, [0,20], true)
}

function main() {

   updatePlot();

   $("input[type=submit]").click(function () {
        startAnimation();
    });

}
$(document).ready(main); //Load main when document is ready.