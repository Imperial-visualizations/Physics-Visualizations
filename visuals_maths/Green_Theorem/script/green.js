// Arrow object and quiver functions come from the __utils__.js file

/** Rotation matrix
* @function
* @param {float} th - angle of rotation
*/
function rotmat(th) {
  var rotator = [[Math.cos(th),-Math.sin(th)],[Math.sin(th),Math.cos(th)]];
  return rotator;
}

/** Rotation function returns arrays x,y for smooth transition
* @function
* @param {array} vec - array/vector to rotate
* @param {float} th - angle of rotation
*/
function rotation(vec,th) {
    // Parameters
    var N = 10;
    var t = numeric.linspace(0,th,N);
    // Rotation matrix
    var x = [];
    var y = [];
    var myvec = math.matrix(vec);
    for (var i=0; i<N; i++) {
        var newvec = math.multiply(rotmat(t[i]),myvec);
            // Pull out x and y components
            x.push(newvec._data[0])
            y.push(newvec._data[1])
    }
    return [x,y];
}

/** Takes wings of an arrow and rotates anti-clockwise about head by 90 degrees, this is used for the
// circulation integral diagram to prevent glitching with plotly.animate.
* @function
* @param {Arrow.wings} wings - wings of arrow object
* @param {array} offset - offset of wings
* @param {float} th - angle of rotation
*/
function wingRotation(wings, offset, th) {
    var rotated = [];
    var x = [], y = [], addedXVec = [], addedYVec = [];
    // Shift along the offset to rotate around origin
    var shiftedx = math.add(wings.x,[-offset[0],-offset[0],-offset[0]])
    var shiftedy = math.add(wings.y,[-offset[1],-offset[1],-offset[1]])
    for (var i=0; i<10; i++) {
        addedXVec.push(offset[0])
        addedYVec.push(offset[1])
    }
    for (var j=0; j<3; j++) {
        var new_vec = rotation([shiftedx[j],shiftedy[j]],th)
        x = new_vec[0]
        y = new_vec[1]
        rotated.push(math.add(x,addedXVec))
        rotated.push(math.add(y,addedYVec))
        x = []
        y = []
    }
    return rotated
}


/** Creates nxn grid for a unit box
* @function
* @param {int} n - dimensions of box
*/
function box(n) {
    var X = numeric.linspace(0, 1, n+1);
    var Y = numeric.linspace(0, 1, n+1);
    return {'X': X, 'Y':Y}
}


