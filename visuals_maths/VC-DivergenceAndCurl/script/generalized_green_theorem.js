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


//represents 1/4 of the entire arbitrary shape
//sep_x and sep_y are the distance of this 1/4 shape away from x axis and y axis
function initArbitraryShape(phi1, phi2, sep_x, sep_y, x, y, innerArrow = true) {
    var Curve = []
    var xTemp = [], yTemp = [];
    //when combine the four parts, let innerArrow = false so the inner arrows can be hidden
    var innerColor = magenta;
    if(!innerArrow){
        innerColor = orange;
    }
    //add the side with straight lines
    var side ={
         type: "scatter",
         mode: "lines",
         x: [sep_x, sep_x, x+sep_x],
         y: [y+sep_y, sep_y, sep_y],
         line: {color: innerColor, width: 1},
         fill: 'toself',
         fillcolor: orange,
         opacity: 0.9
    };
    Curve.push(side)

    //add the curly side
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
            line: {color: black, width: 4},
            fill: 'toself',
            fillcolor: orange,
            opacity: 0.9
        }

    }
    Curve.push(curve)

    //add arrows on each side use if blocks to identify which 1/4 of the arbitrary shape is being drawn
    var half_x = (2*sep_x + x)*0.5
    var half_y = (2*sep_y + y)*0.5
    if (sep_x*sep_y>0){
        var grid1 = new Line2d([[sep_x,sep_y],[half_x, sep_y]])
        if (sep_x>0){
            var y1 = y + 1 + sep_y;
        }else if (sep_x<0){
            var y1 = y - 1 + sep_y;
        }
        var grid2 = new Line2d([[sep_x, y1],[sep_x, half_y]])
        var arr = new Line2d([[sep_x+x, sep_y],[xTemp[10],yTemp[10]]])
    }else if(sep_x*sep_y<0){
        var grid1 = new Line2d([[x+sep_x,sep_y],[half_x, sep_y]])
        if (sep_y>0){
            var y1 = y - 1 + sep_y;
        }else if (sep_y<0){
            var y1 = y + 1 + sep_y;
        }
        var grid2 = new Line2d([[sep_x, -y1],[sep_x, half_y]])
        var arr = new Line2d([[sep_x, sep_y+y],[xTemp[10],yTemp[10]]])
    }
    Curve.push(arr.arrowHead(black,3))
    if (innerArrow){
        Curve.push(grid1.arrowHead(magenta,2));
        Curve.push(grid2.arrowHead(magenta,2));
    } else {
        Curve.push(grid1.arrowHead(magenta,0));
        Curve.push(grid2.arrowHead(magenta,0));
    }


    return Curve
}

function blank(data1, number){
    for (var i=0; i<number; ++i){
        data1.push({
            type: "scatter",
            mode: "lines",
            lines: {width:0}
        })
    }
    return 0;
}


//plot
function updatePlot(){
    var frames = [];
    //first frame -- four pieces being combined as an entire arbitrary shape
    var Curve1 = new initArbitraryShape(0, 0.5*Math.PI, 0.02, 0.02, 2.7, 1.3, false),
        Curve2 = new initArbitraryShape(0.5*Math.PI, Math.PI, -0.02, 0.02, -2.7, 1.3, false),
        Curve3 = new initArbitraryShape(Math.PI, 1.5*Math.PI, -0.02, -0.02, -2.7, -1.3, false),
        Curve4 = new initArbitraryShape(1.5*Math.PI, 2*Math.PI, 0.02, -0.02, 2.7, -1.3, false),
        curve = Curve4.concat(Curve2);
        curve = curve.concat(Curve1);
        curve = curve.concat(Curve3);

    frames.push({data: curve});

    //second stage -- separate the four part gradually
    for (var i=2; i<11; ++i){
        Curve1 = new initArbitraryShape(0, 0.5*Math.PI, 0.02*i, 0.02*i, 2.7, 1.3,true)
        Curve2 = new initArbitraryShape(0.5*Math.PI, Math.PI, -0.02*i, 0.02*i, -2.7, 1.3,true)
        Curve3 = new initArbitraryShape(Math.PI, 1.5*Math.PI, -0.02*i, -0.02*i, -2.7, -1.3,true)
        Curve4 = new initArbitraryShape(1.5*Math.PI, 2*Math.PI, 0.02*i, -0.02*i, 2.7, -1.3,true)
        curve = Curve4.concat(Curve2);
        curve = curve.concat(Curve1);
        curve = curve.concat(Curve3);

        frames.push({data: curve});
    }
    //load animation
    initAnimation("animate", frames, [], layout, 10)
}



//load main
function main() {

    $("input[type=submit]").click(function () {
        var idName = $(this).attr("id");
        startAnimation();
    });
    updatePlot()
    initGuidance(["graph","ani","green"]);

}

$(document).ready(main);