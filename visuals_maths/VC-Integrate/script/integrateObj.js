function carteVolume1(data, verticesX, verticesY, verticesZ, color="rgb(0,0,0)", opacity=1) {
    var volume = {
        type: "mesh3d",
        x: verticesX,
        y: verticesY,
        z: verticesZ,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: opacity,
        colorscale: [['0', color], ['1', color]],
        intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
        showscale: false
    }
    data.push(volume);
    return 1;
}

function carteVolume3(data, a, b, c, verticesZ, color="rgb(0,0,0)", opacity=1) {


    x2.push(0,0);
    y2.push(y[0][meshSize - 1],0);
    z2.push(z[0][0],z[0][0]);

    var zPlane2 = {
        type: "scatter3d",
        mode: "lines",
        x: x2,
        y: y2,
        z: z2,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    }

}

function carteVolume2(data, a, b, c, verticesY = [], verticesZ = [], color="rgb(0,0,0)", opacity=1) {
    var zLength = verticesZ.length;
    var meshSize = 20;
    var zeroes = [0];
    var phi, phiTemp, sinTheta = 0;
    if (verticesY.length === 0) {
        phi = numeric.linspace(0, 0.5*Math.PI, meshSize);
    } else {
        phiTemp = Math.asin(verticesY[0]/(b*Math.sin(Math.acos(verticesZ[0]/c))));
        meshSize = 20*Math.ceil(2*phiTemp/Math.PI);
        phi = numeric.linspace(0, phiTemp, meshSize);
    }
    var x = [], y = [], z = [];
    for(var j = 0, n = zLength; j < n; ++j) {
        x[j] = [], y[j] = [], z[j] = [];
        for(var i = 0; i < meshSize; ++i) {
            sinTheta = Math.sin(Math.acos(verticesZ[j]/c));
            x[j].push(a*Math.cos(phi[i])*sinTheta);
            y[j].push(b*Math.sin(phi[i])*sinTheta);
            z[j].push(verticesZ[j]);
        }
        x[j].push(0);
        y[j].push(y[j][i-1]);
        z[j].push(verticesZ[j]);
        zeroes.push(0,0);
    }

    var sphere = {
        type: "surface",
        x: x,
        y: y,
        z: z,
        showscale: false,
        opacity: opacity,
        colorscale: [[0.0, color], [1.0, color]]
    }

    var zTemp1 = verticesZ.slice(), zTemp2 = verticesZ.slice();
    zTemp2.reverse();
    var zTemp = zTemp2.concat(zTemp1);
    zTemp.push(zTemp2[0]);
    
    var xTemp = zeroes.slice(), yTemp = zeroes.slice();
    for (var i=0; i < zLength; ++i){
        xTemp[i + zLength] = x[i][0];
        yTemp[i + zLength] = y[i][meshSize - 1];
    }
    var xPlane = {
        type: "scatter3d",
        mode: "lines",
        x: zeroes,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 0,
        opacity: opacity
    }
    var yPlane = {
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: zeroes,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 1,
        opacity: opacity
    }

    //TODO: functions for bottom and top

    xTemp = x[0].slice();
    yTemp = y[0].slice();
    zTemp = z[0].slice();

    xTemp.push(0, 0);
    yTemp.push(verticesY[0], 0);
    zTemp.push(verticesZ[0], verticesZ[0]);

    var zBottom = {
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    }

    xTemp = x[zLength - 1].slice();
    yTemp = y[zLength - 1].slice();
    zTemp = z[zLength - 1].slice();

    xTemp.push(0,0);
    yTemp.push(verticesY[0], 0);
    zTemp.push(verticesZ[zLength - 1], verticesZ[zLength - 1]);

    var zTop = {
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    }

    data.push(sphere);
    data.push(yPlane);
    data.push(xPlane);
    data.push(zTop);
    data.push(zBottom);
    return 1;
}

//might be useful for cylindrical
function carteVolume3(data, a, b, c, verticesY = [], verticesZ = [], color="rgb(0,0,0)", opacity=1) {

    var yLength = verticesY.length, zLength = verticesZ.length;
    var meshSize = 20;
    var zeroes = [0];
    var phi, phiTemp, sinTheta = 0;
    if (yLength === 0) {
        phi = numeric.linspace(0, 0.5*Math.PI, meshSize);
    } else {
        phiTemp = Math.asin(verticesY[yLength - 1]/(b* Math.sin(Math.acos(verticesZ[0]/c))));
        meshSize = 20*Math.ceil(yLength/b);
        phi = numeric.linspace(0, phiTemp, meshSize);
    }
    var x = [], y = [], z = [];
    for(var j = 0, n = zLength; j < n; ++j) {
        x[j] = [], y[j] = [], z[j] = [];
        for(var i = 0; i < meshSize; ++i) {
            sinTheta = Math.sin(Math.acos(verticesZ[j]/c));
            x[j].push(a*Math.cos(phi[i])*sinTheta);
            y[j].push(b*Math.sin(phi[i])*sinTheta);
            z[j].push(verticesZ[j]);
        }
        zeroes.push(0,0);
    }
    var sphere = {
        type: "surface",
        x: x,
        y: y,
        z: z,
        showscale: false,
        opacity: opacity,
        colorscale: [[0.0, color], [1.0, color]]
    }

    var zTemp1 = verticesZ.slice(), zTemp2 = verticesZ.slice();
    zTemp2.reverse();
    var zTemp = zTemp2.concat(zTemp1);
    zTemp.push(zTemp2[0]);

    var xTemp = zeroes.slice(), yTemp = zeroes.slice();
    for (var i=0; i < zLength; ++i){
        xTemp[i + zLength] = x[i][0];
        yTemp[i + zLength] = y[i][meshSize - 1];
    }
    var xPlane = {
        type: "scatter3d",
        mode: "lines",
        x: zeroes,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 0,
        opacity: opacity
    }
    var yPlane = {
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: zeroes,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 1,
        opacity: opacity
    }

    xTemp = x[0].slice();
    yTemp = y[0].slice();
    zTemp = z[0].slice();

    xTemp.push(0);
    yTemp.push(0);
    zTemp.push(verticesZ[0]);

    var zBottom = {
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    }

    xTemp = x[zLength - 1].slice();
    yTemp = y[zLength - 1].slice();
    zTemp = z[zLength - 1].slice();

    xTemp.push(0);
    yTemp.push(0);
    zTemp.push(verticesZ[zLength - 1]);

    var zTop = {
        type: "scatter3d",
        mode: "lines",
        x: xTemp,
        y: yTemp,
        z: zTemp,
        line: {color: color, width: 1},
        surfaceaxis: 2,
        opacity: opacity
    }

    data.push(sphere);
    data.push(yPlane);
    data.push(xPlane);
    data.push(zTop);
    data.push(zBottom);
    return 1;
}


