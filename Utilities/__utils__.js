// Converts spherical polar coordinates to cartesian polar coordinates
function p2c(r, theta, phi) {
    return [r * Math.sin(theta) * Math.cos(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(theta)]
}

// Converts cartesian coordinates to spherical polar coordinates
// r is radius, theta is polar and phi is azimuth
function c2p(x, y, z) {
    if (Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2) === 0) {
        return [0, 0, 0]
    }
    else {
        var r = Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2);
        var theta = Math.acos(z/r);
        if (y >= 0) {
            if (x === 0) {
                var phi = Math.PI/2;
                return [r, theta, phi]
            }
            else {
                var phi = Math.PI/2 + Math.atan(y/x)
                return [r, theta, phi]
            }
        }
        else {
            if (x === 0) {
                var phi = 3*Math.PI/2;
                return [r, theta, phi]
            }
            else {
                var phi = 3*Math.PI/2 + Math.atan(y/x)
                return [r, theta, phi]
            }
        }
    }
}

//var a = [[1,2,3],[4,5,6]]
//console.log(a[0][2])

///// Arrow object based on design of Ronnie's arrow object written in Python /////

function Arrow(r, theta, phi, out, width, color) {

// Args:
//     r (float)       - float between [0, infty)
//     theta (float)   - radians [0, π]
//     phi (float)     - radians [0, 2π]
//     out (bool)      - true if outgoing, false if incoming (to origin)
//     width (int)     - line thickness
//     color (hex/rgb) - line color

    this.r = r
    this.theta = theta
    this.phi = phi
    this.out = out
    this.width = width
    this.color = color

    // Finds polar coordinates of wings ends
    this._find_wing_coord = function() {
        var frac = 0.1;
        var r = this.r;
        var sin45 = Math.sin(Math.PI/4);

        if (this.out === true) {
            var d = r - frac * sin45;
        } else if (this.out === false) {
            var d = r + frac * sin45;
        } else {
            throw "arg: out must be true or false"
        }
        var a = Math.sqrt(Math.pow(frac*sin45,2) + d*d);
        var alpha = Math.acos(d/a);
        return [a, alpha]
    }

    var [wing_length, wing_angle] = this._find_wing_coord();

    var shaft_xyz = p2c(this.r, this.theta, this.phi);
    var wings_xyz = [p2c(wing_length, this.theta + wing_angle, this.phi),
                     p2c(wing_length, this.theta - wing_angle, this.phi)];

    this.shaft = {x: [0, shaft_xyz[0]],
                  y: [0,shaft_xyz[1]],
                  z: [0,shaft_xyz[2]],
                  type: 'scatter3d',
                  mode : 'lines',
                  line: {color: this.color,
                         width: this.width}
    }

    this.wings = {x: [wings_xyz[0][0], shaft_xyz[0], wings_xyz[1][0]],
                  y: [wings_xyz[0][1], shaft_xyz[1], wings_xyz[1][1]],
                  z: [wings_xyz[0][2], shaft_xyz[2], wings_xyz[1][2]],
                  type: 'scatter3d',
                  mode: 'lines',
                  line: {color: this.color,
                         width: this.width}
    }

    this.data = [this.shaft, this.wings]


}

function main() {
    var my_arrow = new Arrow(3,2,Math.PI, true, 5, 'rgb(0,0,0)')
    console.log(my_arrow)
    var data = my_arrow.data
    var layout = {showlegend: false}
    Plotly.plot('graph', data, layout)
}

$(document).ready(main);