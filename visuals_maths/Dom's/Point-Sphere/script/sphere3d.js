//Global Initial Parameters:
var initialPoint = [-2., -2., 2.];
var historyPoint = [initialPoint];
var historyIndex = 0;
var historyCount = 0;
var historyLimit = 15;
var radius = 2*Math.sqrt(3);
var sphere = new Sphere(radius).gObject(cyan, white);
var axes = createAxes(4);
var animatePause = false;
var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: createView([1, 1, 1]),
        xaxis: {range: [-4, 4], zeroline: true, scaleratio: 1},
        yaxis: {range: [-4, 4], zeroline: true, scaleratio: 1},
        zaxis: {range: [-4, 4], zeroline: true, scaleratio: 1}
    }
}

//Transformation algorithms
function computeFrames(transformation, start, end, startPoint, frameSize) {
    var intermediate = numeric.linspace(start, end, frameSize);
    var traceLine = [startPoint];
    var frames =[];
    var newPoint;

    for (var i = 0, n = intermediate.length; i < n; ++i) {
        newPoint = math.multiply(transformation(intermediate[i]), startPoint);
        traceLine.push(newPoint);
        frames.push({
            data: [
                    {
                        x: [newPoint[0]],
                        y: [newPoint[1]],
                        z: [newPoint[2]]
                    },
                    new Line(traceLine).gObject(orange)
            ]
        })
    }
    historyIndex++;
    if(historyCount < historyLimit - 1) {
        historyCount++;
    }
    historyPoint[historyIndex % historyLimit] = newPoint;
    return frames;
}
function computeCompositeFrames(rotation1, rotation2, angle1, angle2, initialPoint, frameSize, color1, color2, symbol) {
    var intermediate1 = numeric.linspace(0.0, angle1, frameSize);
    var intermediate2 = numeric.linspace(0.0, angle2, frameSize);
    var trace1 = [initialPoint];
    var frames = [];

    for (var i = 0, n = intermediate1.length; i < n; ++i) {
        var newPoint = math.multiply(rotation1(intermediate1[i]), initialPoint);
        trace1.push(newPoint);
        var firstTrace = new Line(trace1);
        frames.push(
            [
                new Point(newPoint).gObject("rgb(22,20,128)", symbol),
                firstTrace.gObject(color1),
                new Line([[0., 0., 0.], [0., 0., 0.]]).gObject()
            ]
        );
    }
    var trace2 = [newPoint];
    for (var i = 1, n = intermediate2.length; i < n; ++i) {
        var newPoint2 = math.multiply(rotation2(intermediate2[i]), newPoint);
        trace2.push(newPoint2);
        frames.push(
            [
                new Point(newPoint2).gObject("rgb(22,20,128)", symbol),
                new Line(trace2).gObject(color2),
                firstTrace.gObject(color1.slice(0, -1) + ",0.7)")
            ]
        );
    }
    return frames;
}
function computeCommute(rotation1, rotation2, theta1, theta2, frameSize) {
    var frameList1 = computeCompositeFrames(
        rotation1, rotation2,
        theta1, theta2,
        initialPoint, frameSize,
        "rgb(255,0,0)", "rgb(0,0,255)", "circle"
    );

    var frameList2 = computeCompositeFrames(
        rotation2, rotation1,
        theta2, theta1,
        initialPoint, frameSize,
        "rgb(0,0,255)", "rgb(255,0,0)", "square"
    );

    var frames = [];
    for (var i = 0; i < frameList1.length; ++i) {
        frames.push({
            data: [
                frameList1[i][0], frameList1[i][1], frameList1[i][2],
                frameList2[i][0], frameList2[i][1], frameList2[i][2]
            ],
            name: i
        })
    }

    var steps=[]
    for (var i = 0; i < frameSize; ++i) {
        steps.push({
            label: "R1",
            method: "animate",
            args: [
                    [i],
                    {
                        mode: "immediate",
                        transition: {duration: 300},
                        frame: {duration: 300, redraw: false}
                    }
            ]
        })
    }

    for (var i = 0; i < frameSize - 1; ++i) {
        steps.push({
            label: "R2",
            method: "animate",
            args: [
                    [i + frameSize],
                    {
                        mode: "immediate",
                        transition: {duration: 300},
                        frame: {duration: 300, redraw: false}
                    }
            ]
        })
    }

    var sliders= [{
        active: 0,
        currentvalue: {prefix: "Trasformation: "},
        pad: {t:10},
        steps: steps
    }];

    var layout = {
        width: 450, height: 500,
        margin: {l:0, r:0, t:0, b:0},
        hovermode: "closest",
        updatemenus: [
            {
                x: 1.0, y: 0.50,
                xanchor: "right", yanchor: "top",
                showactive: false,
                type: "buttons",
                pad: {t: 87, r: 10},
                buttons: [
                            {
                                method: "animate",
                                args: [
                                        null,
                                        {
                                            fromcurrent: true,
                                            transition: {duration: 50, easing: "quadratic-in-out"},
                                            frame: {duration: 50, redraw:false}
                                        }
                                ],
                                label: "Play"
                            },
                            {
                                method: "animate",
                                args:[
                                        [null],
                                        {
                                            mode: "immediate",
                                            transition: {duration: 0},
                                            frame: {duration: 0, redraw: false}
                                        }
                                ],
                                label: "Pause"
                            }
                ]
            }
        ],
        showlegend: false,
        sliders: sliders,
        scene: {
            camera: createView([1,1,1]),
            xaxis: {range: [-4, 4]},
            yaxis: {range: [-4, 4]},
            zaxis: {range: [-4, 4]}
        }
    }
    return [frames, layout];
}

