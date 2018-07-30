var layout = {
    width: 500, height: 500,
    margin: {l:0, r:0, t:50, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        xaxis: {range:[-50, 50], zeroline: true, scaleratio: 1},
        yaxis: {range:[-50, 50], zeroline: true, scaleratio: 1},
        zaxis: {range:[-50, 50], zeroline: true, scaleratio: 1},
        aspectratio: {x:1, y:1, z:1},
    }
};

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

function addLine(data, a1, b1, c1, d1, a2, b2, c2, d2, color1, color2){
    var normal = [b1*c2 - b2*c1, a2*c1 - a1*c2, a1*b2 - a2*b1];
    var n1 = [a1, b1, c1];
    var n2 = [a2, b2, c2];
    n1 = n1/math.norm(n1);
    n2 = n2/math.norm(n2);

    if (n1 === n2 || n1 === -n2){
        return 1;
    }

    var u1 = [a1, b1]; u2 = [a2, b2],
        v1 = [a1, c1]; v2 = [a2, c2],
        w1 = [b1, c1]; w2 = [b2, c2];

    u1 = math.multiply(u1, 1/math.norm(u1)); u2 = math.multiply(u2, 1/math.norm(u2));
    v1 = math.multiply(v1, 1/math.norm(v1)); v2 = math.multiply(v2, 1/math.norm(v2));
    w1 = math.multiply(w1, 1/math.norm(w1)); w2 = math.multiply(w2, 1/math.norm(w2));

    var x, point = [];
    if (u1 != u2 && u1 != -u2) {
        // z = 0
        x = math.lusolve([[a1, b1], [a2, b2]], [-d1, -d2]);
        for (var i=0; i<2; ++i){
            point.push(x[i][0]);
        }
        point.push(0);
    } else if (v1 != v2 && v1 != -v2) {
        // y = 0
        x = math.lusolve([[a1, c1], [a2, c2]], [-d1, -d2]);
        point.push(x[0][0]);
        point.push(0);
        point.push(x[1][0]);
    } else if (w1 != w2 && w1 != -w2) {
        // x = 0
        x = math.lusolve([[b1, c1], [b2, c2]], [-d1, -d2]);
        point.push(0);
        for (var i=0; i<2; ++i){
            point.push(x[i][0]);
        }
    } else {
        return 1;
    }

    var xPoints = [point[0] - 50*normal[0], point[0] + 50*normal[0]];
    var yPoints = [point[1] - 50*normal[1], point[1] + 50*normal[1]];
    var zPoints = [point[2] - 50*normal[2], point[2] + 50*normal[2]];

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
    var error = compute(data);
    console.log("plotting", error, data);
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

    addPlane(data, a1, b1, c1, d1, cyan);
    addPlane(data, a2, b2, c2, d2, orange);
    addPlane(data, a3, b3, c3, d3, lilac);

    addLine(data, a1, b1, c1, d1, a2, b2, c2, d2, black, white);
    //addLine(data, a2, b2, c2, d2, a3, b3, c3, d3, "rgb(255,0,0)", white);
    //addLine(data, a1, b1, c1, d1, a3, b3, c3, d3, "rgb(0,0,255)", white);

    return 0;
}

function update() {
    console.log("updating");
    return 0;
}

function main() {
    $("input[type=box]").each(function () {
        $(this).on('keyup',function () {
            if(event.keyCode == 13) {
                let n = $(this).val();
                if( n.match(/^-?\d*(\.\d+)?$/) && !isNaN(parseFloat(n)) ){
                    $("#"+$(this).attr("id") + "Error").hide();
                    if( parseFloat(n) > -51 && parseFloat(n) < 51){
                        init();
                    } else{
                        $("#"+$(this).attr("id") + "Error").text("Invalid input: min = -50, max = 50");
                        $("#"+$(this).attr("id") + "Error").show();
                    }
                } else{
                    $("#"+$(this).attr("id") + "Error").text("Invalid input: the input needs to be a number");
                    $("#"+$(this).attr("id") + "Error").show();
                }
            }
        });
    });

    init();
}
$(document).ready(main);