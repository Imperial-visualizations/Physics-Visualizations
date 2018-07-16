"use strict";
//Global Initial Parameters:
var defaultHref = window.location.href;
var initialPoint = [1., 1.];
var layout = {
    width: 450, "height": 500,
    margin: {l:30, r:30, t:30, b:30},
    hovermode: "closest",
    showlegend: false,
    xaxis: {range: [-5, 5], zeroline: true, title: "x"},
    yaxis: {range: [-5, 5], zeroline: true, title: "y"},
    aspectratio: {x:1, y:1}
};

//Plots
function initPlot(coor) {
    Plotly.purge("graph");

    var data = [];

    if (coor === "#tab1") {
        console.log("This is tab1");
        data.push({
            type: "scatter",
            mode: "lines",
            x: [0, initialPoint[0]],
            y: [0, initialPoint[1]],
            line: {color: "rgb(255,0,0)", width: 2}
        });
    } else if (coor === "#tab2"){
        console.log("This is tab2");
        data.push({
            type: "scatter",
            mode: "lines",
            x: [0, -initialPoint[0]],
            y: [0, -initialPoint[1]],
            line: {color: "rgb(0,0,255)", width: 2}
        });
    }

    Plotly.newPlot("graph", data, layout);
    return;
}

function updatePlot() {
    var data = [];
    var href = $('ul.tab-nav li a.active.button').attr('href'); // active href
    var factor;

    console.log("Updating plots!!!!!");

    if (href === "#tab1") {
        factor = parseFloat(document.getElementById('t1Slider').value);
        data.push({
            type: "scatter",
            mode: "lines",
            x: [0, factor*initialPoint[0]],
            y: [0, factor*initialPoint[1]],
            line: {color: "rgb(255,0,0)", width: 2}
        });
    } else if (href === "#tab2") {
        factor = -parseFloat(document.getElementById('t2Slider').value);
        data.push({
            type: "scatter",
            mode: "lines",
            x: [0, factor*initialPoint[0]],
            y: [0, factor*initialPoint[1]],
            line: {color: "rgb(0,0,255)", width: 2}
        });
    }

    Plotly.animate(
        'graph',
        {data: data},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
    return;
}

function main() {
    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            updatePlot();
        });
    });

    $(".rightnav").on('click',function(){
        window.location.href =
            defaultHref.slice(0,-6)
            +(parseInt(defaultHref.slice(-6,-5))+1) + ".html";
    });

    $(".rightnav").on("mouseenter", function() {
        $(".rightnav").css({"color":"#1a0433","font-size":"55px"});
    }).on('mouseleave', function(){
        $(".rightnav").css({"color":"#330766","font-size":"50px"});
    });

    $(".leftnav").on('click',function(){
        window.location.href =
            defaultHref.slice(0,-6)
            +(parseInt(defaultHref.slice(-6,-5))-1) + ".html";
    });

    $(".leftnav").on("mouseenter", function() {
        $(".leftnav").css({"color":"#1a0433","font-size":"55px"})
    }).on('mouseleave', function(){
        $(".leftnav").css({"color":"#330766","font-size":"50px"})
    });


    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initPlot(href);
            return false;
        });
    });
    initPlot("#tab1");
    return;
}
$(document).ready(main);