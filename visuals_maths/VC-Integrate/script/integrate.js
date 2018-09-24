var axes = createAxes(4);
var layout = {
    width: 450, height: 450,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: {
            up: {x: 0, y: 0, z: 1},
            eye: {x: 1.1, y: -1.3, z: 0.8},
            center: {x: 0, y: 0, z: -0.15}
        },
        aspectratio: {x:1, y:1, z:1},
        xaxis: {range: [-1, 11], autorange: false, zeroline: true, showline: false, showticklabels: true},
        yaxis: {range: [-1, 11], autorange: false, zeroline: true, showline: false, showticklabels: true},
        zaxis: {range: [-1, 11], autorange: false, zeroline: true, showline: false, showticklabels: true},
    }
}
var stops;

function addFrame(frames, data, maxDataSize){
    addEmptyObjects3d(data, maxDataSize - data.length);
    frames.push({data: data});
    return 0;
}

function limitSurface(data, a, b, c, verticesY, verticesZ=[], color="rgb(0,0,0)", opacity=1) {
    var zLength = verticesZ.length;
    var phi, phiTemp, sinTheta = 0;
    var x = [], y = [], z = [];

    phiTemp = Math.asin(verticesY/(b*Math.sin(Math.acos(verticesZ[0]/c))));
    var meshSize = 20*Math.ceil(1 - 2*phiTemp/Math.PI);
    phi = numeric.linspace(phiTemp, 0.5*Math.PI, meshSize);

    for(var j = 0, n = zLength; j < n; ++j) {
        x[j] = [], y[j] = [], z[j] = [];
        for(var i = 0; i < meshSize; ++i) {
            sinTheta = Math.sin(Math.acos(verticesZ[j]/c));
            x[j].push(a*Math.cos(phi[i])*sinTheta);
            y[j].push(b*Math.sin(phi[i])*sinTheta);
            z[j].push(verticesZ[j]);
        }
        x[j].push(0);
        y[j].push(y[j][i-1]);
        z[j].push(verticesZ[j]);
    }

    data.push({//Curved surface
        type: "surface",
        x: x,
        y: y,
        z: z,
        showscale: false,
        opacity: opacity,
        colorscale: [[0.0, color], [1.0, color]]
    });

    return 1;
}
function limitSurface2(data, a, b, c, verticesY, verticesZ=[], color="rgb(0,0,0)", opacity=1) {
    var zLength = verticesZ.length;
    var phi, phiTemp, sinTheta = 0;
    var x = [], y = [], z = [];

    phiTemp = Math.asin(verticesY/(b*Math.sin(Math.acos(verticesZ[0]/c))));
    var meshSize = 20*Math.ceil(1 - 2*phiTemp/Math.PI);
    phi = numeric.linspace(phiTemp, phiTemp+0.1, meshSize);

    for(var j = 0, n = zLength; j < n; ++j) {
        x[j] = [], y[j] = [], z[j] = [];
        for(var i = 0; i < meshSize; ++i) {
            sinTheta = Math.sin(Math.acos(verticesZ[j]/c));
            x[j].push(a*Math.cos(phi[i])*sinTheta);
            y[j].push(b*Math.sin(phi[i])*sinTheta);
            z[j].push(verticesZ[j]);
        }
        x[j].push(0);
        y[j].push(0);
        z[j].push(verticesZ[j]);
    }

    data.push({//Curved surface
        type: "surface",
        x: x,
        y: y,
        z: z,
        showscale: false,
        opacity: opacity,
        colorscale: [[0.0, color], [1.0, color]]
    });

    xTemp = x[0].slice();
    yTemp = y[0].slice();
    zTemp = z[0].slice();

    xTemp.push(0, 0);
    yTemp.push(0, 0);
    zTemp.push(verticesZ[0], verticesZ[0]);

    data.push({//Bottom lid
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    });

    xTemp = x[zLength - 1].slice();
    yTemp = y[zLength - 1].slice();
    zTemp = z[zLength - 1].slice();

    xTemp.push(0,0);
    yTemp.push(0,0);
    zTemp.push(verticesZ[zLength - 1], verticesZ[zLength - 1]);

    data.push({//Top lid
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    });

    return 1;
}
function limitSurface3(data, a, b, c, verticesY, verticesZ=[], color="rgb(0,0,0)", opacity=1) {
    var zLength = verticesZ.length;
    var phi, phiTemp, sinTheta = 0;
    var x = [], y = [], z = [];

    phiTemp = Math.asin(verticesY/(b*Math.sin(Math.acos(verticesZ[0]/c))));
    var meshSize = 20*Math.ceil(1 - 2*phiTemp/Math.PI);
    phi = numeric.linspace(phiTemp, phiTemp+0.1, meshSize);

    for(var j = 0, n = zLength; j < n; ++j) {
        x[j] = [], y[j] = [], z[j] = [];
        for(var i = 0; i < meshSize; ++i) {
            sinTheta = Math.sin(Math.acos(verticesZ[j]/c));
            x[j].push(a*Math.cos(phi[i])*sinTheta);
            y[j].push(b*Math.sin(phi[i])*sinTheta);
            z[j].push(verticesZ[j]);
        }
        x[j].push(0);
        y[j].push(0);
        z[j].push(0);
    }

    data.push({//Curved surface
        type: "surface",
        x: x,
        y: y,
        z: z,
        showscale: false,
        opacity: opacity,
        colorscale: [[0.0, color], [1.0, color]]
    });

    xTemp = x[0].slice();
    yTemp = y[0].slice();
    zTemp = z[0].slice();

    xTemp.push(0);
    yTemp.push(0);
    zTemp.push(0);

    data.push({//Bottom lid
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    });

    xTemp = x[zLength - 1].slice();
    yTemp = y[zLength - 1].slice();
    zTemp = z[zLength - 1].slice();

    xTemp.push(0);
    yTemp.push(0);
    zTemp.push(0);

    data.push({//Top lid
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    });

    return 1;
}

