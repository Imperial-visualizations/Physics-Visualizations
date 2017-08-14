var u = [1,0,0];
var v = [0,1,0];
var w = [0,0,1];

var my_pped = {
    u: u,
    v: v,
    w: w,
    volume: function() {
        var crossp = math.cross(this.v,this.w);
        var vol = math.dot(this.u,crossp);
        return Math.abs(vol)
    },
    gopped: function() {
        var data = {
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
        "opacity": 0.6,
//        "colorscale": [[0, "rgb(0,62,116)"],[1, "rgb(255,255,255)"]]
//        "colorscale":'Viridis'
        }
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
            font: {
                family: "Lato",
                size: 12,
                color: "#003E74",
                weight: 900
                },
                fill : 'tonexty',
                showlegend: false
        }
        return layout
    }
}

//  Arrow prototype
function Arrow(start,end) {
    this.start = start;
    this.end = end;
    // Method to return data for the arrow shaft
    this.shaft_data = function() {
        var x = [this.start[0],this.end[0]];
        var y = [this.start[1],this.end[1]];
        var z = [this.start[2],this.end[2]];
        var data = {
            x: x,
            y: y,
            z: z,
            type: 'scatter3d',
            mode: 'lines',
            line: {
                width: 10,
                color: "rgb(0,62,116)"
            }
        }
    return data
    }
    // Method to return data for arrow head
    this.head_data = function() {
        var x
    }
    // Merge data for arrow with current plot, probably unnecessary...
    this.merge = function(data) {
        var new_data = [data,this.shaft_data()];
        return new_data
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

function main() {
    var vol = my_pped.volume();
    var arrow1 = new Arrow([0,0,0],u);
    var arrow2 = new Arrow([0,0,0],v);
    var arrow3 = new Arrow([0,0,0],w);

    var data = [my_pped.gopped(),arrow1.shaft_data(),arrow2.shaft_data(),arrow3.shaft_data()];

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
    var arrow1 = new Arrow([0,0,0],u);
    var arrow2 = new Arrow([0,0,0],v);
    var arrow3 = new Arrow([0,0,0],w);
    // Arrow data and PPed data
    var data = [my_pped.gopped(),arrow1.shaft_data(),arrow2.shaft_data(),arrow3.shaft_data()];
    var layout = my_pped.lytpped();

    Plotly.newPlot('graph',data,layout)
    vol = my_pped.volume();
    document.getElementById("volume").innerHTML = String(vol);
}
$(document).ready(main);
