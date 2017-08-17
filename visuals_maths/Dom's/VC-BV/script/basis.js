//Global Initial Parameters:
var initialPoint = [2., 2., 2.];
var radius = 2*Math.sqrt(3);
var layout = {
  "width": 450, "height": 500,
  "margin": {l:0, r:0, t:0, b:0},
  "hovermode": "closest",
  "showlegend": false,
  "scene": {
    camera: createView(initialPoint),
    xaxis: {range: [-6, 6]},
    yaxis: {range: [-6, 6]},
    zaxis: {range: [-6, 6]}
  }
}
var coorType = 0; //(1 = Cartesian, 2 = Cylindrical, 3 = Spherical
var currentPoint = [1, 1, 1];

//Plots
function plotInit(coor) {
    var initialRho = 0, initialphi = 0, initialR = 0, initialTheta = 0;

    if (coor === 1) {
        if (coorType !== 1) {
            //console.log(currentPoint);
            $("#xController").val(currentPoint[0]);
            $("#xControllerDisplay").text(currentPoint[0]);
            $("#yController").val(currentPoint[1]);
            $("#yControllerDisplay").text(currentPoint[1]);
            $("#zController").val(currentPoint[2]);
            $("#zControllerDisplay").text(currentPoint[2]);
        }
        var x = parseFloat(document.getElementById('xController').value);
        var y = parseFloat(document.getElementById('yController').value);
        var z = parseFloat(document.getElementById('zController').value);
        plotCartesian(x, y, z);
        coorType = 1;
    } else if (coor === 2){
        if (coorType !== 2) {
            //console.log(currentPoint);
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
        }
        var rho = parseFloat(document.getElementById('rhoController').value);
        var phi = parseFloat(document.getElementById('phiController').value)*Math.PI;
        var z = parseFloat(document.getElementById('z1Controller').value);

        plotCylinder(rho, phi, z);
        coorType = 2;
    } else if (coor === 3){
        if (coorType !== 3) {
            //console.log(currentPoint);
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
        }
        var r = parseFloat(document.getElementById('rController').value);
        var theta = parseFloat(document.getElementById('thetaController').value)*Math.PI;
        var phi = parseFloat(document.getElementById('phi1Controller').value)*Math.PI;

        plotSphere(r, theta, phi);
        coorType = 3;
    }
}
//Plot for basis for corresponding coordinate systems:
function plotCartesian(x, y, z) {
    cuboid = new Cuboid(x, y, z);
    Plotly.newPlot('graph',
        [
            cuboid.gObject("rgb(0,62,116"),
            new Line([[x, y, z], [x + 1, y, z]]).gObject("rgb(255,0,0)"),
            new Line([[x, y, z], [x, y + 1, z]]).gObject("rgb(0,255,0)"),
            new Line([[x, y, z], [x, y, z + 1]]).gObject("rgb(0,0,255)")
        ],
        layout
    )
    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10, Math.round(z*10)/10];
}
function plotCylinder(rho, phi, z) {
    cylinder = new Cylinder(rho, z);
    var x = rho*Math.cos(phi);
    var y = rho*Math.sin(phi);

    var meshSize = phi/Math.PI*24;
    var t = numeric.linspace(0, phi, meshSize);
    var xTrace = [], yTrace = [], zTrace = [];
    for(var i = 0; i < meshSize; ++i) {
        xTrace[i] = rho*Math.cos(t[i]);
        yTrace[i] = rho*Math.sin(t[i]);
        zTrace[i] = z;
    }
    Plotly.newPlot('graph',
        [
            cylinder.gObjectCurve("rgb(0,62,116)", "rgb(255,255,255)"),
            cylinder.gObjectTop("rgb(0,62,116)"),
            cylinder.gObjectBottom("rgb(0,62,116)"),
            new Line([[x, y, z], [x + Math.cos(phi), y + Math.sin(phi), z]]).gObject("rgb(255,0,0)"),
            new Line([[x, y, z], [x - Math.sin(phi), y + Math.cos(phi), z]]).gObject("rgb(0,255,0)"),
            new Line([[x, y, z], [x, y, z + 1]]).gObject("rgb(0,0,255)"),
            {
                type: "scatter3d",
                mode: "lines",
                x: xTrace,
                y: yTrace,
                z: zTrace,
                line: {color: "rgb(0,0,0)", width: 2}
            }
        ],
        layout
    )
    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10, Math.round(z*10)/10];
}
function plotSphere(r, theta, phi) {
    sphere = new Sphere(r);
    var x = r*Math.cos(phi)*Math.sin(theta);
    var y = r*Math.sin(phi)*Math.sin(theta);
    var z = r*Math.cos(theta);

    var meshSize = phi/Math.PI*24;
    var t = numeric.linspace(0, phi, meshSize);
    var xTrace = [], yTrace = [], zTrace = [];
    for(var i = 0; i < meshSize; ++i) {
        xTrace[i] = r*Math.cos(t[i])*Math.sin(theta);
        yTrace[i] = r*Math.sin(t[i])*Math.sin(theta);
        zTrace[i] = z;
    }

    var meshSize1 = theta/Math.PI*24;
    var t1 = numeric.linspace(0, theta, meshSize1);
    var xTrace1 = [], yTrace1 = [], zTrace1 = [];
    for(var i = 0; i < meshSize1; ++i) {
        xTrace1[i] = r*Math.cos(phi)*Math.sin(t1[i]);
        yTrace1[i] = r*Math.sin(phi)*Math.sin(t1[i]);
        zTrace1[i] = r*Math.cos(t1[i]);
    }
    Plotly.newPlot('graph',
        [
            sphere.gObject("rgb(0,62,116)", "rgb(255,255,255)"),
            new Line([[x, y, z], [x + Math.cos(phi)*Math.sin(theta), y + Math.sin(phi)*Math.sin(theta), z + Math.cos(theta)]]).gObject("rgb(0,0,255)"),
            new Line([[x, y, z], [x - Math.sin(phi), y + Math.cos(phi), z]]).gObject("rgb(0,255,0)"),
            new Line([[x, y, z], [x + Math.cos(phi)*Math.cos(theta), y + Math.sin(phi)*Math.cos(theta), z - Math.sin(theta)]]).gObject("rgb(255,0,0)"),
            {
                type: "scatter3d",
                mode: "lines",
                x: xTrace,
                y: yTrace,
                z: zTrace,
                line: {color: "rgb(0,0,0)", width: 2}
            },
            {
                type: "scatter3d",
                mode: "lines",
                x: xTrace1,
                y: yTrace1,
                z: zTrace1,
                line: {color: "rgb(0,0,0)", width: 2}
            }
        ],
        layout
    )
    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10, Math.round(z*10)/10];
}
//Plot for planes:
function plotPlane(plane) {
    var data = [];
    if (plane === 1) {
        data.push({
            x: [0, 0],
            y: [-10, 10],
            z: [[-10, 10],
                [-10, 10]],
            colorscale: "Blues",
            showscale: false,
            type: "surface"
        });
    } else if (plane === 2) {
        data.push({
            x: [-10, 10],
            y: [0, 0],
            z: [[-10, -10],
                [10, 10]],
            colorscale: "Blues",
            showscale: false,
            type: "surface"
        });
    } else if (plane === 3) {
        data.push({
            x: [-10, 10],
            y: [-10, 10],
            z: [[0, 0],
                [0, 0]],
            colorscale: "Blues",
            showscale: false,
            type: "surface"
        });
    }
    Plotly.plot('graph', data);
}
//Layout
function createView(point) {
  var norm = Math.sqrt(point[0]*point[0] + (5*point[1])*(5*point[1]) + point[2]*point[2]);
  var a = 0.5 + point[0]/norm, b = 1 +  5*point[1]/norm, c = 0.5 + point[2]/norm;
  var camera = {
    up: {x: 0, y: 0, z: 1},
    eye: {x: -a, y: -b, z: c + 0.5},
    center: {x: 0, y: 0, z: -0.2}
  }
  return camera
}

//Slider Value and Matrix grid Value
function makeTableHTML(myArray) {
    var result = "<table><tbody>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
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
            plotInit(coorType);
        });
    });

    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');
            if(href === "#carte"){
                plotInit(1);
            } else if(href === "#cylin"){
                plotInit(2);
            } else if(href === "#spher"){
                plotInit(3);
            }
            return false;
        });
    });
    plotInit(1);
}
$(document).ready(main);