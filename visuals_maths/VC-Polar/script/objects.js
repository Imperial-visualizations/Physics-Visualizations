'use strict';
// Colour definitions:
var magenta = "#FF00FF",
    blue = "#0000FF",
    green = "#008000",
    impBlue = "#003E74",
    black = "rgb(0,0,0)",
    white = "rgb(255,255,255)",
    cyan = "rgb(0,146,146)", //1
    lilac = "rgb(182,109,255)", //2
    orange = "rgb(219,209,0)"; //3

// Plot Utilities:
/**
 * sets camera options in layout.
 * @param {array} point - point of viewpoint.
 */
function createView(point) {
  var norm = Math.sqrt(point[0]*point[0] + (5*point[1])*(5*point[1]) + point[2]*point[2]);
  var a = 0.5 + point[0]/norm, b = 1 +  5*point[1]/norm, c = 0.5 + point[2]/norm;
  var camera = {
    up: {x: 0, y: 0, z: 1},
    eye: {x: -a, y: -b, z: c + 0.5},
    center: {x: 0, y: 0, z: -0.2}
  }
  return camera
}
/**
 * Creates Axes Object.
 * @param {float} length - length of the half axes.
 */
function createAxes(length) {
    var axes = [];
    var vector = [0, length];
    var initialVec;
    var vecString = ["x", "y", "z"];
    var originString = ["", "", "(0,0,0)"];
    for (var i = 0; i < 3; ++i) {
        initialVec = [[0, 0], [0, 0], [0, 0]];
        initialVec[i] = vector;
        axes.push(
            {
                type: "scatter3d",
                mode: "lines+text",
                x: initialVec[0],
                y: initialVec[1],
                z: initialVec[2],
                line: {color: "rgb(0,0,0)", width: 4},
                text: [originString[i], vecString[i]],
                textfont: {size: 15},
                textposition: "top"
            }
        );
    }
    return axes;
}

// Change of Basis:
/**
 * changes spherical to cartesian coordinates
 * @param {float} r - r.
 * @param {float} theta - theta.
 * @param {float} phi - phi.
 */
function sp2c(r,theta,phi) {
    return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
    ];
}
/**
 * changes cartesian to spherical coordinates
 * @param {float} x - x.
 * @param {float} y - y.
 * @param {float} z - z.
 */
function c2sp(x,y,z) {
    var r = 0, theta = 0, phi = 0;
    if (x*x + y*y + z*z !== 0) {
        r = Math.sqrt(x*x + y*y + z*z);
        theta = Math.acos(z/r);
        phi = Math.atan2(y,x);
    }
    return [r, theta, phi];
}
/**
 * changes polar to cartesian coordinates
 * @param {float} rho - rho.
 * @param {float} phi - phi.
 */
function p2c(rho, phi) {
    return [
        rho * Math.cos(phi),
        rho * Math.sin(phi)
    ];
}
/**
 * changes cartesian to polar coordinates
 * @param {float} x - x.
 * @param {float} y - y.
 */
function c2p(x,y) {
    var rho = 0, phi = 0;
    if (x*x + y*y !== 0) {
        rho = Math.sqrt(x*x + y*y);
        phi = Math.atan2(y,x);
    }
    return [rho, phi];
}


///Shape Objects:
//3D Objects:
/**
 * Represents a line.
 * @constructor
 * @param {list} points - list of the points in the line.
 */
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

    this.arrowHead = function(color, width=7, wingLen=0.1, dash="solid") {
        var lastElm = this.x.length - 1;
        var [r, theta, phi] = c2sp(this.x[lastElm]-this.x[0], this.y[lastElm]-this.y[0], this.z[lastElm]-this.z[0]);
        var offset = [this.x[0], this.y[0], this.z[0]];
        var frac = wingLen*r;
        var sin45 = Math.sin(Math.PI/4);
        var d = r - frac * sin45;
        var wingLength = Math.sqrt(Math.pow(frac*sin45,2) + d*d);
        var wingAngle = Math.acos(d/wingLength);


        var wings_xyz = [
            math.add(sp2c(wingLength, theta + wingAngle, phi), offset),
            math.add(sp2c(wingLength, theta - wingAngle, phi), offset)
        ];

        var wings = {
            type: "scatter3d",
            mode: "lines",
            x: [wings_xyz[0][0], this.x[lastElm], wings_xyz[1][0]],
            y: [wings_xyz[0][1], this.y[lastElm], wings_xyz[1][1]],
            z: [wings_xyz[0][2], this.z[lastElm], wings_xyz[1][2]],
            line: {color: color, width: width}
        }

        return wings;
    }
}
/**
 * Represents a point.
 * @constructor
 * @param {array} position - position of the point.
 */
