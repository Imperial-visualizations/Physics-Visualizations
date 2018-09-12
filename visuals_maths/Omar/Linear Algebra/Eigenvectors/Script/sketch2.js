var layout = {
    width: 800,
    height: 800,
    margin: {
        l: 20,
        r: 20,
        t: 50,
        b: 50
    },
    hovermode: "closest",
    showlegend: false,
    xaxis: {
        label: "x",
        range: [-50, 50]
    },
    yaxis: {
        label: "y",
        range: [-50, 50]
    },
    aspectratio: {
        x: 1,
        y: 1
    }
};
main();
var xx = 1;
var yy = 1;
var zz = 3;
var kk = 5;

// a variable for the spacing of the sliders
var spacing;

// dummy variable stores data produced by graph function in order to use it for the animation. See event listener.
var dummy;

function graph(inputTheta, x1, y1, x2, y2) {
    //define input matrix:

    var matrix = [[x1, y1], [x2, y2]];

    //spacer determines distance between points
    var spacer = 1;

    var height = 10;
    var width = 10;
    var rho = Math.sqrt(height * height + width * width);

    var xArray = [];
    var yArray = [];

    var xArrayTrans = [];
    var yArrayTrans = [];

    //determine the eigenvectors:
    var xEigVector0 = numeric.eig(matrix).E.x[0][0];
    var yEigVector0 = numeric.eig(matrix).E.x[1][0];
    var theta0 = Math.atan2(yEigVector0, xEigVector0);

    var xEigVector1 = numeric.eig(matrix).E.x[0][1];
    var yEigVector1 = numeric.eig(matrix).E.x[1][1];
    var theta1 = Math.atan2(yEigVector1, xEigVector1);

    //generate points on the input line.
    var xInput = [];
    var yInput = [];
    var xInputTransformedArray = [];
    var yInputTransformedArray = [];
    var xInputTransformedArray = [];
    var yInputTransformedArray = [];

    var inputArray = numeric.linspace(-rho, rho, 15);

    for (var i = 0; i < inputArray.length; i++) {
        var x = inputArray[i] * Math.cos(inputTheta);
        var y = inputArray[i] * Math.sin(inputTheta);
        xInput.push(x);
        yInput.push(y);

        //transform and generate transArrays.
        var xInputTransformed = x1 * x + y1 * y;
        var yInputTransformed = x2 * x + y2 * y;

        xInputTransformedArray.push(xInputTransformed);
        yInputTransformedArray.push(yInputTransformed);
    }
    
    //determine the length of the lines depending on the length of the transformed objects.

    var maxX = Math.max.apply(null, xInputTransformedArray); //max transformed X
    var maxY = Math.max.apply(null, yInputTransformedArray); //max transformed Y
    var lineLength = (x1 * x2 + y1 * y2);

    //defining input line:
    if (lineLength < rho) {
        lineLength = rho;
    }
    //generate eigenvector lines, line of input and transformed points.
    for (
        var x = -lineLength * 1.2; x < lineLength * 1.2 + 1; x += (lineLength * 1.2) / 10
    ) {
        for (
            var y = -lineLength * 1.2; y < lineLength * 1.2 + 1; y += (lineLength * 1.2) / 10
        ) {
            xArray.push(x);
            yArray.push(y);

            //transform and generate transArrays.
            var xTransformed = x1 * x + y1 * y;
            var yTransformed = x2 * x + y2 * y;

            xArrayTrans.push(xTransformed);
            yArrayTrans.push(yTransformed);
        }
    }

    var data = [
        {
            x: xInput,
            y: yInput,
            type: "scatter",
            mode: "markers",
            name: "Example Points",
            color: "green",
            hovertext: "Position vectors",
            marker: {
                color: "blue"
            }
    },
        {
            x: xArray,
            y: yArray,
            type: "scatter",
            opacity: "0.15",
            name: "Position Vectors",
            mode: "markers",
            hovertext: "2D array",
            marker: {
                color: "blue"
            }
    },
        {
            x: [-lineLength * math.cos(theta0), lineLength * math.cos(theta0)],
            y: [-lineLength * math.sin(theta0), lineLength * math.sin(theta0)],
            name: "Span of Eigenvector 1",
            hovertext: "Eigenvector 1"
    },

        {
            x: [-lineLength * math.cos(theta1), lineLength * math.cos(theta1)],
            y: [-lineLength * math.sin(theta1), lineLength * math.sin(theta1)],
            name: "Span of Eigenvector 2",
            type: "scatter",
            hovertext: "Eigenvector 2"
    }
  ];

    // animate
    Plotly.newPlot("graph", {
        xaxis: {
            range: [-30, 30]
        },
        yaxis: {
            range: [-30, 30]
        }
    }).then(function () {
        Plotly.addFrames("graph", [
            {
                data: [
                    {
                        x: xInputTransformedArray,
                        y: yInputTransformedArray
          },
                    {
                        x: xArrayTrans,
                        y: yArrayTrans,
                        type: "scatter",
                        mode: "markers",
                        opacity: "0.15"
          }
        ],
                name: "frame1"
      },
            {
                data: [
                    {
                        x: xInput,
                        y: yInput
          },
                    {
                        x: xArray,
                        y: yArray,
                        type: "scatter",
                        mode: "markers",
                        opacity: "0.15"
          }
        ],
                name: "frame2"
      }
    ]);
    });

    Plotly.newPlot("graph", data);

    return data;
}

