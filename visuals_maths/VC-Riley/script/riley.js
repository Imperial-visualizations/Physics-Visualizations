//Global Initial Parameters:
var initialPoint = [3.4, 1.4, 3.7];
var layout = {
    width: 450, "height": 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: {
            up: {x: 0, y: 0, z: 1},
            eye: {x: 1.1, y: -0.2, z: 0.4},
            center: {x: 0, y: 0, z: 0}
        },
        xaxis: {range: [-6, 6], zeroline: true, scaleratio: 1},
        yaxis: {range: [-6, 6], zeroline: true, scaleratio: 1},
        zaxis: {range: [-6, 6], zeroline: true, scaleratio: 1},
        aspectratio: {x:1, y:1, z:1},
    }
};
var currentPoint = initialPoint;
var initialRho = 0, initialPhi = 0, initialR = 0, initialTheta = 0;
var axes = createAxes(5);
var isBlackText = true;
var blackTextType = "lines+text";

//Add more curvature definition:
function curveMore(arraySize) {
    var hello = [], hello2;
    if (arraySize%2 === 0) {
        for (var i = 0, n = Math.round(arraySize/2); i < n; ++i) {
            hello.push(1 + (i/n/100));
        }
        hello2 = hello.slice();
    } else {
        for (var i = 0, n = Math.round(arraySize/2) - 1; i < n; ++i) {
            hello.push(1+ (i/n/100));
        }
        hello2 = hello.slice();
        hello.push(1.008);
    }

    return hello.concat(hello2.reverse());
}

