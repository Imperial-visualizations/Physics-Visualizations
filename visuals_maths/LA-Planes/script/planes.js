var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:50, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: {
            eye: {x: 1.2, y: 1.2, z: 1.2},
            center: {x: 0, y: 0, z: -0.15}
        },
        xaxis: {range:[-50, 50], zeroline: true, scaleratio: 1},
        yaxis: {range:[-50, 50], zeroline: true, scaleratio: 1},
        zaxis: {range:[-50, 50], zeroline: true, scaleratio: 1},
        aspectratio: {x:1, y:1, z:1},
    }
};

function addEmptyObjects3d(data, numberObj){
    for (var i=0; i < numberObj; ++i){
        data.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            line: {width: 0}
        });
    }
    return;
}

function addPlane(data, a, b, c, d, color) {
    var x, y, z;

    if (c > 1e-10) {
        x = [-50, 50, 50, -50],
        y = [-50, -50, 50, 50];
        z = [];
        for (var i=0; i<4; ++i) {
            z.push(-( d + a*x[i] + b*y[i] )/c );
        }
    } else if (b > 1e-10) {
        x = [-50, 50, 50, -50],
        z = [-50, -50, 50, 50];
        y = [];
        for (var i=0; i<4; ++i) {
            y.push(-( d + a*x[i] + c*z[i] )/b );
        }
    } else if (a > 1e-10) {
        y = [-50, 50, 50, -50],
        z = [-50, -50, 50, 50];
        x = [];
        for (var i=0; i<4; ++i) {
            x.push(-( d + b*y[i] + c*z[i] )/a );
        }
    } else {
        return 1; // not a plane.
    }

    var plane = {
        type: "mesh3d",
        x: x, y: y, z: z,
        i: [0, 2], j: [1, 3], k: [2, 0],
        opacity: 0.5,
        colorscale: [['0', color], ['1', white]],
        intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
        showscale: false
    };
    data.push(plane)
    return 0;
}

function addIntersection(data, a1, b1, c1, d1, a2, b2, c2, d2, color1, color2){
    var normal = [b1*c2 - b2*c1, a2*c1 - a1*c2, a1*b2 - a2*b1];

    var x, point = [];
    if (a1*b2 - b1*a2 != 0) {
        // z = 0
        x = math.lusolve([[a1, b1], [a2, b2]], [-d1, -d2]);
        for (var i=0; i<2; ++i){
            point.push(x[i][0]);
        }
        point.push(0);
    } else if (a1*c2 - c1*a2 != 0) {
        // y = 0
        x = math.lusolve([[a1, c1], [a2, c2]], [-d1, -d2]);
        point.push(x[0][0]);
        point.push(0);
        point.push(x[1][0]);
    } else if (b1*c2 - c1*b2 != 0) {
        // x = 0
        x = math.lusolve([[b1, c1], [b2, c2]], [-d1, -d2]);
        point.push(0);
        for (var i=0; i<2; ++i){
            point.push(x[i][0]);
        }
    } else {
        addEmptyObjects3d(data, 1);
        return 1;
    }

    var xPoints = [point[0] - 50*normal[0], point[0] + 50*normal[0]],
        yPoints = [point[1] - 50*normal[1], point[1] + 50*normal[1]],
        zPoints = [point[2] - 50*normal[2], point[2] + 50*normal[2]];

    var line = {
        type: "scatter3d",
        mode: "lines",
        x: xPoints,
        y: yPoints,
        z: zPoints,
        line: {color: color1, width: 8}
    };

    data.push(line);
    return 0;
}

function addLine(data, a1, b1, c1, d1, a2, b2, c2, d2, color1, color2){
    var normal = [b1*c2 - b2*c1, a2*c1 - a1*c2, a1*b2 - a2*b1];

    var x, point = [];
    if (a1*b2 - b1*a2 != 0) {
        // z = 0
        x = math.lusolve([[a1, b1], [a2, b2]], [-d1, -d2]);
        for (var i=0; i<2; ++i){
            point.push(x[i][0]);
        }
        point.push(0);
    } else if (a1*c2 - c1*a2 != 0) {
        // y = 0
        x = math.lusolve([[a1, c1], [a2, c2]], [-d1, -d2]);
        point.push(x[0][0]);
        point.push(0);
        point.push(x[1][0]);
    } else if (b1*c2 - c1*b2 != 0) {
        // x = 0
        x = math.lusolve([[b1, c1], [b2, c2]], [-d1, -d2]);
        point.push(0);
        for (var i=0; i<2; ++i){
            point.push(x[i][0]);
        }
    } else {
        addEmptyObjects3d(data, 1);
        return 1;
    }

    var xPoints = [point[0] - 50*normal[0], point[0] + 50*normal[0]],
        yPoints = [point[1] - 50*normal[1], point[1] + 50*normal[1]],
        zPoints = [point[2] - 50*normal[2], point[2] + 50*normal[2]];

    var line = {
        type: "scatter3d",
        mode: "lines",
        x: xPoints,
        y: yPoints,
        z: zPoints,
        line: {color: color1, width: 8}
    };

    data.push(line);
    return 0;
}


