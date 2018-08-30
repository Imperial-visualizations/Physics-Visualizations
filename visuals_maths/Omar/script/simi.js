math.config({matrix:"Matrix"})
var axes = createAxes(4);
var layout = {
    width: 450, height: 450,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: {
            up: {x: 0, y: 0, z: 1},
            eye: {x: 1, y: 2, z: 0.5},
            center: {x: 0, y: 0, z: -0.15}
        },
        aspectratio: {x:1, y:1, z:1},
        xaxis: {range: [-9, 9], autorange: false, zeroline: true,},
        yaxis: {range: [-9, 9], autorange: false, zeroline: true,},
        zaxis: {range: [-9, 9], autorange: false, zeroline: true,},
    }
}
var isBlackText = false;
var blackTextType = "lines";

function computeFrames(frames){
    const
        x1 = parseFloat($("#x1Input").val()),
        y1 = parseFloat($("#y1Input").val()),
        z1 = parseFloat($("#z1Input").val()),
        x2 = parseFloat($("#x2Input").val()),
        y2 = parseFloat($("#y2Input").val()),
        z2 = parseFloat($("#z2Input").val()),
        x3 = parseFloat($("#x3Input").val()),
        y3 = parseFloat($("#y3Input").val()),
        z3 = parseFloat($("#z3Input").val());
        X1 = parseFloat($("#X1Input").val()),
        Y1 = parseFloat($("#Y1Input").val()),
        Z1 = parseFloat($("#Z1Input").val()),
        X2 = parseFloat($("#X2Input").val()),
        Y2 = parseFloat($("#Y2Input").val()),
        Z2 = parseFloat($("#Z2Input").val()),
        X3 = parseFloat($("#X3Input").val()),
        Y3 = parseFloat($("#Y3Input").val()),
        Z3 = parseFloat($("#Z3Input").val());
    var stops = [0];
    data = [];
    blank = {
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            lines: {width:0}
        }
    var vec1 = new Line([[0,0,0],[x1,y1,z1]]);
    var vec2 = new Line([[0,0,0],[x2,y2,z2]]);
    var vec3 = new Line([[0,0,0],[x3,y3,z3]]);
    data.push(vec1.gObject(magenta,5));
    data.push(vec1.arrowHead(magenta,5));
    data.push(vec2.gObject(magenta,5));
    data.push(vec2.arrowHead(magenta,5));
    data.push(vec3.gObject(magenta,5));
    data.push(vec3.arrowHead(magenta,5));
    data.push(blank)
    frames.push({data: data});
    stops.push(frames.length - 1);

    data = [];
    data.push({
        type: "mesh3d",
        x: [0, x1, x1+x2, x2, x3, x1+x3, x1+x2+x3, x2+x3],
        y: [0, y1, y1+y2, y2, y3, y1+y3, y1+y2+y3, y2+y3],
        z: [0, z1, z1+z2, z2, z3, z1+z3, z1+z2+z3, z2+z3],
        i : [0, 0, 3, 4, 4, 4, 4, 4, 5, 6, 6, 7],
        j : [2, 3, 4, 3, 6, 7, 1, 5, 2, 2, 7, 3],
        k : [1, 2, 0, 7, 5, 6, 0, 1, 1, 5, 2, 2],
        opacity: 0.5,
        colorscale: [['0', blue], ['1', "rgb(255,255,255)"]],
        intensity: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
        showscale: false
    })


    data.push(vec1.gObject(magenta,5));
    data.push(vec1.arrowHead(magenta,5));
    data.push(vec2.gObject(magenta,5));
    data.push(vec2.arrowHead(magenta,5));
    data.push(vec3.gObject(magenta,5));
    data.push(vec3.arrowHead(magenta,5));
    frames.push({data: data});
    stops.push(frames.length - 1);

    var matrixA = math.matrix([[x1,y1,z1],[x2,y2,z2],[x3,y3,z3]])
    var matrixS = math.matrix([[X1,Y1,Z1],[X2,Y2,Z2],[X3,Y3,Z3]])
    var matrixSS = math.inv(matrixS)
    var new_matrix = math.multiply(matrixSS, math.multiply(matrixA, matrixS))
    var a = new_matrix._data

    a1= math.round((a[0][0])*100)/100
    b1= math.round((a[0][1])*100)/100
    c1= math.round((a[0][2])*100)/100
    a2= math.round((a[1][0])*100)/100
    b2= math.round((a[1][1])*100)/100
    c2= math.round((a[1][2])*100)/100
    a3= math.round((a[2][0])*100)/100
    b3= math.round((a[2][1])*100)/100
    c3= math.round((a[2][2])*100)/100
    data = [];
    var new_vec1 = new Line([[0,0,0],[a1,b1,c1]])
    var new_vec2 = new Line([[0,0,0],[a2,b2,c2]])
    var new_vec3 = new Line([[0,0,0],[a3,b3,c3]])



    data.push(new_vec1.gObject(green,5))
    data.push(new_vec1.arrowHead(green,5))
    data.push(new_vec2.gObject(green,5))
    data.push(new_vec2.arrowHead(green,5))
    data.push(new_vec3.gObject(green,5))
    data.push(new_vec3.arrowHead(green,5))
    data.push(blank)
    frames.push({data: data});
    stops.push(frames.length - 1);

    data = [];
    data.push({
        type: "mesh3d",
        x: [0, a1, a1+a2, a2, a3, a1+a3, a1+a2+a3,a2+a3],
        y: [0, b1, b1+b2, b2, b3, b1+b3, b1+b2+b3,b2+b3],
        z: [0, c1, c1+c2, c2, c3, c1+c3, c1+c2+c3,c2+c3],
        i : [0, 0, 3, 4, 4, 4, 4, 4, 5, 6, 6, 7],
        j : [2, 3, 4, 3, 6, 7, 1, 5, 2, 2, 7, 3],
        k : [1, 2, 0, 7, 5, 6, 0, 1, 1, 5, 2, 2],
        opacity: 0.5,
        colorscale: [
     [0, 'rgb(255, 0, 0)'],
     [0.5, 'rgb(0, 255, 125)'],
     [1, 'rgb(0, 0, 255)']
   ],
        intensity: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
        showscale: false
    })
    data.push(new_vec1.gObject(green,5))
    data.push(new_vec1.arrowHead(green,5))
    data.push(new_vec2.gObject(green,5))
    data.push(new_vec2.arrowHead(green,5))
    data.push(new_vec3.gObject(green,5))
    data.push(new_vec3.arrowHead(green,5))
    frames.push({data: data});



    stops.push(frames.length - 1);

    return stops;



}

