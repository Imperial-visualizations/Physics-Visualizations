"use strict";
//Global Initial Parameters:
var initialPoint = [2., 2., 2.];
var layout = {
    /*width: 450, height: 500,*/
    autosize: true,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: createView([1,1,1]),
        xaxis: {range: [-10, 10], zeroline: true, autorange: false,},
        yaxis: {range: [-10, 10], zeroline: true, autorange: false,},
        zaxis: {range: [-10, 10], zeroline: true, autorange: false,},

        aspectratio: {x:1, y:1, z:1},
    }
};
var currentPoint = initialPoint;
var initialPhi = 0, initialR = 6.37, initialTheta = 0, initialV = 0.5;

//Physics
function findValues() {
    var r = 6.37;
    let omega = 2*Math.PI/8.6400;
    var v = parseFloat(document.getElementById('vController').value);
    var theta = parseFloat(document.getElementById('thetaController').value)*Math.PI;
    var phi = parseFloat(document.getElementById('phi1Controller').value)*Math.PI;


    let R = [r*Math.cos(phi)*Math.cos(theta), r*Math.sin(phi)*Math.cos(theta), r*Math.sin(theta)];
    let Omegamatrix = [0, 0, omega];
    let B = math.cross(Omegamatrix, R);
    var Fcent = math.cross(Omegamatrix, B);

    let V = [2*v*Math.cos(phi)*Math.sin(theta), 2*v*Math.sin(phi)*Math.sin(theta),(-2)*v*Math.cos(theta)];
    var Fcor = math.cross(Omegamatrix, V);
    return [V, Fcent, Fcor];
}

//Plots
function initPlot(refe) {
    Plotly.purge("graph");
    if (refe === "#spher"){
        //initialR = Math.sqrt(currentPoint[0]*currentPoint[0] + currentPoint[1]*currentPoint[1] + currentPoint[2]*currentPoint[2]);
        initialTheta = Math.atan2(currentPoint[2], Math.sqrt(currentPoint[0]*currentPoint[0] + currentPoint[1]*currentPoint[1]))/Math.PI;
        initialPhi = ((Math.atan2(currentPoint[1], currentPoint[0]) + 2*Math.PI) % (2*Math.PI))/Math.PI;
        //initialR = Math.round(initialR*10)/10;
        initialTheta = Math.round(initialTheta*16)/16;
        initialPhi = Math.round(initialPhi*8)/8;
        initialV = 0.5;

        $("#vcontroller").val(initialV);
        $("#vcontrollerDisplay").text(initialV);
        $("#thetaController").val(initialTheta);
        $("#thetaControllerDisplayA1").text("(" + initialTheta*16 + "/16)" + $("#thetaControllerDisplayA1").attr("data-unit"));
        $("#thetaControllerDisplayA2").text(initialTheta*180 + $("#thetaControllerDisplayA2").attr("data-unit"));
        $("#phi1Controller").val(initialPhi);
        $("#phi1ControllerDisplayA1").text("(" + initialPhi*8 + "/8)" + $("#phi1ControllerDisplayA1").attr("data-unit"));
        $("#phi1ControllerDisplayA2").text(initialPhi*180 + $("#phi1ControllerDisplayA2").attr("data-unit"));

        var v = parseFloat(document.getElementById('vController').value);
        var r = 6.37;
        var omega = 2*Math.PI/86400;
        var theta = parseFloat(document.getElementById('thetaController').value)*Math.PI;
        var phi = parseFloat(document.getElementById('phi1Controller').value)*Math.PI;

        Plotly.plot("graph", computeSpherical(r, theta, phi), layout);
    } else if (refe === "#cent") {
        return;
    }
    return;
}
//Plot for basis for corresponding coordinate systems:
function computeSpherical(r, theta, phi, v) {
    var sphere = new Sphere(r);
    var x = r*Math.cos(phi)*Math.cos(theta);
    var y = r*Math.sin(phi)*Math.cos(theta);
    var z = r*Math.sin(theta);

    var [[Vx, Vy, Vz], [Fcentx, Fcenty, Fcentz], [Fcorx, Fcory, Fcorz]] = findValues();


    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10, Math.round(z*10)/10];

    var data = [
        sphere.gObject("rgb(0,77,178)", white),
        //omega vector
        new Line([[0, 0, 0],[0, 0, r+1]]).gObject(magenta),
        new Line([[0, 0, r],[0, 0, r+1]]).arrowHead(magenta),

        //new Line([[x, y, z], [x + Math.cos(phi)*Math.cos(theta), y + Math.sin(phi)*Math.cos(theta), z + Math.sin(theta)]]).gObject(cyan),

        // r vector
        new Line([[0, 0, 0], [x, y, z]]).gObject(cyan),
        //new Line([[x, y, z], [x - Math.sin(phi), y + Math.cos(phi), z]]).gObject(lilac),

        //velocity vector
        new Line([[x, y, z], [x + Vx, y + Vy, z + Vz]]).gObject(green),
        //new Line([[x, y, z], [x + Math.cos(theta)*Math.cos(phi), y + Math.cos(theta)*Math.sin(phi), z]]).gObject(red),

        //centrifugal and coriolis force vectors
        new Line([[x, y, z], [x - Fcentx, y - Fcenty, z + Fcentz]]).gObject(red),
        new Line([[x, y, z], [x + Fcorx, y + Fcory, z + Fcorz]]).gObject(orange),
    ];

    var meshSize, t;
    var xTrace = [], yTrace = [], zTrace = [];


    return data;
}

function updatePlot() {
    var data = [];
    var href = $('ul.tab-nav li a.active.button').attr('href'); // active href


    if (href === "#spher" || href === "#cent") {
        //var r = parseFloat(document.getElementById('vcontroller').value);
        data = computeSpherical(
            6.37,
            parseFloat(document.getElementById('thetaController').value)*Math.PI,
            parseFloat(document.getElementById('phi1Controller').value)*Math.PI,
            parseFloat(document.getElementById('vController').value)
        );
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
            return false;
        });
    });
    initPlot("#spher");
}
$(document).ready(main);