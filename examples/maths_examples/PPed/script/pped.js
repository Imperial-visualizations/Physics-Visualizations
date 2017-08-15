// Draw a 1x1x1 cube as default, global variables
var u = [1,0,0];
var v = [0,1,0];
var w = [0,0,1];

// Parallelipiped object
var my_pped = {
    u: u,
    v: v,
    w: w,
    // Method to find volume
    volume: function() {
        var crossp = math.cross(this.v,this.w);
        var vol = math.dot(this.u,crossp);
        return Math.abs(vol)
    },
    // Method to return object to plot on plotly
    gopped: function() {
        var data = {
        type: "mesh3d",
        x : [0,this.u[0],this.u[0]+this.v[0],this.v[0],this.w[0],this.w[0]+this.u[0],this.w[0]+this.u[0]+this.v[0],
             this.v[0]+this.w[0]],
        y : [0,this.u[1],this.u[1]+this.v[1],this.v[1],this.w[1],this.w[1]+this.u[1],this.w[1]+this.u[1]+this.v[1],
             this.v[1]+this.w[1]],
        z : [0,this.u[2],this.u[2]+this.v[2],this.v[2],this.w[2],this.w[2]+this.u[2],this.w[2]+this.u[2]+this.v[2],
             this.v[2]+this.w[2]],
        i : [0, 0, 3, 4, 4, 4, 4, 4, 5, 6, 6, 7],
        j : [2, 3, 4, 3, 6, 7, 1, 5, 2, 2, 7, 3],
        k : [1, 2, 0, 7, 5, 6, 0, 1, 1, 5, 2, 2],
        opacity: 0.6,
        showlegend: true
        }
        return data
    },
    // Layout object
    lytpped: function() {
        var ubx = Math.abs(this.u[0])+Math.abs(this.v[0])+Math.abs(this.w[0]);
        var uby = Math.abs(this.u[1])+Math.abs(this.v[1])+Math.abs(this.w[1]);
        var ubz = Math.abs(this.u[2])+Math.abs(this.v[2])+Math.abs(this.w[2]);
        var layout = {
            xaxis: {
                title: 'x',
                range:[-ubx,ubx]
            },
            yaxis: {
                title: 'y',
                range: [-uby,uby]
            },
            zaxis: {
                title: 'z',
                range: [-ubz,ubz]
            },
            font: {
                family: "Lato",
                size: 12,
                color: "#003E74",
                weight: 900
            },
            fill : 'tonexty',
            showlegend: true
        }
        return layout
    }
}

// Completely useless at the moment
function getImage() {
    var x = document.createElement("ppedImage");
    x.setAttribute("src","pped_image.png");
    x.setAttribute("height","300")
    x.setAttribute("height","300")
    document.getElementById("panel").appendChild(x);
}

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

///// Arrow object based on design of Ronnie's arrow object written in Python /////

///// Arrow object based on design of Ronnie's arrow object written in Python /////
function Arrow(u, v, w, offset=[0,0,0], out=true, width=5, color='rgb(0,0,0)',showlegend=false) {

// Args:
//     r (float)        - float between [0, infty)
//     theta (float)    - radians [0, π]
//     phi (float)      - radians [0, 2π]
//     offset (float^3) - array length 3 to indicate offset of vector if need be, default origin
//     out (bool)       - true if outgoing, false if incoming (to origin), default as outgoing
//     width (int)      - line thickness, default value is 5
//     color (hex/rgb)  - line color, default colour black
//     showlegend (bool)- decide whether a legend is wanted for the arrow, we usually don't want this

    // Give the arrow some attributes
    this.u = u
    this.v = v
    this.w = w
    this.offset = offset
    this.out = out
    this.width = width
    this.color = color
    this.showlegend = showlegend

    // Convert to polar coordinates
    var [r, theta, phi] = c2p(u,v,w)

    // Finds polar coordinates of wings ends
    this._find_wing_coord = function() {
        var frac = 0.1*r;
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
    // Translate to offset
    var shaft_xyz = [this.u+offset[0], this.v+offset[1], this.w+offset[2]];
    var wings_xyz = [math.add(p2c(wing_length, theta + wing_angle, phi), offset),
                     math.add(p2c(wing_length, theta - wing_angle, phi), offset)];
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
    var vol = my_pped.volume();

    // Give arrows names as well for legends
    var arrow1 = new Arrow(u[0],u[1],u[2],[0,0,0],true, 5,'rgb(0,62,116)',true);
    arrow1.shaft['name'] = 'u⃗'
    var arrow2 = new Arrow(v[0],v[1],v[2],[0,0,0],true, 5,'rgb(2,137,59)',true);
    arrow2.shaft['name'] = 'v⃗'
    var arrow3 = new Arrow(w[0],w[1],w[2],[0,0,0],true, 5,'rgb(221,37,1)',true);
    arrow3.shaft['name'] = 'w⃗'

    var data = [my_pped.gopped(),arrow1.data[0],arrow1.data[1],arrow2.data[0],arrow2.data[1],arrow3.data[0],
                arrow3.data[1]];

    var layout = my_pped.lytpped();

    document.getElementById("volume").innerHTML = String(vol);
    Plotly.newPlot('graph',data,layout)
    $("#panel").hide()
    $("#reveal").click(function() {
        $("#panel").slideToggle("slow");
    });
    getImage();
}

function ppedplotter() {
    var ux = Number(document.getElementById('ux').value);
    var uy = Number(document.getElementById('uy').value);
    var uz = Number(document.getElementById('uz').value);
    u = [ux,uy,uz];

    var vx = Number(document.getElementById('vx').value);
    var vy = Number(document.getElementById('vy').value);
    var vz = Number(document.getElementById('vz').value);
    v = [vx,vy,vz];

    var wx = Number(document.getElementById('wx').value);
    var wy = Number(document.getElementById('wy').value);
    var wz = Number(document.getElementById('wz').value);
    w = [wx,wy,wz];

    my_pped.u = u;
    my_pped.v = v;
    my_pped.w = w;

    var vol = my_pped.volume();

    var arrow1 = new Arrow(u[0],u[1],u[2],[0,0,0],true, 5,'rgb(0,62,116)',true);
    arrow1.shaft['name'] = 'u⃗'
    var arrow2 = new Arrow(v[0],v[1],v[2],[0,0,0],true, 5,'rgb(2,137,59)',true);
    arrow2.shaft['name'] = 'v⃗'
    var arrow3 = new Arrow(w[0],w[1],w[2],[0,0,0],true, 5,'rgb(221,37,1)',true);
    arrow3.shaft['name'] = 'w⃗'

    // Arrow data and PPed data
    var data = [my_pped.gopped(),arrow1.data[0],arrow2.data[0],arrow3.data[0],
                arrow1.data[1],arrow2.data[1],arrow3.data[1]];
    var layout = my_pped.lytpped();

    Plotly.newPlot('graph',data,layout)
    vol = my_pped.volume();
    document.getElementById("volume").innerHTML = String(vol);
}
$(document).ready(main);