/** Creates circulating arrows inside the nxn grid
* @function
* @param {int} n - dimensions of box
* @param {rgb/hex color} color - colours of arrows
*/
function arrowBox(n,color1,color2) {
    // length of box
    var l = 1/n;
    // grid
    grid = box(n)
    data = [];
    new_data = [];
    var v0 = [0,0], v1 = [0,0], v2 = [0,0], v3 = [0,0];
    // Various cases to consider such as different arrow colours on the outside of the box...
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            if (j === 0) {
                if (i === 0) {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v1[0]-v0[0],v1[1]-v0[1],math.add(v0,[0.1*l,0.1*l]),1,color1,false,0.7)
                    var arrow1 = new Arrow2D(v0[0]-v3[0],v0[1]-v3[1],math.add(v3,[0.1*l,-0.1*l]),1,color1,false,0.7)

                    // parameters to be passed into quiver function
                    var points = [math.add(v1,[-0.1*l,0.1*l]),
                        math.add(v2,[-0.1*l,-0.1*l])];
                    var vecs = [math.add(v2,[-v1[0],-v1[1]]),
                        math.add(v3,[-v2[0],-v2[1]])];

                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    // Add arrow data
                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)
                    data.push(arrow1.shaft)
                    data.push(arrow1.wings)

                    data = data.concat(new_data)
                } else if (i === n-1) {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v1[0]-v0[0],v1[1]-v0[1],math.add(v0,[0.1*l,0.1*l]),1,color1,false,0.7)
                    var arrow1 = new Arrow2D(v2[0]-v1[0],v2[1]-v1[1],math.add(v1,[-0.1*l,0.1*l]),1,color1,false,0.7)

                    var points = [math.add(v2,[-0.1*l,-0.1*l]),
                        math.add(v3,[0.1*l,-0.1*l])];
                    var vecs = [math.add(v3,[-v2[0],-v2[1]]),
                        math.add(v0,[-v3[0],-v3[1]])];

                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)
                    data.push(arrow1.shaft)
                    data.push(arrow1.wings)

                    data = data.concat(new_data)
                } else {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v1[0]-v0[0],v1[1]-v0[1],math.add(v0,[0.1*l,0.1*l]),1,color1,false,0.7)

                    var points = [math.add(v1,[-0.1*l,0.1*l]),
                        math.add(v2,[-0.1*l,-0.1*l]), math.add(v3,[0.1*l,-0.1*l])];
                    var vecs = [math.add(v2,[-v1[0],-v1[1]]),
                        math.add(v3,[-v2[0],-v2[1]]), math.add(v0,[-v3[0],-v3[1]])];
                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)

                    data = data.concat(new_data)
                }

            } else if (j === (n-1)) {
                if (i === 0) {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v3[0]-v2[0],v3[1]-v2[1],math.add(v2,[-0.1*l,-0.1*l]),1,color1,false,0.7)
                    var arrow1 = new Arrow2D(v0[0]-v3[0],v0[1]-v3[1],math.add(v3,[0.1*l,-0.1*l]),1,color1,false,0.7)

                    var points = [math.add(v1,[-0.1*l,0.1*l]),
                        math.add(v0,[0.1*l,0.1*l])];
                    var vecs = [math.add(v2,[-v1[0],-v1[1]]),
                        math.add(v1,[-v0[0],-v0[1]])];
                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)
                    data.push(arrow1.shaft)
                    data.push(arrow1.wings)

                    data = data.concat(new_data)
                } else if (i === n-1) {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v3[0]-v2[0],v3[1]-v2[1],math.add(v2,[-0.1*l,-0.1*l]),1,color1,false,0.7)
                    var arrow1 = new Arrow2D(v2[0]-v1[0],v2[1]-v1[1],math.add(v1,[-0.1*l,0.1*l]),1,color1,false,0.7)

                    var points = [math.add(v3,[0.1*l,-0.1*l]),
                        math.add(v0,[0.1*l,0.1*l])];
                    var vecs = [math.add(v0,[-v3[0],-v3[1]]),
                        math.add(v1,[-v0[0],-v0[1]])];
                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)
                    data.push(arrow1.shaft)
                    data.push(arrow1.wings)

                    data = data.concat(new_data)

                } else {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v3[0]-v2[0],v3[1]-v2[1],math.add(v2,[-0.1*l,-0.1*l]),1,color1,false,0.7)

                    var points = [math.add(v1,[-0.1*l,0.1*l]),
                        math.add(v3,[0.1*l,-0.1*l]), math.add(v0,[0.1*l,0.1*l])];
                    var vecs = [math.add(v2,[-v1[0],-v1[1]]),
                        math.add(v0,[-v3[0],-v3[1]]), math.add(v1,[-v0[0],-v0[1]])];
                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)

                    data = data.concat(new_data)

                }
            } else {
                if (i === 0) {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v0[0]-v3[0],v0[1]-v3[1],math.add(v3,[0.1*l,-0.1*l]),1,color1,false,0.7);

                    var points = [math.add(v1,[-0.1*l,0.1*l]),
                        math.add(v2,[-0.1*l,-0.1*l]), math.add(v0,[0.1*l,0.1*l])];
                    var vecs = [math.add(v2,[-v1[0],-v1[1]]),
                        math.add(v3,[-v2[0],-v2[1]]), math.add(v1,[-v0[0],-v0[1]])];
                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)

                    data = data.concat(new_data)

                } else if (i === n-1) {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];
                    // New arrows with different colours...
                    var arrow0 = new Arrow2D(v2[0]-v1[0],v2[1]-v1[1],math.add(v1,[-0.1*l,0.1*l]),1,color1,false,0.7)

                    var points = [math.add(v3,[0.1*l,-0.1*l]),
                        math.add(v2,[-0.1*l,-0.1*l]), math.add(v0,[0.1*l,0.1*l])];
                    var vecs = [math.add(v0,[-v3[0],-v3[1]]),
                        math.add(v3,[-v2[0],-v2[1]]), math.add(v1,[-v0[0],-v0[1]])];
                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data.push(arrow0.shaft)
                    data.push(arrow0.wings)

                    data = data.concat(new_data)

                } else {
                    v0 = [grid.X[i],grid.Y[j]];
                    v1 = [grid.X[i+1],grid.Y[j]];
                    v2 = [grid.X[i+1],grid.Y[j+1]];
                    v3 = [grid.X[i],grid.Y[j+1]];

                    var points = [math.add(v1,[-0.1*l,0.1*l]),
                        math.add(v0,[0.1*l,0.1*l]), math.add(v3,[0.1*l,-0.1*l]), math.add(v2,[-0.1*l,-0.1*l])];
                    var vecs = [math.add(v2,[-v1[0],-v1[1]]),
                        math.add(v1,[-v0[0],-v0[1]]), math.add(v0,[-v3[0],-v3[1]]), math.add(v3,[-v2[0],-v2[1]])];
                    new_data = getQuiver2D(points, vecs, 1, color2, 0.7);

                    data = data.concat(new_data)
                }
            }
        }
    }
    return data
}