function computeFrames(frames, extra){
    const // Decided these parameters are quite trivial so they are fixed.
        a = 10.0, b = 10.0, c = 10.0;
    var stops = [0];
    var maxDataSize = 0;

    var qSphere = new QuarterSphere(a,b,c);

    extra.push(qSphere.gObject(lilac, white));
    extra.push(qSphere.gObjectX(lilac));
    extra.push(qSphere.gObjectY(lilac));
    extra.push(qSphere.gObjectZ(lilac));

    var data;
    var x1, x2, x3, y1, y2, y3, z1, z2;
    var interval = 0.5;
    var initY, initZ;
    var activeTab = $('.tab-pane.active').attr('id');
    if (activeTab === 'carte') {
        maxDataSize = 14;

        // 1st Volume Elements
        x2 = 0; y2 = b/3; z2 = c/3;
        y1 = y2 - interval; z1 = z2 - interval;
        x3 = 8*a/9 + 1/9;

        initY = [y1, y2, y2, y1, y1, y2, y2, y1];
        initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

        while (x2 + 0.5 < x3) {
            data = [];
            carteVolume1(data, [0, 0, x2, x2, 0, 0, x2, x2], initY, initZ, cyan, 0.8);
            carteVolume1(data, [x2, x2, x2+0.5, x2+0.5, x2, x2, x2+0.5, x2+0.5], initY, initZ, black);
            carteVolume1(data, [0, 0, x3, x3+1/9, 0, 0, x3-1/9, x3], initY, initZ, cyan, 0.2);
            x2 += interval;

            addText(data, [-1, y1, z1], "x = 0");
            addText(data, [a, y1, z1], "x = a(1 - (y/b)² - (z/c)²)^0.5");

            addFrame(frames, data, maxDataSize);
        }

        data = [];
        carteVolume1(data, [0, 0, x3, x3+1/9, 0, 0, x3-1/9, x3], initY, initZ, cyan, 0.8);
        addFrame(frames, data, maxDataSize);
        stops.push(frames.length - 1);

        // 2nd Volume Elements
        var zTemp1 = 1 - (z1/c)**2; zTemp2 = 1 - (z2/c)**2;
        var yTemp1, yTemp2 = (0.5/b)**2;

        y3 = b*Math.sin(Math.acos(z2/c));
        y2 = 0.1;
        while(y2 < y3){
            data = [];
            yTemp1 = (y2/b)**2; yTemp2 = ((y2+0.5)/b)**2;
            carteVolume1(data, [0, 0, a*Math.sqrt(zTemp1 - yTemp2), a*Math.sqrt(zTemp1 - yTemp1), 0, 0, a*Math.sqrt(zTemp2 - yTemp2), a*Math.sqrt(zTemp2 - yTemp1)], [y2, y2+0.5, y2+0.5, y2, y2, y2+0.5, y2+0.5, y2], initZ, black);
            carteVolume2(data, a, b, c, [y2], [z1, z2], cyan);
            carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2, orange, 1, cyan, 0.4);
            limitSurface(data, a, b, c, y3 - 0.5, [z1, z2], orange2, 1);

            addText(data, [a/3, 0, c/3], "y = 0", orange);
            addText(data, [a/3, b, c/3], "y = b(1 - (z/c)²)^0.5", orange2);

            addFrame(frames, data, maxDataSize);
            y2 += 0.4;
        }

        data = [];
        carteVolume2(data, a, b, c, [], [z1, z2], cyan);
        addFrame(frames, data, maxDataSize);
        stops.push(frames.length - 1);

        //3rd Volume Elements
        data = [];
        carteVolume2(data, a, b, c, [], [0, 0.5], black);
        addFrame(frames, data, maxDataSize);
        var zPoints = [0];
        z2 = 0.5;
        while (z2 + 0.5 < c) {
            zPoints.push(z2);
            data = [];
            carteVolume2(data, a, b, c, [], zPoints, cyan);
            carteVolume2(data, a, b, c, [], [z2, z2 + 0.5], black);

            addText(data, [a/1.2, b/1.2, -1], "z = 0");
            addText(data, [a/7, b/7, c+.5], "z = c");

            addFrame(frames, data, maxDataSize);
            z2 += interval;

        }

        data = [];
        data.push(qSphere.gObject(cyan, white, 1));
        data.push(qSphere.gObjectX(cyan, 1));
        data.push(qSphere.gObjectY(cyan, 1));
        data.push(qSphere.gObjectZ(cyan, 1));
        addFrame(frames, data, maxDataSize);
    } else if(activeTab === 'cylin') {
        maxDataSize = 15;
        interval = 1/Math.sqrt(8);
        // 1st Volume Elements
        x1 = 0; y1 = 0; z1 = c/3 - 0.5;
        x2 = interval; y2 = interval; z2 = c/3;

        initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

        sinTheta1 = 0.5*(1 - (z1/c)**2);
        sinTheta2 = 0.5*(1 - (z2/c)**2);

        maxX1 = a*Math.sqrt(sinTheta1); maxX2 = a*Math.sqrt(sinTheta2);
        maxY1 = b*Math.sqrt(sinTheta1); maxY2 = b*Math.sqrt(sinTheta2);

        initX = [interval, 0, maxX1-interval/2, maxX1+interval/2, interval, 0, maxX2-interval/2, maxX2+interval/2];
        initY = [0, interval, maxY1+interval/2, maxY1-interval/2, 0, interval, maxY2+interval/2, maxY2-interval/2];
        while ( x1 + interval < maxX1 && y1 + interval < maxY1 ){
            data = [];
            carteVolume1(data, [interval, 0, x1, x2, interval, 0, x1, x2], [0, interval, y2, y1, 0, interval, y2, y1], initZ, cyan, 0.8);
            carteVolume1(data, initX, initY, initZ, cyan, 0.2);
            carteVolume1(data, [x2, x1, x1+interval, x2+interval, x2, x1, x1+interval, x2+interval], [y1, y2, y2+interval, y1+interval, y1, y2, y2+interval, y1+interval], initZ, black);
            addText(data, [-1, interval, z1], "ρ = 0");
            addText(data, [a, b, z1], "ρ = ab((1 - (z/c)²)/((b cos(φ))² + (a sin(φ))²))^0.5");
            addFrame(frames, data, maxDataSize);
            x1+=interval; x2+=interval;
            y1+=interval; y2+=interval;
        }

        data = [];
        carteVolume1(data, initX, initY, initZ, cyan);
        addFrame(frames, data, maxDataSize);
        stops.push(frames.length - 1);

        //2nd Volume Elements
        var y3 = b*Math.sin(Math.acos(z1/c));
        y2 = 0.1;
        while(y2 < y3){
            data = [];
            cylinVolume(data, a, b, c, [y2], [z1, z2], cyan);
            carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2, orange, 1, cyan, 0.2, orange2, 1);
            limitSurface2(data, a, b, c, y2, [z1, z2])

            addText(data, [a, 0, z1], "φ = 0", orange);
            addText(data, [0, b, z1], "φ = π/2", orange2);

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            y2 += interval;
        }

        data = [];
        carteVolume2(data, a, b, c, [], [z1, z2], cyan);
        addFrame(frames, data, maxDataSize);
        stops.push(frames.length - 1);

        //3rd Volume Elements
        data = [];
        carteVolume2(data, a, b, c, [], [0, 0.5], black);
        addFrame(frames, data, maxDataSize);
        var zPoints = [0];
        z2 = 0.5;
        while (z2 + 0.5 < c) {
            zPoints.push(z2);
            data = [];
            carteVolume2(data, a, b, c, [], zPoints, cyan);
            carteVolume2(data, a, b, c, [], [z2, z2 + 0.5], black);

            addText(data, [a/1.2, b/1.2, -1], "z = 0");
            addText(data, [a/7, b/7, c+.5], "z = c");

            addFrame(frames, data, maxDataSize);
            z2 += interval;

        }

        data = [];
        data.push(qSphere.gObject(cyan, white, 1));
        data.push(qSphere.gObjectX(cyan, 1));
        data.push(qSphere.gObjectY(cyan, 1));
        data.push(qSphere.gObjectZ(cyan, 1));
        addFrame(frames, data, maxDataSize);
    } else if(activeTab === 'spher') {
        maxDataSize = 15;
        var intervalZ = 0, sq8 = 1/Math.sqrt(8);
        interval = 0;
        // 1st Volume Elements
        x1 = 1/Math.sqrt(32); y1 = x1; z1 = 2*x1;
        x2 = 0.25; y2 = 0.25; z2 = 2*z1;

        maxZ1 = c/Math.sqrt(2) - z1/2; maxZ2 = maxZ1 + z1;
        maxX1 = a*Math.sqrt(0.5*(1 - (maxZ1/c)**2)); maxX2 = a*Math.sqrt(0.5*(1 - (maxZ2/c)**2));
        maxY1 = b*Math.sqrt(0.5*(1 - (maxZ1/c)**2)); maxY2 = b*Math.sqrt(0.5*(1 - (maxZ2/c)**2));

        //initX = [x2, 0, 0.25, x2+0.25, x2-0.25, -0.25, 0, x2];
        //initY = [0, y2, y2+0.25, 0.25, -0.25, y2-0.25, y2, 0];
        //initZ = [0, 0, z2, z2, z2, z2, 2*z2, 2*z2];

        var firstX = [z1, 0, maxX1-x1, maxX1+x1, z1-0.25, -0.25, maxX2-x1, maxX2+x1],
            firstY = [0, z1, maxY1+y1, maxY1-y1, -0.25, z1-0.25, maxY2+y1, maxY2-y1],
            firstZ = [0, 0, maxZ1, maxZ1, z1, z1, maxZ2, maxZ2];

        while ( z1 + interval < maxX1 ){ // Since the shape is symmetrical, only check for one ie 'x'.
            data = [];
            carteVolume1(data,
                [z1, 0, 0.25+interval, z1+0.25+interval, z1-0.25, -0.25, interval, z1+interval],
                [0, z1, z1+0.25+interval, 0.25+interval, -0.25, z1-0.25, z1+interval, interval],
                [0, 0, z1+intervalZ, z1+intervalZ, z1, z1, z2+intervalZ, z2+intervalZ], cyan, 0.8);
            carteVolume1(data, firstX, firstY, firstZ, cyan, 0.2);
            carteVolume1(data,
                [z1+interval, interval, 0.25+interval, z1+0.25+interval, z1-0.25+interval, interval-0.25, interval, z1+interval],
                [interval, z1+interval, z1+0.25+interval, 0.25+interval, interval-0.25, interval+z1-0.25, z1+interval, interval],
                [intervalZ, intervalZ, z1+intervalZ, z1+intervalZ, z1+intervalZ, z1+intervalZ, z2+intervalZ, z2+intervalZ], black);
            addText(data, [-1, -1, -1], "ρ = 0");
            addText(data, [maxX1, maxY1, maxZ1], "ρ = ((a² + b²)(1 - (z/c)²))^0.5");
            addFrame(frames, data, maxDataSize);
            interval+=0.25; intervalZ+=sq8;
        }

        data = [];
        carteVolume1(data, firstX, firstY, firstZ, black);
        addFrame(frames, data, maxDataSize);
        stops.push(frames.length - 1);

        //2nd Volume Elements
        var y3 = b*Math.sin(Math.acos(maxZ2/c));
        y2 = 0.25;
        while(y2 < y3){
            data = [];
            spherVolume(data, a, b, c, [y2], [maxZ1, maxZ2], cyan);
            spherVolume2(data, a, b, c, [], [maxZ1, maxZ2], cyan, 0.2, orange, 1, cyan, 0.2, orange2, 1);
            limitSurface3(data, a, b, c, y2, [maxZ1, maxZ2]) //black bars

            addText(data, [maxX1, 0, maxZ1], "φ = 0", orange);
            addText(data, [0, maxY1, maxZ1], "φ = π/2", orange2);

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            y2 += 0.25;
        }

        data = [];
        spherVolume2(data, a, b, c, [], [maxZ1, maxZ2], cyan);
        addFrame(frames, data, maxDataSize);
        stops.push(frames.length - 1);

        //3rd Volume Elements
        var zPoints = [0];
        z2 = 0.5;
        while (z2 + 0.5 < c) {
            zPoints.push(z2);
            data = [];
            spherVolume2(data, a, b, c, [], zPoints, cyan);
            spherVolume2(data, a, b, c, [], [z2, z2 + 0.5], black);

            addText(data, [a/1.2, b/1.2, -1], "θ = π/2");
            addText(data, [a/7, b/7, c+.5], "θ = 0");

            addFrame(frames, data, maxDataSize);
            z2 += 0.5;
        }

        data = [];
        data.push(qSphere.gObject(cyan, white, 1));
        data.push(qSphere.gObjectX(cyan, 1));
        data.push(qSphere.gObjectY(cyan, 1));
        data.push(qSphere.gObjectZ(cyan, 1));
        addFrame(frames, data, maxDataSize);

    }

    return stops;
}

