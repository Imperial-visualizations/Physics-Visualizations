//Layout
function createView(point) {
  var norm = Math.sqrt(point[0]*point[0] + (5*point[1])*(5*point[1]) + point[2]*point[2]);
  var a = 0.5 + point[0]/norm, b = 1 +  5*point[1]/norm, c = 0.5 + point[2]/norm;
  var camera = {
    up: {x: 0, y: 0, z: 1},
    eye: {x: -a, y: -b, z: c + 0.5},
    center: {x: 0, y: 0, z: -0.2}
  }
  return camera
}

//Plot Objects:
function createAxes(length) {
    var axes = [];
    var vector = [0, length];
    var initialVec;
    var vecString = ["x", "y", "z"];
    var originString = ["", "", "(0,0,0)"];
    for (var i = 0; i < 3; ++i) {
        initialVec = [[0, 0], [0, 0], [0, 0]];
        initialVec[i] = vector;
        axes.push(
            {
                type: "scatter3d",
                mode: "lines+text",
                x: initialVec[0],
                y: initialVec[1],
                z: initialVec[2],
                line: {color: "rgb(0,0,0)", width: 4},
                text: [originString[i], vecString[i]],
                textfont: {size: 15},
                textposition: "top"
            }
        );
    }
    return axes;
}