/** Function which runs the animation for the circulation integral
* @function
*/
function circulationPlot() {
    // Vector field with the help of getQuiver
    var X = numeric.linspace(0,1,2);
    var Y = numeric.linspace(0,1,2);
    var points = genPoints2D(X,Y);
    var vecs = [[1, 0], [0, -1], [0, 1], [-1 ,0]];
    var layout = {
        xaxis: {label: 'x', range: [-0.5,1.5]},
        yaxis: {lavel: 'y', range: [-0.5,1.5]},
        showlegend: true,
        font: {
            size: 12
        },
        title: 'Line Integral around C'
    };

    var initialData = [];
    var ratio = 1.2;
    // Create arrows
    var arrow0 = new Arrow2D(1,0,[0,0],2,'rgb(0,0,0)',false,ratio);
    var wings0 = arrow0.data.wings;
    var arrow1 = new Arrow2D(0,1,[1,0],2,'rgb(0,0,0)',false,ratio);
    var wings1 = arrow1.data.wings;
    var arrow2 = new Arrow2D(-1,0,[1,1],2,'rgb(0,0,0)',false,ratio);
    var wings2 = arrow2.data.wings;
    var arrow3 = new Arrow2D(0,-1,[0,1],2,'rgb(0,0,0)',false,ratio);
    var wings3 = arrow3.data.wings;

    wings0.x = math.add(wings0.x,[-ratio+0.5,-ratio+0.5,-ratio+0.5])
    wings1.y = math.add(wings1.y,[-ratio+0.5,-ratio+0.5,-ratio+0.5])
    wings2.x = math.add(wings2.x,[ratio-0.5,ratio-0.5,ratio-0.5])
    wings3.y = math.add(wings3.y,[ratio-0.5,ratio-0.5,ratio-0.5])
    // Arrow wings to be plotted only
    initialData = [wings0,wings1,wings2,wings3]

    var myLabel = {
        x: [0.5],
        y: [0.5],
        mode: 'text',
        name: 'D',
        text: ['D'],
        type: 'scatter',
        showlegend: false,
        font: {size: 20}

    }
    initialData.push(myLabel)
      var fill_area = {
        x: [0, 1, 1, 0, 0],
        y: [0, 0, 1, 1, 0],
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill: 'tozeroy',
        showlegend: false,
        mode: 'lines',
    }
    initialData.push(fill_area)

    var outline_area = {
        x: [0, 1, 1, 0, 0],
        y: [0, 0, 1, 1, 0],
        line: {simplify: false, color: 'rgb(0,62,116)'},
        name: 'C',
        type: 'scatter',
        mode: 'lines'
    }
    initialData.push(outline_area)

    N = 50
    var frames = [];
    var t = 0;

    for (var i=0; i<N; i++) {
        t = 0.5*i/(N-1)
        newData = {
            data: [{
                  x: math.add(wings0.x,[t,t,t]),
                  y: wings0.y,
                  name: 'frame'+parseInt(i)

            },
            {
                x: wings1.x,
                y: math.add(wings1.y,[t,t,t]),
                name: 'frame'+parseInt(i)
            },
            {
                x: math.add(wings2.x,[-t,-t,-t]),
                y: wings2.y,
                name: 'frame'+parseInt(i)
            },
            {
                x: wings3.x,
                y: math.add(wings3.y,[-t,-t,-t]),
                name: 'frame'+parseInt(i)

            },
            {
                x: [0.5],
                y: [0.5],
                mode: 'text',
                name: 'D',
                text: ['D'],
                type: 'scatter',
                showlegend: false,
                font: {
                    size: 30
                }
            },
            {
                x: [0, 1, 1, 0, 0],
                y: [0, 0, 1, 1, 0],
                name: 'frame'+parseInt(i)
            }

            ]
        }
        frames.push(newData)
    }
    // Use shifted arrows and rotate for smoother transition
    var w0 = {x: math.add(wings0.x,[0.5,0.5,0.5]), y: wings0.y}
    var w1 = {x: wings1.x, y: math.add(wings1.y,[0.5,0.5,0.5])}
    var w2 = {x: math.add(wings2.x,[-0.5,-0.5,-0.5]), y: wings2.y}
    var w3 = {x: wings3.x, y: math.add(wings3.y,[-0.5,-0.5,-0.5])}

    shifted0 = wingRotation(w0, [1,0], Math.PI/2)
    shifted1 = wingRotation(w1, [1,1], Math.PI/2)
    shifted2 = wingRotation(w2, [0,1], Math.PI/2)
    shifted3 = wingRotation(w3, [0,0], Math.PI/2)

    for (var i=0; i<5; i++) {
        newData = {
            data: [{
                 x: [shifted0[0][i], shifted0[2][i], shifted0[4][i]],
                 y: [shifted0[1][i], shifted0[3][i], shifted0[5][i]],
                 name: 'frame'+parseInt(i)

            },
            {
                 x: [shifted1[0][i], shifted1[2][i], shifted1[4][i]],
                 y: [shifted1[1][i], shifted1[3][i], shifted1[5][i]],
                 name: 'frame'+parseInt(i)
            },
            {
                 x: [shifted2[0][i], shifted2[2][i], shifted2[4][i]],
                 y: [shifted2[1][i], shifted2[3][i], shifted2[5][i]],
                 name: 'frame'+parseInt(i)
            },
            {
                 x: [shifted3[0][i], shifted3[2][i], shifted3[4][i]],
                 y: [shifted3[1][i], shifted3[3][i], shifted3[5][i]],
                 name: 'frame'+parseInt(i)

            },
            {
                x: [0.5],
                y: [0.5],
                mode: 'text',
                name: 'D',
                text: ['D'],
                type: 'scatter',
                showlegend: false,
                font: {
                    size: 30
                }
            },
            {
                x: [0, 1, 1, 0, 0],
                y: [0, 0, 1, 1, 0],
                name: 'frame'+parseInt(i)
            }

            ]
        }
        frames.push(newData)

    }

    var arrow0 = new Arrow2D(1,0,[0,0],2,'rgb(0,0,0)',false,ratio);
    var wings0 = arrow0.data.wings;
    var arrow1 = new Arrow2D(0,1,[1,0],2,'rgb(0,0,0)',false,ratio);
    var wings1 = arrow1.data.wings;
    var arrow2 = new Arrow2D(-1,0,[1,1],2,'rgb(0,0,0)',false,ratio);
    var wings2 = arrow2.data.wings;
    var arrow3 = new Arrow2D(0,-1,[0,1],2,'rgb(0,0,0)',false,ratio);
    var wings3 = arrow3.data.wings;

    wings0.x = math.add(wings0.x,[-ratio,-ratio,-ratio])
    wings1.y = math.add(wings1.y,[-ratio,-ratio,-ratio])
    wings2.x = math.add(wings2.x,[ratio,ratio,ratio])
    wings3.y = math.add(wings3.y,[ratio,ratio,ratio])

    for (var i=0; i<N; i++) {
        t = 0.5*i/(N-1)
        newData = {
            data: [{
                 x: math.add(wings0.x,[t,t,t]),
                 y: wings0.y,
                 name: 'frame'+parseInt(i)

            },
            {
                x: wings1.x,
                y: math.add(wings1.y,[t,t,t]),
                name: 'frame'+parseInt(i)
            },
            {
                x: math.add(wings2.x,[-t,-t,-t]),
                y: wings2.y,
                name: 'frame'+parseInt(i)
            },
            {
                x: wings3.x,
                y: math.add(wings3.y,[-t,-t,-t]),
                name: 'frame'+parseInt(i)

            },
            {
                x: [0.5],
                y: [0.5],
                mode: 'text',
                name: 'D',
                text: ['D'],
                type: 'scatter',
                showlegend: false,
                font: {
                    size: 30
                }
            },
            {
                x: [0, 1, 1, 0, 0],
                y: [0, 0, 1, 1, 0],
                name: 'frame'+parseInt(i)
            }

            ]
        }
        frames.push(newData)
    }
    // Plot with animate
    Plotly.newPlot('circulation_graph',initialData,layout)
    Plotly.animate('circulation_graph',frames, {
    transition: {
        duration: 25,
        easing: 'linear'
    },
    frame: {
        duration: 25,
        redraw: false

    },
    mode: 'immediate'
    }

    )

}

