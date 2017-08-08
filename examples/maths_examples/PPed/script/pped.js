var u = [4,0,0];
var v = [2,1,0];
var w = [0,3,5];

var my_pped = {
    u: u,
    v: v,
    w: w,
    volume: function() {
        var crossp = math.cross(this.v,this.w);
        var vol = math.dot(this.u,crossp);
        return vol
    },
    gopped: function() {
        var data = [{
        type: "mesh3d",
        "x" : [0,this.u[0],this.u[0]+this.v[0],this.v[0],this.w[0],this.w[0]+this.u[0],this.w[0]+this.u[0]+this.v[0],
             this.v[0]+this.w[0]],
        "y" : [0,this.u[1],this.u[1]+this.v[1],this.v[1],this.w[1],this.w[1]+this.u[1],this.w[1]+this.u[1]+this.v[1],
             this.v[1]+this.w[1]],
        "z" : [0,this.u[2],this.u[2]+this.v[2],this.v[2],this.w[2],this.w[2]+this.u[2],this.w[2]+this.u[2]+this.v[2],
             this.v[2]+this.w[2]],
        "i" : [0, 0, 3, 4, 4, 4, 4, 4, 5, 6, 6, 7],
        "j" : [2, 3, 4, 3, 6, 7, 1, 5, 2, 2, 7, 3],
        "k" : [1, 2, 0, 7, 5, 6, 0, 1, 1, 5, 2, 2],
        "opacity": 0.8,
        "colorscale": [[0, "rgb(0,62,116)"], [0.2, 'rgb(40, 40, 40)'], [1, "rgb(255,255,255)"]]
        }]
        return data
    },
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
            font: {family: "Helvetica Neue"}
        }
        return layout
    }
}

function main() {
    var vol = my_pped.volume();
    var data = my_pped.gopped();
    var layout = my_pped.lytpped();
    document.getElementById("volume").innerHTML = String(vol);
    Plotly.plot('graph',data,layout)
}

$(document).ready(main);
