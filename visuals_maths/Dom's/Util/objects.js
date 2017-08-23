//Objects:
function Line(points) {
    this.x = [];
    this.y = [];
    this.z = [];
    for (var i = 0; i  < points.length; ++i) {
        this.x.push(points[i][0]);
        this.y.push(points[i][1]);
        this.z.push(points[i][2]);
    }

    this.gObject = function(color, width=7, dash="solid") {
        var lineObject = {
            type: "scatter3d",
            mode: "lines",
            x: this.x,
            y: this.y,
            z: this.z,
            line: {color: color, width: width, dash:dash}
        }
        return lineObject;
    }
}
function Point(position) {
    this.position = position;
    this.gObject = function(color, symbol="circle") {
        pointObject = {
            type: "scatter3d",
            mode: "markers",
            x: [this.position[0]],
            y: [this.position[1]],
            z: [this.position[2]],
            marker: {"color": color, "size": 7, "symbol": symbol}
        }
        return pointObject;
    }
}
function Sphere(radius) {
    this.radius = radius;
    var meshSize = 20;
    var theta = numeric.linspace(0, Math.PI, meshSize);
    var phi = numeric.linspace(0, 2*Math.PI, meshSize);
    this.x = [], this.y = [], this.z = [];
    for(var i = 0; i < meshSize; ++i) {
        this.x[i] = [], this.y[i] = [], this.z[i] = [];
        for(var j = 0; j < meshSize; ++j) {
            this.x[i].push(radius*Math.cos(phi[i])*Math.sin(theta[j]));
            this.y[i].push(radius*Math.sin(phi[i])*Math.sin(theta[j]));
            this.z[i].push(radius*Math.cos(theta[j]));
        }
    }
    this.gObject = function(color1, color2) {
        var sphere = {
            type: "surface",
            x: this.x,
            y: this.y,
            z: this.z,
            showscale: false,
            opacity: 0.7,
            colorscale: [[0.0, color1], [1.0, color2]]
        }
        return sphere;
    }
}
function Cylinder(radius, height){
    this.radius = radius;
    this.height = height;
    var meshSize = radius * 10;
    if (meshSize === 0) {meshSize = 2;}
    var phi = numeric.linspace(0, 2*Math.PI, meshSize);
    this.x = [], this.y = [], this.z = [];
    var hValue = numeric.linspace(-height, height, meshSize);

    var xTemp = [], yTemp = [], zTemp = [];
    for(var i = 0; i < meshSize; ++i) {
        xTemp.push(radius*Math.cos(phi[i]));
        yTemp.push(radius*Math.sin(phi[i]));
    }
    for(var i = 0; i < meshSize; ++i) {
        this.x.push(xTemp);
        this.y.push(yTemp);
        this.z.push(numeric.rep([meshSize], hValue[i]));
    }

    this.gObjectCurve = function(color1, color2) {
        var curve = {
            type: "surface",
            x: this.x,
            y: this.y,
            z: this.z,
            showscale: false,
            opacity: 0.7,
            colorscale: [[0.0, color1], [1.0, color2]]
        }
        return curve;
    }
    this.gObjectTop = function(color) {
        var top = {
            type: "scatter3d",
            mode: "lines",
            x: this.x[0],
            y: this.y[0],
            z: this.z[meshSize - 1],
            line: {color: color.slice(0, -1) + ",0.2)", width: 1},
            surfaceaxis: 2,
            opacity: 0.5
        }
        return top;
    }
    this.gObjectBottom = function(color) {
        var bottom = {
            type: "scatter3d",
            mode: "lines",
            x: this.x[0],
            y: this.y[0],
            z: this.z[0],
            line: {color: color.slice(0, -1) + ",0.7)", width: 1},
            surfaceaxis: 2,
            opacity: 0.7
        }
        return bottom;
    }
}
function Cuboid(x, y, z){
    this.width = x,
    this.length = y,
    this.height = z,
    this.gObject = function(color) {
        var cuboid = {
            type: "mesh3d",
            x: [-x, -x, x, x, -x, -x, x, x],
            y: [-y, y, y, -y, -y, y, y, -y],
            z: [-z, -z, -z, -z, z, z, z, z],
            i : [0, 0, 3, 4, 4, 4, 4, 4, 5, 6, 6, 7],
            j : [2, 3, 4, 3, 6, 7, 1, 5, 2, 2, 7, 3],
            k : [1, 2, 0, 7, 5, 6, 0, 1, 1, 5, 2, 2],
            opacity: 0.5,
            colorscale: [['0', color], ['1', "rgb(255,255,255)"]],
            intensity: [0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1],
            showscale: false
        }
        return cuboid
    }
}