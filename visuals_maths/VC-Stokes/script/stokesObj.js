'use strict';
///Shape Objects:
//3D Objects:
/**
 * Represents a line.
 * @constructor
 * @param {list} points - list of the points in the line.
 */
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
            z.push(height*Math.sin(theta[i]) + this.center[2]);
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