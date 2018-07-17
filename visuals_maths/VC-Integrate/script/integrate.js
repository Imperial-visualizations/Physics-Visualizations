var tetrahedron = {
    type: "mesh3d",
    x: [0, 0, 0, 4],
    y: [0, 0, 4, 0],
    z: [0, 4, 0, 0],
    i: [0, 0, 0, 1],
    j: [1, 2, 3, 2],
    k: [2, 3, 1, 3],
    intensity: [0, 0.33, 0.66, 1],
    colorscale: [
      [0, 'rgb(255,255,255)'],
      [1, 'rgb(255,255,255)']
    ],
    opacity: 0.5,
    showscale : false
  };

var axes = createAxes(4);
var layout = {
    width: 450, height: 450,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        camera: {
            up: {x: 0, y: 0, z: 1},
            eye: {x: 1, y: 2, z: 0.5},
            center: {x: 0, y: 0, z: -0.15}
        },
        aspectratio: {x:1, y:1, z:1},
        xaxis: {range: [0, 5], autorange: false, zeroline: true,},
        yaxis: {range: [0, 5], autorange: false, zeroline: true,},
        zaxis: {range: [0, 5], autorange: false, zeroline: true,},
    }
}

function integratorZYXelement(xinit, yinit,zinit,number, direction, element){
    zz = []
    yy = []
    xx = []
    if (element === 1){
        for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
        zz.push(zinit[j] + direction*(0.1*number));
    }
    xx= xinit
    yy = yinit
    }
    if (element === 2) {
       for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            ylim = yinit[j] + direction*(0.1*number)
            if (zinit[j] != 0 ) {
                zlim = c*(1 - ((xinit[j]/a) +(ylim/b)))
            } else {
                zlim = 0
            }
            yy.push(ylim)
            zz.push(zlim)
        }
    xx = xinit
    }
    if (element === 3){
        for (var j = 0; j <6 ; j++){
        xlim = xinit[j] + direction*(0.1*number)
        if (yinit[j] != 0) {
                ylim = b*(1 - (xlim/a))
            } else {
                ylim = 0
            }
        if (zinit[j] != 0) {
                zlim = c*(1 - ((ylim/b)+(xlim/a)))
            } else {
                zlim = 0
            }
            xx.push(xlim)
            yy.push(ylim)
            zz.push(zlim)

                }
                newcube = {
                type: "mesh3d",
                x: xx,
                y: yy,
                z: zz,
                i: [3,0,0,1,3,3],
                j: [5,1,3,3,0,2],
                k: [4,2,1,4,2,5],
                opacity: 0.5,
                colorscale: [
                [0, 'rgb(0,0,0)'],
                [1, 'rgb(0,0,0)']
            ],
        opacity: 1.0,
        showscale: false}
        return newcube
    }


    newcube = {
        type: "mesh3d",
        x: xx ,
        y: yy,
        z: zz,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 1.0,
        colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)'] ],
        intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
        showscale: false
    }
    return newcube

}
function integratorZYXtotal(xinit, yinit,zinit,number,direction, element){
    xx = []
    yy = []
    zz = []
    if (element ===1){
        for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (zinit[j] != 0.4 && direction === 1){
                zz.push(zinit[j] +(0.1*number))
            } else if (zinit[j] === 0.4 && direction === 1){
                zz.push(0.0)
            } else if (zinit[j] != 0.5 && direction === -1) {
                zz.push(zinit[j] - (0.1*number))
            } else {
                zz.push(0.5)
            }
        }
        xx = xinit
        yy = yinit
    }
    if (element ===2) {
        for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (yinit[j] != 0.3 && direction === -1) {
                ylim = yinit[j] - (0.1*number)
            } else if (yinit[j] === 0.3 && direction === -1){
                ylim = 0.2
            } else if (yinit[j] != 0.2 && direction ===1) {
                ylim = yinit[j] + (0.1*number)
            } else {
                ylim = 0.0
            }
            if (zinit[j] != 0 ) {
                zlim = c*(1 - (xinit[j]+(ylim/b)))
            } else {
                zlim = 0
            }
            yy.push(ylim)
            zz.push(zlim)
        }
        xx = xinit

    }
    if (element ===3) {
     for (var j = 0; j <6 ; j++){
        if (xinit[j] != 0.4 && direction === -1){
            xlim = xinit[j] - (0.1*number)

        } else if (xinit[j] === 0.4 && direction === -1) {
            xlim = 0.4
        } else if (xinit[j] != 0.3 && direction === 1) {
            xlim = xinit[j] + (0.1*number)
        } else {
            xlim = 0.0
        }

        if (yinit[j] != 0) {
                ylim = b*(1 - (xlim/a))
            } else {
                ylim = 0
            }
        if (zinit[j] != 0) {
                zlim = 1 - c*((ylim/b)+(xlim/a))
            } else {
                zlim = 0
            }
            xx.push(xlim)
            yy.push(ylim)
            zz.push(zlim)
    }
            newcube = {
                type: "mesh3d",
                x: xx,
                y: yy,
                z: zz,
                i: [3,0,0,1,3,3],
                j: [5,1,3,3,0,2],
                k: [4,2,1,4,2,5],
                opacity: 1.0,
            colorscale: [
            [0, 'rgb(0,62,116)'],
            [1, 'rgb(0,62,116)']
            ],
                showscale: false
                }
    return newcube

    }

        newcube = {
        type: "mesh3d",
        x: xx ,
        y: yy,
        z: zz,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 0.8,
        colorscale: [
          [0, 'rgb(0,62,116)'],
          [1, 'rgb(0,62,116)']
        ],

        showscale: false, }
    return newcube
}
function ZYXintegrator() {
    var xxinit = [0.3, 0.3, 0.4, 0.4, 0.3, 0.3, 0.4, 0.4];
    var yyinit = [0.2, 0.3, 0.3, 0.2, 0.2, 0.3, 0.3, 0.2];
    var zzinit = [0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5];
    var xxinit2 = [0.4,0.4, 0.3, 0.3, 0.4, 0.4, 0.3, 0.3];
    var yyinit2 = [0.2,0.3, 0.3, 0.2, 0.2, 0.3, 0.3, 0.2];
    var zzinit2 = [0.0,0.0, 0.0, 0.0, 0.4, 0.3, 0.4, 0.5];
    var xxinit3 = [0.3, 0.3, 0.3, 0.4, 0.4, 0.4];
    var yyinit3 = [0.0, 0.0, 0.7, 0.0, 0.0, 0.6];
    var zzinit3 =  [0.0, 0.6, 0.0, 0.0, 0.7, 0.0];
    frames = []
    for (var i = 0; i < 5; ++i) {
          frames.push({
            "data": [integratorZYXtotal(xxinit,yyinit,zzinit,i, -1,1),
                     integratorZYXelement(xxinit,yyinit,zzinit,i,-1,1)],
            "name": i})
      }
    for (var i = 0; i < 2; ++i) {
              frames.push({
            "data": [integratorZYXtotal(xxinit,yyinit,zzinit,i,1),
                     integratorZYXelement(xxinit,yyinit,zzinit,i,1)],
            "name": i + 5})

    }
    for (var i = 0; i < 3; ++i) {
          frames.push({
            "data": [integratorZYXtotal(xxinit2,yyinit2,zzinit2,i, -1,2),
                integratorZYXelement(xxinit2,yyinit2,zzinit2,i, -1,2)],
            "name": i + 7
        })
      }
    for (var i = 0; i < 3; ++i) {
        var Yintotal = integratorZYXtotal(xxinit2,yyinit2,zzinit2,i,1,2)
        var Yinelem = integratorZYXelement(xxinit2,yyinit2,zzinit2,i,1,2)
          frames.push({
            "data": [Yintotal,
                Yinelem],
            "name": i + 10
        })
      }
    for (var i = 0; i < 4; ++i) {
          frames.push({
            "data": [integratorZYXtotal(xxinit3,yyinit3,zzinit3,i, -1,3),
                    integratorZYXelement(xxinit3,yyinit3,zzinit3,i, -1,3)],
            "name": i + 13
        })
      }
    for (var i = 0; i < 7; ++i) {
          frames.push({
            "data": [integratorZYXtotal(xxinit3,yyinit3,zzinit3,i,1,3),
                    integratorZYXelement(xxinit3,yyinit3,zzinit3,i,1,3)],
            "name": i + 17
        })
      }
    return frames
}

function computeFrames(){

}

function initPlot(){
    Plotly.purge("graph");
    var data = [{
        type:"scatter3d",
        mode:"lines",
        x: [0,1],
        y: [0,1],
        z: [0,1],
        line: {color: black, width: 2, dash:"solid"}
    }];

    data = data.concat(axes);
    data.push(tetrahedron);

    var newcube = {
        type: "mesh3d",
        x: [0.3, 0.3, 0.4, 0.4, 0.3, 0.3, 0.4, 0.4],
        y: [0.2, 0.3, 0.3, 0.2, 0.2, 0.3, 0.3, 0.2],
        z: [0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5],
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 1.0,
        colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)'] ],
        intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
        showscale: false
    }

    data.push(newcube);

    Plotly.newPlot("graph", data, layout);
    //initAnimation("animateButton", frames, extra, layout, 10, [0, 38], true);
}

function main() {
    $("input[type=range]").each(function () {
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
        });
    });

    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');
            return false;
        });
    });

    $("input[type=submit]").click(function () {
        var idName = $(this).attr("id");
        console.log("animating")
    });

    $("input[type=button]").click(function () {
        var idName = $(this).attr("id");
        console.log("button")
    });

    initPlot();
}
$(document).ready(main);