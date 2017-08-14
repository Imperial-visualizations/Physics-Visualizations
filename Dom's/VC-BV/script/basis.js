//Objects:
function Line(points) {
    this.x = [];
    this.y = [];
    this.z = [];
    for (var i = 0; i  < points.length; ++i) {
        this.x.push(points[i][0]);
        this.y.push(points[i][1]);
        this.z.push(points[i][2]);
    }

    this.gObject = function(color) {
        var lineObject = {
            "type": "scatter3d",
            "mode": "lines",
            "x": this.x,
            "y": this.y,
            "z": this.z,
            "line": {"color": color, "width": 7}
        }
        return lineObject;
    }
}
function Point(position) {
    this.position = position;
    this.gObject = function(color, symbol="circle") {
        pointObject = {
            "type": "scatter3d",
             "mode": "markers",
             "x": [this.position[0]],
             "y": [this.position[1]],
             "z": [this.position[2]],
             "marker": {"color": color, "size": 7, "symbol": symbol}
        }
        return pointObject;
    }
}
function Sphere(radius) {
    this.radius = radius;
    var meshSize = 20;
    var theta = numeric.linspace(0, 2*Math.PI, meshSize);
    var phi = numeric.linspace(0, Math.PI, meshSize);
    this.x = [], this.y = [], this.z = [];
    for(var i = 0; i < meshSize; ++i) {
        this.x[i] = [], this.y[i] = [], this.z[i] = [];
        for(var j = 0; j < meshSize; ++j){
            this.x[i].push(radius*Math.cos(theta[i])*Math.sin(phi[j]));
            this.y[i].push(radius*Math.sin(theta[i])*Math.sin(phi[j]));
            this.z[i].push(radius*Math.cos(phi[j]));
        }
    }
    this.gObject = function(color1, color2) {
        var sphere = {
            "type": "surface",
            "x": this.x,
            "y": this.y,
            "z": this.z,
            "showscale": false,
            "opacity": 0.7,
            "colorscale": [[0.0, color1], [1.0, color2]]
        }
        return sphere;
    }
}

//Global Initial Parameters:
var initialPoint = [2., 2., 2.];
var radius = 2*Math.sqrt(3);
var layout = {
  "width": 450, "height": 500,
  "margin": {l:0, r:0, t:0, b:0},
  "hovermode": "closest",
  "showlegend": false,
  "scene": {
    camera: createView(initialPoint),
    xaxis: {range: [-10, 10]},
    yaxis: {range: [-10, 10]},
    zaxis: {range: [-10, 10]}
  }
}
var coorType = 0; //(1 = Cartesian, 2 = Cylindrical, 3 = Spherical

//Plots
function plotInit(coorType) {

    var x = parseFloat(document.getElementById('xController').value);
    var y = parseFloat(document.getElementById('yController').value);
    var z = parseFloat(document.getElementById('zController').value);
    Plotly.newPlot('graph',
        [
            new Line([[x, y, z], [x + 1, y, z]]).gObject("rgb(255,0,0)"),
            new Line([[x, y, z], [x, y + 1, z]]).gObject("rgb(0,255,0)"),
            new Line([[x, y, z], [x, y, z + 1]]).gObject("rgb(0,0,255)")
        ],
        layout
    )

}
//Plot for planes:
function plotPlane(plane) {
    var data = [];
    if (plane === 1) {
        data.push({
            x: [0, 0],
            y: [-10, 10],
            z: [[-10, 10],
                [-10, 10]],
            colorscale: "Blues",
            showscale: false,
            type: "surface"
        });
    } else if (plane === 2) {
        data.push({
            x: [-10, 10],
            y: [0, 0],
            z: [[-10, -10],
                [10, 10]],
            colorscale: "Blues",
            showscale: false,
            type: "surface"
        });
    } else if (plane === 3) {
        data.push({
            x: [-10, 10],
            y: [-10, 10],
            z: [[0, 0],
                [0, 0]],
            colorscale: "Blues",
            showscale: false,
            type: "surface"
        });
    }
    Plotly.plot('graph', data);
}
//Layout
function createView(point) {
  var norm = Math.sqrt(point[0]**2 + (5*point[1])**2 + point[2]**2);
  var a = 0.5 + point[0]/norm, b = 1 +  5*point[1]/norm, c = 0.5 + point[2]/norm;
  var camera = {
    up: {x: 0, y: 0, z: 1},
    eye: {x: a, y: b, z: c},
    center: {x: 0, y: 0, z: -0.2}
  }
  return camera
}

//Slider Value and Matrix grid Value
function makeTableHTML(myArray) {
    var result = "<table><tbody>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}

function main() {
    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            $("#"+$(this).attr("id") + "DisplayA2").text( parseFloat($(this).val())*180 + $("#" + $(this).attr("id") + "DisplayA2").attr("data-unit") );
            if (parseFloat($(this).val())*8 % 8 === 0.0) {
                displayEl = $(this).val() + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            } else if (parseFloat($(this).val())*8 % 4 === 0.0) {
                displayEl = "(" + $(this).val()*2 + "/2)" + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            } else if (parseFloat($(this).val())*8 % 2 === 0.0) {
                displayEl = "(" + $(this).val()*4 + "/4)" + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            } else {
                displayEl = "(" + $(this).val()*8 + "/8)" + $("#"+$(this).attr("id") + "DisplayA1").attr("data-unit");
            }
            $("#"+$(this).attr("id") + "DisplayA1").text( displayEl );
            plotInit();
    });
  });

  $(function() {
    $('ul.tab-nav li a.button').click(function() {
      var href = $(this).attr('href');
        $('li a.active.button', $(this).parent().parent()).removeClass('active');
        $(this).addClass('active');
        $('.tab-pane.active', $(href).parent()).removeClass('active');
        $(href).addClass('active');
        return false;
    });
  });
  plotInit();
}
$(document).ready(main);