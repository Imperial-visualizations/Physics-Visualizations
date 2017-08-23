var a = 1, b = 1, c = 1;
//var zinteglimit = (10*c) -1
//var yinteglimit = (10* b) - 1
//var xinteglimit = (10* a)
var xxinit = [0.3, 0.3, 0.4, 0.4, 0.3, 0.3, 0.4, 0.4];
var yyinit = [0.2, 0.3, 0.3, 0.2, 0.2, 0.3, 0.3, 0.2];
var zzinit = [0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5];
var xxinit2 = [0.4,0.4, 0.3, 0.3, 0.4, 0.4, 0.3, 0.3];
var yyinit2 = [0.2,0.3, 0.3, 0.2, 0.2, 0.3, 0.3, 0.2];
var zzinit2 = [0.0,0.0, 0.0, 0.0, 0.4, 0.3, 0.4, 0.5];
var xxinit3 = [0.3, 0.3, 0.3, 0.4, 0.4, 0.4];
var yyinit3 = [0.0, 0.0, 0.7, 0.0, 0.0, 0.6];
var zzinit3 =  [0.0, 0.6, 0.0, 0.0, 0.7, 0.0];
var zz, yy;
var frames = [];

function ZintegratorZYXelementup(xinit, yinit,zinit,number){
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
        zz.push(zinit[j] +(0.1*number))     
    }
    newcube = {
        type: "mesh3d",
        x: xinit ,
        y: yinit,
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
function ZintegratorZYXelementdown(xinit, yinit,zinit,number){
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            zz.push(zinit[j] - (0.1*number))     
        }
        newcube = {
        type: "mesh3d",
        x: xinit ,
        y: yinit,
        z: zz,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 1.0,
        colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)'] ],
        intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],

        showscale: false}
    return newcube
}
function ZintegratorZYXtotalup(xinit, yinit,zinit,number){
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (zinit[j] != 0.4){
                zz.push(zinit[j] +(0.1*number))        
            } else 
            {
                zz.push(0.0)
            }
        }
        newcube = {
        type: "mesh3d",
        x: xinit ,
        y: yinit,
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
function ZintegratorZYXtotaldown(xinit, yinit,zinit,number){
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (zinit[j] != 0.5){
                zz.push(zinit[j] - (0.1*number))        
            } else 
            {
                zz.push(0.5)
            }
        }
        newcube = {
        type: "mesh3d",
        x: xinit ,
        y: yinit,
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

function YintegratorZYXelementdown(xinit, yinit, zinit, number){
    yy = []
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            ylim = yinit[j] - (0.1*number)
            if (zinit[j] != 0) {
                zlim = c*(0.7 - (ylim/b))
            } else {
                zlim = 0 
            }
            yy.push(ylim)
            zz.push(zlim)
        }
    newcube = {
        type: "mesh3d",
        x: xinit,
        y: yy,
        z: zz,
        i: [0, 3, 0, 4, 4, 7, 3, 7, 1, 5, 4, 4],
        j: [3, 2, 1, 1, 5, 5, 7, 6, 2, 2, 3, 7],
        k: [1, 1, 4, 5, 7, 6, 2, 2, 5, 6, 0, 3],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 1.0,
        colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)'] ],

        showscale: false,}
    return newcube
}
function YintegratorZYXelementup(xinit, yinit, zinit, number){
    yy = []
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            ylim = yinit[j] + (0.1*number)
            if (zinit[j] != 0) {
                zlim = c*(0.7 - (ylim/b))
            } else {
                zlim = 0 
            }
            yy.push(ylim)
            zz.push(zlim)
        }
    newcube = {
        type: "mesh3d",
        x: xinit,
        y: yy,
        z: zz,
        i: [0, 3, 0, 4, 4, 7, 3, 7, 1, 5, 4, 4],
        j: [3, 2, 1, 1, 5, 5, 7, 6, 2, 2, 3, 7],
        k: [1, 1, 4, 5, 7, 6, 2, 2, 5, 6, 0, 3],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 1.0,
        colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)'] ],

        showscale: false,}
    return newcube
}
function YintegratorZYXtotaldown(xinit, yinit, zinit, number){
    yy = []
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (yinit[j] != 0.3) {
            ylim = yinit[j] - (0.1*number)
            } else {
                ylim = 0.2 
            }
            if (zinit[j] != 0) {
                zlim = c*(0.7 - (ylim/b))
            } else {
                zlim = 0 
            }
            yy.push(ylim)
            zz.push(zlim)
        }
    newcube = {
        type: "mesh3d",
        x: xinit,
        y: yy,
        z: zz,
        i: [0, 3, 0, 4, 4, 7, 3, 7, 1, 5, 4, 4],
        j: [3, 2, 1, 1, 5, 5, 7, 6, 2, 2, 3, 7],
        k: [1, 1, 4, 5, 7, 6, 2, 2, 5, 6, 0, 3],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 0.8,
        colorscale: [
          [0, 'rgb(0,62,116)'],
          [1, 'rgb(0,62,116)']
        ],

        opacity: 1.0,
        showscale: false,}
    return newcube
}
function YintegratorZYXtotalup(xinit, yinit, zinit, number){
    yy = []
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (yinit[j] != 0.3) {
            ylim = yinit[j] + (0.1*number)
            } else {
                ylim = 0.0 
            }
            if (zinit[j] != 0) {
                zlim = c*(0.7 - (ylim/b))
            } else {
                zlim = 0 
            }
            yy.push(ylim)
            zz.push(zlim)
        }
    newcube = {
        type: "mesh3d",
        x: xinit,
        y: yy,
        z: zz,
        i: [0, 3, 0, 4, 4, 7, 3, 7, 1, 5, 4, 4],
        j: [3, 2, 1, 1, 5, 5, 7, 6, 2, 2, 3, 7],
        k: [1, 1, 4, 5, 7, 6, 2, 2, 5, 6, 0, 3],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 0.8,
        colorscale: [
          [0, 'rgb(0,62,116)'],
          [1, 'rgb(0,62,116)']
        ],

        opacity: 1.0,
        showscale: false,}
    return newcube
}