//Hide/Show Option (Rotation) - for better interface
//Rotation
var rotationType = 0; //To keep track of which button is active also keep track of toggle
function hideRotate() {
    $('.rotateCP1').hide();
    $('.rotateCP2').hide();
    $('.rotateCP3').hide();
    $('.rotateCommute').hide();
}
function showRotate(axis) {
    if (axis === 1 & axis !== rotationType){
        hideRotate();
        $('.rotateCP1').slideToggle(600);
    } else if (axis === 2 & axis !== rotationType){
        hideRotate();
        $('.rotateCP2').slideToggle(600);
    } else if (axis === 3 & axis !== rotationType){
        hideRotate();
        $('.rotateCP3').slideToggle(600);
    }
    rotationType = axis;
}
var rotateMain = true;
function revealRotate(axis) {
    $('.rotateCommute').hide();
    showRotate(axis);
}
//Commute - Rotatation
function revealCommute() {
    $('.rotate3D').slideToggle(600);
    $('.rotateSlider').slideToggle(600);
    hideRotate();
    $('.rotateCommute').slideToggle(600);
    plotCommute();
    rotationType = 0;
    $('.tab-nav').hide();
}
function unrevealCommute() {
    $('.tab-nav').slideToggle(600);
    $('.rotate3D').slideToggle(600);
    $('.rotateSlider').slideToggle(600);
    plotInit();
    revealRotate(1);
}
//Reflection
var reflectionType = 0;
function hideReflect() {
    $('.xReflect').hide();
    $('.yReflect').hide();
    $('.zReflect').hide();
}
function showReflect(plane) {
    if (plane === 1 & plane !== reflectionType){
        hideReflect();
        $('.xReflect').slideToggle(600);
    } else if (plane === 2 & plane !== reflectionType){
        hideReflect();
        $('.yReflect').slideToggle(600);
    } else if (plane === 3 & plane !== reflectionType){
        hideReflect();
        $('.zReflect').slideToggle(600);
    }
    reflectionType = plane;
}
var scaleType = 0;
function hideScale() {
    $('.xScale').hide();
    $('.yScale').hide();
    $('.zScale').hide();
}
function showScale(dir) {
    if (dir === 1 & dir !== scaleType){
        hideScale();
        $('.xScale').slideToggle(600);
    } else if (dir === 2 & dir !== scaleType){
        hideScale();
        $('.yScale').slideToggle(600);
    } else if (dir === 3 & dir !== scaleType){
        hideScale();
        $('.zScale').slideToggle(600);
    }
    scaleType = dir;
}