// Initial plot of circulation integral diagram which is plotted upon loading
function initialPlot() {
    var initialData = [];
    var ratio = 1.2;
    var arrow0 = new Arrow2D(1,0,[0,0],2,'rgb(0,0,0)',false,ratio);
    var wings0 = arrow0.data.wings;
    var arrow1 = new Arrow2D(0,1,[1,0],2,'rgb(0,0,0)',false,ratio);
    var wings1 = arrow1.data.wings;
    var arrow2 = new Arrow2D(-1,0,[1,1],2,'rgb(0,0,0)',false,ratio);
    var wings2 = arrow2.data.wings;
    var arrow3 = new Arrow2D(0,-1,[0,1],2,'rgb(0,0,0)',false,ratio);
    var wings3 = arrow3.data.wings;

    wings0.x = math.add(wings0.x,[-ratio+0.5,-ratio+0.5,-ratio+0.5])
    wings1.y = math.add(wings1.y,[-ratio+0.5,-ratio+0.5,-ratio+0.5])
    wings2.x = math.add(wings2.x,[ratio-0.5,ratio-0.5,ratio-0.5])
    wings3.y = math.add(wings3.y,[ratio-0.5,ratio-0.5,ratio-0.5])

    initialData = [wings0,wings1,wings2,wings3]

    var myLabel = {
        x: [0.5],
        y: [0.5],
        mode: 'text',
        name: 'D',
        text: ['D'],
        type: 'scatter',
        showlegend: false,
        font: {size:12}

    }
    initialData.push(myLabel)
    var fill_area = {
        x: [0, 1, 1, 0, 0],
        y: [0, 0, 1, 1, 0],
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill: 'tozeroy',
        showlegend: false,
        mode: 'lines',
    }
    initialData.push(fill_area)

    var outline_area = {
        x: [0, 1, 1, 0, 0],
        y: [0, 0, 1, 1, 0],
        line: {simplify: false, color: 'rgb(0,62,116)'},
        name: 'C',
        type: 'scatter',
        mode: 'lines'
    }
    initialData.push(outline_area)

    var layout = {
        xaxis: {label: 'x', range: [-0.5,1.5]},
        yaxis: {lavel: 'y', range: [-0.5,1.5]},
        showlegend: true,
        font: {
            size: 12
        },
        title: 'Line Integral around C'
    };
    Plotly.newPlot('circulation_graph',initialData,layout)
}

