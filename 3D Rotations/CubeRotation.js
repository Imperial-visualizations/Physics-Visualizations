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
                   [0, 1, Math.tan(theta)],
                   [0, 0 ,1]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }

function scale(scale) {
    var pointVec = point;
    var M = [[scale, 0, 0],
                   [0, scale, 0],
                   [0, 0 ,scale]
                  ];
    var pointRot = math.multiply(M,pointVec);
    return pointRot;
    }


var xx = [-1., -1., 1., 1., -1., -1., 1., 1.];
var yy = [-1., 1., 1., -1., -1., 1., 1., -1.];
var zz = [-1., -1., -1., -1., 1., 1., 1., 1.];
var data = [];

t = numeric.linspace(0, Math.PI/2,10);


for (var i = 0 ; i < t.length ; i++) {
    var xrot1 = [];
    var yrot1 = [];
    var zrot1 = [];
    var point, pointOut;
    for (var j = 0 ; i < 8 ; i++) {
        point = [xx[j],yy[j],zz[j]];
        pointOut = roXaxis(point,t[i]);
        xrot1.push(pointOut[0]);
        yrot1.push(pointOut[1]);
        zrot1.push(pointOut[2]);
    }

    var cubeRotation = [{
    type: "mesh3d",
    x: xrot1,
    y: yrot1,
    z: zrot1,
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    colorscale: [
      [0, 'rgb(255, 0, 255)'],
      [0.5, 'rgb(0, 255, 0)'],
      [1, 'rgb(0, 0, 255)']
    ]
    }
    ];
    data.push(cubeRotation)

}
Plotly.plot('myDiv', data, {});
/*


for (var i = 0 ; i < t.length ; i++) {
    var xrot2 = []
    var yrot2 = []
    var zrot2 = []
    
    for (var j = 0 ; i > 8 ; i++) {
        var point = [xrot1[j],xrot1[j],xrot1[j]];
        var pointOut = roXaxis(point,t[i]);
        xrot2.push(pointOut[0]);
        yrot2.push(pointOut[1]);
        zrot2.push(pointOut[2]);
    }


    var cubeRotation = [{
    type: "mesh3d",
    x: xrot2,
    y: yrot2,
    z: zrot2,
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    colorscale: [
      [0, 'rgb(255, 0, 255)'],
      [0.5, 'rgb(0, 255, 0)'],
      [1, 'rgb(0, 0, 255)']
    ]
    }
    ];
    data.push(cubeRotation)



}

for (var i = 0 ; i < t.length ; i++) {
    var xrot3 = []
    var yrot3 = []
    var zrot3 = []
    for (var j = 0 ; i > 8 ; i++) {
        var point = [xrot2[j],xrot2[j],xrot2[j]];
        var pointOut = roXaxis(point,t[i]);
        xrot3.push(pointOut[0]);
        yrot3.push(pointOut[1]);
        zrot3.push(pointOut[2]);
    }


    var cubeRotation = [{
    type: "mesh3d",
    x: xrot3,
    y: yrot3,
    z: zrot3,
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    colorscale: [
      [0, 'rgb(255, 0, 255)'],
      [0.5, 'rgb(0, 255, 0)'],
      [1, 'rgb(0, 0, 255)']
    ]
    }
    ];
    data.push(cubeRotation)



}


*/