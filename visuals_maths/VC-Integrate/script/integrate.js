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

    var data;
    var x1, x2, x3, y1, y2, y3, z1, z2, z3;
    var interval = 0.5;
    var initX, initY, initZ;
    var activeTab = $('.tab-pane.active').attr('id');
    if (activeTab === 'carte') {
        maxDataSize = 12;
        // 1st volume elements
        x2 = 0.5; y2 = b/3; z2 = c/3;
        x1 = 0; y1 = y2 - interval; z1 = z2 - interval;
        x3 = 8*a/9;

        initY = [y1, y2, y2, y1, y1, y2, y2, y1];
        initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

        while (x2 < x3) {
            data = [];
            initX = [x1, x1, x2, x2, x1, x1, x2, x2];
            carteVolume1(data, initX, initY, initZ, cyan, 0.8);
            carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan, 0.2);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [x3],
                y: [y1],
                z: [z1],
                line: {color: lilac, width: 3, dash: "solid"},
                text: ["x = a(1 - (y/b)² - (z/c)²)^0.5"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [x1],
                y: [y1],
                z: [z1],
                line: {color: lilac, width: 3, dash: "solid"},
                text: ["x = 0"],
                textfont: {color:black, size:16},
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            x2 += interval;
        }

        data = [];
        carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan, 0.8);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        //2nd Volume Elements
        data = [];
        carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan);
        carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);

        var y3 = b*Math.sin(Math.acos(z2/c));
        y2 = 0.5;
        while(y2 < y3){
            data = [];
            carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2);
            carteVolume2(data, a, b, c, [y2], [z1, z2], cyan);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b],
                z: [c/3],
                line: {color: black, width: 3, dash: "solid"},
                text: ["y = b(1 - (z/c)²)^0.5"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [0],
                z: [c/3],
                line: {color: black, width: 3, dash: "solid"},
                text: ["y = 0"],
                textfont: {color:black, size:16},
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            y2 += interval;
        }

        data = [];
        carteVolume2(data, a, b, c, [], [z1, z2], cyan);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);

        //3rd VE
        var zPoints = [0];
        var z3 = 0.5;
        while (z3 < c) {
            zPoints.push(z3);
            data = [];
            carteVolume2(data, a, b, c, [], zPoints, cyan);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b/2],
                z: [c],
                line: {color: black, width: 3, dash: "solid"},
                text: ["z = c"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b/2],
                z: [0],
                line: {color: black, width: 3, dash: "solid"},
                text: ["z = 0"],
                textfont: {color:black, size:16},
                textposition: "bottom",
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            z3 += interval;
        }

        data = [];
        data.push(qSphere.gObject(cyan, white, 1));
        data.push(qSphere.gObjectX(cyan, 1));
        data.push(qSphere.gObjectY(cyan, 1));
        data.push(qSphere.gObjectZ(cyan, 1));
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);
    } else if(activeTab === 'cylin') {
        maxDataSize = 12;
        // 1st volume elements
        x2 = 0.5; y2 = 0.5; z2 = c/3;
        x1 = 0; y1 = 0; z1 = z2 - interval;
        x3 = 8*a/9;

        initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

        while (x2 < x3) {
            data = [];
            initX = [x1, x1, x2, x2, x1, x1, x2, x2];
            initY = [y1, y2, y2, y1, y1, y2, y2, y1];
            carteVolume1(data, initX, initY, initZ, cyan, 0.8);
            carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan, 0.2);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [x3],
                y: [y1],
                z: [z1],
                line: {color: lilac, width: 3, dash: "solid"},
                text: ["x = a(1 - (y/b)² - (z/c)²)^0.5"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [x1],
                y: [y1],
                z: [z1],
                line: {color: lilac, width: 3, dash: "solid"},
                text: ["x = 0"],
                textfont: {color:black, size:16},
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            x2 += 0.25*Math.sqrt(2);
            y2 += 0.25*Math.sqrt(2);
        }

        data = [];
        carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan, 0.8);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        //2nd Volume Elements
        data = [];
        carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan);
        carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);

        var y3 = b*Math.sin(Math.acos(z2/c));
        y2 = 0.5;
        while(y2 < y3){
            data = [];
            carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2);
            carteVolume2(data, a, b, c, [y2], [z1, z2], cyan);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b],
                z: [c/3],
                line: {color: black, width: 3, dash: "solid"},
                text: ["y = b(1 - (z/c)²)^0.5"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [0],
                z: [c/3],
                line: {color: black, width: 3, dash: "solid"},
                text: ["y = 0"],
                textfont: {color:black, size:16},
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            y2 += interval;
        }

        data = [];
        carteVolume2(data, a, b, c, [], [z1, z2], cyan);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);

        //3rd VE
        var zPoints = [0];
        var z3 = 0.5;
        while (z3 < c) {
            zPoints.push(z3);
            data = [];
            carteVolume2(data, a, b, c, [], zPoints, cyan);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b/2],
                z: [c],
                line: {color: black, width: 3, dash: "solid"},
                text: ["z = c"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b/2],
                z: [0],
                line: {color: black, width: 3, dash: "solid"},
                text: ["z = 0"],
                textfont: {color:black, size:16},
                textposition: "bottom",
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            z3 += interval;
        }

        data = [];
        data.push(qSphere.gObject(cyan, white, 1));
        data.push(qSphere.gObjectX(cyan, 1));
        data.push(qSphere.gObjectY(cyan, 1));
        data.push(qSphere.gObjectZ(cyan, 1));
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);
    } else if(activeTab === 'spher') {
        maxDataSize = 12;
        // 1st volume elements
        data = [];
        x2 = 0.5; y2 = b/3; z2 = c/3;
        x1 = 0; y1 = y2 - interval; z1 = z2 - interval;
        x3 = 8*a/9;

        initY = [y1, y2, y2, y1, y1, y2, y2, y1];
        initZ = [z1, z1, z1, z1, z2, z2, z2, z2];

        while (x2 < x3) {
            data = [];
            initX = [x1, x1, x2, x2, x1, x1, x2, x2];
            carteVolume1(data, initX, initY, initZ, cyan, 0.8);
            carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan, 0.2);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [x3],
                y: [y1],
                z: [z1],
                line: {color: lilac, width: 3, dash: "solid"},
                text: ["x = a(1 - (y/b)² - (z/c)²)^0.5"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [x1],
                y: [y1],
                z: [z1],
                line: {color: lilac, width: 3, dash: "solid"},
                text: ["x = 0"],
                textfont: {color:black, size:16},
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            x2 += interval;
        }

        data = [];
        carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan, 0.8);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        //2nd Volume Elements
        data = [];
        carteVolume1(data, [x1, x1, x3+1/9, x3+2/9, x1, x1, x3, x3+1/9], initY, initZ, cyan);
        carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);

        var y3 = b*Math.sin(Math.acos(z2/c));
        y2 = 0.5;
        while(y2 < y3){
            data = [];
            carteVolume2(data, a, b, c, [], [z1, z2], cyan, 0.2);
            carteVolume2(data, a, b, c, [y2], [z1, z2], cyan);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b],
                z: [c/3],
                line: {color: black, width: 3, dash: "solid"},
                text: ["y = b(1 - (z/c)²)^0.5"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [0],
                z: [c/3],
                line: {color: black, width: 3, dash: "solid"},
                text: ["y = 0"],
                textfont: {color:black, size:16},
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            y2 += interval;
        }

        data = [];
        carteVolume2(data, a, b, c, [], [z1, z2], cyan);
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);

        //3rd VE
        var zPoints = [0];
        var z3 = 0.5;
        while (z3 < c) {
            zPoints.push(z3);
            data = [];
            carteVolume2(data, a, b, c, [], zPoints, cyan);

            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b/2],
                z: [c],
                line: {color: black, width: 3, dash: "solid"},
                text: ["z = c"],
                textfont: {color:black, size:16},
                opacity: 1
            });
            data.push({
                type: "scatter3d",
                mode: "lines+text",
                x: [a/2],
                y: [b/2],
                z: [0],
                line: {color: black, width: 3, dash: "solid"},
                text: ["z = 0"],
                textfont: {color:black, size:16},
                textposition: "bottom",
                opacity: 1
            });

            addEmptyObjects3d(data, maxDataSize - data.length);
            frames.push({data: data});
            z3 += interval;
        }

        data = [];
        data.push(qSphere.gObject(cyan, white, 1));
        data.push(qSphere.gObjectX(cyan, 1));
        data.push(qSphere.gObjectY(cyan, 1));
        data.push(qSphere.gObjectZ(cyan, 1));
        addEmptyObjects3d(data, maxDataSize - data.length);
        frames.push({data: data});

        stops.push(frames.length - 1);
    }

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
            initPlot();
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