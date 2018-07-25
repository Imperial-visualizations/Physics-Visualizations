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
    orange = "rgb(219,209,0)", //3
    red = "rgb(160, 0, 0)",
    realOrange = "rgb(227,104, 0)";



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
            z.push(height*(height*Math.sin(theta[i]) + this.center[2])+height);
        }
        var lineObject = {
            type: "scatter3d",
            mode: "lines",
            x: x,
            y: y,
            z: z,
            line: {color: color, width: width, dash:dash},
            surfaceaxis: 2,
            surfacecolor: green,
            opacity:0.5
        }
        return lineObject;
    }

}
function Square(a) {
    this.a = a;

    this.gObject = function(color1, color2) {
        var square = {
            x: [-a, a],
            y: [-a, a],
            z: [[0, 0],
                [0, 0]],
            colorscale: [[0.0, color1], [1.0, color2]],
            opacity: 0.7,
            showscale: false,
            type: "surface"
        }
        return square;
    }
}
function Circle(radius){
    this.radius = radius;

    var phi = numeric.linspace(0,2*Math.PI,20);
    this.x = [], this.y = [], this.z = [];

    for (var i=0; i<20; ++i){
        this.x.push(this.radius*Math.cos(phi[i])+1);
        this.y.push(this.radius*Math.sin(phi[i])+1);
        this.z.push(0)
    }
    this.gObject = function(color=black, width=10, dash="solid") {
        var lineObject = {
            type: "scatter3d",
            mode: "lines",
            x: this.x,
            y: this.y,
            z: this.z,
            line: {color: color, width: width, dash:dash},
            surfaceaxis: 2,
            surfacecolor: green,
            opacity:0.5
        }
        return lineObject;
    }

}

function Sphere(radius) {
    this.radius = radius;
    this.gObject = function(color1,color2, width=7, dash="solid",size,height=1, wave=4) {
        var meshSize = 40;
        var phi = numeric.linspace(0, 2*Math.PI, meshSize);
        var theta= numeric.linspace(0, 0.5*Math.PI, meshSize);
        var beta = numeric.linspace(0,wave*Math.PI, meshSize);

        this.x = [], this.y = [], this.z = [];
        for(var i = 0; i < meshSize; ++i) {
            this.x[i] = [], this.y[i] = [], this.z[i] = [];
            for(var j = 0; j < meshSize; ++j) {

                this.x[i].push(this.radius*Math.cos(phi[i])*Math.sin(theta[j])+1);


                this.y[i].push(this.radius*Math.sin(phi[i])*Math.sin(theta[j])+1);
                this.z[i].push(height*(size*this.radius*Math.cos(theta[j])+height*(height*Math.sin(theta[j])*(Math.sin(beta[i])+ 1)+height)));

            }
        }
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




function c2p(x,y) {
    var rho = 0, phi = 0;
    if (x*x + y*y !== 0) {
        rho = Math.sqrt(x*x + y*y);
        phi = Math.atan2(y,x);
    }
    return [rho, phi];
}

function sp2c(r,theta,phi) {
    return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
    ];
}

function c2sp(x,y,z) {
    var r = 0, theta = 0, phi = 0;
    if (x*x + y*y + z*z !== 0) {
        r = Math.sqrt(x*x + y*y + z*z);
        theta = Math.acos(z/r);
        phi = Math.atan2(y,x);
    }
    return [r, theta, phi];
}


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
            type: "scatter3d",
            mode: "lines",
            x: [wings_xyz[0][0], this.x[lastElm], wings_xyz[1][0]],
            y: [wings_xyz[0][1], this.y[lastElm], wings_xyz[1][1]],
            z: [0,0,0],
            line: {color: color, width: width}
        }

        return wings;
    }
}
function p2c(rho, phi) {
    return [
        rho * Math.cos(phi),
        rho * Math.sin(phi)
    ];
}