function updateText(number){
    var activeTab = $('.tab-pane.active').attr('id');
    $("#" + activeTab + 1).hide();
    $("#" + activeTab + 2).hide();
    $("#" + activeTab + 3).hide();
    if (number > stops[2]){
        $("#" + activeTab + 3).show();
    } else if (number > stops[1]){
        $("#" + activeTab + 2).show();
    } else {
        $("#" + activeTab + 1).show();
    }
}

function initPlot(){
    Plotly.purge("graph");
    var frames = [],
        extra = [];

    stops = computeFrames(frames, extra);

    $("#animateSlider").attr("max", frames.length - 1);
    initAnimation("animate", frames, extra, layout, 0, stops);
    return 0;
}

function main() {
    $("input[type=range]").each(function () {
        $(this).on('input', function(){
            var slideNumber = $(this).val();
            var activeTab = $('.tab-pane.active').attr('id');
            $("#"+$(this).attr("id") + "Display").text( slideNumber + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            historyPlot(parseFloat(slideNumber));
            updateText(slideNumber);
        });
    });

    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');
            initPlot(); //This is re-plot depends on the href!!!!!!!!!!!!!!
            var slideNumber = parseFloat($("#" + "animateSlider").val());
            updateText(slideNumber + 2);
            return false;
        });
    });

    $("input[type=submit]").click(function () {
        startAnimation();
        var slideNumber = parseFloat($("#" + "animateSlider").val());
        updateText(slideNumber + 2);
    });

    $("input[type=button]").click(function () {
        initPlot();
        var slideNumber = parseFloat($("#" + "animateSlider").val());
        updateText(slideNumber + 2);
    });

    initPlot();
    initGuidance(["graph", "coor", "equations", "buttons", "slider"]);
}
$(document).ready(main);