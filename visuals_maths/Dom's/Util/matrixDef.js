//Rotation Matrices (axis of rotation along x/y/z-axix):
function rotationX(angle) {
    var matrix = [[1, 0, 0], [0, Math.cos(angle), -Math.sin(angle)], [0, Math.sin(angle), Math.cos(angle)]];
    return matrix;
}
function rotationY(angle) {
    var matrix = [[Math.cos(angle), 0, Math.sin(angle)], [0, 1, 0], [-Math.sin(angle), 0, Math.cos(angle)]];
    return matrix;
}
function rotationZ(angle) {
    var matrix = [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0 ,1]];
    return matrix;
}

//Scaling Matrices
function scaleX(factor) {
    var matrix = [[factor, 0, 0], [0, 1, 0], [0, 0, 1]];
    return matrix;
}
function scaleY(factor) {
    var matrix = [[1, 0, 0], [0, factor, 0], [0, 0, 1]];
    return matrix;
}
function scaleZ(factor) {
    var matrix = [[1, 0, 0], [0, 1, 0], [0, 0 ,factor]];
    return matrix;
}