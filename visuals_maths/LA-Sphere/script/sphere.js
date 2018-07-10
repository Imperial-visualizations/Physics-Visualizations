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

//Matrix Utilities:
/** Rotation Matrix about x-axis */
function rotationX(angle) {
    var matrix = [[1, 0, 0], [0, Math.cos(angle), -Math.sin(angle)], [0, Math.sin(angle), Math.cos(angle)]];
    return matrix;
}
/** Rotation Matrix about y-axis */
function rotationY(angle) {
    var matrix = [[Math.cos(angle), 0, Math.sin(angle)], [0, 1, 0], [-Math.sin(angle), 0, Math.cos(angle)]];
    return matrix;
}
/** Rotation Matrix about z-axis */
function rotationZ(angle) {
    var matrix = [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0 ,1]];
    return matrix;
}
/** Scalation Matrix in x-direction */
function scaleX(factor) {
    var matrix = [[factor, 0, 0], [0, 1, 0], [0, 0, 1]];
    return matrix;
}
/** Scalation Matrix in y-direction */
function scaleY(factor) {
    var matrix = [[1, 0, 0], [0, factor, 0], [0, 0, 1]];
    return matrix;
}
/** Scalation Matrix in z-direction */
function scaleZ(factor) {
    var matrix = [[1, 0, 0], [0, 1, 0], [0, 0 ,factor]];
    return matrix;
}

//HTML Matrices Display
/**
 * This function makes table for matrix display
 * @param {array} myArray - array of matrix
 */
function makeTableHTML(myArray) {
    var result = "<table class='matrix'><tbody>";
    for(var i=0, n=myArray.length; i<n; ++i) {
        result += "<tr>";
        for(var j=0, m=myArray[i].length; j<m; ++j){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}

//Matrix Display Value
/**
 * Produces display for rotation matrix.
 * @param {float} angle - angle of rotation.
 * @param {string} rotationType - rotation about three coordinate axes.
 */
function displayRotationMatrix(angle, rotationType) {
    var result;
    var cosAngle = "cos("+String(Math.abs(angle))+"π"+")";
    var sinAngle1 = "sin(0)", sinAngle2 = "-sin(0)";
    if (angle === "0" || angle === "-2" || angle === "2"){
        cosAngle = "1"; sinAngle1 = "0"; sinAngle2 = "0";
    } else if (angle > 0) {
        sinAngle1 = "sin(" + String(angle)+"π)"; sinAngle2 = "-sin(" + String(angle)+"π)";
    } else if (angle < 0) {
        sinAngle1 = "-sin(" + String(-angle)+"π)"; sinAngle2 = "sin(" + String(-angle)+"π)";
    }
    if (rotationType === "rotateX") {
        result = makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", cosAngle, sinAngle2],
                ["0", sinAngle1, cosAngle]
            ]
        )
    } else if (rotationType === "rotateY") {
        result = makeTableHTML(
            [
                [cosAngle, "0", sinAngle1],
                ["0", "1", "0"],
                [sinAngle2, "0", cosAngle]
            ]
        )
    } else if (rotationType === "rotateZ") {
        result = makeTableHTML(
            [
                [cosAngle, sinAngle2, "0"],
                [sinAngle1, cosAngle, "0"],
                ["0", "0", "1"]
            ]
        )
    }
    return result;
}
/**
 * Produces display for reflection matrix.
 * @param {string} reflectionType - reflection on three planes: (x = 0, y = 0 and, z = 0).
 */