function initPlot(){
    Plotly.purge("graph");
    var frames = [],
        extra = [];

    var stops = computeFrames(frames, extra);

    console.log(stops);
    $("#animateSlider").attr("max", frames.length - 1);
    initAnimation("animate", frames, [], layout, 100, stops, true);
    return;
}

function main() {
    $("input[type=range]").each(function () {
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            historyPlot(parseFloat($(this).val()));
        });
    });

    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');
            return false;
        });
    });

    $("input[type=box]").each(function () {
        $(this).on('keyup',function () {
            if(event.keyCode == 13) {
                let n = $(this).val();
                if( n.match(/^-?\d*(\.\d+)?$/) && !isNaN(parseFloat(n)) ){
                    $("#"+$(this).attr("id") + "Error").hide();
                    if( parseFloat(n) > 1 && parseFloat(n) < 8){
                        initPlot();
                    } else{
                        $("#"+$(this).attr("id") + "Error").text("Invalid input: min = 1, max = 7");
                        $("#"+$(this).attr("id") + "Error").show();
                    }
                }
                else{
                    $("#"+$(this).attr("id") + "Error").text("Invalid input: the input needs to be a number");
                    $("#"+$(this).attr("id") + "Error").show();
                }
            }
        });
    });

    $("input[type=submit]").click(function () {
        var idName = $(this).attr("id");
        console.log("animating")
        startAnimation();
    });

    $("input[type=button]").click(function () {
        var idName = $(this).attr("id");
        initPlot();
        console.log("button")
    });

    initPlot();
}
$(document).ready(main);
