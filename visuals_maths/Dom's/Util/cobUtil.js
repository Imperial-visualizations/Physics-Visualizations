// Spherical 2 Cartesian
function sp2c(r, theta, phi) {
    return [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
    ];
}


// Cartesian 2 Spherical
function c2sp(x, y, z) {
    var r = 0, theta = 0, phi = 0;
    if (x*x + y*y + z*z !== 0) {
        r = Math.sqrt(x*x + y*y + z*z);
        theta = Math.acos(z/r);
        phi = Math.atan2(y,x);
    }
    return [r, theta, phi];
}