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

//plot
function plotData(){
    Plotly.newPlot("graph", circulation(), layout)
    return;
}

//create a square with arrows going anticlockwise on each side
function circulation(){

    var data = []
    var square = new Rectangle(3,2.8)
    data.push(square.gObject(impBlue))
    var arr1 = new Line2d([[-1,0],[1.5,0]])
    var arr2 = new Line2d([[3,-1],[3,1.4]])
    var arr3 = new Line2d([[4,2.8],[1.5,2.8]])
    var arr4 = new Line2d([[0,3.8],[0,1.4]])
    data.push(arr1.arrowHead(black,3))
    data.push(arr2.arrowHead(black,3))
    data.push(arr3.arrowHead(black,3))
    data.push(arr4.arrowHead(black,3))
    data.push({
        x: [1.5],
        y: [1.4],
        mode: 'text',
        text: ['D'],
        type: 'scatter',
        showlegend: true,
        font: {size: 30}
        })

    return data;
}
//load main
function main() {

    plotData();
    initGuidance(["graph","text"]);
}

$(document).ready(main);