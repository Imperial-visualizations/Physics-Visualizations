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



function initPlot() {
    Plotly.purge("graph");

    //x slider controls the "size" parameter (height) of the sphere
    $("#xController").val(initialX);
    $("#xControllerDisplay").text(initialX);
    var x = parseFloat(document.getElementById('xController').value);

    //y slider controls the wave number(shape) of the sphere
    $("#yController").val(initialY);
    $("#yControllerDisplay").text(initialY);
    var y = parseFloat(document.getElementById('yController').value);

    //initial plot with slider
    var data = [];

    var pringles = new Pringles(4, [1,1,1]);
    var cirface = new Sphere(4)

    data = data.concat(cirface.gObject(blue, white, 7,"solid", x,1,y))
    data = data.concat(pringles.gObject(black, 7, "solid",1,y));


    Plotly.newPlot("graph", data, layout);
    return;
}

//animation
function updatePlot() {
    var data1 = [];
    var x = parseFloat(document.getElementById('xController').value);
    var y = parseFloat(document.getElementById('yController').value);
    var cirface = new Sphere(4)
    data1 = data1.concat(cirface.gObject(blue, blue, 7,"solid", x,1,y))
    var pringles = new Pringles(4, [1,1,1]);
    data1 = data1.concat(pringles.gObject(black, 7, "solid",1,y));



    var frames = [], data;

    //H is a set of height of the sphere
    var step1 = numeric.linspace(0, x, 20)
    H = step1.reverse()


    //frames
    for (i=0; i<20; ++i){
        if (i<19){
            data = [];
            var cirface = new Sphere(4)
            data = data.concat(cirface.gObject(blue, blue, 7,"solid", H[i],1,y))
            var pringles = new Pringles(4, [1,1,1]);
            data = data.concat(pringles.gObject(black, 7, "solid", 1,y))

        }else{
            //get rid of the sphere surface for the last frame
            //have to push some empty objects to match the length of frames
            data = [];
            var pringles = new Pringles(4, [1,1,1]);
            data = data.concat(pringles.gObject(black, 7, "solid", 1,y,1));
            data.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            lines: {width:0}
            });
            data.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            lines: {width:0}
            });
            data.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            lines: {width:0}
            })
        }

        frames.push({data: data});
    }

    //load slider
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
    //load animation
    initAnimation("animate", frames, [], layout, 10, [0,20], true)
}

//load main
function main() {

    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            updatePlot();
        });

    });

    initPlot();
    updatePlot();
   $("input[type=submit]").click(function () {
        startAnimation();
    });
   initGuidance(["graph", "ani", "slider1", "slider2", "text", "graph"]);
}
$(document).ready(main); //Load main when document is ready.