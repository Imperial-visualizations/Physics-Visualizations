//Global Initial Parameters:
var initialPoint = [1.5, 1.5];
var layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5, 5], zeroline: true, title: "x"},
    yaxis: {range: [-5, 5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};
var currentPoint = initialPoint;
var initialRho = 0, initialPhi = 0, initialR = 0, initialTheta = 0;
var isBlackText = false;
var blackTextType = "lines";

/**
 * It adds more curvatures to multiply to the curve array.
 * @param {float} arraySize - size of the curve array.
 */
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
/**
 * Resets and plots initial area element or basis vectors of plane polar.
 * @param {string} type - basis vectors or area element
 */
function initPolar(type) {
    Plotly.purge("graph");
    initialRho = Math.sqrt(currentPoint[0]*currentPoint[0] + currentPoint[1]*currentPoint[1]);
    initialPhi = ((Math.atan2(currentPoint[1], currentPoint[0]) + 2*Math.PI) % (2*Math.PI))/Math.PI;
    initialRho = Math.round(initialRho*10)/10;
    initialPhi = Math.round(initialPhi*8)/8;

    $("#rhoController").val(initialRho);
    $("#rhoControllerDisplay").text(initialRho);
    $("#phiController").val(initialPhi);
    $("#phiControllerDisplayA1").text("(" + initialPhi*8 + "/8)" + $("#phiControllerDisplayA1").attr("data-unit"));
    $("#phiControllerDisplayA2").text(initialPhi*180 + $("#phiControllerDisplayA2").attr("data-unit"));

    var rho = parseFloat(document.getElementById('rhoController').value);
    var phi = parseFloat(document.getElementById('phiController').value)*Math.PI;

    if (type === "#basis"){
        Plotly.newPlot("graph", computeBasis(rho, phi), layout);
    } else if (type === "#area"){
        Plotly.newPlot("graph", computeArea(rho, phi), layout);
    }
    return;
}
/**
 * Computes the basis vectors of plane polar.
 * @param {float} rho - rho value.
 * @param {float} phi - phi value.
 */
function computeBasis(rho, phi) {
    var x = rho*Math.cos(phi);
    var y = rho*Math.sin(phi);
    currentPoint = [Math.round(x*10)/10, Math.round(y*10)/10];

    var meshSize = Math.round(phi/Math.PI*24);
    if (meshSize === 0) {meshSize = 2;}

    var t = numeric.linspace(0, phi, meshSize);
    var xTrace = [], yTrace = [];
    for(var i = 0; i < meshSize; ++i) {
        xTrace[i] = rho*Math.cos(t[i]);
        yTrace[i] = rho*Math.sin(t[i]);
    }
    var circle = new Circle(rho);
    rhoLine = new Line2d([[x, y], [x+Math.cos(phi), y+Math.sin(phi)]]);
    phiLine = new Line2d([[x, y], [x-Math.sin(phi), y+Math.cos(phi)]]);
    var data = [
        rhoLine.gObject(orange, 3),
        rhoLine.arrowHead(orange, 3),
        phiLine.gObject(lilac, 3),
        phiLine.arrowHead(lilac, 3),
        {
            type: "scatter",
            mode: "lines",
            x: [0, x],
            y: [0, y],
            line: {color: black, width: 2}
        },
        circle.gObject()
    ];

    return data;
}
/**
 * Computes the area element of plane polar.
 * @param {float} rho - rho value.
 * @param {float} phi - phi value.
 */
function computeArea(rho, phi) {
    var x0 = rho*Math.cos(phi);
    var y0 = rho*Math.sin(phi);
    currentPoint = [Math.round(x0*10)/10, Math.round(y0*10)/10];

    var newPhi = phi + Math.PI/8;

    var x1 = rho*Math.cos(newPhi);
    var y1 = rho*Math.sin(newPhi);

    var meshSize0 = Math.round(phi/Math.PI*24);

    var intermediatePhi0 = numeric.linspace(0, phi, meshSize0);
    var xPhi0 = [], yPhi0 = [];
    for(var i = 0; i < meshSize0; ++i) {
        xPhi0[i] = 0.3*rho*Math.cos(intermediatePhi0[i]);
        yPhi0[i] = 0.3*rho*Math.sin(intermediatePhi0[i]);
    }

    var meshSize1 = 9;
    var curved = curveMore(meshSize1);

    var intermediatePhi1 = numeric.linspace(phi, newPhi, meshSize1);
    var xPhi1 = [], yPhi1 = [];
    var xPhi2 = [], yPhi2 = [];
    var xPhi3 = [], yPhi3 = [];
    for(var i = 0; i < meshSize1; ++i) {
        xPhi1[i] = 0.45*rho*Math.cos(intermediatePhi1[i]);
        yPhi1[i] = 0.45*rho*Math.sin(intermediatePhi1[i]);
        xPhi2[i] = curved[i]*rho*Math.cos(intermediatePhi1[i]);
        yPhi2[i] = curved[i]*rho*Math.sin(intermediatePhi1[i]);
        xPhi3[i] = curved[i]*(rho + 1)*Math.cos(intermediatePhi1[i]);
        yPhi3[i] = curved[i]*(rho + 1)*Math.sin(intermediatePhi1[i]);
    }

    var xTrace = xPhi2.concat(xPhi3.reverse());
    xTrace.push(xPhi2[0]);
    var yTrace = yPhi2.concat(yPhi3.reverse());
    yTrace.push(yPhi2[0]);

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
        {
            type: "scatter",
            mode: "lines+text",
            x: [x0, x0+0.5*Math.cos(phi), x0+Math.cos(phi)],
            y: [y0, y0+0.5*Math.sin(phi), y0+Math.sin(phi)],
            line: {color: orange, width: 3, dash: "solid"},
            text: ["", "dρ", ""],
            textfont: {color:orange, size:16}
        },
        {
            type: "scatter",
            mode: "lines+text",
            x: xPhi2,
            y: yPhi2,
            line: {color: lilac, width: 3, dash: "solid"},
            text: rhodphiText,
            textfont: {color:lilac, size:16}
        },
        {
            type: "scatter",
            mode: blackTextType,
            x: [0, 3*x0/5, x0],
            y: [0, 3*y0/5, y0],
            line: {color: "rgb(0,0,0)", width: 2},
            text: ["", "ρ", ""],
            textfont: {color:black, size:15}
        },
        {
            type: "scatter",
            mode: "lines",
            x: xTrace,
            y: yTrace,
            line: {simplify: false, color: cyan},
            fill:'tonexty',
        }
    ];

    return data;
}

