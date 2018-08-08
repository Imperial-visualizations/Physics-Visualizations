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
        xaxis: {range: [-20, 20], autorange: false, zeroline: true,},
        yaxis: {range: [-20, 20], autorange: false, zeroline: true,},
        zaxis: {range: [-20, 20], autorange: false, zeroline: true,},
    }
}
var isBlackText = false;
var blackTextType = "lines";

function computeFrames(frames, extra){
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
    //original vector
    var Vec = new Line([[0,0,0],[x1+x2+x3,y1+y2+y3,z1+z2+z3]]);


    var vec1 = new Line([[0,0,0],[x1,y1,z1]]);
    var vec2 = new Line([[0,0,0],[x2,y2,z2]]);
    var vec3 = new Line([[0,0,0],[x3,y3,z3]]);
    extra.push(Vec.gObject(black,5));
    extra.push(Vec.arrowHead(black,5));
    extra.push(vec1.gObject(magenta,5));
    extra.push(vec1.arrowHead(magenta,5));
    extra.push(vec2.gObject(magenta,5));
    extra.push(vec2.arrowHead(magenta,5));
    extra.push(vec3.gObject(magenta,5));
    extra.push(vec3.arrowHead(magenta,5));






    //new coord
    var new_x = new Line([[0,0,0],[10*X1,10*Y1,10*Z1]]);
    var new_y = new Line([[0,0,0],[10*X2,10*Y2,10*Z2]]);
    var new_z = new Line([[0,0,0],[10*X3,10*Y3,10*Z3]]);
    extra.push(new_x.gObject(orange,3));
    extra.push(new_y.gObject(orange,3));
    extra.push(new_z.gObject(orange,3));
    //matrix
    var matrixA = math.matrix([[x1,y1,z1],[x2,y2,z2],[x3,y3,z3]])
    var matrixS = math.matrix([[X1,Y1,Z1],[X2,Y2,Z2],[X3,Y3,Z3]])
    var matrixSS = math.inv(matrixS)
    var new_matrix = math.multiply(matrixSS, math.multiply(matrixA, matrixS))
    var a = new_matrix._data
    console.log(a)



    data = [];
    var new_vec1 = new Line([[0,0,0],[a[0][0],a[0][1],a[0][2]]])
    var new_vec2 = new Line([[0,0,0],[a[1][0],a[1][1],a[1][2]]])
    var new_vec3 = new Line([[0,0,0],[a[2][0],a[2][1],a[2][2]]])



    data.push(new_vec1.gObject(green,5))
    data.push(new_vec1.arrowHead(green,5))
    data.push(new_vec2.gObject(green,5))
    data.push(new_vec2.arrowHead(green,5))
    data.push(new_vec3.gObject(green,5))
    data.push(new_vec3.arrowHead(green,5))
/*
    var magVec1 = Math.sqrt(X1*X1+Y1*Y1+Z1*Z1)
    var magVec2 = Math.sqrt(X2*X2+Y2*Y2+Z2*Z2)
    var magVec3 = Math.sqrt(X3*X3+Y3*Y3+Z3*Z3)

    var magvec1 = Math.sqrt(x1*x1+y1*y1+z1*z1)
    var magvec2 = Math.sqrt(x2*x2+y2*y2+z2*z2)
    var magvec3 = Math.sqrt(x3*x3+y3*y3+z3*z3)


    data = [];

    var dotPro1 = (x1*X1+y1*Y1+z1*Z1)/(magVec1*magvec1)
    var dotPro2 = (x2*X1+y2*Y1+z2*Z1)/(magVec1*magvec2)
    var dotPro3 = (x3*X1+y3*Y1+z3*Z1)/(magVec1*magvec3)
    var dotPro11 = (x1*X2+y1*Y2+z1*Z2)/(magVec2*magvec1)
    var dotPro22 = (x2*X2+y2*Y2+z2*Z2)/(magVec2*magvec2)
    var dotPro33 = (x3*X2+y3*Y2+z3*Z2)/(magVec2*magvec2)
    var dotPro111 = (x1*X3+y1*Y3+z1*Z3)/(magVec3*magvec1)
    var dotPro222 = (x2*X3+y2*Y3+z2*Z3)/(magVec3*magvec2)
    var dotPro333 = (x3*X3+y3*Y3+z3*Z3)/(magVec3*magvec3)

    var Project1 = new Line([[0,0,0],[X1*dotPro1,Y1*dotPro1,Z1*dotPro1]])
    var Dot1 = new Line([[x1,y1,z1],[X1*dotPro1,Y1*dotPro1,Z1*dotPro1]])
    data.push(Dot1.gObject(green,3,"dot"))
    data.push(Project1.gObject(green,5))
    data.push(Project1.arrowHead(green,5))



    var Project11 = new Line([[0,0,0],[X2*dotPro11,Y2*dotPro11,Z2*dotPro11]])
    var Dot11 = new Line([[x1,y1,z1],[X2*dotPro11,Y2*dotPro11,Z2*dotPro11]])
    data.push(Dot11.gObject(green,3,"dot"))
    data.push(Project11.gObject(green,5))
    data.push(Project11.arrowHead(green,5))


    var Project111 = new Line([[0,0,0],[X3*dotPro111,Y3*dotPro111,Z3*dotPro111]])
    var Dot111 = new Line([[x1,y1,z1],[X3*dotPro111,Y3*dotPro111,Z3*dotPro111]])
    data.push(Dot111.gObject(green,3,"dot"))
    data.push(Project111.gObject(green,5))
    data.push(Project111.arrowHead(green,5))




    var Project2 = new Line([[0,0,0],[X1*dotPro2,Y1*dotPro2,Z1*dotPro2]])
    var Dot2 = new Line([[x2,y2,z2],[X1*dotPro2,Y1*dotPro2,Z1*dotPro2]])
    data.push(Dot2.gObject(blue,3,"dot"))
    data.push(Project2.gObject(blue,5))
    data.push(Project2.arrowHead(blue,5))



    var Project22 = new Line([[0,0,0],[X2*dotPro22,Y2*dotPro22,Z2*dotPro22]])
    var Dot22 = new Line([[x2,y2,z2],[X2*dotPro22,Y2*dotPro22,Z2*dotPro22]])
    data.push(Dot22.gObject(blue,3,"dot"))
    data.push(Project22.gObject(blue,5))
    data.push(Project22.arrowHead(blue,5))


    var Project222 = new Line([[0,0,0],[X3*dotPro222,Y3*dotPro222,Z3*dotPro222]])
    var Dot222 = new Line([[x2,y2,z2],[X3*dotPro222,Y3*dotPro222,Z3*dotPro222]])
    data.push(Dot111.gObject(blue,3,"dot"))
    data.push(Project111.gObject(blue,5))
    data.push(Project111.arrowHead(blue,5))


    var Project3 = new Line([[0,0,0],[X1*dotPro3,Y1*dotPro3,Z1*dotPro3]])
    var Dot3 = new Line([[x3,y3,z3],[X3*dotPro3,Y1*dotPro3,Z1*dotPro3]])
    data.push(Dot1.gObject(green,3,"dot"))
    data.push(Project1.gObject(green,5))
    data.push(Project1.arrowHead(green,5))



    var Project33 = new Line([[0,0,0],[X2*dotPro33,Y2*dotPro33,Z2*dotPro33]])
    var Dot33 = new Line([[x3,y3,z3],[X2*dotPro33,Y2*dotPro33,Z2*dotPro33]])
    data.push(Dot33.gObject(orange,3,"dot"))
    data.push(Project33.gObject(orange,5))
    data.push(Project33.arrowHead(orange,5))


    var Project333 = new Line([[0,0,0],[X3*dotPro333,Y3*dotPro333,Z3*dotPro333]])
    var Dot333 = new Line([[x3,y3,z3],[X3*dotPro333,Y3*dotPro333,Z3*dotPro333]])
    data.push(Dot333.gObject(orange,3,"dot"))
    data.push(Project333.gObject(orange,5))
    data.push(Project333.arrowHead(orange,5))
*/
    frames.push({data: data});

    stops.push(frames.length - 1);
    console.log()

    return stops;
}

function initPlot(){
    Plotly.purge("graph");
    var frames = [],
        extra = [];

    var stops = computeFrames(frames, extra);


    $("#animateSlider").attr("max", frames.length - 1);
    initAnimation("animate", frames, extra, layout, 10, stops, true);
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
