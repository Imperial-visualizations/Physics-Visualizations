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
    var Phi1 = numeric.linspace(0, 0.2*Math.PI, 20);

    var Phi2 = numeric.linspace(0.25*Math.PI, 0.45*Math.PI, 20);

    var Phi3 = numeric.linspace(0.5*Math.PI, 0.7*Math.PI, 20);

    var Phi4 = numeric.linspace(0.75*Math.PI, 0.95*Math.PI, 20);

    var Phi5 = numeric.linspace(Math.PI, 1.2*Math.PI, 20);

    var Phi6 = numeric.linspace(1.25*Math.PI, 1.45*Math.PI, 20);

    var Phi7 = numeric.linspace(1.5*Math.PI, 1.7*Math.PI, 20);

    var Phi8 = numeric.linspace(1.75*Math.PI, 1.95*Math.PI, 20);



    var xTemp1 = [], yTemp1 = [];

    var xTemp2 = [], yTemp2 = [];

    var xTemp3 = [], yTemp3 = [];

    var xTemp4 = [], yTemp4 = [];

    var xTemp5 = [], yTemp5 = [];

    var xTemp6 = [], yTemp6 = [];

    var xTemp7 = [], yTemp7 = [];

    var xTemp8 = [], yTemp8 = [];

    var Curve = [];

    for(var i = 0; i < 20; ++i) {

        var radius = 1



        xTemp1.push(2*radius*Math.cos(Phi1[i]));

        yTemp1.push(2*radius*Math.sin(Phi1[i]));
        var curve1 = {

            type: "scatter",

            mode: "lines",

            x: xTemp1,

            y: yTemp1,

            line: {color: black, width: 3}

        };

        Curve.push(curve1)



        xTemp2.push(2*radius*Math.cos(Phi2[i]));

        yTemp2.push(2*radius*Math.sin(Phi2[i]));



        var curve2 = {

            type: "scatter",

            mode: "lines",

            x: xTemp2,

            y: yTemp2,

            line: {color: black, width: 3}

        };

        Curve.push(curve2)

        xTemp3.push(2*radius*Math.cos(Phi3[i]));

        yTemp3.push(2*radius*Math.sin(Phi3[i]));



        var curve3 = {

            type: "scatter",

            mode: "lines",

            x: xTemp3,

            y: yTemp3,

            line: {color: black, width: 3}

        };

        Curve.push(curve3)

        xTemp4.push(2*radius*Math.cos(Phi4[i]));

        yTemp4.push(2*radius*Math.sin(Phi4[i]));



        var curve4 = {

            type: "scatter",

            mode: "lines",

            x: xTemp4,

            y: yTemp4,

            line: {color: black, width: 3}

        };

        Curve.push(curve4)

        xTemp5.push(2*radius*Math.cos(Phi5[i]));

        yTemp5.push(2*radius*Math.sin(Phi5[i]));
        var curve5 = {

            type: "scatter",

            mode: "lines",

            x: xTemp5,

            y: yTemp5,

            line: {color: black, width: 3}

        };

        Curve.push(curve5)

        xTemp6.push(2*radius*Math.cos(Phi6[i]));

        yTemp6.push(2*radius*Math.sin(Phi6[i]));
        var curve6 = {

            type: "scatter",

            mode: "lines",

            x: xTemp6,

            y: yTemp6,

            line: {color: black, width: 3}

        };

        Curve.push(curve6)
        xTemp7.push(2*radius*Math.cos(Phi7[i]));

        yTemp7.push(2*radius*Math.sin(Phi7[i]));
        var curve7 = {

            type: "scatter",

            mode: "lines",

            x: xTemp7,

            y: yTemp7,

            line: {color: black, width: 3}

        };

        Curve.push(curve7)
        xTemp8.push(2*radius*Math.cos(Phi8[i]));

        yTemp8.push(2*radius*Math.sin(Phi8[i]));
        var curve8 = {

            type: "scatter",

            mode: "lines",

            x: xTemp8,

            y: yTemp8,

            line: {color: black, width: 3}

        };

        Curve.push(curve8)
    }

    arr1 = new Line2d([[xTemp1[0],yTemp1[0]],[xTemp1[19],yTemp1[19]]]);
    Curve.push(arr1.arrowHead(magenta,3));

    arr2 = new Line2d([[xTemp2[0],yTemp2[0]],[xTemp2[19],yTemp2[19]]]);
    Curve.push(arr2.arrowHead(magenta,3));

    arr3 = new Line2d([[xTemp3[0],yTemp3[0]],[xTemp3[19],yTemp3[19]]]);
    Curve.push(arr3.arrowHead(magenta,3));

    arr4 = new Line2d([[xTemp4[0],yTemp4[0]],[xTemp4[19],yTemp4[19]]]);
    Curve.push(arr4.arrowHead(magenta,3));

    arr5 = new Line2d([[xTemp5[0],yTemp5[0]],[xTemp5[19],yTemp5[19]]]);
    Curve.push(arr5.arrowHead(magenta,3));

    arr6 = new Line2d([[xTemp6[0],yTemp6[0]],[xTemp6[19],yTemp6[19]]]);
    Curve.push(arr6.arrowHead(magenta,3));

    arr7 = new Line2d([[xTemp7[0],yTemp7[0]],[xTemp7[19],yTemp7[19]]]);
    Curve.push(arr7.arrowHead(magenta,3));

    arr8 = new Line2d([[xTemp8[0],yTemp8[0]],[xTemp8[19],yTemp8[19]]]);
    Curve.push(arr8.arrowHead(magenta,3));

    return Curve;
}


function main() {
    plotData();
}

$(document).ready(main); //Load main when document is ready.