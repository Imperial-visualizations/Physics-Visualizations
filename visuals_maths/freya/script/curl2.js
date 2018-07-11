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





function initarcArrow(){
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
    Plotly.newPlot("graph", initarcArrow(), layout);
}

function arcArrowMove(){
    step = numeric.linspace(0,2*Math.PI,30);
    for (var a=0; a<30; ++a){
        newCurve = [];
        var xTemp = [], yTemp = [];
        phi = numeric.linspace(step[a], step[a]+0.20*Math.PI, 20);
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
        arr = new Line2d([[xTemp[0],yTemp[0]],[xTemp[19],yTemp[19]]]);
        newCurve.push(arc)

        newCurve.push(arr.arrowHead(magenta,3));
    }
    Plotly.animate("graph",arcArrowMove(), {
    transition: {
        duration: 25,
        easing: 'linear'
    },
    frame: {
        duration: 25,
        redraw: false

    },
    mode: 'immediate'
    }

    )
    return;
}


function main() {
   initarcArrow();
   arcArrowMove();
}

$(document).ready(main); //Load main when document is ready.
