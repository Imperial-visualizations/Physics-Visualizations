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



//Plot
/**
 * Resets and plots initial area element or basis vectors of plane polar.
 * @param {string} type - basis vectors or area element
 */
function plotData() {
    Plotly.purge("graph");
    Plotly.newPlot("graph", initArbitraryShape(), layout);
    return;
    }
function initArbitraryShape() {


    var Phi1 = numeric.linspace(0, 0.5*Math.PI, 20);
    var Phi2 = numeric.linspace(0.5*Math.PI, Math.PI, 20);
    var Phi3 = numeric.linspace(Math.PI, 1.5*Math.PI, 20);
    var Phi4 = numeric.linspace(1.5*Math.PI, 2*Math.PI, 20);

    var xTemp1 = [], yTemp1 = [];
    var xTemp2 = [], yTemp2 = [];
    var xTemp3 = [], yTemp3 = [];
    var xTemp4 = [], yTemp4 = [];
    var Curve = [];
    for(var i = 0; i < 20; ++i) {
        var radius1 = 1 - 0.7*(Math.cos(Phi1[i]-Math.PI*0.25)*Math.sin(Phi1[i]-Math.PI*0.25));
        var radius2 = 1 - 0.7*(Math.cos(Phi2[i]-Math.PI*0.25)*Math.sin(Phi2[i]-Math.PI*0.25));
        var radius3 = 1 - 0.7*(Math.cos(Phi3[i]-Math.PI*0.25)*Math.sin(Phi3[i]-Math.PI*0.25));
        var radius4 = 1 - 0.7*(Math.cos(Phi4[i]-Math.PI*0.25)*Math.sin(Phi4[i]-Math.PI*0.25));

        xTemp1.push(2*radius1*Math.cos(Phi1[i])+0.2);
        yTemp1.push(2*radius1*Math.sin(Phi1[i])+0.2);



        var curve1 = {
            type: "scatter",
            mode: "lines",
            x: xTemp1,
            y: yTemp1,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve1)
        xTemp2.push(2*radius2*Math.cos(Phi2[i])-0.2);
        yTemp2.push(2*radius2*Math.sin(Phi2[i])+0.2);

        var curve2 = {
            type: "scatter",
            mode: "lines",
            x: xTemp2,
            y: yTemp2,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve2)
        xTemp3.push(2*radius3*Math.cos(Phi3[i])-0.2);
        yTemp3.push(2*radius3*Math.sin(Phi3[i])-0.2);
        var curve3 = {
            type: "scatter",
            mode: "lines",
            x: xTemp3,
            y: yTemp3,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve3)
        xTemp4.push(2*radius4*Math.cos(Phi4[i])+0.2);
        yTemp4.push(2*radius4*Math.sin(Phi4[i])-0.2);
        var curve4 = {
            type: "scatter",
            mode: "lines",
            x: xTemp4,
            y: yTemp4,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve4)
    };
    var side1 ={
         type: "scatter",
         mode: "lines",
         x: [0.2,0.2,2.9],
         y: [1.5,0.2,0.2],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };

    var side2 ={
         type: "scatter",
         mode: "lines",
         x: [-0.2,-0.2,-2.9],
         y: [1.5,0.2,0.2],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };
    var side3 ={
         type: "scatter",
         mode: "lines",
         x: [-0.2,-0.2,-2.9],
         y: [-1.5,-0.2,-0.2],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };
    var side4 ={
         type: "scatter",
         mode: "lines",
         x: [0.2,0.2,2.9],
         y: [-1.5,-0.2,-0.2],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };

    var grid11 =new Line2d([[0.2,0.2],[1.55,0.2]]);
    var grid12 =new Line2d([[-2.9,0.2],[-1.55,0.2]]);
    var grid13 =new Line2d([[-0.2,-0.2],[-1.55,-0.2]]);
    var grid14 =new Line2d([[2.9,-0.2],[1.55,-0.2]]);
    var grid21 =new Line2d([[0.2,2.2],[0.2,0.85]])
    var grid22 =new Line2d([[-0.2,-0.5],[-0.2,0.85]])
    var grid23 =new Line2d([[-0.2,-2.2],[-0.2,-0.85]])
    var grid24 =new Line2d([[0.2,0.5],[0.2,-0.85]])
    var arr1 = new Line2d([[2.9,2],[xTemp1[10],yTemp1[10]]])
    var arr2 = new Line2d([[-0.2,1.5],[xTemp2[10],yTemp2[10]]])
    var arr3 = new Line2d([[-2.9,-0.2],[xTemp3[10],yTemp3[10]]])
    var arr4 = new Line2d([[0.2,-1.5],[xTemp4[10],yTemp4[10]]])
    Curve.push(side1);
    Curve.push(side2);
    Curve.push(side3);
    Curve.push(side4);
    Curve.push(grid11.arrowHead(magenta))
    Curve.push(grid12.arrowHead(magenta))
    Curve.push(grid13.arrowHead(magenta))
    Curve.push(grid14.arrowHead(magenta))
    Curve.push(grid21.arrowHead(magenta))
    Curve.push(grid22.arrowHead(magenta))
    Curve.push(grid23.arrowHead(magenta))
    Curve.push(grid24.arrowHead(magenta))
    Curve.push(arr1.arrowHead(black))
    Curve.push(arr2.arrowHead(black))
    Curve.push(arr3.arrowHead(black))
    Curve.push(arr4.arrowHead(black))
    return Curve

}


function main() {
    plotData();
}

$(document).ready(main); //Load main when document is ready.