// Converts spherical polar coordinates to cartesian polar coordinates
function p2c(r, theta, phi) {
    return [r * Math.sin(theta) * Math.cos(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(theta)]
}

// Converts cartesian coordinates to spherical polar coordinates
// r is radius, theta is polar and phi is azimuth
// Converts cartesian coordinates to spherical polar coordinates
// r is radius, theta is polar and phi is azimuth
function c2p(x, y, z) {
    if (Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2) === 0) {
        return [0, 0, 0]
    }
    else {
        var r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
        var theta = Math.acos(z/r);
        if (y >= 0) {
            if (x === 0) {
                var phi = Math.PI/2;
                return [r, theta, phi]
            } else if (x > 0) {
                var phi = Math.atan(y/x)
                return [r, theta, phi]
            } else {
                var phi = Math.PI + Math.atan(y/x)
                return [r, theta, phi]
            }
        }
        else {
            if (x === 0) {
                var phi = 3*Math.PI/2;
                return [r, theta, phi]
            } else if (x < 0) {
                var phi = Math.PI + Math.atan(y/x);
                return [r, theta, phi];
            } else {
                var phi = 2*Math.PI + Math.atan(y/x);
                return [r, theta, phi]
            }
        }
    }
}

// Vector field function to be used put here...
function vectorField(x, y, z) {
    return [x, y, z]
}

// Generate a vector field for given arrays X, Y, Z and a function of (x,y,z) called vectorField and place in one array
function genVel(X, Y, Z, vectorField) {
    var vecs = [];
    for (var i=0; i<X.length; i++) {
        for (var j=0; j<Y.length; j++) {
            for (var k=0; k<Z.length; k++) {
                vecs.push(vectorField(X[i],Y[j],Z[k]))
            }
        }
    }
    return vecs
}

// Generate an array of the points to use
function genPoints(X, Y, Z) {
    var points = [];
    for (var i=0; i<X.length; i++) {
        for (var j=0; j<Y.length; j++) {
            for (var k=0; k<Z.length; k++) {
                points.push([X[i],Y[j],Z[k]])
            }
        }
    }
    return points
}

// Before using this function, first use genPoints() AND genVel() to get the data in the correct format
function getQuiver(points, vecs, width, color, ratio) {
    var arrows = [];
    for (var i=0; i<points.length; i++) {
        var my_arrow = new Arrow(vecs[i][0],vecs[i][1],vecs[i][2],
            [points[i][0],points[i][1],points[i][2]],width,color,showlegend=false,ratio);
        // Push shaft
        arrows.push(my_arrow.data[0])
        // Push wings
        arrows.push(my_arrow.data[1])
    }
    return arrows
}

///// Arrow object based on design of Ronnie's arrow object written in Python /////
function Arrow(u, v, w, offset=[0,0,0], width=5, color='rgb(0,0,0)', showlegend=false, ratio=1) {

// Args:
//     r (float)         - float between [0, infty)
//     theta (float)     - radians [0, π]
//     phi (float)       - radians [0, 2π]
//     offset (float^3)  - array length 3 to indicate offset of vector if need be, default origin
//     out (bool)        - true if outgoing, false if incoming (to origin), default as outgoing
//     width (int)       - line thickness, default value is 5
//     color (hex/rgb)   - line color, default colour black
//     showlegend (bool) - decide whether a legend is wanted for the arrow, we usually don't want this
//     ratio (float)     - float between (0,1], ratio of length of vector

    // Give the arrow some attributes
    this.u = u
    this.v = v
    this.w = w
    this.offset = offset
    this.width = width
    this.color = color
    this.showlegend = showlegend
    this.ratio = ratio

    // Convert to polar coordinates
    var [r, theta, phi] = c2p(u,v,w)

    // Finds polar coordinates of wings ends
    this._find_wing_coord = function() {
        var frac = 0.1*r;
        var sin45 = Math.sin(Math.PI/4);
        var d = r - frac * sin45;

        var a = Math.sqrt(Math.pow(frac*sin45,2) + d*d);
        var alpha = Math.acos(d/a);
        return [a, alpha]
    }

    var [wing_length, wing_angle] = this._find_wing_coord();
    // Translate to offset
    var shaft_xyz = [this.u*this.ratio+offset[0], this.v*this.ratio+offset[1], this.w*this.ratio+offset[2]];
    var wings_xyz = [math.add(p2c(this.ratio*wing_length, theta + wing_angle, phi), offset),
                     math.add(p2c(this.ratio*wing_length, theta - wing_angle, phi), offset)];
    // Arrow shaft
    this.shaft = {x: [offset[0], shaft_xyz[0]],
                  y: [offset[1], shaft_xyz[1]],
                  z: [offset[2], shaft_xyz[2]],
                  type: 'scatter3d',
                  mode: 'lines',
                  line: {color: this.color,
                         width: this.width},
                  showlegend: this.showlegend
    }
    // Arrow wings
    this.wings = {x: [wings_xyz[0][0], shaft_xyz[0], wings_xyz[1][0]],
                  y: [wings_xyz[0][1], shaft_xyz[1], wings_xyz[1][1]],
                  z: [wings_xyz[0][2], shaft_xyz[2], wings_xyz[1][2]],
                  type: 'scatter3d',
                  mode: 'lines',
                  line: {color: this.color,
                         width: this.width},
                  showlegend: false
    }

    this.data = [this.shaft, this.wings]
}

function main() {
    var layout = {autosize: true,
                  xaxis: {title: 'x'},
                  yaxis: {title: 'y'},
                  zaxis: {title: 'z'},
                  scene: {
                      aspectratio: {
                          x: 1,
                          y: 1,
                          z: 1
                      }
                  },
                  showlegend: false}

    var N = 4

    var x = numeric.linspace(-1,1,N);
    var y = numeric.linspace(-1,1,N);
    var z = numeric.linspace(-1,1,N);

    var points = genPoints(x,y,z);
    var vecs = genVel(x,y,z,vectorField);
    var arrows = getQuiver(points, vecs, 2, 'rgb(0,0,0)', 0.4);

    Plotly.plot('graph', arrows, layout)
}

$(document).ready(main);