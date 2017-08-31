math.config({matrix:"Matrix"})
// Global variables for vertices and matrix display
var vertex1 = [1,0];
var vertex2 = [1,1];
var vertex3 = [0,1];
var my_matrix = math.matrix([[1,0],[0,1]])

// Rotation matrix
function rotmat(th) {
    var rotator = [[Math.cos(th),-Math.sin(th)],[Math.sin(th),Math.cos(th)]];
    return rotator;
}

// Rotation function returns arrays x,y for smooth transition
function rotation(vec,th) {
    // Parameters
    var N = 50;
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

// Scale function returns arrays of similar form to rotation()
// Arguments must go in of the form (vec, scale1, scale2)
function scale() {
    // Define variables and parameters
    var N = 50;
    var vec = arguments[0];
    if (arguments.length === 2){
        var x = numeric.linspace(vec[0],arguments[1]*vec[0],N);
        var y = numeric.linspace(vec[1],arguments[1]*vec[1],N);
    } else if (arguments.length === 3) {
        var x = numeric.linspace(vec[0],arguments[1]*vec[0],N);
        var y = numeric.linspace(vec[1],arguments[2]*vec[1],N);
    }
    return [x,y]
}

function skew(vec,axis) {
    // Number of frames
    var N = 50;
    // If axis = 0 then skew in x-direction
    if (axis === 0) {
        var A = [[1,1],[0,1]];
        var newvec = math.multiply(A,math.matrix(vec));
        var x = numeric.linspace(vec[0],newvec._data[0],N);
        var y = numeric.linspace(vec[1],newvec._data[1],N);
        return [x,y]
    }
    else if (axis === 1) {
        var A = [[1,0],[1,1]];
        var newvec = math.multiply(A,math.matrix(vec));
        var x = numeric.linspace(vec[0],newvec._data[0],N);
        var y = numeric.linspace(vec[1],newvec._data[1],N);
        return [x,y]
    }
}

// Custom matrix transformation, arguments form matrix [[a,b],[c,d]]
function custom(vec,a,b,c,d) {
    var N = 50;
    var A = [[a,b],[c,d]];
    var x0 = vec[0];
    var y0 = vec[1];
    var newvec = math.multiply(A,math.matrix(vec));
    var x = numeric.linspace(x0,newvec._data[0],N);
    var y = numeric.linspace(y0,newvec._data[1],N);
    return[x,y]
}

// Convert x,y arrays returned from functions in json format for animate
function jsonFormat(x,y) {
    var myJson = [];
    var N = x.length;
    for (var i=0; i<N; i++) {
        myJson.push({"data": [{"x": [x[i],0],"y": [y[i],0]}],"name": 'frame'+parseInt(i)})
    }
    return myJson;
}

// Custom linspace function, probably will not need it...
function mylinspace(a,b,n) {
    var h = (b-a)/(n-1);
    var myinterval = [];
    for (var i=0; i<n; i++) {
        myinterval.push(a+i*h);
    }
    return myinterval;
}

///// NOW START TO DEFORM SQUARES WITH FUNCTIONS WE'VE ALREADY WRITTEN /////

// Structure of this function goes:
// (string for transformation, parameters, 3 vertex arguments then matrix)
function squareTrans() {
    if (arguments[0] === "rotate") {
        var th = arguments[1];
        my_matrix = math.multiply(rotmat(th),my_matrix);
        var [x0,y0] = rotation(arguments[2],th);
        vertex1 = [x0[x0.length-1],y0[y0.length-1]]
        var [x1,y1] = rotation(arguments[3],th);
        vertex2 = [x1[x1.length-1],y1[y1.length-1]]
        var [x2,y2] = rotation(arguments[4],th);
        vertex3 = [x2[x2.length-1],y2[y2.length-1]]
        return [x0,x1,x2,y0,y1,y2,my_matrix]
    } else if (arguments[0] === "scale") {
    // If only 1 scale argument given
          if (arguments.length === 5) {
              var s = arguments[1];
              my_matrix = math.multiply([[s,0],[0,s]],my_matrix)
              var [x0,y0] = scale(arguments[2],s);
              vertex1 = [x0[x0.length-1],y0[y0.length-1]]
              var [x1,y1] = scale(arguments[3],s);
              vertex2 = [x1[x1.length-1],y1[y1.length-1]]
              var [x2,y2] = scale(arguments[4],s);
              vertex3 = [x2[x2.length-1],y2[y2.length-1]]
              return [x0,x1,x2,y0,y1,y2]
          } else if (arguments.length === 6){
              var s1 = arguments[1];
              var s2 = arguments[2];
              my_matrix = math.multiply([[s1,0],[0,s2]],my_matrix)
              var [x0,y0] = scale(arguments[3],s1,s2);
              vertex1 = [x0[x0.length-1],y0[y0.length-1]]
              var [x1,y1] = scale(arguments[4],s1,s2);
              vertex2 = [x1[x1.length-1],y1[y1.length-1]]
              var [x2,y2] = scale(arguments[5],s1,s2);
              vertex3 = [x2[x2.length-1],y2[y2.length-1]]
              return [x0,x1,x2,y0,y1,y2]
          }
    } else if (arguments[0] === "custom") {
        var a = arguments[1], b = arguments[2],
         c = arguments[3], d = arguments[4];
        my_matrix = math.multiply([[a,b],[c,d]],my_matrix)
        var [x0,y0] = custom(arguments[5],a,b,c,d);
        vertex1 = [x0[x0.length-1],y0[y0.length-1]]
        var [x1,y1] = custom(arguments[6],a,b,c,d);
        vertex2 = [x1[x1.length-1],y1[y1.length-1]]
        var [x2,y2] = custom(arguments[7],a,b,c,d);
        vertex3 = [x2[x2.length-1],y2[y2.length-1]]
        return [x0,x1,x2,y0,y1,y2]
    } else if (arguments[0] === "skew") {
        var axis = arguments[1];
        if (axis===0) {
            my_matrix = math.multiply([[1,1],[0,1]],my_matrix)
        } else if (axis===1) {
            my_matrix = math.multiply([[1,0],[1,1]],my_matrix)
        }
        var [x0,y0] = skew(arguments[2],axis);
        vertex1 = [x0[x0.length-1],y0[y0.length-1]]
        var [x1,y1] = skew(arguments[3],axis);
        vertex2 = [x1[x1.length-1],y1[y1.length-1]]
        var [x2,y2] = skew(arguments[4],axis);
        vertex3 = [x2[x2.length-1],y2[y2.length-1]]
        return [x0,x1,x2,y0,y1,y2]
  }
}

// Convert x,y arrays returned from functions in json format for animate
function jsonFormat2(x0,x1,x2,y0,y1,y2) {
    var myJson = [];
    var N = x0.length;
    for (var i=0; i<N; i++) {
        myJson.push({"data": [{"x": [0,x0[i],x1[i],x2[i],0],
          "y": [0,y0[i],y1[i],y2[i],0]}],"name": 'frame'+parseInt(i)})
    }
    return myJson;
}

// Layout object to be used for all plots
var layout = {xaxis: {range: [-4, 4], title:"x"},
    yaxis: {range: [-4, 4], title:"y"},
    margin: {l:30, r:30, t:30, b:30},
    font: {
          family: "Lato",
          size: 12,
          color: "#003E74",
          weight: 900
    }
    };

// Plots a 1x1 square on the grid and reset vertices
function squarePlotter(){
    Plotly.newPlot('graph', [{
        x : [0,1,1,0,0],
        y : [0,0,1,1,0],
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill:'tonexty',
        mode: 'lines'
    }],
    layout
    )
}

// Plots animated skew
function plotterSkew(axis,vertex1,vertex2,vertex3) {
    var myArray = squareTrans("skew",axis,vertex1,vertex2,vertex3);
    var frames = jsonFormat2(...myArray);
    // Initial plot
    Plotly.newPlot('graph', [{
        x: frames[0].data[0].x,
        y: frames[0].data[0].y,
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill:'tonexty',
        mode: 'lines'
        }],
        layout
    );

    // Animation
    Plotly.animate('graph', frames, {
        transition: {
            duration: 25,
            easing: 'linear'
        },
        frame: {
            duration: 25,
            redraw: false,
        },
        mode: 'immediate'
    });
}

// Plots animated scale
function plotterScale(s1,s2,vertex1,vertex2,vertex3) {
    var myArray = squareTrans("scale",s1,s2,vertex1,vertex2,vertex3);
    var frames = jsonFormat2(...myArray);
    // Initial plot
    Plotly.newPlot('graph', [{
        x: frames[0].data[0].x,
        y: frames[0].data[0].y,
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill:'tonexty',
        mode: 'lines'
        }],
        layout
    );

    // Animation
    Plotly.animate('graph', frames, {
        transition: {
            duration: 25,
            easing: 'linear'
        },
        frame: {
            duration: 25,
            redraw: false,
        },
        mode: 'immediate'
    });
}

// Plots animated rotation
function plotterRotate(th,vertex1,vertex2,vertex3) {
    var myArray = squareTrans("rotate",th,vertex1,vertex2,vertex3);
    var frames = jsonFormat2(...myArray);
    // Initial plot
    Plotly.newPlot('graph', [{
        x: frames[0].data[0].x,
        y: frames[0].data[0].y,
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill:'tonexty',
        mode: 'lines'
        }],
        layout
    );

  // Animation
  Plotly.animate('graph', frames, {
    transition: {
      duration: 25,
      easing: 'linear'
    },
    frame: {
      duration: 25,
      redraw: false,
    },
    mode: 'immediate'
  });
}

// Plots animated custom
function plotterCustom(a,b,c,d,vertex1,vertex2,vertex3) {
    var myArray = squareTrans("custom",a,b,c,d,vertex1,vertex2,vertex3);
    var frames = jsonFormat2(...myArray);
    // Initial plot
    Plotly.newPlot('graph', [{
        x: frames[0].data[0].x,
        y: frames[0].data[0].y,
        line: {simplify: false, color: 'rgb(0,62,116)'},
        fill:'tonexty',
        mode: 'lines'
        }],
        layout
    );

  // Animation
  Plotly.animate('graph', frames, {
    transition: {
      duration: 25,
      easing: 'linear'
    },
    frame: {
      duration: 25,
      redraw: false,
    },
    mode: 'immediate'
  });
}

// Main function to run when page is ready
function main() {
    squarePlotter();
    rotateMatrix();
    scaleMatrix();
    $("#custommatrix").append(makeTableHTML([[1,0],[0,1]]))
    if ($("#x").is(":checked")) {
        $("#skewmatrix").html(makeTableHTML([[1,1],[0,1]]));
    } if ($("#y").is(":checked")) {
        $("#skewmatrix").html(makeTableHTML([[1,0],[1,1]]));
    }
    var myTable = makeTableInput(2,2)
    console.log(myTable)
    $("#tableInput").append(myTable)
}

// Function which takes array as input and returns a table
function makeTableHTML(myArray) {
    var result = "<table class='matrix'><tbody>";
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

// Function which takes array as input and returns a table
function makeTableInput(m, n) {
    var result = "<table class='matrix'><tbody>";
    for (var i=0; i<m; i++) {
        result += "<tr>";
        for (var j=0; j<n; j++){
            if (i === j) {
                result += "<td>"+"<input type='number' id='row"+String(i)+"col"+String(j)+
                    "' oninput='customMatrix()'"+" value='1'"+"'>"+"</td>";
            } else {
                result += "<td>"+"<input type='number' id='row"+String(i)+"col"+String(j)+
                "' oninput='customMatrix()'"+" value='0'"+"'>"+"</td>";
            }
//            result += "<td>"+"Hello World"+"</td>";
        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}

// Plot the graphs after reading data from sliders
function plotRotate() {
  var x = $("#rotateID").val();
  var th = Math.PI*x;
  plotterRotate(th,vertex1,vertex2,vertex3);
}


function plotSkew() {
  if (document.getElementById("x").checked) {
    plotterSkew(0, vertex1, vertex2, vertex3);
  } else {
    plotterSkew(1,vertex1,vertex2,vertex3);
  }

}


function plotScale() {
  var scale1 = document.getElementById('scale1ID').value;
  var scale2 = document.getElementById('scale2ID').value;
  plotterScale(scale1,scale2,vertex1,vertex2,vertex3);
}


function plotCustom() {
    var a = $("#row0col0").val();
    var b = $("#row0col1").val();
    var c = $("#row1col0").val();
    var d = $("#row1col1").val();
    plotterCustom(a,b,c,d,vertex1,vertex2,vertex3);

}


// Display values above sliders for scale tab
$("#scale1ID").each(function () {
  $(this).on('input', function() {
        $("#"+$(this).attr("id") + "Display").text($(this).val());
  });
});


$("#scale2ID").each(function () {
  $(this).on('input', function() {
        $("#"+$(this).attr("id") + "Display").text($(this).val());
  });
});


function rotateMatrix() {
    var x = $("#rotateID").val();
    var th = Math.PI*x;
    var rotmatrix = roundedmat(rotmat(th))
    $("#rotatematrix").html(makeTableHTML(rotmatrix));
    th = Math.round(th*100)/100;
    $("#rotatematrix2").html(makeTableHTML([["cos("+String(x)+"π"+")","-sin("+String(x)+"π"+")"],
        ["sin("+String(x)+"π"+")","cos("+String(x)+"π"+")"]]));
    $("#showtheta").html("θ = " + th + " rad or θ =  " + x.toString() + "π rad")
}


function scaleMatrix() {
    var scale1 = $("#scale1ID").val();
    var scale2 = $("#scale2ID").val();
    $("#scalematrix").html(makeTableHTML([[scale1,0],[0,scale2]]))
    $("#scale1IDDisplay").text($("#scale1ID").val());
    $("#scale2IDDisplay").text($("#scale2ID").val());
}


function customMatrix() {
    var a = $("#row0col0").val();
    var b = $("#row0col1").val();
    var c = $("#row1col0").val();
    var d = $("#row1col1").val();
    document.getElementById('custommatrix').innerHTML=makeTableHTML([[a,b],[c,d]])
}


// Rounds all elements in a mxn array to 2 d.p.
function roundedmat(A) {
    m = A.length
    n = A[0].length
    for (i=0; i<m; i++) {
        for (j=0; j<n; j++) {
            A[i][j] =  Math.round(A[i][j]*100)/100
        }
    }
    return A
}


function resetStuff() {
    squarePlotter();
    vertex1 = [1,0];
    vertex2 = [1,1];
    vertex3 = [0,1];
    my_matrix = math.matrix([[1,0],[0,1]]);
}


function showMatrix() {
    var A = [[my_matrix.get([0,0]),my_matrix.get([0,1])],[my_matrix.get([1,0]),my_matrix.get([1,1])]];
    A = roundedmat(A);
    alert(math.matrix(A));
}


$(document).ready(function() {
    $(".radio").click(function() {
        if ($("#x").is(":checked")) {
            document.getElementById("skewmatrix").innerHTML=makeTableHTML([[1,1],[0,1]]);
        } if ($("#y").is(":checked")) {
            document.getElementById("skewmatrix").innerHTML=makeTableHTML([[1,0],[1,1]]);
        }

    })
});


$(document).ready(main);