function init() {
    Plotly.purge("graph");

    var data = [];
    const
        a1 = parseFloat($("#a1Input").val()), b1 = parseFloat($("#b1Input").val()),
        c1 = parseFloat($("#c1Input").val()), d1 = parseFloat($("#d1Input").val());
    addPlane(data, a1, b1, c1, d1, cyan);

    Plotly.newPlot("graph", data, layout);
    return 0;
}

function compute(data) {
    const
        a1 = parseFloat($("#a1Input").val()), b1 = parseFloat($("#b1Input").val()),
        c1 = parseFloat($("#c1Input").val()), d1 = parseFloat($("#d1Input").val()),
        a2 = parseFloat($("#a2Input").val()), b2 = parseFloat($("#b2Input").val()),
        c2 = parseFloat($("#c2Input").val()), d2 = parseFloat($("#d2Input").val()),
        a3 = parseFloat($("#a3Input").val()), b3 = parseFloat($("#b3Input").val()),
        c3 = parseFloat($("#c3Input").val()), d3 = parseFloat($("#d3Input").val());

    if(!$("#plane1").is(":hidden")){addPlane(data, a1, b1, c1, d1, cyan);};
    if(!$("#plane2").is(":hidden")){addPlane(data, a2, b2, c2, d2, orange);};
    if(!$("#plane3").is(":hidden")){addPlane(data, a3, b3, c3, d3, lilac);};

    if (!$("#plane1").is(":hidden") && !$("#plane2").is(":hidden")) {
        addIntersection(data, a1, b1, c1, d1, a2, b2, c2, d2, "rgb(0,255,0)", white);
    }
    if (!$("#plane2").is(":hidden") && !$("#plane3").is(":hidden")) {
        addIntersection(data, a2, b2, c2, d2, a3, b3, c3, d3, "rgb(255,0,0)", white);
    }
    if (!$("#plane1").is(":hidden") && !$("#plane3").is(":hidden")) {
        addIntersection(data, a1, b1, c1, d1, a3, b3, c3, d3, "rgb(0,0,255)", white);
    }

    return 0;
}

function update() {
    Plotly.purge("graph");
    var data = [];
    var error = compute(data);

    console.log("updating", error);

    Plotly.newPlot("graph", data, layout);
    return 0;
}

function main() {
    $("input[type=number]").each(function () {
        $(this).on('keyup',function () {
            if(event.keyCode == 13) {
                let n = $(this).val();
                if( n.match(/^-?\d*(\.\d+)?$/) && !isNaN(parseFloat(n)) ){
                    $("#"+$(this).attr("id") + "Error").hide();
                    if( parseFloat(n) > -51 && parseFloat(n) < 51){
                        update();
                    } else{
                        $("#inputError").text("Invalid input: min = -50, max = 50");
                        $("#inputError").show();
                    }
                } else{
                    $("#inputError").text("Invalid input: the input needs to be a number");
                    $("#inputError").show();
                }
            }
        });
    });

    $('.fraction').each(function(key, value) {
        $this = $(this)
        var split = $this.html().split("/")
        if( split.length == 2 ){
            $this.html('<span class="top">'+split[0]+'</span><span class="bottom">'+split[1]+'</span>')
        }
    });

    $("input[type=button]").click(function () {
        if ($(this).attr("id") === "addPlane"){
            if ($("#plane2").is(":hidden")) {
                $("#plane2").show();
            } else if ($("#plane3").is(":hidden")) {
                $("#plane3").show();
            }
        } else if ($(this).attr("id") === "addLine") {
            if ($("#line01").is(":hidden")) {
                $("#line01").show();
            } else if ($("#line02").is(":hidden")) {
                $("#line02").show();
            }
        } else if ($(this).attr("id") === "addPoint") {
            $("#point1").show();
        }
        update();
    });

    $(".closeBtn").click(function () {
        $("#" + $(this).attr("id").slice(0,6)).hide();
        update();
    });

    init();
}
$(document).ready(main);