function SphericalVE (x, y, z){
    this.verticesX = x,
    this.verticesY = y,
    this.verticesZ = z,
    this.gObject = function(color="rgb(0,0,0)", opacity=1) {
        var vE = {
            type: "mesh3d",
            x: this.verticesX,
            y: this.verticesY,
            z: this.verticesZ,
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
            opacity: opacity,
            colorscale: [['0', color], ['1', color]],
            intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
            showscale: false
        }
        return vE
    }
}
/*
function CylindricalVE (x, y, z){
    this.verticesX = x,
    this.verticesY = y,
    this.verticesZ = z,
    this.gObject = function(color="rgb(0,0,0)", opacity=1) {
        var vE = {
            type: "mesh3d",
            x: this.verticesX,
            y: this.verticesY,
            z: this.verticesZ,
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
            opacity: opacity,
            colorscale: [['0', color], ['1', color]],
            intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
            showscale: false
        }
        return vE
    }
}
*/
function QuarterSphere(a,b,c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.meshSize = 20;

    this.gObject = function(color1, color2) {
        var theta = numeric.linspace(0, 0.5*Math.PI, this.meshSize);
        var phi = numeric.linspace(0, 0.5*Math.PI, this.meshSize);
        var x = [], y = [], z = [];
        for(var i = 0; i < this.meshSize; ++i) {
            x[i] = [], y[i] = [], z[i] = [];
            for(var j = 0; j < this.meshSize; ++j) {
                x[i].push(this.a*Math.cos(phi[i])*Math.sin(theta[j]));
                y[i].push(this.b*Math.sin(phi[i])*Math.sin(theta[j]));
                z[i].push(this.c*Math.cos(theta[j]));
            }
        }
        var sphere = {
            type: "surface",
            x: x,
            y: y,
            z: z,
            showscale: false,
            opacity: 0.6,
            colorscale: [[0.0, color1], [1.0, color2]]
        }
        return sphere;
    }
    this.gObjectX = function(color) {
        var theta = numeric.linspace(0, 0.5*Math.PI, this.meshSize);
        var x=[0,0], y=[0], z=[0];
        for(var i=0; i<this.meshSize; ++i){
            x.push(0);
            y.push(this.b*Math.sin(theta[i]));
            z.push(this.c*Math.cos(theta[i]));
        }
        y.push(0);
        z.push(0);

        var xPlane = {
            type: "scatter3d",
            mode: "lines",
            x: x,
            y: y,
            z: z,
            line: {color: color.slice(0, -1) + ",0.2)", width: 1},
            surfaceaxis: 0,
            opacity: 0.8
        }
        return xPlane;
    }
    this.gObjectY = function(color) {
        var theta = numeric.linspace(0, 0.5*Math.PI, this.meshSize);
        var x=[0], y=[0,0], z=[0];
        for(var i=0; i<this.meshSize; ++i){
            x.push(this.a*Math.sin(theta[i]));
            y.push(0);
            z.push(this.c*Math.cos(theta[i]));
        }
        x.push(0);
        z.push(0);

        var yPlane = {
            type: "scatter3d",
            mode: "lines",
            x: x,
            y: y,
            z: z,
            line: {color: color.slice(0, -1) + ",0.2)", width: 1},
            surfaceaxis: 1,
            opacity: 0.8
        }
        return yPlane;
    }
    this.gObjectZ = function(color) {
        var phi = numeric.linspace(0, 0.5*Math.PI, this.meshSize);
        var x=[0], y=[0], z=[0,0];
        for(var i=0; i<this.meshSize; ++i){
            x.push(this.a*Math.cos(phi[i]));
            y.push(this.b*Math.sin(phi[i]));
            z.push(0);
        }
        x.push(0);
        y.push(0);

        var zPlane = {
            type: "scatter3d",
            mode: "lines",
            x: x,
            y: y,
            z: z,
            line: {color: color.slice(0, -1) + ",0.2)", width: 1},
            surfaceaxis: 2,
            opacity: 0.8
        }
        return zPlane;
    }
}