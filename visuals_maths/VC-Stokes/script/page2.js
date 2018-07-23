var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: createView([1,1,1]),
        xaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        yaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        zaxis: {range: [-6, 6], zeroline: true, autorange: false,},
        aspectratio: {x:1, y:1, z:1},
    }
};
function initPlot() {
    Plotly.purge("graph");


    var data = [];

    var pringles = new Pringles(4, [1,1,1]);

    data.push(pringles.gObject(lilac, 7, "solid", 1.5));

    console.log(data);

    Plotly.newPlot("graph", data, layout);
    return;
}

function main() {
    initPlot();
}

$(document).ready(main); //Load main when document is ready.