function Point(position) {
    this.position = position;
    this.gObject = function(color, size = 7, symbol="circle") {
        var pointObject = {
            type: "scatter3d",
            mode: "markers",
            x: [this.position[0]],
            y: [this.position[1]],
            z: [this.position[2]],
            marker: {"color": color, "size": size, "symbol": symbol}
        }
        return pointObject;
    }
}
/**
 * Represents a sphere.
 * @constructor
 * @param {float} radius - radius of the sphere.
 */
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
            opacity: 0.6,
            colorscale: [[0.0, color1], [1.0, color2]]
        }
        return sphere;
    }
}
/**
 * Represents a cylinder.
 * @constructor
 * @param {float} radius - radius of the circular cross-section.
 * @param {float} height - height of the cylinder.
 */
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
/**
 * Represents a cuboid.
 * @constructor
 * @param {float} x - half length of cuboid in x-direction.
 * @param {float} y - half length of cuboid in y-direction.
 * @param {float} z - half length of cuboid in z-direction.
 */
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
//2D Objects:
/**
 * Represents a circle.
 * @constructor
 * @param {float} radius - radius of the circle.
 */
function Circle(radius) {
    this.radius = radius;

    this.gObject = function(color=cyan, centre=[0,0]) {
        var phi = numeric.linspace(0, 2*Math.PI, 40);
        var x = [], y = [];
        for (var i=0, n=phi.length; i<n; ++i) {
            x.push(this.radius*Math.cos(phi[i]) + centre[0]);
            y.push(this.radius*Math.sin(phi[i]) + centre[1]);
        }
        var circle = {
            type: "scatter",
            mode: "lines",
            x: x,
            y: y,
            line: {simplify: false, color: color},
            fill:'toself',
            opacity: 0.5
        }
        return circle;
    }
}
/**
 * Represents a line.
 * @constructor
 * @param {list} points - list of the points in the line.
 */
function Line2d(points) {
    this.x = [];
    this.y = [];

    for (var i = 0; i  < points.length; ++i) {
        this.x.push(points[i][0]);
        this.y.push(points[i][1]);
    }

    this.gObject = function(color, width=7, dash="solid") {
        var lineObject = {
            type: "scatter",
            mode: "lines",
            x: this.x,
            y: this.y,
            line: {color: color, width: width, dash:dash}
        }
        return lineObject;
    }

    this.arrowHead = function(color, width=7, dash="solid") {
        var lastElm = this.x.length - 1;
        var [rho, phi] = c2p(this.x[lastElm] - this.x[0], this.y[lastElm] - this.y[0]);
        var offset = [this.x[0], this.y[0]];
        var frac = 0.2*rho;
        var sin45 = Math.sin(Math.PI/4);
        var d = rho - frac * sin45;
        var wingLength = Math.sqrt(Math.pow(frac*sin45,2) + d*d);
        var wingAngle = Math.acos(d/wingLength);

        var wings_xyz = [
            math.add(p2c(wingLength, phi + wingAngle), offset),
            math.add(p2c(wingLength, phi - wingAngle), offset)
        ];

        var wings = {
            type: "scatter",
            mode: "lines",
            x: [wings_xyz[0][0], this.x[lastElm], wings_xyz[1][0]],
            y: [wings_xyz[0][1], this.y[lastElm], wings_xyz[1][1]],
            line: {color: color, width: width}
        }

        return wings;
    }
}