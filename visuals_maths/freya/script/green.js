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


    var Phi1 = numeric.linspace(-Math.PI*0.5, Math.PI*0.5, 30);

    var Phi2 = numeric.linspace(Math.PI*0.5, Math.PI*1.5, 30);


        Phi2.reverse();
    var Phi3 = numeric.linspace(0, Math.PI, 30);
    var Phi4 = numeric.linspace(-Math.PI, 0, 30);
        Phi4.reverse()



    var xTemp1 = [], yTemp1 = [], xTemp2 = [], yTemp2 = [];
    var xTemp3 = [], yTemp3 = [], xTemp4 = [], yTemp4 = [];
    var xTemp5 = [], yTemp5 = [], xTemp6 = [], yTemp6 = [];
    var Curve = [];

    for(var i = 0; i < 30; ++i) {

        var radius1 = 1 - 0.7*(Math.cos(Phi1[i]-Math.PI*0.25)*Math.sin(Phi1[i]-Math.PI*0.25));
        var radius2 = 1 - 0.7*(Math.cos(Phi3[i]-Math.PI*0.25)*Math.sin(Phi3[i]-Math.PI*0.25));
        var radius3 = 1 - 0.7*(Math.cos(Phi4[i]-Math.PI*0.25)*Math.sin(Phi4[i])-Math.PI*0.25);
        xTemp1.push(2*radius1*Math.cos(Phi1[i]));
        yTemp1.push(2*radius1*Math.sin(Phi1[i]));
        xTemp2.push(2*radius1*Math.cos(Phi2[i]));
        yTemp2.push(2*radius1*Math.sin(Phi2[i]));




        var curve1 = {
            type: "scatter",
            mode: "lines",
            x: xTemp1,
            y: yTemp1,
            line: {color: black, width: 3},
            //fill: 'toself',
            //fillcolor: orange,
            //opacity: 0.1
        };

        Curve.push(curve1)
        var curve2 = {
            type: "scatter",
            mode: "lines",
            x: xTemp2,
            y: yTemp2,
            line: {color: black, width: 3},
            //fill: 'toself',
            //fillcolor: orange,
            //opacity: 0.1
        };

        Curve.push(curve2)
    };
    var a = numeric.linspace(10,18,5);

    for (c = 0; c<5; ++c){
        var b = a[c];
        var radius1 = 1 - 0.7*(Math.cos(Phi1[b]-Math.PI*0.25)*Math.sin(Phi1[b]-Math.PI*0.25));


        xTemp5.push(2*radius1*Math.cos(Phi1[b]));
        yTemp5.push(2*radius1*Math.sin(Phi1[b]));
        xTemp6.push(2*radius1*Math.cos(Phi2[b]));
        yTemp6.push(2*radius1*Math.sin(Phi2[b]));

        var grid2 ={
            type: "scatter",
            mode: "lines",
            x: [xTemp5[c],xTemp6[c]],
            y: [yTemp5[c],yTemp6[c]],
            line: {color: blue, width: 0.8}
        };
        Curve.push(grid2)


        var grid4 ={
            type: "scatter",
            mode: "lines",
            x: [xTemp5[c]+0.025,xTemp6[c]+0.025],
            y: [yTemp5[c]+0.025,yTemp6[c]+0.025],
            line: {color: magenta, width: 0.8}
        };
        Curve.push(grid4)
    };
    var j = numeric.linspace(3,27,13);

    for (k = 0; k<13; ++k){
        var l = j[k];

        var radius2 = 1 - 0.7*(Math.cos(Phi3[l]-Math.PI*0.25)*Math.sin(Phi3[l]-Math.PI*0.25));
        var radius3 = 1 - 0.7*(Math.cos(Phi4[l]-Math.PI*0.25)*Math.sin(Phi4[l]-Math.PI*0.25));
        xTemp3.push(2*radius2*Math.cos(Phi3[l]));
        yTemp3.push(2*radius2*Math.sin(Phi3[l]));
        xTemp4.push(2*radius3*Math.cos(Phi4[l]));
        yTemp4.push(2*radius3*Math.sin(Phi4[l]));

        var grid1 ={
            type: "scatter",
            mode: "lines",
            x: [xTemp3[k],xTemp4[k]],
            y: [yTemp3[k],yTemp4[k]],
            line: {color: blue, width: 0.8}
        };
        Curve.push(grid1)

        var grid3 ={
            type: "scatter",
            mode: "lines",
            x: [xTemp3[k]+0.025,xTemp4[k]+0.025],
            y: [yTemp3[k]+0.025,yTemp4[k]+0.025],
            line: {color: magenta, width: 0.8}
            };
        Curve.push(grid3)

    };




    return Curve;


}


function main() {
    plotData();
}
$(document).ready(main); //Load main when document is ready.
