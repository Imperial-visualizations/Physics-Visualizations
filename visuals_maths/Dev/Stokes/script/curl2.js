var layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5, 5], zeroline: true, title: "x"},
    yaxis: {range: [-5, 5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};


var isBlackText = false;
var blackTextType = "lines";



function initArcArrow(){


    var xTemp = [], yTemp = [];
    Curve = [];
    phi = numeric.linspace(0, 0.20*Math.PI, 20);
    for (var i = 0; i < 20; ++i){
        xTemp.push(2*Math.cos(phi[i]));
        yTemp.push(2*Math.sin(phi[i]));

        var arc={
            type: "scatter",
            mode: "lines",
            x: xTemp,
            y: yTemp,
            line: {color: black, width: 3}
        };
    } ;
    Curve.push(arc)

    arr = new Line2d([[xTemp[0],yTemp[0]],[xTemp[19],yTemp[19]]]);
    Curve.push(arr.arrowHead(magenta,3));
    Plotly.purge("graph");
    Plotly.newPlot("graph", Curve, layout);
}


function frames(){
    var step = numeric.linspace(0,2*Math.PI,10);
    var frames = [], data;
    var xTemp1, yTemp1;

    for (var a=0; a<10; ++a){
        xTemp1 = [], yTemp1 = [];
        phi = numeric.linspace(step[a], step[a]+0.20*Math.PI, 20);
        for (var i=0; i<20; ++i){
            data = [];
            xTemp1.push(2*Math.cos(phi[i]));
            yTemp1.push(2*Math.sin(phi[i]));

            var arc={
                type: "scatter",
                mode: "lines",
                x: xTemp1,
                y: yTemp1,
                line: {color: black, width: 3}
            };
            data.push(arc);
            arr = new Line2d([[xTemp1[0],yTemp1[0]],[xTemp1[19],yTemp1[19]]]);
            data.push(arr.arrowHead(magenta,3));
        };
        frames.push({data: data});
    };

    initAnimation("animate", frames, [], layout, 100, [0, 19], true)
}


function main() {
   frames();
   $("input[type=submit]").click(function () {
        startAnimation();
        console.log("animating");
    });
}

$(document).ready(main); //Load main when document is ready.
