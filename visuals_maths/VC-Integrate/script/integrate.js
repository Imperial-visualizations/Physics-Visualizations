var tetrahedron;

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
        xaxis: {range: [0, 10], autorange: false, zeroline: true,},
        yaxis: {range: [0, 10], autorange: false, zeroline: true,},
        zaxis: {range: [0, 10], autorange: false, zeroline: true,},
    }
}
/*
function computeFrames(frames, extra){
    const
        a = parseFloat($("#aInput").val()),
        b = parseFloat($("#bInput").val()),
        c = parseFloat($("#cInput").val());

    extra.push({ //Tetrahedron
        type: "mesh3d",
        x: [0, 0, 0, a],
        y: [0, 0, b, 0],
        z: [0, c, 0, 0],
        i: [0, 0, 0, 1],
        j: [1, 2, 3, 2],
        k: [2, 3, 1, 3],
        intensity: [0, 0.33, 0.66, 1],
        colorscale: [ [0, 'rgb(255,255,255)'], [1, 'rgb(255,255,255)'] ],
        opacity: 0.5,
        showscale : false
    });



    // volume elements
    var data = [];
    var x2 = 0.5, y2 = b/3, z2 = c/3;
    var interval = 0.5;
    var x1 = x2 - interval, y1 = y2 - interval, z1 = z2 - interval;

    var initX = [x1, x1, x2, x2, x1, x1, x2, x2],
        initY = [y1, y2, y2, y1, y1, y2, y2, y1],
        initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

    data.push(new CartesianVE(initX, initY, initZ).gObject('rgb(0,62,116)'));
    data.push(new CartesianVE(initX, initY, initZ).gObject());
    frames.push({data: data});

    while (x1 < a/3) {
        data = [];
        x1 += interval;

        initX = [x1, x1, x2, x2, x1, x1, x2, x2];

        data.push(new CartesianVE(initX, initY, initZ).gObject());
        frames.push({data: data});
    }

    x2 = a/3;
    x1 = 0;

    initX = [x1, x1, x2+.5, x2+1, x1, x1, x2, x2+.5];
    initY = [y1, y2, y2, y1, y1, y2, y2, y1];
    initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

    frames.push({data: [new CartesianVE(initX, initY, initZ).gObject()]});

    return;
}
*/
function computeFrames(frames, extra){
    const
        a = parseFloat($("#aInput").val()),
        b = parseFloat($("#bInput").val()),
        c = parseFloat($("#cInput").val());
    var stops = [0];
    var maxDataSize = 12;

    var qSphere = new QuarterSphere(a,b,c);

    extra.push(qSphere.gObject(lilac, white));
    extra.push(qSphere.gObjectX(lilac));
    extra.push(qSphere.gObjectY(lilac));
    extra.push(qSphere.gObjectZ(lilac));


    // 1st volume elements
    var data = [];
    var x2 = 0.5, y2 = b/3, z2 = c/3;
    var interval = 0.5;
    var x1 = 0, y1 = y2 - interval, z1 = z2 - interval;
    var x3 = 8*a/9;

    var initY = [y1, y2, y2, y1, y1, y2, y2, y1],
        initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

    while (x2 < x3) {
        data = [];
        initX = [x1, x1, x2, x2, x1, x1, x2, x2];
        carteVolume1(data, initX, initY, initZ);
        carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, 'rgb(255,0,0)', 0.2);

        data.push({
            type: "scatter3d",
            mode: "lines+text",
            x: [x3],
            y: [y1],
            z: [z1],
            line: {color: lilac, width: 3, dash: "solid"},
            text: ["x = a²(1 - (y/b)² - (z/c)²)"],
            textfont: {color:"rgb(0,0,0)", size:16},
            opacity: 1
        });
        data.push({
            type: "scatter3d",
            mode: "lines+text",
            x: [0],
            y: [y1],
            z: [z1],
            line: {color: lilac, width: 3, dash: "solid"},
            text: ["x = 0"],
            textfont: {color:"rgb(0,0,0)", size:16},
            opacity: 1
        });

        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});
        x2 += interval;
    }

    data = [];
    carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ);
    addEmptyObjects3d(data, maxDataSize - data.length);
    frames.push({data: data});


    //2nd Volume Elements
    data = [];
    carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ);
    carteVolume2(data, a, b, c, [], [z1, z2], "rgb(255,0,0,0.6)", 0.2);
    addEmptyObjects3d(data, maxDataSize - data.length);
    frames.push({data: data});

    stops.push(frames.length - 1);

    var y3 = b*Math.sin(Math.acos(z2/c));
    y2 = 0.5;
    while(y2 < y3){
        data = [];
        carteVolume2(data, a, b, c, [], [z1, z2], "rgb(255,0,0,0.6)", 0.2);
        carteVolume2(data, a, b, c, [y2], [z1, z2]);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});
        y2 += interval;
    }

    data = [];
    carteVolume2(data, a, b, c, [], [z1, z2]);
    addEmptyObjects3d(data, maxDataSize - data.length);
    frames.push({data: data});

    stops.push(frames.length - 1);

    //3rd VE
    var zPoints = [0];
    var z3 = 0.5;
    while (z3 < c) {
        zPoints.push(z3);
        data = [];
        carteVolume2(data, a, b, c, [], zPoints);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});
        z3 += interval;
    }

    data = [];
    data.push(qSphere.gObject(black, white, 1));
    data.push(qSphere.gObjectX(black, 1));
    data.push(qSphere.gObjectY(black, 1));
    data.push(qSphere.gObjectZ(black, 1));
    addEmptyObjects3d(data, maxDataSize - data.length);
    frames.push({data: data});

    stops.push(frames.length - 1);

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
                    if( parseFloat(n) > 2 && parseFloat(n) < 11){
                        initPlot();
                    } else{
                        $("#"+$(this).attr("id") + "Error").text("Invalid input: min = 3, max = 10");
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
        startAnimation();
    });

    $("input[type=button]").click(function () {
        var idName = $(this).attr("id");
        initPlot();
    });

    $("select").click(function () {
        var idName = $(this).attr("id");
        if (idName === "") {
           var value = $(this).val();
           if( value === "1") {
           } else if ( value === "2") {
           } else {
           }
       }
    });

    initPlot();
}
$(document).ready(main);