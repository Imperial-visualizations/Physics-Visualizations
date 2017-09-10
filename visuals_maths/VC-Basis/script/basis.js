"use strict";
//Global Initial Parameters:
var initialPoint = [2., 2., 2.];
var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: createView([1,1,1]),
        xaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        yaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        zaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        aspectratio: {x:1, y:1, z:1},
    }
};
var currentPoint = initialPoint;
var initialRho = 0, initialPhi = 0, initialR = 0, initialTheta = 0;

//Plots
function initPlot(coor) {
    Plotly.purge("graph");
    if (coor === "#carte") {
        $("#xController").val(currentPoint[0]);
        $("#xControllerDisplay").text(currentPoint[0]);
        $("#yController").val(currentPoint[1]);
        $("#yControllerDisplay").text(currentPoint[1]);
        $("#zController").val(currentPoint[2]);
        $("#zControllerDisplay").text(currentPoint[2]);

        var x = parseFloat(document.getElementById('xController').value);
        var y = parseFloat(document.getElementById('yController').value);
        var z = parseFloat(document.getElementById('zController').value);

        Plotly.newPlot("graph", computeCartesian(x, y, z), layout);
    } else if (coor === "#cylin"){
        initialRho = Math.sqrt(currentPoint[0]*currentPoint[0] + currentPoint[1]*currentPoint[1]);
        initialPhi = ((Math.atan2(currentPoint[1], currentPoint[0]) + 2*Math.PI) % (2*Math.PI))/Math.PI;
        initialRho = Math.round(initialRho*10)/10;
        initialPhi = Math.round(initialPhi*8)/8;

        $("#rhoController").val(initialRho);
        $("#rhoControllerDisplay").text(initialRho);
        $("#phiController").val(initialPhi);
        $("#phiControllerDisplayA1").text("(" + initialPhi*8 + "/8)" + $("#phiControllerDisplayA1").attr("data-unit"));
        $("#phiControllerDisplayA2").text(initialPhi*180 + $("#phiControllerDisplayA2").attr("data-unit"));
        $("#z1Controller").val(currentPoint[2]);
        $("#z1ControllerDisplay").text(currentPoint[2]);

        var rho = parseFloat(document.getElementById('rhoController').value);
        var phi = parseFloat(document.getElementById('phiController').value)*Math.PI;
        var z = parseFloat(document.getElementById('z1Controller').value);

        Plotly.newPlot("graph", computeCylindrical(rho, phi, z), layout);
    } else if (coor === "#spher"){
        initialR = Math.sqrt(currentPoint[0]*currentPoint[0] + currentPoint[1]*currentPoint[1] + currentPoint[2]*currentPoint[2]);
        initialTheta = Math.atan2(Math.sqrt(currentPoint[0]*currentPoint[0] + currentPoint[1]*currentPoint[1]), currentPoint[2])/Math.PI;
        initialPhi = ((Math.atan2(currentPoint[1], currentPoint[0]) + 2*Math.PI) % (2*Math.PI))/Math.PI;
        initialR = Math.round(initialR*10)/10;
        initialTheta = Math.round(initialTheta*8)/8;
        initialPhi = Math.round(initialPhi*8)/8;

        $("#rController").val(initialR);
        $("#rControllerDisplay").text(initialR);
        $("#thetaController").val(initialTheta);
        $("#thetaControllerDisplayA1").text("(" + initialTheta*8 + "/8)" + $("#thetaControllerDisplayA1").attr("data-unit"));
        $("#thetaControllerDisplayA2").text(initialTheta*180 + $("#thetaControllerDisplayA2").attr("data-unit"));
        $("#phi1Controller").val(initialPhi);
        $("#phi1ControllerDisplayA1").text("(" + initialPhi*8 + "/8)" + $("#phi1ControllerDisplayA1").attr("data-unit"));
        $("#phi1ControllerDisplayA2").text(initialPhi*180 + $("#phi1ControllerDisplayA2").attr("data-unit"));

        var r = parseFloat(document.getElementById('rController').value);
        var theta = parseFloat(document.getElementById('thetaController').value)*Math.PI;
        var phi = parseFloat(document.getElementById('phi1Controller').value)*Math.PI;

        Plotly.newPlot("graph", computeSpherical(r, theta, phi), layout);
    }
    return;
}
//Plot for basis for corresponding coordinate systems:
function computeCartesian(x, y, z) {
    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10, Math.round(z*10)/10];

    var data = [
        new Cuboid(x, y, z).gObject(impBlue),
        new Line([[x, y, z], [x + 1, y, z]]).gObject(orange),
        new Line([[x, y, z], [x, y + 1, z]]).gObject(lilac),
        new Line([[x, y, z], [x, y, z + 1]]).gObject(cyan)
    ];

    return data;
}
function computeCylindrical(rho, phi, z) {
    var cylinder = new Cylinder(rho, z);
    var x = rho*Math.cos(phi);
    var y = rho*Math.sin(phi);
    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10, Math.round(z*10)/10];

    var meshSize = Math.round(phi/Math.PI*24);
    if (meshSize === 0) {meshSize = 2;}

    var t = numeric.linspace(0, phi, meshSize);
    var xTrace = [], yTrace = [], zTrace = [];
    for(var i = 0; i < meshSize; ++i) {
        xTrace[i] = rho*Math.cos(t[i]);
        yTrace[i] = rho*Math.sin(t[i]);
        zTrace[i] = z;
    }

    var data = [
        cylinder.gObjectCurve(impBlue, white),
        cylinder.gObjectTop("rgb(0,62,116)"),
        cylinder.gObjectBottom("rgb(0,62,116)"),
        new Line([[x, y, z], [x + Math.cos(phi), y + Math.sin(phi), z]]).gObject(orange),
        new Line([[x, y, z], [x - Math.sin(phi), y + Math.cos(phi), z]]).gObject(lilac),
        new Line([[x, y, z], [x, y, z + 1]]).gObject(cyan),
        {
            type: "scatter3d", mode: "lines",
            x: xTrace, y: yTrace, z: zTrace,
            line: {color: black, width: 2}
        }
    ];

    return data;
}
function computeSpherical(r, theta, phi) {
    var sphere = new Sphere(r);
    var x = r*Math.cos(phi)*Math.sin(theta);
    var y = r*Math.sin(phi)*Math.sin(theta);
    var z = r*Math.cos(theta);
    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10, Math.round(z*10)/10];

    var data = [
        sphere.gObject(impBlue, white),
        new Line([[x, y, z], [x + Math.cos(phi)*Math.sin(theta), y + Math.sin(phi)*Math.sin(theta), z + Math.cos(theta)]]).gObject(cyan),
        new Line([[x, y, z], [x - Math.sin(phi), y + Math.cos(phi), z]]).gObject(lilac),
        new Line([[x, y, z], [x + Math.cos(phi)*Math.cos(theta), y + Math.sin(phi)*Math.cos(theta), z - Math.sin(theta)]]).gObject(orange)
    ];

    var meshSize, t;
    var xTrace = [], yTrace = [], zTrace = [];

    meshSize = Math.round(phi/Math.PI*24);
    if (meshSize === 0) {meshSize = 2;}
    t = numeric.linspace(0, phi, meshSize);
    for(var i = 0; i < meshSize; ++i) {
        xTrace[i] = r*Math.cos(t[i])*Math.sin(theta);
        yTrace[i] = r*Math.sin(t[i])*Math.sin(theta);
        zTrace[i] = z;
    }

    data.push({
        type: "scatter3d",
        mode: "lines",
        x: xTrace,
        y: yTrace,
        z: zTrace,
        line: {color: black, width: 2}
    });

    xTrace = []; yTrace = []; zTrace = [];

    meshSize = Math.round(theta/Math.PI*24);
    if (meshSize === 0) {meshSize = 2;}
    t = numeric.linspace(0, theta, meshSize);
    for(var i = 0; i < meshSize; ++i) {
        xTrace[i] = r*Math.cos(phi)*Math.sin(t[i]);
        yTrace[i] = r*Math.sin(phi)*Math.sin(t[i]);
        zTrace[i] = r*Math.cos(t[i]);
    }

    data.push({
        type: "scatter3d",
        mode: "lines",
        x: xTrace,
        y: yTrace,
        z: zTrace,
        line: {color: black, width: 2}
    });

    return data;
}