//Update Positions
function updatePositionDisplay() {
    var previousPos;
    if (historyIndex === 0) {
        previousPos = "N/A";
    } else {
        previousPos = "("
            + String(Math.round(historyPoint[historyIndex-1][0]*100)/100) + ", "
            + String(Math.round(historyPoint[historyIndex-1][1]*100)/100) + ", "
            + String(Math.round(historyPoint[historyIndex-1][2]*100)/100)
            + ")";
    }
    document.getElementById("previousPosition").innerHTML= previousPos;
    document.getElementById("currentPosition").innerHTML=
        "("
        + String(Math.round(historyPoint[historyIndex][0]*100)/100) + ", "
        + String(Math.round(historyPoint[historyIndex][1]*100)/100) + ", "
        + String(Math.round(historyPoint[historyIndex][2]*100)/100)
        + ")";
}

function animateTransformation (frames) {
    Plotly.animate('graph', frames,{
        fromcurrent: true,
        transition: {duration: 55, easing: "quadratic-in-out"},
        frame: {duration: 55, redraw: false,},
        mode: "immediate"
    });

    updatePositionDisplay();
}

//Plots
function plotInit() {
    historyIndex = 0;
    historyCount = 0;
    historyPoint = [initialPoint];

    plotHistory(0);
    updatePositionDisplay();
}
function plotHistory(version) {
    var data = [];
    data.push(new Point(historyPoint[version]).gObject(lilac));
    data = data.concat(axes);
    data.push(sphere);

    var figure = {data: data, layout: layout}
    Plotly.newPlot('graph', figure,);
}
function plotPreviousCurrent(position) {
    var initialPosition = new Point(position);
    var data = []
    data.push(initialPosition.gObject(lilac));
    data.push(new Line([[0,0,0], [0,0,0]]).gObject());
    data.push(initialPosition.gObject(lilac.slice(0,-1) + ",0.5)"));
    data = data.concat(axes);
    data.push(sphere);

    var figure = {data: data, layout: layout}
    Plotly.newPlot('graph', figure,);
}
function plotRotate(axis) {
    var slider = document.getElementById('rotator').value;
    var angle = slider * Math.PI;
    var frames;
    var frameSize = Math.round(24 * Math.abs(slider)); //frameSize proportional to angle. multi of "8";
    if (angle === 0){
        frameSize = 8;
    }
    var index = historyIndex % historyLimit;
    if (axis === 1) {
        frames = computeFrames(rotationX, 0, angle, historyPoint[index], frameSize);
    } else if (axis === 2) {
        frames = computeFrames(rotationY, 0, angle, historyPoint[index], frameSize);
    } else if (axis === 3) {
        frames = computeFrames(rotationZ, 0, angle, historyPoint[index], frameSize);
    }
    plotPreviousCurrent(historyPoint[index]);
    animateTransformation(frames);
    displayRotationMatrix();
}
function plotReflect(plane) {
    var frames;
    var frameSize = 15;
    var index = historyIndex % historyLimit;
    if (plane === 1) {
        frames = computeFrames(scaleX, 1, -1, historyPoint[index], frameSize);
    } else if (plane === 2) {
        frames = computeFrames(scaleY, 1, -1, historyPoint[index], frameSize);
    } else if (plane === 3) {
        frames = computeFrames(scaleZ, 1, -1, historyPoint[index], frameSize);
    }

    reflectionType = plane;

    plotPreviousCurrent(historyPoint[index]);
    animateTransformation(frames);
    plotPlane(plane);
    displayReflectionMatrix();
}
function plotScale(direction) {
    var factor  = document.getElementById('scaler').value;
    var frames;
    var frameSize = 10;
    var scaling = [1, 1, 1];
    var index = historyIndex % historyLimit;
    if (direction === 1) {
        frames = computeFrames(scaleX, 1, factor, historyPoint[index], frameSize);
    } else if (direction === 2) {
        frames = computeFrames(scaleY, 1, factor, historyPoint[index], frameSize);
    } else if (direction === 3) {
        frames = computeFrames(scaleZ, 1, factor, historyPoint[index], frameSize);
    }

    scaleType = direction;
    plotPreviousCurrent(historyPoint[index]);
    animateTransformation(frames);
    displayScaleMatrix();
}
//Plot for planes:
function plotPlane(plane) {
    var data = [];
    if (plane === 1) {
        data.push({
            x: [0, 0],
            y: [-4, 4],
            z: [[-4, 4],
                [-4, 4]],
            colorscale: [[0.0, lilac.slice(0,-1) + ",0.5)"], [1.0, white]],
            showscale: false,
            type: "surface"
        });
    } else if (plane === 2) {
        data.push({
            x: [-4, 4],
            y: [0, 0],
            z: [[-4, -4],
                [4, 4]],
            colorscale: [[0.0, lilac.slice(0,-1) + ",0.5)"], [1.0, white]],
            showscale: false,
            type: "surface"
        });
    } else if (plane === 3) {
        data.push({
            x: [-4, 4],
            y: [-4, 4],
            z: [[0, 0],
                [0, 0]],
            colorscale: [[0.0, lilac.slice(0,-1) + ",0.5)"], [1.0, white]],
            showscale: false,
            type: "surface"
        });
    }
    Plotly.plot('graph', data);
}
//Plot for commute
function plotCommute() {
  var theta1 = document.getElementById('rotator1').value * Math.PI;
  var theta2 = document.getElementById('rotator2').value * Math.PI;
  var frameSize = 20;
  var data1 = [];

  for (var i = 0; i < 8; ++i) {
    data1.push(new Line([[0.,0.,0.], [0.,0.,0.]]).gObject("rgb(0,0,0)"));
  }
  data1.push(new Point(initialPoint).gObject(lilac, "diamond"));

  for (var i = 0; i < 3; ++i) {
    uvec = [0., 0., 0.];
    uvec[i] = 1;
    data1.push(new Line([[0.,0.,0], uvec]).gObject("rgb(0,0,0)"));
  }

  data1.push(sphere);
  var data2 = computeCommute(rotationY, rotationZ, theta1, theta2, frameSize);
  var figure = {
    "data": data1,
    "frames": data2[0],
    "layout": data2[1]
  }
  Plotly.newPlot('graph', figure);
}