/** Plot for diagram visualising curl
* @function
* @param {int} n - dimension of box
*/
function curlPlot(n) {
    var data = arrowBox(n,'rgb(0,62,116)','rgb(0,62,116)');
    var layout = {
        title: 'Plot of region D split up into rotating regions',
        xaxis: {label: 'x', range: [-0.5,1.5]},
        yaxis: {lavel: 'y', range: [-0.5,1.5]},
        showlegend: false
    };
    Plotly.newPlot('curl_graph',data,layout)
}

/** Function which zooms into curl diagram plot to show single rotating region using animate
* @function
*/
function zoom() {
    Plotly.animate('curl_graph',{layout: {
        title: 'Plot of D split up into rotating regions',
        xaxis: {label: 'x', range: [0.3,0.4]},
        yaxis: {label: 'y', range: [0.3,0.4]},
        showlegend: false
        }
    }, {
        transition: {
            duration: 1000,
            easing: 'linear'
        }
    })
}

/** Unzoom function which reverses the zoom
* @function
*/
function unzoom() {
    Plotly.animate('curl_graph',{layout: {
        title: 'Plot of D split up into rotating regions',
        xaxis: {label: 'x', range: [-0.5,1.5]},
        yaxis: {label: 'y', range: [-0.5,1.5]},
        showlegend: false
        }
    }, {
        transition: {
            duration: 1000,
            easing: 'linear'
        }
    })
}

/** Plots the same graph as in the "curl tab" but with colour coded arrows to indicate
// "cancelled arrows"
* @function
* @param {int} n - ""
*/
function overallPlot(n) {
    var data = arrowBox(n,'rgb(255,0,255)','rgb(34,139,34)');
    var layout = {
        title: 'Plot of region D with colour coded arrows',
        xaxis: {label: 'x', range: [-0.5,1.5]},
        yaxis: {lavel: 'y', range: [-0.5,1.5]},
        showlegend: false
    };
    Plotly.newPlot('overall_graph',data,layout)
}


/** Replots the graph above for different values of n
* @function
*/
function overallReplot() {
    var N = document.getElementById('getN').value;
    overallPlot(Number(N))
}


/** Was used before to be able to toggle text
* @function
*/
function toggleText() {
    $("#circ_para").slideToggle(600)
    $("#curl_para").slideToggle(600)
    $("#overall_para").slideToggle(600)
}

/** Main function
* @function
*/
function main(){
    curlPlot(10)
    overallPlot(2)
    initialPlot()
}

$(document).ready(main)