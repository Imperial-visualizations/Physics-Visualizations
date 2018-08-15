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

var isInterShown = false;

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

function addIntersection(data, point, normal, a1, b1, c1, d1, a2, b2, c2, d2, color){
    normal[0] = b1*c2 - b2*c1;
    normal[1] = a2*c1 - a1*c2;
    normal[2] = a1*b2 - a2*b1;

    var x;
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

    increaseMag(normal, 100);
    data.push({
        type: "scatter3d",
        mode: "lines",
        x: [point[0] - normal[0], point[0] + normal[0]],
        y: [point[1] - normal[1], point[1] + normal[1]],
        z: [point[2] - normal[2], point[2] + normal[2]],
        line: {color: color, width: 8}
    });

    normalise(normal);
    sig2(normal);
    sig2(point);

    return 0;
}

function addLine(data, point, direction, color){
    increaseMag(direction, 100);
    data.push({
        type: "scatter3d",
        mode: "lines",
        x: [point[0] - direction[0], point[0] + direction[0]],
        y: [point[1] - direction[1], point[1] + direction[1]],
        z: [point[2] - direction[2], point[2] + direction[2]],
        line: {color: color, width: 8}
    });
    return 0;
}

function addPoint(data, point, color){
    data.push({
        type: "scatter3d",
        mode: "markers",
        x: [point[0]],
        y: [point[1]],
        z: [point[2]],
        marker: {color: color, width: 8}
    });
    return 0;
}

function increaseMag(value, limit) {
    for (var i=0; i<value.length; ++i){
        if(value[i] !== 0){
            while (Math.abs(value[i]) < limit){
                value[i] *= 10;
            }
        }
    }
    return 0;
}

function normalise(value) {
    var mag = math.norm(value);
    if (mag !== 0){
        for (var i=0; i<value.length; ++i){
            value[i] = value[i]/mag;
        }
    }
    return 0;
}

function sig2(value) {
    for (var i=0; i<value.length; ++i){
        value[i] = Math.round(value[i]*100)/100;
    }
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
        c3 = parseFloat($("#c3Input").val()), d3 = parseFloat($("#d3Input").val()),

        e1 = parseFloat($("#e1Input").val()), i1 = parseFloat($("#i1Input").val()),
        f1 = parseFloat($("#f1Input").val()), j1 = parseFloat($("#j1Input").val()),
        g1 = parseFloat($("#g1Input").val()), k1 = parseFloat($("#k1Input").val()),
        e2 = parseFloat($("#e2Input").val()), i2 = parseFloat($("#i2Input").val()),
        f2 = parseFloat($("#f2Input").val()), j2 = parseFloat($("#j2Input").val()),
        g2 = parseFloat($("#g2Input").val()), k2 = parseFloat($("#k2Input").val()),

        x = parseFloat($("#xInput").val()), y = parseFloat($("#yInput").val()), z = parseFloat($("#zInput").val());

    var point, direction;
    if(!$("#plane1").is(":hidden")){addPlane(data, a1, b1, c1, d1, cyan);};
    if(!$("#plane2").is(":hidden")){addPlane(data, a2, b2, c2, d2, orange);};
    if(!$("#plane3").is(":hidden")){addPlane(data, a3, b3, c3, d3, lilac);};

    if (!$("#plane1").is(":hidden") && !$("#plane2").is(":hidden")) {
        point = []; direction = [];
        addIntersection(data, point, direction, a1, b1, c1, d1, a2, b2, c2, d2, "rgb(0,255,0)");
        $("#intersection1").text("Plane 1 & Plane 2: " + "Point: " + point + " " + "Direction: " + direction);
    }
    if (!$("#plane2").is(":hidden") && !$("#plane3").is(":hidden")) {
        point = []; direction = [];
        addIntersection(data, point, direction, a2, b2, c2, d2, a3, b3, c3, d3, "rgb(255,0,0)");
        $("#intersection2").text("Plane 2 & Plane 3: " + "Point: " + point + " " + "Direction: " + direction);
    }
    if (!$("#plane1").is(":hidden") && !$("#plane3").is(":hidden")) {
        point = []; direction = [];
        addIntersection(data, point, direction, a1, b1, c1, d1, a3, b3, c3, d3, "rgb(0,0,255)");
        $("#intersection3").text("Plane 1 & Plane 3: " + "Point: " + point + " " + "Direction: " + direction);
    }

    if(!$("#line01").is(":hidden")){addLine(data, [e1, f1, g1], [i1, j1, k1], black);};
    if(!$("#line02").is(":hidden")){addLine(data, [e2, f2, g2], [i2, j2, k2], "#7ec0ee");};

    if(!$("#point1").is(":hidden")){addPoint(data, [x, y, z], black);};


    return 0;
}

function update() {
    Plotly.purge("graph");
    var data = [];
    var error = compute(data);

    updateIntersection();
    Plotly.newPlot("graph", data, layout);
    return 0;
}

function updateIntersection() {
    if(isInterShown){
        hideIntersection();
        if (!$("#plane1").is(":hidden") && !$("#plane2").is(":hidden")) {
            $("#intersection1").show();
        }
        if (!$("#plane2").is(":hidden") && !$("#plane3").is(":hidden")) {
            $("#intersection2").show();
        }
        if (!$("#plane1").is(":hidden") && !$("#plane3").is(":hidden")) {
            $("#intersection3").show();
        }
    } else{
        hideIntersection();
    }


    return 0;
}

function hideIntersection() {
    $("#intersection1").hide();
    $("#intersection2").hide();
    $("#intersection3").hide();
    return 0;
}

function main() {
    $("input[type=number]").each(function () {
        $(this).on('keyup',function () {
            if(event.keyCode == 13) {
                let n = $(this).val();
                if( n.match(/^-?\d*(\.\d+)?$/) && !isNaN(parseFloat(n)) ){
                    $("#inputError").hide();
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

    $("input[type=submit]").click(function () {
        if ($(this).attr("id") === "showIntersection") {
            isInterShown = !isInterShown;
            updateIntersection();
            document.getElementById("showIntersection").value = (isInterShown) ?
            "Hide Equations of Intersection Lines":"Show Equations of Intersection Lines";
        }
    });

    $(".closeBtn").click(function () {
        $("#" + $(this).attr("id").slice(0,6)).hide();
        update();
    });

    init();
    initGuidance(["graph", "addButtons", "equations", "showIntersection"]);
}
$(document).ready(main);