function XintegratorZYXelementdown(xinit, yinit, zinit, number){
    xx = []
    yy = []
    zz = []
    for (var j = 0; j <6 ; j++){
        xlim = xinit[j] - (0.1*number)
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
                opacity: 0.5,
                colorscale: [
                [0, 'rgb(0,0,0)'],
                [1, 'rgb(0,0,0)']
            ],
        opacity: 1.0,
        showscale: false            
                }
    return newcube

}
function XintegratorZYXelementup(xinit, yinit, zinit, number){
    xx = []
    yy = []
    zz = []
    for (var j = 0; j <6 ; j++){
        xlim = xinit[j] + (0.1*number)
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
                opacity: 0.5,
                colorscale: [
                [0, 'rgb(0,0,0)'],
                [1, 'rgb(0,0,0)']
            ],
        opacity: 1.0,
        showscale: false            
                }
    return newcube

}
function XintegratorZYXtotaldown(xinit, yinit, zinit, number){
    xx = []
    yy = []
    zz = []
    for (var j = 0; j <6 ; j++){
        if (xinit[j] != 0.3){
            xlim = xinit[j] - (0.1*number)
            
        } else {
            xlim = 0.3
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
function XintegratorZYXtotalup(xinit, yinit, zinit, number){
    xx = []
    yy = []
    zz = []
    for (var j = 0; j <6 ; j++){
        if (xinit[j] != 0.3){
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

function ZYXintegrator() {
    frames = []
    for (var i = 0; i < 5; ++i) {
          frames.push({
            "data": [ZintegratorZYXtotaldown(xxinit,yyinit,zzinit,i),
                     ZintegratorZYXelementdown(xxinit,yyinit,zzinit,i)],
            "name": i})
      }
    for (var i = 0; i < 2; ++i) {
              frames.push({
            "data": [ZintegratorZYXtotalup(xxinit,yyinit,zzinit,i),
                     ZintegratorZYXelementup(xxinit,yyinit,zzinit,i)],
            "name": i + 5})

    }
    for (var i = 0; i < 3; ++i) {
          frames.push({
            "data": [YintegratorZYXtotaldown(xxinit2,yyinit2,zzinit2,i),
                YintegratorZYXelementdown(xxinit2,yyinit2,zzinit2,i)],
            "name": i + 7
        })
      }
    for (var i = 0; i < 3; ++i) {
        var Yintotal = YintegratorZYXtotalup(xxinit2,yyinit2,zzinit2,i)
        var Yinelem = YintegratorZYXelementup(xxinit2,yyinit2,zzinit2,i)
          frames.push({
            "data": [Yintotal,
                Yinelem],
            "name": i + 10
        })
      }
    for (var i = 0; i < 4; ++i) {
          frames.push({
            "data": [XintegratorZYXtotaldown(xxinit3,yyinit3,zzinit3,i),
                    XintegratorZYXelementdown(xxinit3,yyinit3,zzinit3,i)],
            "name": i + 13
        })
      }
    for (var i = 0; i < 7; ++i) {
          frames.push({
            "data": [XintegratorZYXtotalup(xxinit3,yyinit3,zzinit3,i),
                    XintegratorZYXelementup(xxinit3,yyinit3,zzinit3,i)],
            "name": i + 17
        })
      }
    return frames
}

function XintegratorXYZelementup(xinit, yinit,zinit,number){
    xx = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            xx.push(xinit[j] +(0.1*number))     
        }
        newcube = {
        type: "mesh3d",
        x: xx ,
        y: yinit,
        z: zinit,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 1.0,
        colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)'] ],
        intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],

        showscale: false}
    return newcube
}
function XintegratorXYZelementdown(xinit, yinit,zinit,number){
    xx = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            xx.push(xinit[j] - (0.1*number))     
        }
        newcube = {
        type: "mesh3d",
        x: xx ,
        y: yinit,
        z: zinit,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 1.0,
        colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)'] ],
        intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],

        showscale: false}
    return newcube
}
function XintegratorXYZtotalup(xinit, yinit,zinit,number){
    xx = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (xinit[j] != 0.3){
                xx.push(xinit[j] +(0.1*number))        
            } else 
            {
                xx.push(0.0)
            }
        }
        newcube = {
        type: "mesh3d",
        x: xx ,
        y: yinit,
        z: zinit,
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
function XintegratorXYZtotaldown(xinit, yinit,zinit,number){
    xx = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (xinit[j] != 0.4){
                xx.push(xinit[j] - (0.1*number))        
            } else 
            {
                xx.push(0.4)
            }
        }
        newcube = {
        type: "mesh3d",
        x: xx ,
        y: yinit,
        z: zinit,
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


var tetrahedron = {
    type: "mesh3d",
    x: [0, 0, 0, 1],
    y: [0, 0, 1, 0],
    z: [0, 1, 0, 0],
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
  }
var volumeElement = {
    type: "mesh3d",
    x: [0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.1, 0.1] ,
    y: [0., 0.1, 0.1, 0., 0., 0.1, 0.1, 0.],
    z: [0., 0., 0., 0., 0.1, 0.1, 0.1, 0.1],
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    opacity: 0.3,
    colorscale: [
          [0, 'rgb(255,255,255)'],
          [0.5, 'rgb(0,133,202)'],
          [1, 'rgb(0,62,116)']
        ],

    showscale: false
}
var data = [];

frames = ZYXintegrator()
data.push(frames[0].data[0]);
data.push(frames[0].data[1]);
data.push(tetrahedron);

var steps=[]

for (var i = 0; i < (24); ++i) {
    steps.push({
        "method": "animate",
        "args": [
                    [i],
                    {
                        "mode": "immediate",
                        "transition": {"duration": 300,},
                        "frame": {"duration": 300, "redraw": false}
                    }
                ]
    })
}
  var sliders= [{
    "active": 0,
    "pad": {"t":10},
    "steps": steps
  }];
  var layout = {
    "width": 700, "height": 600,
    "margin": {l:0, r:0, t:0, b:0},
    "hovermode": "closest",
    "updatemenus": [
      {
        "x": 0.0, "y": 1,
        "xanchor": "left", "yanchor": "top",
        "showactive": false,
        "type": "buttons",
        "pad": {"t": 87, "r": 10},
        "buttons": [
          {
            "method": "animate",
            "args": [null, {"fromcurrent": true, "transition": {"duration": 200, "easing": "quadratic-in-out"}, "frame": {"duration": 200, "redraw":false}}],
            "label": "Play"
          },
          {
            "method": "animate",
            "args":[[null], {"mode": "immediate", "transition": {"duration": 0}, "frame": {"duration": 0, "redraw": false}}],
            "label": "Pause"
          }
        ]
      }
    ],
    "showlegend": false,
    "sliders": sliders,
      scene: {
    xaxis: {range: [-1, 1]},
    yaxis: {range: [-1, 1]},
    zaxis: {range: [-1, 1]}
    }

  }

Plotly.newPlot('graph', {data:data, frames: frames, layout: layout});