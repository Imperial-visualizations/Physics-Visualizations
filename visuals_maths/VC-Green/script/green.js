"use strict";
//Global Initial Parameters:
var currentHref = window.location.href;
var maxArrowNum = 7;
var layout = {
    width: 400, height: 400,
    margin: {l:50, r:50, t:50, b:50},
    hovermode: "closest",
    showlegend: false,
    xaxis: {label: 'x', range: [-0.5,5]},
    yaxis: {lavel: 'y', range: [-0.5,5]},
    aspectratio: {x:1, y:1}
};

function arrowRect(vertices, numberOfArrows, color1, color2) {
    var rectLength = Math.abs(vertices[1][0] - vertices[0][0]);
    var arrowLength = rectLength/numberOfArrows;
    var rectX = numeric.linspace(vertices[0][0], vertices[1][0], numberOfArrows+1),
        rectY = numeric.linspace(vertices[1][1], vertices[2][1], numberOfArrows+1);
    var data = [];

    var injection = rectLength/(9*numberOfArrows);

    var rectX2 = rectX.slice(),
        rectY2 = rectY.slice();
    rectX2.reverse();
    rectY2.reverse();

    addArrowsX(data, numberOfArrows, rectX, rectY[0]+injection, color1, 1);
    addArrowsY(data, numberOfArrows, rectX[0]+injection, rectY2, color1, -1);
    addArrowsX(data, numberOfArrows, rectX2, rectY[numberOfArrows]-injection, color1, -1);
    addArrowsY(data, numberOfArrows, rectX[numberOfArrows]-injection, rectY, color1, 1);

    for (var i=1; i<numberOfArrows; ++i){
        addArrowsX(data, numberOfArrows, rectX, rectY[i]+injection, color2, 1);
        addArrowsY(data, numberOfArrows, rectX[i]+injection, rectY2, color2, -1);

        addArrowsX(data, numberOfArrows, rectX2, rectY[i]-injection, color2, -1);
        addArrowsY(data, numberOfArrows, rectX[i]-injection, rectY, color2, 1);
    }

    addEmptyObjects2d(data, maxArrowNum*56 - data.length);
    return data;
}

function addArrowsX(data, numberOfArrows, rectX, fixedY, color, direction=1){
    var arrowTemp;

    var arrowReduction = 0.15*Math.abs(rectX[1] - rectX[0]);
    for (var i=0; i < numberOfArrows; ++i){
        arrowTemp = new Line2d([[rectX[i]+arrowReduction*direction, fixedY], [rectX[i+1]-arrowReduction*direction, fixedY]]);
        data.push(
            arrowTemp.gObject(color, 2),
            arrowTemp.arrowHead(color, 2)
        );
    }
    return;
}
function addArrowsY(data, numberOfArrows, fixedX, rectY, color, direction=1){
    var arrowTemp;
    var arrowReduction = 0.15*Math.abs(rectY[1] - rectY[0]);
    for (var i=0; i < numberOfArrows; ++i){
        arrowTemp = new Line2d([[fixedX, rectY[i]+arrowReduction*direction], [fixedX, rectY[i+1]-arrowReduction*direction]]);
        data.push(
            arrowTemp.gObject(color, 2),
            arrowTemp.arrowHead(color, 2)
        );
    }
    return;
}

function addEmptyObjects2d(data, numberObj){
    for (var i=0; i < numberObj; ++i){
        data.push({
            type: "scatter",
            mode: "lines",
            line: {width: 0}
        });
    }
    return 0;
}

//Plots
function initPlot() {
    Plotly.purge("graph");

    Plotly.newPlot("graph", arrowRect([[0,0],[4,0],[4,4],[0,4]], 2, green, magenta), layout);

    return;
}

function updatePlot() {
    var data = [];
    var numberOfArrows = parseFloat(document.getElementById('curlSlider').value);

    Plotly.animate(
        'graph',
        {data: arrowRect([[0,0],[4,0],[4,4],[0,4]], numberOfArrows, green, magenta)},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
}

function main() {
    $("input[type=range]").each(function () {
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            updatePlot();
        });
    });

    $(".rightnav").on('click',function(){
        window.location.href =
            currentHref.slice(0,-6)
            +(parseInt(currentHref.slice(-6,-5))+1) + ".html";
    });

    $(".rightnav").on("mouseenter", function() {
        $(".rightnav").css({"color":"#1a0433","font-size":"55px"});
    }).on('mouseleave', function(){
        $(".rightnav").css({"color":"#330766","font-size":"50px"});
    });

    $(".leftnav").on('click',function(){
        window.location.href =
            currentHref.slice(0,-6)
            +(parseInt(currentHref.slice(-6,-5))-1) + ".html";
    });

    $(".leftnav").on("mouseenter", function() {
        $(".leftnav").css({"color":"#1a0433","font-size":"55px"})
    }).on('mouseleave', function(){
        $(".leftnav").css({"color":"#330766","font-size":"50px"})
    });

    initPlot();
}
$(document).ready(main);