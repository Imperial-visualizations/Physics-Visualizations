var layout = {
    width: 800,
    height: 800,
    margin: { l: 20, r: 20, t: 50, b: 50 },
    hovermode: "closest",
    showlegend: false,
    xaxis: { label: "x", range: [-50, 50] },
    yaxis: { label: "y", range: [-50, 50] },
    aspectratio: { x: 1, y: 1 }
};


var dummy;
function all(inputTheta){
//define input matrix:

var x1 = 3;
var y1 = 1;
var x2 = 2;
var y2 = 2;

var matrix = [[x1, y1], [x2, y2]];

//spacer determines distance between points
var spacer = 10;

var height = 50;
var width = 50;
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


//defining the input angle from the slider

//generate eigenvector lines, line of input and transformed points.
for (var x = -width; x < width + 1; x += spacer) {
    for (var y = -height; y < height + 1; y += spacer) {
        xArray.push(x);
        yArray.push(y);

        //transform and generate transArrays.
        var xTransformed = x1 * x + y1 * y;
        var yTransformed = x2 * x + y2 * y;

        xArrayTrans.push(xTransformed);
        yArrayTrans.push(yTransformed);
    }
}

//generate points on the input line.
var xInput = [];
var yInput = [];
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
var lineLength = Math.sqrt(maxX * maxX + maxY * maxY);

//defining input line:
var data = [

    {
        x: xInput,
        y: yInput,
        type: "scatter",
        mode: "markers"
    },
    {
        x: [-lineLength * math.cos(theta0), lineLength * math.cos(theta0)],
        y: [-lineLength * math.sin(theta0), lineLength * math.sin(theta0)]
    },
    {
        x: [-lineLength * math.cos(inputTheta) , lineLength * math.cos(inputTheta) ],
        y: [-lineLength * math.sin(inputTheta) , lineLength * math.sin(inputTheta)]
    },

    {
        x: [-lineLength * math.cos(theta1), lineLength * math.cos(theta1)],
        y: [-lineLength * math.sin(theta1), lineLength * math.sin(theta1)]
    }
];

// animate
Plotly.newPlot("graph", {
    xaxis: { range: [-30, 30] },
    yaxis: { range: [-30, 30] }
}).then(function() {
    Plotly.addFrames("graph", [
        {
            data: [{ x: xInputTransformedArray, y: yInputTransformedArray }],
            name: "frame1"
        },
        {
            data: [{ x: xInput, y: yInput }],
            name: "frame2"
        }
    ]);
});


Plotly.newPlot('graph', data)

return data}

function startAnimation() {
    Plotly.animate("graph", ["frame1", "frame2"], {
        frame: [{ duration: 5000 }, { duration: 3000 }],
        transition: [
            { duration: 3000, easing: "cubic-in" },
            { duration: 3000, easing: "cubic-out" }
        ]
    });
}
Plotly.newPlot('graph', dummy)


var slider = document.getElementById('controller');

slider.addEventListener("change", function() { 
  sliderVal = slider.value;  
   dummy = all(sliderVal);
})






