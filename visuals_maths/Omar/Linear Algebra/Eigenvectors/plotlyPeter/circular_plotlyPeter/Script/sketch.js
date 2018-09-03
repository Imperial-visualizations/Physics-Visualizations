var layout = {
    width: 800,
    height: 800,
    margin: { l: 20, r: 20, t: 50, b: 50 },
    hovermode: "closest",
    showlegend: false,
    xaxis: { label: "x", range: [-20, 20] },
    yaxis: { lavel: "y", range: [-20, 20] },
    aspectratio: { x: 1, y: 1 }
};

//define input matrix:
var x1 = 1;
var x2 = 3;
var y1 = 5;
var y2 = 2;

var matrix = [[x1, y1], [x2, y2]];

//spacer determines distance between points
var spacer = 5;

var height = 15;
var width = 15;

var xArray = [];
var yArray = [];

var xArrayTrans = [];
var yArrayTrans = [];

//determine the eigenvectors:
var xEigVector0 = numeric.eig(matrix).E.x[0][0];
var yEigVector0 = numeric.eig(matrix).E.x[1][0];

var xEigVector1 = numeric.eig(matrix).E.x[0][1];
var yEigVector1 = numeric.eig(matrix).E.x[1][1];


//find angle for each eigenvector: 

var theta0 = math.atan2(yEigVector0, xEigVector0);

var theta1 = math.atan2(yEigVector1, xEigVector1);


//generate angular array for point generation: 
var meshSize = 5 * (math.floor(2* math.PI/ math.abs(theta1-theta0)));


var angular0 = numeric.linspace(theta0, theta0 + 2 * math.PI  , meshSize);

var angular1 = numeric.linspace(theta1, theta1 + 2 * math.PI , meshSize);


//generate points
for (var r = 0; r < 60; r += 5) {
    for (var i = 0; i < meshSize; i++) {
        var x = r * math.cos(angular0[i]);
        var y = r * math.sin(angular0[i]);
        
        xArray.push(x);
        yArray.push(y);

        //transform and generate transArrays.
        var xTransformed = x1 * x + y1 * y;
        var yTransformed = x2 * x + y2 * y;

        xArrayTrans.push(xTransformed);
        yArrayTrans.push(yTransformed);
    }};

var data = [
    {
        x: xArray,
        y: yArray,
        type: "scatter",
        mode: "markers"
    },
    {
        x: [-xEigVector0 * 30, xEigVector0 * 30],
        y: [-yEigVector0 * 30, yEigVector0 * 30]
    },

    {
        x: [-xEigVector1 * 30, xEigVector1 * 30],
        y: [-yEigVector1 * 30, yEigVector1 * 30]
    }
];

// animate
Plotly.plot("graph", {
    xaxis: { range: [-10, 10] },
    yaxis: { range: [-10, 10] }
}).then(function() {
    Plotly.addFrames("graph", [
        {
            data: [{ x: xArrayTrans, y: yArrayTrans }],
            name: "frame1"
        },
        {
            data: [{ x: xArray, y: yArray }],
            name: "frame2"
        }
    ]);
});

function startAnimation() {
    Plotly.animate("graph", ["frame1", "frame2"], {
        frame: [{ duration: 4000 }, { duration: 3000 }],
        transition: [
            { duration: 3000, easing: "cubic-in" },
            { duration: 3000, easing: "cubic-out" }
        ],
        mode: "next"
    });
}

//main console
function main() {
    Plotly.plot("graph", data);
}
$(document).ready(main);