function updatePlot() {
    var data = [];
    var href = $('ul.tab-nav li a.active.button').attr('href'); // active href

    if (href === "#carte") {
        var x = parseFloat(document.getElementById('xController').value);
        var y = parseFloat(document.getElementById('yController').value);
        var z = parseFloat(document.getElementById('zController').value);
        data = computeCartesian(x, y, z);
    } else if (href === "#cylin") {
        var rho = parseFloat(document.getElementById('rhoController').value);
        var phi = parseFloat(document.getElementById('phiController').value)*Math.PI;
        var z = parseFloat(document.getElementById('z1Controller').value);
        data = computeCylindrical(rho, phi, z);
    } else if (href === "#spher") {
        var r = parseFloat(document.getElementById('rController').value);
        var theta = parseFloat(document.getElementById('thetaController').value)*Math.PI;
        var phi = parseFloat(document.getElementById('phi1Controller').value)*Math.PI;
        data = computeSpherical(r, theta, phi);
    }

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
    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            $("#"+$(this).attr("id") + "DisplayA2").text( parseFloat($(this).val())*180 + $("#" + $(this).attr("id") + "DisplayA2").attr("data-unit") );

            if (parseFloat($(this).val())*8 % 8 === 0.0) {
                displayEl = $(this).val();
            } else if (parseFloat($(this).val())*8 % 4 === 0.0) {
                displayEl = "(" + $(this).val()*2 + "/2)";
            } else if (parseFloat($(this).val())*8 % 2 === 0.0) {
                displayEl = "(" + $(this).val()*4 + "/4)";
            } else {
                displayEl = "(" + $(this).val()*8 + "/8)";
            }
            $("#"+$(this).attr("id") + "DisplayA1").text( displayEl + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit"));
            updatePlot();
        });
    });

    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initPlot(href);
            return false;
        });
    });
    initPlot("#carte");
}
$(document).ready(main);