'use strict';
//Global Initial Parameters:
var initialVec = [-2., -2., 2.];
var historyVectors = [initialVec];
var historyIndex = 0;
var historyCount = 0;
var historyLimit = 10;
var radius = 2*Math.sqrt(3);
var sphere = new Sphere(radius).gObject(cyan, white);
var axes = createAxes(4);
var layout = {
    width: 450, height: 450,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: {
            up: {x: 0, y: 0, z: 1},
            eye: {x: -0.5, y: -1.5, z: 0.9},
            center: {x: 0, y: 0, z: -0.15}
        },
        aspectratio: {x:1, y:1, z:1},
        xaxis: {range: [-4, 4], autorange: false, zeroline: true,},
        yaxis: {range: [-4, 4], autorange: false, zeroline: true,},
        zaxis: {range: [-4, 4], autorange: false, zeroline: true,},
    }
}

//Computing transformation frames
function computeFrames(transformation, start, end, startVec, frameSize, addTrace = true) {
    var intermediate = numeric.linspace(start, end, frameSize);
    var traceLine = [startVec];
    var frames =[], data;
    var newVec, newLine;

    for (var i = 0, n = intermediate.length; i < n; ++i) {
        newVec = math.multiply(transformation(intermediate[i]), startVec);
        traceLine.push(newVec);
        newLine = new Line([[0,0,0], newVec]);
        data = [
            newLine.gObject(black),
            newLine.arrowHead(black)
        ];
        if (addTrace) {
            data.push(new Line(traceLine).gObject(orange));
        }
        frames.push({data: data});
    }
    historyIndex++;
    if(historyCount < historyLimit - 1) {
        historyCount++;
    }
    historyVectors[historyIndex % historyLimit] = newVec;
    return frames;
}
function computeCompositeRotations(rotation1, rotation2, angle1, angle2, initialVec, frameSize, arrowColor, color1, color2, symbol) {
    var intermediate1 = numeric.linspace(0.0, angle1, frameSize);
    var intermediate2 = numeric.linspace(0.0, angle2, frameSize);
    var trace1 = [initialVec];
    var frames = [];
    var firstTrace;
    var newLine;

    var newVec, newVec2;
    for (var i = 0, n = intermediate1.length; i < n; ++i) {
        newVec = math.multiply(rotation1(intermediate1[i]), initialVec);
        trace1.push(newVec);
        newLine = new Line([[0,0,0], newVec]);
        firstTrace = new Line(trace1);
        frames.push({
            data:[
                newLine.gObject(arrowColor),
                newLine.arrowHead(arrowColor),
                firstTrace.gObject(color1),
                new Line([[0., 0., 0.], [0., 0., 0.]]).gObject()
            ]
        });
    }

    var trace2 = [newVec];
    for (var i = 1, n = intermediate2.length; i < n; ++i) {
        newVec2 = math.multiply(rotation2(intermediate2[i]), newVec);
        trace2.push(newVec2);
        newLine = new Line([[0,0,0], newVec2]);
        frames.push({
            data:[
                newLine.gObject(arrowColor),
                newLine.arrowHead(arrowColor),
                new Line(trace2).gObject(color2),
                firstTrace.gObject(color1.slice(0, -1) + ",0.7)")
            ]
        });
    }

    return frames;
}
function computeCommute(rotation1, rotation2, theta1, theta2, frameSize) {
    var frameList1 = computeCompositeRotations(
        rotation1, rotation2,
        theta1, theta2,
        initialVec, frameSize,
        white, lilac, orange, "circle"
    );

    var frameList2 = computeCompositeRotations(
        rotation2, rotation1,
        theta2, theta1,
        initialVec, frameSize,
        black, orange, lilac, "square"
    );

    var frames = [], data;
    for (var i=0, n=frameList1.length; i < n; ++i) {
        data = [];
        for (var j=0, m=frameList1[i].data.length; j < m; ++j) {
            data.push(frameList1[i].data[j]);
            data.push(frameList2[i].data[j]);
        }
        frames.push({data: data});
    }
    return frames;
}

//Hide/Show Option (Rotation) - for better interface
//Commute - Rotation
var isFrameSliderDisplayed = false;
function hideCommute() {
    $('.rotate3D').show();
    $('.rotateCommute').hide();
    $('#frameSlider').hide();
    initPlot();
    isFrameSliderDisplayed = false;
} //has purging here!!!
function showCommute() {
    $('.rotate3D').hide();
    $('.rotateCommute').show();
    $('#frameSlider').show();
    commutePlot();
    isFrameSliderDisplayed = true;
}


//Update Equation Display
function updateMatrixDisplay(matrix, idName) {
    var index = historyIndex % historyLimit;
    var current = makeTableHTML(
        [
            [Math.round(historyVectors[index][0]*100)/100],
            [Math.round(historyVectors[index][1]*100)/100],
            [Math.round(historyVectors[index][2]*100)/100]
        ]
    )

    var previous = makeTableHTML(
        [
            [Math.round(historyVectors[index - 1][0]*100)/100],
            [Math.round(historyVectors[index - 1][1]*100)/100],
            [Math.round(historyVectors[index - 1][2]*100)/100]
        ]
    )

    document.getElementById(idName).innerHTML = "<table class='matrixWrapper'>" + "<tbody>" + "<tr>"
        + "<td>" + current + "</td>"
        + "<td>=</td>"
        + "<td>" + matrix + "</td>"
        + "<td>x</td>"
        + "<td>" + previous + "</td>"
        + "</tr>" + "</tbody>" + "<table>";

    return;
}
function displayCurrent(index) {
    var current = makeTableHTML(
        [
            [Math.round(historyVectors[index][0]*100)/100],
            [Math.round(historyVectors[index][1]*100)/100],
            [Math.round(historyVectors[index][2]*100)/100]
        ]
    )
    document.getElementById("rotateMatrix").innerHTML = current;
    document.getElementById("reflectMatrix").innerHTML = current;
}

