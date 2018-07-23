function VolumeElement(x, y, z){
    this.verticesX = x,
    this.verticesY = y,
    this.verticesZ = z,
    this.gObject = function(color="rgb(0,0,0)", opacity=1) {
        var vE = {
            type: "mesh3d",
            x: this.verticesX,
            y: this.verticesY,
            z: this.verticesZ,
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
            opacity: opacity,
            colorscale: [['0', color], ['1', color]],
            intensity: [0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
            showscale: false
        }
        return vE
    }
}