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

function initArbitraryShape(sep_x,sep_y) {


    var Phi1 = numeric.linspace(0, 0.5*Math.PI, 20);
    var Phi2 = numeric.linspace(0.5*Math.PI, Math.PI, 20);
    var Phi3 = numeric.linspace(Math.PI, 1.5*Math.PI, 20);
    var Phi4 = numeric.linspace(1.5*Math.PI, 2*Math.PI, 20);

    var xTemp1 = [], yTemp1 = [];
    var xTemp2 = [], yTemp2 = [];
    var xTemp3 = [], yTemp3 = [];
    var xTemp4 = [], yTemp4 = [];
    var Curve = [];
    for(var i = 0; i < 20; ++i) {
        var radius1 = 1 - 0.7*(Math.cos(Phi1[i]-Math.PI*0.25)*Math.sin(Phi1[i]-Math.PI*0.25));
        var radius2 = 1 - 0.7*(Math.cos(Phi2[i]-Math.PI*0.25)*Math.sin(Phi2[i]-Math.PI*0.25));
        var radius3 = 1 - 0.7*(Math.cos(Phi3[i]-Math.PI*0.25)*Math.sin(Phi3[i]-Math.PI*0.25));
        var radius4 = 1 - 0.7*(Math.cos(Phi4[i]-Math.PI*0.25)*Math.sin(Phi4[i]-Math.PI*0.25));

        xTemp1.push(2*radius1*Math.cos(Phi1[i])+sep_x);
        yTemp1.push(2*radius1*Math.sin(Phi1[i])+sep_y);



        var curve1 = {
            type: "scatter",
            mode: "lines",
            x: xTemp1,
            y: yTemp1,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve1)
        xTemp2.push(2*radius2*Math.cos(Phi2[i])-sep_x);
        yTemp2.push(2*radius2*Math.sin(Phi2[i])+sep_y);

        var curve2 = {
            type: "scatter",
            mode: "lines",
            x: xTemp2,
            y: yTemp2,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve2)
        xTemp3.push(2*radius3*Math.cos(Phi3[i])-sep_x);
        yTemp3.push(2*radius3*Math.sin(Phi3[i])-sep_y);
        var curve3 = {
            type: "scatter",
            mode: "lines",
            x: xTemp3,
            y: yTemp3,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve3)
        xTemp4.push(2*radius4*Math.cos(Phi4[i])+sep_x);
        yTemp4.push(2*radius4*Math.sin(Phi4[i])-sep_y);
        var curve4 = {
            type: "scatter",
            mode: "lines",
            x: xTemp4,
            y: yTemp4,
            line: {color: black, width: 3},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.1
        };
        Curve.push(curve4)
    };
    var side1 ={
         type: "scatter",
         mode: "lines",
         x: [sep_x,sep_x,sep_x+2.7],
         y: [sep_y+1.3,sep_y,sep_y],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };

    var side2 ={
         type: "scatter",
         mode: "lines",
         x: [-sep_x,-sep_x,-sep_x-2.7],
         y: [sep_y+1.3,sep_y,sep_y],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };
    var side3 ={
         type: "scatter",
         mode: "lines",
         x: [-sep_x,-sep_x,-sep_x-2.7],
         y: [-sep_y-1.3,-sep_y,-sep_y],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };
    var side4 ={
         type: "scatter",
         mode: "lines",
         x: [sep_x,sep_x,sep_x+2.7],
         y: [-sep_y-1.3,-sep_y,-sep_y],
         line: {color: magenta, width: 3},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };

    var grid11 =new Line2d([[sep_x,sep_y],[sep_x+1.35,sep_y]]);
    var grid12 =new Line2d([[-2.7-sep_x,sep_y],[-sep_x-1.35,sep_y]]);
    var grid13 =new Line2d([[-sep_x,-sep_y],[-sep_x-1.35,-sep_y]]);
    var grid14 =new Line2d([[2.7+sep_x,-sep_y],[sep_x+1.35,-sep_y]]);
    var grid21 =new Line2d([[sep_x,sep_y+2],[sep_x,sep_y+0.65]])
    var grid22 =new Line2d([[-sep_x,-sep_y-0.3],[-sep_x,sep_y+0.65]])
    var grid23 =new Line2d([[-sep_x,-sep_y-2],[-sep_x,-sep_y-0.65]])
    var grid24 =new Line2d([[sep_x,sep_y+0.3],[sep_x,-sep_y-0.65]])
    var arr1 = new Line2d([[sep_x+2.7,sep_y],[xTemp1[10],yTemp1[10]]])
    var arr2 = new Line2d([[-sep_x,sep_y+1.3],[xTemp2[10],yTemp2[10]]])
    var arr3 = new Line2d([[-sep_x-2.7,-sep_y],[xTemp3[10],yTemp3[10]]])
    var arr4 = new Line2d([[sep_x,-sep_y-1.3],[xTemp4[10],yTemp4[10]]])
    Curve.push(side1);
    Curve.push(side2);
    Curve.push(side3);
    Curve.push(side4);
    Curve.push(grid11.arrowHead(magenta,3))
    Curve.push(grid12.arrowHead(magenta,3))
    Curve.push(grid13.arrowHead(magenta,3))
    Curve.push(grid14.arrowHead(magenta,3))
    Curve.push(grid21.arrowHead(magenta,3))
    Curve.push(grid22.arrowHead(magenta,3))
    Curve.push(grid23.arrowHead(magenta,3))
    Curve.push(grid24.arrowHead(magenta,3))
    Curve.push(arr1.arrowHead(black,3))
    Curve.push(arr2.arrowHead(black,3))
    Curve.push(arr3.arrowHead(black,3))
    Curve.push(arr4.arrowHead(black,3))
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
        var data = new initArbitraryShape(0.02*i, 0.02*i)
        frames.push({data: data})
    }
    console.log(frames)
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