/** updates the plot according to the slider controls. */
function updatePlot() {
    var data = [];
    // NB: updates according to the active tab
    var href = $('ul.tab-nav li a.active.button').attr('href'); // finds out which tab is active

    var rho = parseFloat(document.getElementById('rhoController').value);
    var phi = parseFloat(document.getElementById('phiController').value)*Math.PI;

    if (href === "#basis") {
        data = computeBasis(rho, phi);
    } else if (href === "#area") {
        data = computeArea(rho, phi);
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
    /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
    $("input[type=range]").each(function () {
        var displayEl;
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );

            //To display angle in degree
            $("#"+$(this).attr("id") + "DisplayA2").text( parseFloat($(this).val())*180 + $("#" + $(this).attr("id") + "DisplayA2").attr("data-unit") );

            //To display the angle in radian in terms of fraction multiple of pi
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

            //NB: Display values are restricted by their definition in the HTML to always display nice number.

            updatePlot(); //Updating the plot is linked with display (Just My preference)
        });

    });

    /*Checkbox*/
    $("input[type=checkbox]").each(function () {
        $(this).on("change", function() {
            isBlackText = !isBlackText;
            if (isBlackText) {
                blackTextType = "lines+text";
            } else {
                blackTextType = "lines";
            }
            initPolar($('ul.tab-nav li a.active.button').attr('href')); // re-initialise with/out the black label

        });
    });

    /*Tabs*/
    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initPolar(href); //re-initialise when tab is changed
            return false;
        });
    });

    //The First Initialisation - I use 's' rather than 'z' :p
    initPolar("#basis");
}
$(document).ready(main); //Load main when document is ready.