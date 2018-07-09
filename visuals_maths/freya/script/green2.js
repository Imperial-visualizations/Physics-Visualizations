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


    var Phi = numeric.linspace(0, 2*Math.PI, 50);


    var xTemp = [], yTemp = [];
    var Curve = [];
    for(var i = 0; i < 50; ++i) {


        xTemp.push(3*Math.cos(Phi));
        yTemp.push(3*Math.sin(Phi));

        var curve = {
            type: "scatter",
            mode: "lines",
            x: xTemp,
            y: yTemp,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.7
        };

        Curve.push(curve)
    };

    for (var i= 0; i < 26; ++i) {


        var grid ={
            type: "scatter",
            mode: "lines",
            x: [xTemp[i], xTemp[i+25]],
            y: [yTemp[i], yTemp[i+25]],
            line: {color: black, width: 1}
        };
        Curve.push(grid)
    };
    console.log(xTemp)

    return Curve;


}


function main() {
    plotData();
}
$(document).ready(main); //Load main when document is ready.