//Memento
function undo(){
    if(historyIndex === 0){
        return;
    }
    historyIndex--;
    historyCount--;
    plotHistory(historyIndex % historyLimit);

    document.getElementById("previousPosition").innerHTML=
        "("
        + String(Math.round(historyPoint[historyIndex+1][0]*100)/100) + ", "
        + String(Math.round(historyPoint[historyIndex+1][1]*100)/100) + ", "
        + String(Math.round(historyPoint[historyIndex+1][2]*100)/100)
        + ")";
    document.getElementById("currentPosition").innerHTML=
        "("
        + String(Math.round(historyPoint[historyIndex][0]*100)/100) + ", "
        + String(Math.round(historyPoint[historyIndex][1]*100)/100) + ", "
        + String(Math.round(historyPoint[historyIndex][2]*100)/100)
        + ")";
}

function main() {
    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            $("#"+$(this).attr("id") + "DisplayA2").text( parseFloat($(this).val())*180 + $("#" + $(this).attr("id") + "DisplayA2").attr("data-unit") );
            if (parseFloat($(this).val())*8 % 8 === 0.0) {
                displayEl = $(this).val() + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            } else if (parseFloat($(this).val())*8 % 4 === 0.0) {
                displayEl = "(" + $(this).val()*2 + "/2)" + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            } else if (parseFloat($(this).val())*8 % 2 === 0.0) {
                displayEl = "(" + $(this).val()*4 + "/4)" + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            } else {
                displayEl = "(" + $(this).val()*8 + "/8)" + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            }
            $("#"+$(this).attr("id") + "DisplayA1").text( displayEl );
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
    plotInit();
    revealRotate(1); //Since Rotate is the active tab (html)
    showReflect(1);
    showScale(1);
    document.getElementById("initialPosition").innerHTML=
        "("
        + String(initialPoint[0]) + ", "
        + String(initialPoint[1]) + ", "
        + String(initialPoint[2])
        + ")";
}
$(document).ready(main);