//Plots
function initPlot() {
    historyVectors = [initialVec];
    historyIndex = 0;
    historyCount = 0;
    displayCurrent(0)
    histPlot(0);
}
function histPlot(index) {
    Plotly.purge("graph");
    var data = [];
    var initVec = new Line([[0,0,0], historyVectors[index]]);
    data.push(initVec.gObject(black));
    data.push(initVec.arrowHead(black));
    data.push({type:"scatter3d"});
    data.push(sphere);
    data = data.concat(axes);
    Plotly.newPlot(
        "graph",
        {data: data, layout: layout}
    );
}

//Animation
function animateTransformation(frames) {
    //$("#rotateAnimate").prop("disabled",true);
    Plotly.animate('graph', frames,
        {
            fromcurrent: true,
            transition: {duration: 55, easing: "quadratic-in-out"},
            frame: {duration: 55, redraw: false,},
            mode: "immediate",
            onComplete: function(){$("#rotateAnimate").prop("disabled",false);}
        }
    );

    return;
}

function animateRotate() {
    var frames;
    var rotateAxis = document.getElementById("rotateSelect").value
    var slider = document.getElementById('rotator').value;
    var angle = slider * Math.PI;
    var frameSize = 8;
    if (angle !== 0) {
        frameSize = Math.round(24 * Math.abs(slider)); //frameSize proportional to angle. multi of "8";
    }
    var index = historyIndex % historyLimit;
    if (rotateAxis === "rotateX") {
        frames = computeFrames(rotationX, 0, angle, historyVectors[index], frameSize);
    } else if (rotateAxis === "rotateY") {
        frames = computeFrames(rotationY, 0, angle, historyVectors[index], frameSize);
    } else if (rotateAxis === "rotateZ") {
        frames = computeFrames(rotationZ, 0, angle, historyVectors[index], frameSize);
    }

    updateMatrixDisplay(displayRotationMatrix(slider, rotateAxis), "rotateMatrix");
    animateTransformation(frames);

    return;
}
function animateReflect() {
    $("#rotateAnimate").prop("disabled",true);
    var frames;
    var plane = document.getElementById('reflectSelect').value;
    var frameSize = 10;
    var index = historyIndex % historyLimit;
    if (plane === "reflectX") {
        frames = computeFrames(scaleX, 1, -1, historyVectors[index], frameSize, false);
    } else if (plane === "reflectY") {
        frames = computeFrames(scaleY, 1, -1, historyVectors[index], frameSize, false);
    } else if (plane === "reflectZ") {
        frames = computeFrames(scaleZ, 1, -1, historyVectors[index], frameSize, false);
    }

    updateMatrixDisplay(displayReflectionMatrix(plane), "reflectMatrix");
    animateTransformation(frames);
    planePlot(plane);
    return;
}
//Plot for planes:
function planePlot(plane) {
    if (historyIndex > 1) {
        Plotly.deleteTraces("graph", -1);
    }

    var data = [];
    if (plane === "reflectX") {
        data.push({
            x: [0, 0],
            y: [-4, 4],
            z: [[-4, 4],
                [-4, 4]],
            colorscale: [[0.0, lilac.slice(0,-1) + ",0.5)"], [1.0, white]],
            opacity: 0.5,
            showscale: false,
            type: "surface"
        });
    } else if (plane === "reflectY") {
        data.push({
            x: [-4, 4],
            y: [0, 0],
            z: [[-4, -4],
                [4, 4]],
            colorscale: [[0.0, lilac.slice(0,-1) + ",0.5)"], [1.0, white]],
            opacity: 0.5,
            showscale: false,
            type: "surface"
        });
    } else if (plane === "reflectZ") {
        data.push({
            x: [-4, 4],
            y: [-4, 4],
            z: [[0, 0],
                [0, 0]],
            colorscale: [[0.0, lilac.slice(0,-1) + ",0.5)"], [1.0, white]],
            opacity: 0.5,
            showscale: false,
            type: "surface"
        });
    }
    Plotly.addTraces('graph', data);
}
//Plot for commute
function commutePlot() {
    Plotly.purge("graph");
    var theta1 = document.getElementById('rotator1').value * Math.PI;
    var theta2 = document.getElementById('rotator2').value * Math.PI;
    var frameSize = 20;

    var frames = computeCommute(rotationY, rotationZ, theta1, theta2, frameSize);
    var extra = axes;
    extra.push(sphere);

    initAnimation("commuteAnimate", frames, extra, layout, 10, [0, 19], true);
}

//Memento
function undo(){
    if(historyIndex === 0){
        return;
    }
    historyIndex--;
    historyCount--;
    var index = historyIndex % historyLimit;
    displayCurrent(index);
    histPlot(index);
    return;
}

function main() {
    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            if (isFrameSliderDisplayed){
                historyPlot(parseInt($(this).val()));
            }
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
            hideCommute();
            return false;
        });
    });
    hideCommute();
}
$(document).ready(main);