function startAnimation() {
    Plotly.animate("graph", ["frame1", "frame2"], {
        frame: [
            {
                duration: 5000
      },
            {
                duration: 5000
      }
    ],
        transition: [
            {
                duration: 3000,
                easing: "cubic-in"
      },
            {
                duration: 3000,
                easing: "cubic-out"
      }
    ]
    });
}
Plotly.newPlot("graph", dummy);

graph(0, 1, 1, 0, 0);

//Slider stuff
var slider = document.getElementById("controller");

slider.addEventListener("input", function () {
    sliderVal = slider.value;
    u00val = u00.value;
    u01val = u01.value;
    u10val = u10.value;
    u11val = u11.value;
    dummy = graph(sliderVal, u00val, u01val, u10val, u11val);
});


//maybe matrix stuff
function makeTableInputU(m, n) {
    var result = "<table class='matrixWrapper'><tbody><tr><td>";
    result += "<td>";
    result += "</td>";
    result += "<td><table class='matrix'><tbody>";
    for (var i = 0; i < m; i++) {
        result += "<tr>";
        for (var j = 0; j < n; j++) {
            if (i === 0) {
                result +=
                    "<td>" +
                    "<input type='text' id='Urow" +
                    String(i) +
                    "col" +
                    String(j) +
                    "' oninput='console.log(1)'" +
                    " value='1'" +
                    "'>" +
                    "</td>";
            } else {
                result +=
                    "<td>" +
                    "<input type='text' id='Urow" +
                    String(i) +
                    "col" +
                    String(j) +
                    "' oninput='console.log(1)'" +
                    " value='0'" +
                    "'>" +
                    "</td>";
            }
        }
    }
    result += "</tr>";

    result += "</tbody></table></td>";
    result += "</td></tr></tbody></table>";
    return result;
}

function main() {
    //matrix
    $("#u").append(makeTableInputU(2, 2));

    $("input[type=range]").each(function () {
        var displayEl;
        $(this).on("input", function () {
            $("#" + $(this).attr("id") + "Display").text(
                $(this).val() +
                $("#" + $(this).attr("id") + "Display").attr("data-unit")
            );
        });
    });
}
var u00 = document.getElementById("Urow0col0");
var u10 = document.getElementById("Urow1col0");
var u01 = document.getElementById("Urow0col1");
var u11 = document.getElementById("Urow1col1"); 



u00.addEventListener('input', function () {
    sliderVal = slider.value;

    u00val = u00.value;
    u01val = u01.value;
    u10val = u10.value;
    u11val = u11.value;
    dummy = graph(sliderVal, u00val, u01val, u10val, u11val);

})
u10.addEventListener('input', function () {
    sliderVal = slider.value;

    u00val = u00.value;
    u01val = u01.value;
    u10val = u10.value;
    u11val = u11.value;
    dummy = graph(sliderVal, u00val, u01val, u10val, u11val);

})
u01.addEventListener('input', function () {
    sliderVal = slider.value;

    u00val = u00.value;
    u01val = u01.value;
    u10val = u10.value;
    u11val = u11.value;
    dummy = graph(sliderVal, u00val, u01val, u10val, u11val);

})
u11.addEventListener('input', function () {
    sliderVal = slider.value;

    u00val = u00.value;
    u01val = u01.value;
    u10val = u10.value;
    u11val = u11.value;
    dummy = graph(sliderVal, u00val, u01val, u10val, u11val);

})
