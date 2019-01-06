//calculates the eigenvectors with their angles for a given matrix
// input matrix as an array.
function eigenfunc(matrix) {
    var xEigVector0 = numeric.eig(matrix).E.x[0][0];
    var yEigVector0 = numeric.eig(matrix).E.x[1][0];
    var theta0 = Math.atan2(yEigVector0, xEigVector0);

    var xEigVector1 = numeric.eig(matrix).E.x[0][1];
    var yEigVector1 = numeric.eig(matrix).E.x[1][1];
    var theta1 = Math.atan2(yEigVector1, xEigVector1);

    return [
        [xEigVector0, yEigVector0],
        [xEigVector1, yEigVector1],
        theta0,
        theta1
    ];
}

//returns array of points in Cartesian space before and after the transformation of a matrix.
function arrayTransform(matrix, height, width, spacer) {
    var xArray = [];
    var yArray = [];
    var xArrayTrans = [];
    var yArrayTrans = [];
                                            //spacer determines the spacing between points.
    for (var x = -width; x < width + 1; x += spacer) {
        for (var y = -height; y < height + 1; y += spacer) {
            xArray.push(x);
            yArray.push(y);

            //transform and generate transArrays.
            var xTransformed = x1 * x + y1 * y;
            var yTransformed = x2 * x + y2 * y;

            xArrayTrans.push(xTransformed);
            yArrayTrans.push(yTransformed);
            return [[xArray,yArray],[xArrayTrans, yArrayTrans]]
        }
    }
}


//generates points on a line at a given angle and returns original and transformed array
function linePoints(matrix, lineLength, )