function displayReflectionMatrix(reflectionType) {
    var result;
    if (reflectionType === "reflectX") {
        result = makeTableHTML(
            [
                ["-1", "0", "0"],
                ["0", "1", "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (reflectionType === "reflectY") {
        result = makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", "-1", "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (reflectionType === "reflectZ") {
        result = makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", "1", "0"],
                ["0", "0", "-1"]
            ]
        )
    }
    return result;
}

//Computation functions
/**
 * Produces animation frames with given transformation.
 * @param {@function} transformation - matrices (linear functions).
 * @param {float} start - starting value for the frames.
 * @param {float} end - ending value for the frames.
 * @param {array} startVec - initial vectors.
 * @param {int} frameSize - size of the frames.
 * @param {bool} addTrace - if it is true, it will add trace line. (default: true)
 */
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
/**
 * Produces animation frames of composite of 2 rotations.
 * @param {@function} rotation1 - rotation matrix (linear functions).
 * @param {@function} rotation2 - rotation matrix (linear functions).
 * @param {float} angle1 - angle value for rotation1.
 * @param {float} angle2 - angle value for rotation2.
 * @param {array} initialVec - initial vectors.
 * @param {int} frameSize - size of the frames.
 * @param {string} arrowColor - color of the vector.
 * @param {string} color1 - color of first rotation.
 * @param {string} color2 - color of second rotation.
 */
function computeCompositeRotations(rotation1, rotation2, angle1, angle2, initialVec, frameSize, arrowColor, color1, color2) {
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
/**
 * Fuses two frames produced by @computeCompositeRotations.
 * @param {@function} rotation1 - rotation matrix (linear functions).
 * @param {@function} rotation2 - rotation matrix (linear functions).
 * @param {float} angle1 - angle value for rotation1.
 * @param {float} angle2 - angle value for rotation2.
 * @param {int} frameSize - size of the frames.
 */
function computeCommute(rotation1, rotation2, angle1, angle2, frameSize) {
    var frameList1 = computeCompositeRotations(
        rotation1, rotation2,
        angle1, angle2,
        initialVec, frameSize,
        white, lilac, orange
    );

    var frameList2 = computeCompositeRotations(
        rotation2, rotation1,
        angle2, angle1,
        initialVec, frameSize,
        black, orange, lilac
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

//Update Equation Display
/**
 * It updates the matrix equation display below the play button.
 * @param {array} matrix - matrix array.
 * @param {string} idName - display id in html.
 */
function updateMatrixDisplay(matrix, idName) {
    var index = historyIndex % historyLimit;
    var current = makeTableHTML(
        [
            [Math.round(historyVectors[index][0]*100)/100],
            [Math.round(historyVectors[index][1]*100)/100],
            [Math.round(historyVectors[index][2]*100)/100]
        ]
    )

    if (historyVectors.length > 1 && index === 0) {
        index = historyVectors.length;
    }

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
function displayCurrent(index, idName) {
    var current = "<table class='matrixWrapper'>" + "<tbody>" + "<tr>"
        + "<td>" + makeTableHTML([
            [Math.round(historyVectors[index][0]*100)/100],
            [Math.round(historyVectors[index][1]*100)/100],
            [Math.round(historyVectors[index][2]*100)/100]
        ]) + "</td>"
        + "</tr>" + "</tbody>" + "<table>";

    document.getElementById(idName).innerHTML = current;
    return;
}

//Hide/Show - for better interface
/** It hides [Commute?] interface. */
function hideCommute() {
    $('.rotate3D').show();
    $('.rotateCommute').hide();
    $('.playButtons').show();
    $('#showCommute').show();
    $('#frameSlider').hide();
    var index = historyIndex % historyLimit;
    displayCurrent(index, "matrixDisplay");
    histPlot(index);
    $("#animate").prop("disabled",false);
}
/** It shows [Commute?] interface. */
function showCommute() {
    $('.rotate3D').hide();
    $('.rotateCommute').show();
    $('.playButtons').hide();
    $('#showCommute').hide();
    $('#frameSlider').show();
    commutePlot();
}
/** It disable undo and reset buttons. */
function disableUndoReset() {
    $("#undo").prop("disabled",true);
    $("#reset").prop("disabled",true);
}
/** It enable undo and reset buttons. */
function enableUndoReset() {
    $("#undo").prop("disabled",false);
    $("#reset").prop("disabled",false);
}

//Plot
/** It resets and plots initial plot. */
function initPlot() {
    historyVectors = [initialVec];
    historyIndex = 0;
    historyCount = 0;
    displayCurrent(0, "matrixDisplay");
    hideCommute();
    histPlot(0);
    $("#animate").prop("disabled",false);
    disableUndoReset();
}
/**
 * It plots the index-th vector in the historyVectors.
 * @param {int} index - index of historyVectors.
 */
function histPlot(index) {
    Plotly.purge("graph");
    var data = [];
    var initVec = new Line([[0,0,0], historyVectors[index]]);
    data.push(initVec.gObject(black));
    data.push(initVec.arrowHead(black));
    data.push({type:"scatter3d"}); // trace line
    data.push(sphere);
    data = data.concat(axes);
    data.push({type:"scatter3d"}); // Plane surfaces

    Plotly.newPlot(
        "graph",
        {data: data, layout: layout}
    );
}

//Animation
/**
 * It animates the give frames and links it with given play button id
 * @param {object} frames - frame object.
 * @param {string} playID - id of play button in html.
 */
function animateTransformation(frames, playID) {
    $(playID).prop("disabled",true);
    Plotly.animate('graph', frames,
        {
            fromcurrent: true,
            transition: {duration: 55, easing: "quadratic-in-out"},
            frame: {duration: 55, redraw: false,},
            mode: "afterall",
        }
    ).then(function() {$(playID).prop("disabled",false);});

    return;
}
/** Master Play button */
function playAnimation() {//Master PLAY
    if ($('ul.tab-nav li a.active').attr('href') === "#rotate") {
        animateRotate();
    } else if($('ul.tab-nav li a.active').attr('href') === "#reflect") {
        animateReflect();
    }
}

/** It creates rotations animation frames */
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

    updateMatrixDisplay(displayRotationMatrix(slider, rotateAxis), "matrixDisplay");
    enableUndoReset();
    animateTransformation(frames, "#animate");
    return;
}
/** It creates reflection animation frames */
function animateReflect() {
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

    updateMatrixDisplay(displayReflectionMatrix(plane), "matrixDisplay");
    planePlot(plane);
    enableUndoReset();
    animateTransformation(frames, "#animate");
    return;
}
/**
 * Plots a plane: x = 0, y = 0 or z = 0
 * @param {string} plane - plane type.
 */
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
/** prepares the plots and interface for [commute?] */
function commutePlot() {
    Plotly.purge("graph");
    var angle1 = document.getElementById('rotator1').value * Math.PI;
    var angle2 = document.getElementById('rotator2').value * Math.PI;
    var frameSize = 20;

    var frames = computeCommute(rotationX, rotationY, angle1, angle2, frameSize);
    var extra = axes;
    extra.push(sphere);

    initAnimation("commuteAnimate", frames, extra, layout, 10, [0, 19], true);
}

/** undos performed transformation */
function undo(){
    historyIndex--;
    historyCount--;
    var index = historyIndex % historyLimit;
    if(historyIndex === 0){
        disableUndoReset();
    }
    displayCurrent(index, "matrixDisplay");
    histPlot(index);
    return;
}

function main() {
    //Sliders
    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            $("#"+$(this).attr("id") + "DisplayA2").text( parseFloat($(this).val())*180 + $("#" + $(this).attr("id") + "DisplayA2").attr("data-unit") );

            if (parseFloat($(this).val())*8 % 8 === 0.0) {displayEl = $(this).val();
            } else if (parseFloat($(this).val())*8 % 4 === 0.0) {displayEl = "(" + $(this).val()*2 + "/2)";
            } else if (parseFloat($(this).val())*8 % 2 === 0.0) {displayEl = "(" + $(this).val()*4 + "/4)";
            } else {displayEl = "(" + $(this).val()*8 + "/8)";
            }
            $("#"+$(this).attr("id") + "DisplayA1").text( displayEl + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit"));

            if ($(this).attr("id") === "commuteAnimateSlider"){
                historyPlot(parseInt($(this).val()));
            }
        });

        $(this).on("change", function(){
            var rotatorName = $(this).attr("id");
            if (rotatorName === "rotator1" || rotatorName === "rotator2"){
                commutePlot();
            }
        });
    });

    //Tab
    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');
            hideCommute();
            if (href === "#rotate") {
                $('#showCommute').show();
            } else {
                $('#showCommute').hide();
            }
            return false;
        });
    });

    $("input[type=submit]").click(function () {
        //log(this);
        var idName = $(this).attr("id");
        if (idName === "animate") {
            playAnimation();
        } else if (idName === "commuteAnimate"){
            startAnimation();
        }
    });

    $("input[type=button]").click(function () {
        var idName = $(this).attr("id");
        if (idName === "undo") {
            undo();
        } else if (idName === "reset"){
            initPlot();
        } else if (idName === "showCommute"){
            showCommute();
        } else if (idName === "hideCommute"){
            hideCommute();
        }
    });

    //Initialisation
    initPlot();
}
$(document).ready(main);