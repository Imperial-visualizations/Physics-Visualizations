var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: createView([1,1,1]),
        xaxis: {range: [-3, 3], zeroline: true, autorange: false,},
        yaxis: {range: [-3, 3], zeroline: true, autorange: false,},
        zaxis: {range: [-1, 3], zeroline: true, autorange: false,},
        aspectratio: {x:1, y:1, z:1},
    }
};

var initialA = 0;
var isBlackText = false;
var blackTextType = "lines";



//Plot
/**s
 * Resets and plots initial area element or basis vectors of plane polar.
 * @param {string} type - basis vectors or area element
 */
function plotData() {
    Plotly.purge("graph");
    $("#aController").val(initialA);
    $("#aControllerDisplay").text(initialA);
    var a = parseFloat(document.getElementById('aController').value);
    Plotly.newPlot("graph", initCube(a), layout);
    return;
    }