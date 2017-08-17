function vectorField3D(x,y,z) {
    return [x,-y,z]
}

function main() {
    var layout = {autosize: true,
                  xaxis: {title: 'x'},
                  yaxis: {title: 'y'},
                  zaxis: {title: 'z'},
                  }


    var N = 4;

    var x = numeric.linspace(-1,1,N);
    var y = numeric.linspace(-1,1,N);
    var z = numeric.linspace(-1,1,N);

    var points = genPoints3D(x,y,z);
    var vecs = genVel3D(x,y,z,vectorField3D);
    var arrows = getQuiver3D(points, vecs, 2, 'rgb(0,0,0)', 0.4);

    Plotly.plot('graph',arrows, layout)
}

$(document).ready(main);