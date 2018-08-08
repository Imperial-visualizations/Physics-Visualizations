var currentHref = window.location.href;
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

function initArbitraryShape(phi1, phi2, sep_x, sep_y, x, y) {
    var Curve = []
    var xTemp = [], yTemp = [];
    var Phi = numeric.linspace(phi1,phi2,20)
    for (var i=0; i<20; ++i){
        var radius = 1 - 0.7*(Math.cos(Phi[i]-Math.PI*0.25)*Math.sin(Phi[i]-Math.PI*0.25));
        xTemp.push(2*radius*Math.cos(Phi[i])+sep_x);
        yTemp.push(2*radius*Math.sin(Phi[i])+sep_y);
        var curve ={
            type: "scatter",
            mode: "lines",
            x: xTemp,
            y: yTemp,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        }
        Curve.push(curve)
    }


    var side ={
         type: "scatter",
         mode: "lines",
         x: [sep_x, sep_x, x+sep_x],
         y: [y+sep_y, sep_y, sep_y],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.1
    };
    Curve.push(side)
    var half_x = (2*sep_x + x)*0.5
    var half_y = (2*sep_y + y)*0.5
    if (sep_x*sep_y>0){
        var grid1 = new Line2d([[sep_x,sep_y],[half_x, sep_y]])
        if (sep_x>0){
            var y1 = y + 0.5 + sep_y;
        }else if (sep_x<0){
            var y1 = y - 0.5 + sep_y;
        }
        var grid2 = new Line2d([[sep_x, y1],[sep_x, half_y]])
        var arr = new Line2d([[sep_x+x, sep_y],[xTemp[10],yTemp[10]]])
    }else if(sep_x*sep_y<0){
        var grid1 = new Line2d([[x+sep_x,sep_y],[half_x, sep_y]])
        if (sep_x>0){
            var y1 = y + 1 + sep_y;
        }else if (sep_x<0){
            var y1 = y - 1 + sep_y;
        }
        var grid2 = new Line2d([[sep_x, y1],[sep_x, half_y]])
        var arr = new Line2d([[sep_x, sep_y+y],[xTemp[10],yTemp[10]]])
    }
    Curve.push(grid1.arrowHead(magenta,3))
    Curve.push(grid2.arrowHead(magenta,3))
    Curve.push(arr.arrowHead(black,3))
    return Curve
}
function blank(data1, number){
    var data2 = []
    for (var i=0; i<number; ++i){
        data2.push({
            type: "scatter",
            mode: "lines",
            x:0,
            y:0,
            lines: {width:0}
        })
    }
    data2 = data1.concat(data2)
    return data2;
}
function updatePlot(){
    var frames = [];
    var Curve = [];
    var Phi = numeric.linspace(0,2*Math.PI,80)
    var xTemp=[], yTemp=[];
    for (var i=0; i<80; ++i){
        var radius = 1 - 0.7*(Math.cos(Phi[i]-Math.PI*0.25)*Math.sin(Phi[i]-Math.PI*0.25));
        xTemp.push(2*radius*Math.cos(Phi[i]));
        yTemp.push(2*radius*Math.sin(Phi[i]));
        var curve ={
            type: "scatter",
            mode: "lines",
            x: xTemp,
            y: yTemp,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        }
        Curve.push(curve)
    }
    var arr1 = new Line2d([[xTemp[0],yTemp[0]],[xTemp[10],yTemp[10]]])
    var arr2 = new Line2d([[xTemp[20],yTemp[20]],[xTemp[30],yTemp[30]]])
    var arr3 = new Line2d([[xTemp[40],yTemp[40]],[xTemp[50],yTemp[50]]])
    var arr4 = new Line2d([[xTemp[60],yTemp[60]],[xTemp[70],yTemp[70]]])
    Curve.push(arr1.arrowHead(black,3))
    Curve.push(arr2.arrowHead(black,3))
    Curve.push(arr3.arrowHead(black,3))
    Curve.push(arr4.arrowHead(black,3))
    var data = new blank(Curve,12)
    frames.push({data: data});
    for (var i=1; i<11; ++i){
        data = []
        var Curve1 = new initArbitraryShape(0, 0.5*Math.PI, 0.02*i, 0.02*i, 2.7, 1.3)
        var Curve2 = new initArbitraryShape(0.5*Math.PI, Math.PI, -0.02*i, 0.02*i, -2.7, 1.3)
        var Curve3 = new initArbitraryShape(Math.PI, 1.5*Math.PI, -0.02*i, -0.02*i, -2.7, -1.3)
        var Curve4 = new initArbitraryShape(1.5*Math.PI, 2*Math.PI, 0.02*i, -0.02*i, 2.7, -1.3)
        data = data.concat(Curve4.concat(Curve3.concat(Curve2.concat(Curve1))))
        console.log(data)
        frames.push({data: data});
    }

    initAnimation("animate", frames, [], layout, 10, [0,11], true)
}




function main() {

    $("input[type=submit]").click(function () {
        var idName = $(this).attr("id");
        startAnimation();
    });
    updatePlot()

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

}

$(document).ready(main);