function Zintegrator(xinit, yinit,zinit,number){
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
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 0.6,
        colorscale: [
                  [0, 'rgb(255,255,255)'],
                  [0.5, 'rgb(0,133,202)'],
                  [1, 'rgb(0,62,116)']
            ],  

        showscale: false        }
    return newcube
}

function Yintegrator(xinit, yinit, zinit, number){
    yy = []
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            ylim = yinit[j] +(0.1*number)
            if (zinit[j] != 0) {
                zlim = 1 - ylim
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
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 0.6,
        colorscale: [
                  [0, 'rgb(255,255,255)'],
                  [1, 'rgb(255,255,255)']
            ],  

        showscale: false        }
    return newcube
}

//function Xintegrator(xinit, yinit , number)
    


var a = 1
var b = 1
var c = 1
xxinit = [0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.1, 0.1];
yyinit = [0., 0.1, 0.1, 0., 0., 0.1, 0.1, 0.];
zzinit = [0., 0., 0., 0., 0.1, 0.1, 0.1, 0.1];
var zz, yy
var frames = []
var data = [{
    type: "mesh3d",
    x: [0, 0, 0, a],
    y: [0, 0, b, 0],
    z: [0, c, 0, 0],
    i: [0, 0, 0, 1],
    j: [1, 2, 3, 2],
    k: [2, 3, 1, 3],
    intensity: [0, 0.33, 0.66, 1],
    colorscale: [
      [0, 'rgb(0,62,116)'],
      [1, 'rgb(0,62,116)']
    ],
    opacity: 0.5,
    showscale : false
  },{
    type: "mesh3d",
    x: [0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.1, 0.1] ,
    y: [0., 0.1, 0.1, 0., 0., 0.1, 0.1, 0.],
    z: [0., 0., 0., 0., 0.1, 0.1, 0.1, 0.1],
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    opacity: 0.6,
    colorscale: [
          [0, 'rgb(255,255,255)'],
          [0.5, 'rgb(0,133,202)'],
          [1, 'rgb(0,62,116)']
        ],

    showscale: false,
    visible: true
    }
];

for (var i = 0 ; i < 8 ; i++) {
    cubeish = Zintegrator(xxinit,yyinit,zzinit,i)
    data.push(cubeish)
}

var toptrianglething = {
    type: "mesh3d",
    x: [0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.1, 0.1] ,
    y: [0., 0.1, 0.1, 0.1, 0., 0.1, 0.1, 0.],
    z: [1., 0.9, 0.9, 0.8, 0.0, 0.0, 0.0, 0.0],
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    opacity: 0.6,
    colorscale: [
          [0, 'rgb(255,255,255)'],
          [0.5, 'rgb(0,133,202)'],
          [1, 'rgb(0,62,116)']
        ],

    showscale: false,
    visible: true,
    intensity: [0, 0.33, 0.66, 1],
    opacity: 0.6,
    colorscale: [
          [0, 'rgb(255,255,255)'],
          [1, 'rgb(255,255,255)']
        ],
    showscale : false
  }

xxinit2 = [0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.1, 0.1] ,
yyinit2 = [0., 0.1, 0.1, 0.1, 0., 0.1, 0.1, 0.],
zzinit2 = [1., 0.9, 0.9, 0.8, 0.0, 0.0, 0.0, 0.0]

for (var i = 0 ; i < 10 ; i++) {
    cubeish = Yintegrator(xxinit2,yyinit2,zzinit2,i)
    console.log(cubeish)
//    data.push(cubeish)
}
var toptrianglething2 = {
    type: "mesh3d",
    x: [0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.1, 0.1] ,
    y: [0., 0.1, 0.1, 0.1, 0., 0.1, 0.1, 0.],
    z: [1., 0.9, 0.9, 0.8, 0.0, 0.0, 0.0, 0.0]

    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    opacity: 0.6,

    showscale: false,
    visible: true,
    intensity: [0, 0.33, 0.66, 1],
    opacity: 0.6,
    colorscale: [
          [0, 'rgb(0,0,0)'],
          [1, 'rgb(0,0,0)']
        ],
    showscale : false
  }
data.push(toptrianglething2)

Plotly.plot('graph', data);