//Plot
function initRiley(coor) {
    Plotly.purge("graph");
    if (coor === "#cylin"){
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
function computeCylindrical(rho, phi, z) {
    var x0 = rho*Math.cos(phi);
    var y0 = rho*Math.sin(phi);
    var z0 = z;
    currentPoint = [Math.round(x0*10)/10, Math.round(y0*10)/10, Math.round(z0*10)/10];

    var newPhi = phi + Math.PI/16;

    var x1 = rho*Math.cos(newPhi);
    var y1 = rho*Math.sin(newPhi);
    var z1 = z + 0.8

    var meshSize0 = Math.round(phi/Math.PI*24);

    var intermediatePhi0 = numeric.linspace(0, phi, meshSize0);
    var xPhi0 = [], yPhi0 = [];
    for(var i = 0; i < meshSize0; ++i) {
        xPhi0[i] = 0.3*rho*Math.cos(intermediatePhi0[i]);
        yPhi0[i] = 0.3*rho*Math.sin(intermediatePhi0[i]);
    }
    var zPhi0 = numeric.rep([meshSize0], 0);

    var meshSize1 = 9;
    var curved = curveMore(meshSize1);

    var intermediatePhi1 = numeric.linspace(phi, newPhi, meshSize1);
    var xPhi1 = [], yPhi1 = [], zPhi1 = numeric.rep([meshSize1], 0);
    var xPhi2 = [], yPhi2 = [], zPhi2 = numeric.rep([meshSize1], z0);
    var xPhi3 = [], yPhi3 = [];
    for(var i = 0; i < meshSize1; ++i) {
        xPhi1[i] = 0.45*rho*Math.cos(intermediatePhi1[i]);
        yPhi1[i] = 0.45*rho*Math.sin(intermediatePhi1[i]);
        xPhi2[i] = curved[i]*rho*Math.cos(intermediatePhi1[i]);
        yPhi2[i] = curved[i]*rho*Math.sin(intermediatePhi1[i]);
        xPhi3[i] = curved[i]*(rho + 0.8)*Math.cos(intermediatePhi1[i]);
        yPhi3[i] = curved[i]*(rho + 0.8)*Math.sin(intermediatePhi1[i]);
    }

    var xTrace = xPhi2.concat(xPhi3.reverse());
    xTrace.push(xPhi2[0]);
    var yTrace = yPhi2.concat(yPhi3.reverse());
    yTrace.push(yPhi2[0]);

    var intermediateZ = numeric.linspace(z0, z1, 2*meshSize1 + 1);

    var zTrace = [], xTrace1 = [], yTrace1 = [];

    for (var i = 0, n = intermediateZ.length; i < n; ++i) {
        xTrace1.push(xTrace);
        yTrace1.push(yTrace);
        zTrace.push(numeric.rep([2*meshSize1 + 1], intermediateZ[i]));
    }

    var phiText = [];
    for (var i = 0; i < meshSize0; ++i) {
        phiText.push("");
    }
    phiText[Math.round(meshSize0/2)] = "φ";

    var emptyText = [];
    for (var i = 0; i < meshSize1; ++i) {
        emptyText.push("");
    }

    var dphiText = emptyText.slice();
    dphiText[Math.round(meshSize1/2)] = "dφ";

    var rhodphiText = emptyText.slice();
    rhodphiText[Math.round(meshSize1/2)] = "ρ dφ";

    var data = [
        axes[0],
        axes[1],
        axes[2],
        {
            type: "scatter3d",
            mode: "lines+text",
            x: [x0, x0+0.5*Math.cos(phi), x0+0.8*Math.cos(phi)],
            y: [y0, y0+0.5*Math.sin(phi), y0+0.8*Math.sin(phi)],
            z: [z0, z0, z0],
            line: {color: orange, width: 7, dash: "solid"},
            text: ["", "dρ", ""],
            //textposition: "top left",
            textfont: {color:orange, size:18}
        },
        {
            type: "scatter3d",
            mode: "lines+text",
            x: xPhi2,
            y: yPhi2,
            z: zPhi2,
            line: {color: lilac, width: 7, dash: "solid"},
            text: rhodphiText,
            //textposition: "top",
            textfont: {color:lilac, size:18}
        },
        {
            type: "scatter3d",
            mode: "lines+text",
            x: [x0, x0, x0],
            y: [y0, y0, y0],
            z: [z0, z0+0.4, z1],
            line: {color: cyan, width: 7, dash: "solid"},
            text: ["", "dz", ""],
            //textposition: "left",
            textfont: {color:cyan, size:18}
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: [0, 3*x0/5, x0],
            y: [0, 3*y0/5, y0],
            z: [0, 0, 0],
            line: {color: "rgb(0,0,0)", width: 2},
            text: ["", "ρ", ""],
            textposiition: "bottom"
        },
        new Line([[0, 0, 0], [x1, y1, 0]]).gObject("rgb(0,0,0)", 2),
        new Line([[x0, y0, 0], [x0, y0, z]]).gObject("rgb(0,0,0)", 2, "longdash"),
        new Line([[x1, y1, 0], [x1, y1, z]]).gObject("rgb(0,0,0)", 2, "longdash"),
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xPhi0,
            y: yPhi0,
            z: zPhi0,
            line: {color: "rgb(0,0,0)", width: 2},
            text: phiText,
            //textposition: "bottom"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xPhi1,
            y: yPhi1,
            z: zPhi1,
            line: {color: "rgb(0,0,0)", width: 2},
            text: dphiText,
            textposition: "top"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xPhi2,
            y: yPhi2,
            z: zPhi1,
            line: {color: "rgb(0,0,0)", width: 2},
            text: rhodphiText,
            //textposition: "bottom"
        },
        {
            type: "scatter3d",
            mode: "lines",
            x: xTrace,
            y: yTrace,
            z: zTrace[0],
            line: {color: "rgb(0,62,116)", width: 2},
            surfaceaxis: 2,
            opacity: 0.2
        },
        {
            type: "scatter3d",
            mode: "lines",
            x: xTrace,
            y: yTrace,
            z: zTrace[zTrace.length - 1],
            line: {color: "rgb(0,62,116)", width: 2},
            surfaceaxis: 2,
            opacity: 0.2
        },
        {
            type: "surface",
            x: xTrace1,
            y: yTrace1,
            z: zTrace,
            showscale: false,
            opacity: 0.4,
            colorscale: [[0.0, "rgb(0,62,116)"], [1.0, "rgb(255,255,255)"]]
        }
    ];

    return data;
}
function computeSpherical(r, theta, phi) {
    var x0 = r*Math.cos(phi)*Math.sin(theta);
    var y0 = r*Math.sin(phi)*Math.sin(theta);
    var z0 = r*Math.cos(theta);
    currentPoint = [Math.round(x0*10)/10, Math.round(y0*10)/10, Math.round(z0*10)/10];

    var newPhi = phi + Math.PI/16;
    var newTheta = theta + 3*Math.PI/64;

    var x1 = r*Math.cos(newPhi)*Math.sin(theta);
    var y1 = r*Math.sin(newPhi)*Math.sin(theta);
    var z1 = r*Math.cos(theta);

    var x2 = r*Math.cos(phi)*Math.sin(newTheta);
    var y2 = r*Math.sin(phi)*Math.sin(newTheta);
    var z2 = r*Math.cos(newTheta)

    var meshSize0 = Math.round(phi/Math.PI*24);

    var intermediatePhi0 = numeric.linspace(0, phi, meshSize0);
    var xPhi0 = [], yPhi0 = [];
    for(var i = 0; i < meshSize0; ++i) {
        xPhi0[i] = 0.3*r*Math.cos(intermediatePhi0[i])*Math.sin(theta);
        yPhi0[i] = 0.3*r*Math.sin(intermediatePhi0[i])*Math.sin(theta);
    }
    var zPhi0 = numeric.rep([meshSize0], 0);

    var meshSize1 = 9;
    var curved = curveMore(meshSize1);

    var intermediatePhi1 = numeric.linspace(phi, newPhi, meshSize1);
    var xPhi1 = [], yPhi1 = [], zPhi1 = numeric.rep([meshSize1], 0);
    var xPhi2 = [], yPhi2 = [], zPhi2 = numeric.rep([meshSize1], z0);
    for(var i = 0; i < meshSize1; ++i) {
        xPhi1[i] = 0.45*r*Math.cos(intermediatePhi1[i])*Math.sin(theta);
        yPhi1[i] = 0.45*r*Math.sin(intermediatePhi1[i])*Math.sin(theta);
        xPhi2[i] = curved[i]*r*Math.cos(intermediatePhi1[i])*Math.sin(theta);
        yPhi2[i] = curved[i]*r*Math.sin(intermediatePhi1[i])*Math.sin(theta);
    }

    var meshSize2 = Math.round(theta/Math.PI*24);
    var intermediateTheta0 = numeric.linspace(0, theta, meshSize2);
    var xTheta0 = [], yTheta0 = [], zTheta0 = [];
    for(var i = 0; i < meshSize2; ++i) {
        xTheta0[i] = 0.3*r*Math.cos(phi)*Math.sin(intermediateTheta0[i]);
        yTheta0[i] = 0.3*r*Math.sin(phi)*Math.sin(intermediateTheta0[i]);
        zTheta0[i] = 0.3*r*Math.cos(intermediateTheta0[i]);
    }

    var intermediateTheta1 = numeric.linspace(theta, newTheta, meshSize1);
    var xTheta1 = [], yTheta1 = [], zTheta1 = [];
    var xTheta2 = [], yTheta2 = [];
    var zTemp1 = [], zTemp2 = [];
    for(var i = 0; i < meshSize1; ++i) {
        xTheta1[i] = 0.45*r*Math.cos(phi)*Math.sin(intermediateTheta1[i]);
        yTheta1[i] = 0.45*r*Math.sin(phi)*Math.sin(intermediateTheta1[i]);
        zTheta1[i] = 0.45*r*Math.cos(intermediateTheta1[i]);
        xTheta2[i] = curved[i]*r*Math.cos(phi)*Math.sin(intermediateTheta1[i]);
        yTheta2[i] = curved[i]*r*Math.sin(phi)*Math.sin(intermediateTheta1[i]);
        zTemp1[i] = curved[i]*r*Math.cos(intermediateTheta1[i]);
        zTemp2[i] = curved[i]*(r + 0.8)*Math.cos(intermediateTheta1[i]);
    }

    var xTrace = [], yTrace = [], zTrace = [];

    var xTemp1, yTemp1, xTemp2, yTemp2;
    zTemp2.reverse();

    for (var i = 0; i < meshSize1; ++i) {
        xTemp1 = [], xTemp2 = [], yTemp1 = [], yTemp2 = [];
        for (var j = 0; j < meshSize1; ++j) {
            xTemp1[j] = curved[j]*r*Math.cos(intermediatePhi1[i])*Math.sin(intermediateTheta1[j]);
            yTemp1[j] = curved[j]*r*Math.sin(intermediatePhi1[i])*Math.sin(intermediateTheta1[j]);
            xTemp2[j] = curved[j]*(r + 0.8)*Math.cos(intermediatePhi1[i])*Math.sin(intermediateTheta1[j]);
            yTemp2[j] = curved[j]*(r + 0.8)*Math.sin(intermediatePhi1[i])*Math.sin(intermediateTheta1[j]);
        }
        xTrace[i] = xTemp1.concat(xTemp2.reverse());
        xTrace[i].push(xTemp1[0]);
        yTrace[i] = yTemp1.concat(yTemp2.reverse());
        yTrace[i].push(yTemp1[0]);
        zTrace[i] = zTemp1.concat(zTemp2);
        zTrace[i].push(zTemp1[0]);
    }

    var phiText = [];
    for (var i = 0; i < meshSize0; ++i) {
        phiText.push("");
    }
    phiText[Math.round(meshSize0/2)] = "φ";

    var thetaText = [];
    for (var i = 0; i < meshSize2; ++i) {
        thetaText.push("");
    }
    thetaText[Math.round(meshSize2/2)] = "θ";

    var emptyText = [];
    for (var i = 0; i < meshSize1; ++i) {
        emptyText.push("");
    }

    var dphiText = emptyText.slice();
    dphiText[Math.round(meshSize1/2)] = "dφ";

    var dthetaText = emptyText.slice();
    dthetaText[Math.round(meshSize1/2)] = "dθ";

    var rdthetaText = emptyText.slice();
    rdthetaText[Math.round(meshSize1/2)] = "r dθ";

    var rsinthetadphiText = emptyText.slice();
    rsinthetadphiText[Math.round(meshSize1/2)] = "r sin(θ) dφ";

    var data = [
        axes[0],
        axes[1],
        axes[2],
        {
            type: "scatter3d",
            mode: "lines+text",
            x: [x0, x0+0.6*Math.cos(phi)*Math.sin(theta), x0+0.8*Math.cos(phi)*Math.sin(theta)],
            y: [y0, y0+0.6*Math.sin(phi)*Math.sin(theta), y0+0.8*Math.sin(phi)*Math.sin(theta)],
            z: [z0, z0+0.6*Math.cos(theta), z0+0.8*Math.cos(theta)],
            line: {color: cyan, width: 7},
            text: ["", "dr", ""],
            textfont: {color: cyan, size:17},
            //textposition: "top center"
        },
        {
            type: "scatter3d",
            mode: "lines+text",
            x: xPhi2,
            y: yPhi2,
            z: zPhi2,
            line: {color: lilac, width: 7},
            text: rsinthetadphiText,
            textfont: {color: lilac, size:17},
            //textposition: "top"
        },
        {
            type: "scatter3d",
            mode: "lines+text",
            x: xTheta2,
            y: yTheta2,
            z: zTemp1,
            line: {color: orange, width: 7},
            text: rdthetaText,
            textfont: {color: orange, size:17},
            //textposition: "left"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: [0, 3*x0/5, x0],
            y: [0, 3*y0/5, y0],
            z: [0, 0, 0],
            line: {color: "rgb(0,0,0)", width: 2},
            text: ["", "r sin(θ)", ""],
            //textposition: "bottom"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: [0, 3*x0/5, x0],
            y: [0, 3*y0/5, y0],
            z: [z0, z0, z0],
            line: {color: "rgb(0,0,0)", width: 2},
            text: ["(0, 0, r cos(θ))", "r sin(θ)", ""],
            //textposition: "bottom"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: [0, 0.65*x0, x0],
            y: [0, 0.65*y0, y0],
            z: [0, 0.65*z0, z0],
            line: {color: "rgb(0,0,0)", width: 2},
            text: ["", "r", ""],
            //textposition: "top"
        },
        new Line([[0, 0, 0], [x2, y2, z2]]).gObject("rgb(0,0,0)", 2),
        new Line([[0, 0, z0], [x1, y1, z0]]).gObject("rgb(0,0,0)", 2),
        new Line([[0, 0, 0], [x1, y1, 0]]).gObject("rgb(0,0,0)", 2),
        new Line([[x0, y0, 0], [x0, y0, z0]]).gObject("rgb(0,0,0)", 2, "longdash"),
        new Line([[x1, y1, 0], [x1, y1, z0]]).gObject("rgb(0,0,0)", 2, "longdash"),
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xPhi0,
            y: yPhi0,
            z: zPhi0,
            line: {color: "rgb(0,0,0)", width: 2},
            text: phiText,
            //textposition: "bottom"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xPhi1,
            y: yPhi1,
            z: zPhi2,
            line: {color: "rgb(0,0,0)", width: 2},
            text: dphiText,
            //textposition: "top"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xPhi1,
            y: yPhi1,
            z: zPhi1,
            line: {color: "rgb(0,0,0)", width: 2},
            text: dphiText,
            //textposition: "top"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xPhi2,
            y: yPhi2,
            z: zPhi1,
            line: {color: "rgb(0,0,0)", width: 2},
            text: rsinthetadphiText,
            //textposition: "bottom"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xTheta0,
            y: yTheta0,
            z: zTheta0,
            line: {color: "rgb(0,0,0)", width: 2},
            text: thetaText,
            //textposition: "top"
        },
        {
            type: "scatter3d",
            mode: blackTextType,
            x: xTheta1,
            y: yTheta1,
            z: zTheta1,
            line: {color: "rgb(0,0,0)", width: 2},
            text: dthetaText,
            //textposition: "bottom"
        },
        {
            type: "scatter3d",
            mode: "lines",
            x: xTrace[0],
            y: yTrace[0],
            z: zTrace[0],
            line: {color: "rgb(0,62,116)", width: 2},
            surfaceaxis: 0,
            opacity: 0.2
        },
        {
            type: "scatter3d",
            mode: "lines",
            x: xTrace[xTrace.length - 1],
            y: yTrace[yTrace.length - 1],
            z: zTrace[zTrace.length - 1],
            line: {color: "rgb(0,62,116)", width: 2},
            surfaceaxis: 0,
            opacity: 0.2
        },
        {
            type: "surface",
            x: xTrace,
            y: yTrace,
            z: zTrace,
            showscale: false,
            opacity: 0.4,
            colorscale: [[0.0, "rgb(0,62,116)"], [1.0, "rgb(255,255,255)"]]
        }
    ];

    return data;
}

function updatePlot() {
    var data = [];
    var href = $('ul.tab-nav li a.active.button').attr('href'); // active href

    if (href === "#cylin") {
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

    $("input[type=checkbox]").each(function () {
        $(this).on("change", function() {
            isBlackText = !isBlackText;
            if (isBlackText) {
                blackTextType = "lines+text";
            } else {
                blackTextType = "lines";
            }
            initRiley($('ul.tab-nav li a.active.button').attr('href'));

        });
    });

    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initRiley(href);
            return false;
        });
    });

    initRiley("#cylin");
}
$(document).ready(main);