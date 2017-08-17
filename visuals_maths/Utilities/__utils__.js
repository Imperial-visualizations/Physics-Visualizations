// Converts spherical polar coordinates to cartesian coordinates
// r is radius, theta is polar and phi is azimuth
function sp2c(r, theta, phi) {
    return [r * Math.sin(theta) * Math.cos(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(theta)]
}


// Converts cartesian coordinates to spherical polar coordinates
function c2sp(x, y, z) {
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


// Converts 2D polar to cartesian coordinates
function p2c(rho, phi) {
    // return vector in polar coordinates
    return [rho*Math.cos(phi), rho*Math.sin(phi)]
}


// Converts 2D cartesian to polar coordinates
function c2p(x, y) {
    if (Math.pow(x,2) + Math.pow(y,2) === 0) {
        return [0, 0]
    } else {
        var rho = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        if (y >= 0) {
            if (x === 0) {
                var phi = Math.PI/2;
                return [rho, phi]
            } else if (x > 0) {
                var phi = Math.atan(y/x)
                return [rho, phi]
            } else {
                var phi = Math.PI + Math.atan(y/x)
                return [rho, phi]
            }
        }
        else {
            if (x === 0) {
                var phi = 3*Math.PI/2;
                return [rho, phi]
            } else if (x < 0) {
                var phi = Math.PI + Math.atan(y/x);
                return [rho, phi];
            } else {
                var phi = 2*Math.PI + Math.atan(y/x);
                return [rho, phi]
            }
        }
    }
}


// Generate a vector field for given arrays X, Y, Z and a function of (x,y,z) called vectorField3D and place in one array
function genVel2D(X, Y, vectorField2D) {
    var vecs = [];
    for (var i=0; i<X.length; i++) {
        for (var j=0; j<Y.length; j++) {
            vecs.push(vectorField2D(X[i],Y[j]))
        }
    }
    return vecs
}


// Generate a vector field for given arrays X, Y and a function of (x,y) called vectorField2D and place in one array
function genVel3D(X, Y, Z, vectorField3D) {
    var vecs = [];
    for (var i=0; i<X.length; i++) {
        for (var j=0; j<Y.length; j++) {
            for (var k=0; k<Z.length; k++) {
                vecs.push(vectorField3D(X[i],Y[j],Z[k]))
            }
        }
    }
    return vecs
}


// Generate an array of the points to use 2D and 3D versions
function genPoints2D(X, Y) {
    var points = [];
    for (var i=0; i<X.length; i++) {
        for (var j=0; j<Y.length; j++) {
            points.push([X[i],Y[j]])
        }
    }
    return points
}


function genPoints3D(X, Y, Z) {
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


// Before using this function, first use genPoints2D() AND genVel2D() to get the data in the correct format
function getQuiver2D(points, vecs, width, color, ratio) {
    var arrows = [];
    for (var i=0; i<points.length; i++) {
        var my_arrow = new Arrow2D(vecs[i][0],vecs[i][1],
            [points[i][0],points[i][1]],width,color,showlegend=false,ratio);
        // Push shaft
        arrows.push(my_arrow.data.shaft)
        // Push wings
        arrows.push(my_arrow.data.wings)
    }
    return arrows
}


// Before using this function, first use genPoints3D() AND genVel3D() to get the data in the correct format
function getQuiver3D(points, vecs, width, color, ratio) {
    var arrows = [];
    for (var i=0; i<points.length; i++) {
        var my_arrow = new Arrow3D(vecs[i][0],vecs[i][1],vecs[i][2],
            [points[i][0],points[i][1],points[i][2]],width,color,showlegend=false,ratio);
        // Push shaft
        arrows.push(my_arrow.data.shaft)
        // Push wings
        arrows.push(my_arrow.data.wings)
    }
    return arrows
}


///// Arrow object based on design of Ronnie's arrow object written in Python in 2D /////
function Arrow2D(u, v, offset=[0,0], width=5, color='rgb(0,0,0)', showlegend=false, ratio=1) {

// Args:
//     [u,v] (float^2)   - floats between [0, infty)
//     offset (float^2)  - array length 3 to indicate offset of vector if need be, default origin
//     out (bool)        - true if outgoing, false if incoming (to origin), default as outgoing
//     width (int)       - line thickness, default value is 5
//     color (hex/rgb)   - line color, default colour black
//     showlegend (bool) - decide whether a legend is wanted for the arrow, we usually don't want this
//     ratio (float)     - float between (0,1], ratio of length of vector

    // Give the arrow some attributes
    this.u = u
    this.v = v
    this.offset = offset
    this.width = width
    this.color = color
    this.showlegend = showlegend
    this.ratio = ratio

    // Convert to polar coordinates
    var [r, phi] = c2p(u,v)

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
    var wings_xyz = [math.add(p2c(this.ratio*wing_length, phi + wing_angle), offset),
                     math.add(p2c(this.ratio*wing_length, phi - wing_angle), offset)];

    // Arrow shaft
    this.shaft = {x: [offset[0], shaft_xyz[0]],
                  y: [offset[1], shaft_xyz[1]],
                  type: 'scatter',
                  mode: 'lines',
                  line: {color: this.color,
                         width: this.width},
                  showlegend: this.showlegend
    }
    // Arrow wings
    this.wings = {x: [wings_xyz[0][0], shaft_xyz[0], wings_xyz[1][0]],
                  y: [wings_xyz[0][1], shaft_xyz[1], wings_xyz[1][1]],
                  type: 'scatter',
                  mode: 'lines',
                  line: {color: this.color,
                         width: this.width},
                  showlegend: false
    }

    this.data = {'shaft': this.shaft, 'wings': this.wings}
}


///// Arrow object based on design of Ronnie's arrow object written in Python in 3D /////
function Arrow3D(u, v, w, offset=[0,0,0], width=5, color='rgb(0,0,0)', showlegend=false, ratio=1) {

// Args:
//     u,v,w (float)     - float between [0, infty)
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
    var [r, theta, phi] = c2sp(u,v,w)

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
    var wings_xyz = [math.add(sp2c(this.ratio*wing_length, theta + wing_angle, phi), offset),
                     math.add(sp2c(this.ratio*wing_length, theta - wing_angle, phi), offset)];

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

    this.data = {'shaft': this.shaft, 'wings': this.wings}
}

