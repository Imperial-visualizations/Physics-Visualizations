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

function carteVolume2(data, a, b, c, verticesZ, color="rgb(0,0,0)", opacity=1) {
    var meshSize = 20;
    var phi = numeric.linspace(0, 0.5*Math.PI, meshSize);
    var x = [], y = [], z = [];
    for(var j = 0, n = verticesZ.length; j < n; ++j) {
        x[j] = [], y[j] = [], z[j] = [];
        for(var i = 0; i < meshSize; ++i) {
            theta = Math.acos(verticesZ[j]/c);
            x[j].push(a*Math.cos(phi[i])*Math.sin(theta));
            y[j].push(b*Math.sin(phi[i])*Math.sin(theta));
            z[j].push(verticesZ[j]);
        }
    }
    var sphere = {
        type: "surface",
        x: x,
        y: y,
        z: z,
        showscale: false,
        opacity: 0.4,
        colorscale: [[0.0, color], [1.0, color]]
    }
    var yPlane = {
        type: "scatter3d",
        mode: "lines",
        x: [0, 0, x[0][0], x[1][0], 0],
        y: [0, 0, 0, 0, 0],
        z: [verticesZ[1], verticesZ[0], verticesZ[0], verticesZ[1], verticesZ[1]],
        line: {color: color.slice(0, -1) + ",0.2)", width: 1},
        surfaceaxis: 1,
        opacity: 0.8
    }
    var xPlane = {
        type: "scatter3d",
        mode: "lines",
        x: [0, 0, 0, 0, 0],
        y: [0, 0, y[0][19], y[1][19], 0],
        z: [verticesZ[1], verticesZ[0], verticesZ[0], verticesZ[1], verticesZ[1]],
        line: {color: color.slice(0, -1) + ",0.2)", width: 1},
        surfaceaxis: 0,
        opacity: 0.8
    }

    x1 = x[1].slice();
    y1 = y[1].slice();
    z1 = z[1].slice();

    x1.push(0);
    y1.push(0);
    z1.push(z[1][0]);

    var zPlane1 = {
        type: "scatter3d",
        mode: "lines",
        x: x1,
        y: y1,
        z: z1,
        line: {color: color.slice(0, -1) + ",0.2)", width: 1},
        surfaceaxis: 2,
        opacity: 0.8
    }

    x2 = x[0].slice();
    y2 = y[0].slice();
    z2 = z[0].slice();

    x2.push(0);
    y2.push(0);
    z2.push(z[0][0]);

    var zPlane2 = {
        type: "scatter3d",
        mode: "lines",
        x: x2,
        y: y2,
        z: z2,
        line: {color: color.slice(0, -1) + ",0.2)", width: 1},
        surfaceaxis: 2,
        opacity: 0.8
    }

    data.push(sphere);
    data.push(yPlane);
    data.push(xPlane);
    data.push(zPlane1);
    data.push(zPlane2);
    return 1;
}

function carteVolume3(data, verticesX, verticesY, verticesZ, color="rgb(0,0,0)", opacity=1) {
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