console.log("hello world")
function roXaxis(theta) {
   var M = Math.matrix([[1, 0, 0],
                   [0, Math.cos(theta), -Math.sin(theta)], 
                   [0, Math.sin(theta), Math.cos(theta)]
                  ]);
    return M;
    }

function roYaxis(theta) {
    var M = Math.matrix([[Math.cos(theta), 0, Math.sin(theta)],
                   [0, 1, 0],
                   [-Math.sin(theta), 0, Math.cos(theta)]
                  ]);
    return M;
}

function roZaxis(theta){
    var M = Math.matrix([[Math.cos(theta), -Math.sin(theta), 0],
                   [Math.sin(theta), Math.cos(theta), 0],
                   [0, 0 ,1]
                  ]);
    return M;
}

function rotation(point,axis,theta){
    var pointVec = Math.matrix(point);
    var pointRot = Math.multipy(rotation(theta),pointVec);
    return pointRot;



var xx = [0.,0.,0.,0.,1.,1.,1.,1.];
var yy = [0.,0.,1.,1.,0.,0.,1.,1.];
var zz = [0.,1.,0.,1.,0.,1.,0.,1.];
var xrot = [];
var yrot = [];
var zrot = [];


for (var i = 0 ; i >= 7 ; i--) {
    console.log(i)
    var point = [xx[i],yy[i].zz[i]];
    console.log(point)
    var pointOut = rotation(point,roXaxis,Math.PI/2);
    xrot.push(pointOut[0]);
    yrot.push(pointOut[1]);
    zrot.push(pointOut[2]);
}



