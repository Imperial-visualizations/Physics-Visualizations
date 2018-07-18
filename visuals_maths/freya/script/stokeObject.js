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
function Pringles(radius, center) {
    this.radius = radius;
    this.center = center;

    this.gObject = function(color=black, width=7, dash="solid", height=1, wave=4) {
        var meshSize = 40; //multiple of 4!
        var phi = numeric.linspace(0, 2*Math.PI, meshSize);
        var theta = numeric.linspace(0,wave*Math.PI, meshSize);
        var x = [], y = [], z = [];

        for (var i=0, n=phi.length; i<n; ++i) {
            x.push(this.radius*Math.cos(phi[i]) + this.center[0]);
            y.push(this.radius*Math.sin(phi[i]) + this.center[1]);
            z.push(height*(height*Math.sin(theta[i]) + this.center[2]));
        }
        var lineObject = {
            type: "scatter3d",
            mode: "lines",
            x: x,
            y: y,
            z: z,
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
function Square(a) {
    this.a = a;

    this.gObject = function() {
        var square = {
            x: [-a, a],
            y: [-a, a],
            z: [[0, 0],
                [0, 0]],
            colorscale: [[0.0, lilac.slice(0,-1) + ",0.5)"], [1.0, white]],
            opacity: 0.7,
            showscale: false,
            type: "surface"
        }
        return square;
    }
}
function Circle(radius){
    var radius = this.radius;
    this.gObject = function(color=black, width=7, dash="dot") {
        var phi = numeric.linspace(0,2*Math.PI,20);
        var x = [], y = [], z = [];

        for (i=0; i<20; ++i){
            x.push(radius*Math.cos(phi[i]));
            y.push(radius*Math.sin(phi[i]));
            z.push(0)
        }
        var lineObject = {
            type: "scatter3d",
            mode: "lines",
            x: x,
            y: y,
            z: z,
            line: {color: color, width: width, dash:dash}
        }
        return lineObject;
    }
}