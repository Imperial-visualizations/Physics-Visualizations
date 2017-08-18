// Creates nxn grid for a unit box
function box(n) {
    var X = numeric.linspace(0, 1, n+1);
    var Y = numeric.linspace(0, 1, n+1);
    return {'X': X, 'Y':Y}
}

// Creates circulating arrows inside the nxn grid
function arrowBox(n) {
    // length of box
    var l = 1/n;
    // grid
    grid = box(n)
    data = [];
    new_data = [];
    var v0 = [0,0], v1 = [0,0], v2 = [0,0], v3 = [0,0];
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            v0 = [grid.X[i],grid.Y[j]];
            v1 = [grid.X[i+1],grid.Y[j]];
            v2 = [grid.X[i+1],grid.Y[j+1]];
            v3 = [grid.X[i],grid.Y[j+1]];

            var points = [math.add(v0,[0.1*l,0.1*l]), math.add(v1,[-0.1*l,0.1*l]),
                math.add(v2,[-0.1*l,-0.1*l]), math.add(v3,[0.1*l,-0.1*l])];

            var vecs = [math.add(v1,[-v0[0],-v0[1]]), math.add(v2,[-v1[0],-v1[1]]),
                math.add(v3,[-v2[0],-v2[1]]), math.add(v0,[-v3[0],-v3[1]])];

            new_data = getQuiver2D(points, vecs, 1, 'rgb(0,0,0)', 0.7);

            data = data.concat(new_data)

        }
    }
    return data
}

function circulationPlot() {
    // Vector field with the help of getQuiver
    var X = numeric.linspace(-0.1,1.1,2);
    var Y = numeric.linspace(-0.1,1.1,2);
    var points = genPoints2D(X,Y);
    var vecs = [[1, 0], [0, -1], [0, 1], [-1 ,0]];
    console.log(points)
    var layout = {
        xaxis: {label: 'x', range: [-0.5,1.5]},
        yaxis: {lavel: 'y', range: [-0.5,1.5]},
        showlegend: false
    };

    var data = getQuiver2D(points, vecs, 3, 'rgb(0,0,0)', 0.95);

    var fill_area = {
        x: [0, 1, 1, 0, 0],
        y: [0, 0, 1, 1, 0],
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill: 'tozeroy',
        mode: 'none'
    }

    data.push(fill_area)

    Plotly.plot('circulation_graph',data,layout)
}

function curlPlot(n) {
    var data = arrowBox(n);
    var layout = {
        xaxis: {label: 'x', range: [-0.5,1.5]},
        yaxis: {lavel: 'y', range: [-0.5,1.5]},
        showlegend: false
    };
    Plotly.plot('curl_graph',data,layout)
}

function main(){
    circulationPlot()
    curlPlot(10)
}

$(document).ready(main)