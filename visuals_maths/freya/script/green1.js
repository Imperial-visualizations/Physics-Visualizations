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

    Plotly.newPlot("graph1", initArbitraryShape1(), layout);
    Plotly.newPlot("graph2", initArbitraryShape2(), layout);
    return;
    }
function initArbitraryShape1() {

    var meshSize = 50;
    var phi = numeric.linspace(0,1.99*Math.PI,meshSize);
    var phi2 = numeric.linspace(0,1.98*Math.PI,meshSize);
    var xTemp1=[], yTemp1=[],
        xTemp2=[], yTemp2=[];

    for (i=0; i<meshSize; ++i){
        rho = 2-2*Math.sin(phi[i])**2*Math.cos(phi[i])**2;
        xTemp1.push(2*rho*Math.cos(phi[i]));
        yTemp1.push(2*rho*Math.sin(phi[i]));
        xTemp2.push(rho*Math.cos(phi2[i]));
        yTemp2.push(rho*Math.sin(phi2[i]));
    }

    xTemp2.reverse();
    yTemp2.reverse();
    xTemp1 = xTemp1.concat(xTemp2);
    xTemp1.push(xTemp1[0]);
    yTemp1 = yTemp1.concat(yTemp2);
    yTemp1.push(yTemp1[0]);

    arr1 = new Line2d([[xTemp1[2],yTemp1[2]],[xTemp1[6],yTemp1[6]]]);
    arr2 = new Line2d([[xTemp1[14],yTemp1[14]],[xTemp1[18],yTemp1[18]]]);
    arr3 = new Line2d([[xTemp1[27],yTemp1[27]],[xTemp1[31],yTemp1[31]]]);
    arr4 = new Line2d([[xTemp1[39],yTemp1[39]],[xTemp1[43],yTemp1[43]]]);
    arr5 = new Line2d([[xTemp1[50],yTemp1[50]],[xTemp1[56],yTemp1[56]]]);
    arr6 = new Line2d([[xTemp1[61],yTemp1[61]],[xTemp1[68],yTemp1[68]]]);
    arr7 = new Line2d([[xTemp1[74],yTemp1[74]],[xTemp1[80],yTemp1[80]]]);
    arr8 = new Line2d([[xTemp1[87],yTemp1[87]],[xTemp1[93],yTemp1[93]]]);
    arr9 = new Line2d([[2,0],[2.8,0]]);
    arr10 = new Line2d([[4,-0.15],[3.2,-0.15]])
    var curve = [{
        type: "scatter",
        mode: "lines",
        x: xTemp1,
        y: yTemp1,
        line: {color: black, width: 2},
        fill: 'toself',
        fillcolor: orange,
        opacity: 1
        },
    arr1.arrowHead(black,3),
    arr2.arrowHead(black,3),
    arr3.arrowHead(black,3),
    arr4.arrowHead(black,3),
    arr5.arrowHead(black,3),
    arr6.arrowHead(black,3),
    arr7.arrowHead(black,3),
    arr8.arrowHead(black,3),
    arr9.arrowHead(black,3),
    arr10.arrowHead(black,3)
    ]
    return curve;
}

function initArbitraryShape2(){
    var meshSize = 50;
    var phi = numeric.linspace(0,2*Math.PI,meshSize);
    var phi2 = numeric.linspace(0,2*Math.PI,meshSize);
    var xTemp1=[], yTemp1=[],
        xTemp2=[], yTemp2=[];

    for (i=0; i<meshSize; ++i){
        rho = 2-2*Math.sin(phi[i])**2*Math.cos(phi[i])**2;
        xTemp1.push(2*rho*Math.cos(phi[i]));
        yTemp1.push(2*rho*Math.sin(phi[i]));
        xTemp2.push(rho*Math.cos(phi2[i]));
        yTemp2.push(rho*Math.sin(phi2[i]));
    }

    xTemp2.reverse();
    yTemp2.reverse();
    xTemp1 = xTemp1.concat(xTemp2);
    xTemp1.push(xTemp1[0]);
    yTemp1 = yTemp1.concat(yTemp2);
    yTemp1.push(yTemp1[0]);
    arr1 = new Line2d([[xTemp1[2],yTemp1[2]],[xTemp1[6],yTemp1[6]]]);
    arr2 = new Line2d([[xTemp1[14],yTemp1[14]],[xTemp1[18],yTemp1[18]]]);
    arr3 = new Line2d([[xTemp1[27],yTemp1[27]],[xTemp1[31],yTemp1[31]]]);
    arr4 = new Line2d([[xTemp1[39],yTemp1[39]],[xTemp1[43],yTemp1[43]]]);
    arr5 = new Line2d([[xTemp1[50],yTemp1[50]],[xTemp1[56],yTemp1[56]]]);
    arr6 = new Line2d([[xTemp1[61],yTemp1[61]],[xTemp1[68],yTemp1[68]]]);
    arr7 = new Line2d([[xTemp1[74],yTemp1[74]],[xTemp1[80],yTemp1[80]]]);
    arr8 = new Line2d([[xTemp1[87],yTemp1[87]],[xTemp1[93],yTemp1[93]]]);
    var curve = [{
        type: "scatter",
        mode: "lines",
        x: xTemp1,
        y: yTemp1,
        line: {color: black, width: 2},
        fill: 'toself',
        fillcolor: orange,
        opacity: 1
        },
        {
        type: "scatter",
        mode: "lines",
        x: [3.975,2.02],
        y: [0,0],
        line: {color: orange, width: 3}
        },
        arr1.arrowHead(black,3),
        arr2.arrowHead(black,3),
        arr3.arrowHead(black,3),
        arr4.arrowHead(black,3),
        arr5.arrowHead(black,3),
        arr6.arrowHead(black,3),
        arr7.arrowHead(black,3),
        arr8.arrowHead(black,3)
    ];

    return curve;
}
function main() {
    plotData();
}

$(document).ready(main); //Load main when document is ready.