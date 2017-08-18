function roXaxis(point, theta) {
    var pointVec = point;
    var M = [[1, 0, 0],
                [0, Math.cos(theta), -Math.sin(theta)], 
                   [0, Math.sin(theta), Math.cos(theta)]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function roYaxis(point, theta) {
    var pointVec = point;
    var M = [[Math.cos(theta), 0, Math.sin(theta)],
                   [0, 1, 0],
                   [-Math.sin(theta), 0, Math.cos(theta)]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function roZaxis(point, theta) {
    var pointVec = point;
    var M = [[Math.cos(theta), -Math.sin(theta), 0],
                   [Math.sin(theta), Math.cos(theta), 0],
                   [0, 0 ,1]
                  ]
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function skewXaxis(point, theta) {
    var pointVec = point;
    var M = [[1, Math.tan(theta), 0],
                   [0, 1, 0],
                   [0, 0 ,1]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function skewYaxis(point, theta) {
    var pointVec = point;
    var M = [[1, 0, 0],
                   [Math.tan(theta), 1, 0],
                   [0, 0 ,1]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function skewZaxis(point, theta) {
    var pointVec = point;
    var M = [[1, 0, 0],
                   [0, 1, 0],
                   [0, Math.tan(theta) ,1]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function scale(point, scale) {
    var pointVec = point;
    var M = [[scale, 0, 0],
                   [0, scale, 0],
                   [0, 0 ,scale]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function master(transformation, initalparam, finalparam,xinit,yinit,zinit){
    t = numeric.linspace(initalparam,finalparam  ,10);

    for (var i = 0 ; i < t.length ; i++) {
        xrot1 = []
        yrot1 = []
        zrot1 = []
        var point, pointOut;
        for (var j = 0 ; j < 8 ; j++) {
            point = [xinit[j],yinit[j],zinit[j]];
            pointOut = transformation(point,t[i]);
            xrot1.push(pointOut[0]);
            yrot1.push(pointOut[1]);
            zrot1.push(pointOut[2]);
        }
        cubeRotation = [{
        type: "mesh3d",
        x: xrot1,
        y: yrot1,
        z: zrot1,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        colorscale: [
          [0, 'rgb(255,255,255)'],
          [0.5, 'rgb(0,133,202)'],
          [1, 'rgbrgb(0,62,116)']
        ]
        }]
        ;
        name = 'frame' + i;
        frames.push({
          "name": name,
          "data": cubeRotation
          }
        )
    }
    return frames;
}


var xx = [-1., -1., 1., 1., -1., -1., 1., 1.];
var yy = [-1., 1., 1., -1., -1., 1., 1., -1.];
var zz = [-1., -1., -1., -1., 1., 1., 1., 1.];
var data = [];

var initial = [{
    type: "mesh3d",
    x: xx,
    y: yy,
    z: zz,
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    colorscale: [
      [0, 'rgb(255,255,255)'],
      [0.5, 'rgb(0,133,202)'],
      [1, 'rgbrgb(0,62,116)']
    ]
    }]

var frames = []
var name
var data = [];
var xrot1 = [];
var yrot1 = [];
var zrot1 = [];

var cubeRotation;


var frames1 = master(roXaxis,0,Math.PI/2,xx,yy,zz)
frames.push(frames1)

var frames2 = master(roYaxis,0,Math.PI/2,xrot1,yrot1,zrot1)
frames.push(frames2)

var frames3 = master(skewXaxis,0,Math.PI/4,xrot1,yrot1,zrot1)
frames.push(frames3)

var frames4 = master(skewYaxis,0,Math.PI/4,xrot1,yrot1,zrot1)
frames.push(frames4)





var layout = {
  scene:{
	 aspectmode: "manual",
   aspectratio: {
     x: 1, y: 1, z: 1,
    },
   xaxis: {
    range: [-2, 2],
  },
   yaxis: {
    range: [-2, 2],
  },
   zaxis: {
   range: [-2, 2],
  }},
};

Plotly.newPlot('graph', initial, layout )
Plotly.animate('graph', frames, {transition: {
      duration: 100,
      easing: 'linear'
    },frame: {
      duration: 100,
      redraw: false,
    },mode: 'immediate'},layout);