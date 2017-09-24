// Draw a 1x1x1 cube as default, global variables
var u = [1,0,0];
var v = [0,1,0];
var w = [0,0,1];

/** Converts 1D array to 2D array to convert to matrix equation later
* @function
* @param {array} - 1D array vector
*/
function tableVec(vec) {
    var result = [];
    for (var i=0; i<3; i++) {
        result.push([vec[i]])
    }
    return result
}

/** Parallelepiped object
* @Prototype
*/
var my_pped = {
    u: u,
    v: v,
    w: w,
    /** Method to find volume
    * @method
    */
    volume: function() {
        var crossp = math.cross(this.v,this.w);
        var vol = math.dot(this.u,crossp);
        return Math.abs(vol)
    },
    /** Method to return object to plot on plotly
    * @method
    */
    gopped: function() {
        var data = {
        type: "mesh3d",
        x : [0,this.u[0],this.u[0]+this.v[0],this.v[0],this.w[0],this.w[0]+this.u[0],this.w[0]+this.u[0]+this.v[0],
             this.v[0]+this.w[0]],
        y : [0,this.u[1],this.u[1]+this.v[1],this.v[1],this.w[1],this.w[1]+this.u[1],this.w[1]+this.u[1]+this.v[1],
             this.v[1]+this.w[1]],
        z : [0,this.u[2],this.u[2]+this.v[2],this.v[2],this.w[2],this.w[2]+this.u[2],this.w[2]+this.u[2]+this.v[2],
             this.v[2]+this.w[2]],
        i : [0, 0, 3, 4, 4, 4, 4, 4, 5, 6, 6, 7],
        j : [2, 3, 4, 3, 6, 7, 1, 5, 2, 2, 7, 3],
        k : [1, 2, 0, 7, 5, 6, 0, 1, 1, 5, 2, 2],
        opacity: 0.6,
        showlegend: true
        }
        return data
    },
    /** Layout object
    * @object
    */
    lytpped: function() {
        var ubx = Math.abs(this.u[0])+Math.abs(this.v[0])+Math.abs(this.w[0]);
        var uby = Math.abs(this.u[1])+Math.abs(this.v[1])+Math.abs(this.w[1]);
        var ubz = Math.abs(this.u[2])+Math.abs(this.v[2])+Math.abs(this.w[2]);
        var layout = {
            title: 'Plot with given input vectors',

            xaxis: {
                title: 'x',
                range:[-ubx,ubx]
            },
            yaxis: {
                title: 'y',
                range: [-uby,uby]
            },
            zaxis: {
                title: 'z',
                range: [-ubz,ubz]
            },
            font: {
                family: "Lato",
                size: 12,
                color: "#003E74",
                weight: 900
            },
            fill : 'tonexty',
            showlegend: true,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 25
            }
        }
        return layout
    }
}


/** Function which takes array as input and returns a table
* @function
* @param {int} m,n - integers for dimensions of matrix/array
*/
function makeTableInputU(m, n) {
    var result = "<table class='matrixWrapper'><tbody><tr><td>"
    result += "<td>";
    result += "\\(\\vec{u}\\)";
    result += "</td>"
    result += "<td>&nbsp=&nbsp</td>"
    result += "<td><table class='matrix'><tbody>";
    for (var i=0; i<m; i++) {
        result += "<tr>";
        for (var j=0; j<n; j++){
            if (i === 0) {
                result += "<td>"+"<input type='number' id='Urow"+String(i)+"col"+String(j)+
                    "' oninput='ppedPlotter()'"+" value='1'"+"'>"+"</td>";
            } else {
                result += "<td>"+"<input type='number' id='Urow"+String(i)+"col"+String(j)+
                    "' oninput='ppedPlotter()'"+" value='0'"+"'>"+"</td>";
            }
        }
    }
        result += "</tr>";

    result += "</tbody></table></td>";
    result += "</td></tr></tbody></table>";
    return result;
}

/** Function which takes array as input and returns a table
* @function
* @param {int} m,n - integers for dimensions of matrix/array
*/
function makeTableInputV(m, n) {
    var result = "<table class='matrixWrapper'><tbody><tr><td>"
    result += "<td>";
    result += "\\(\\vec{v}\\)";
    result += "</td>"
    result += "<td>&nbsp=&nbsp</td>"
    result += "<td><table class='matrix'><tbody>";
    for (var i=0; i<m; i++) {
        result += "<tr>";
        for (var j=0; j<n; j++){
            if (i === 1) {
                result += "<td>"+"<input type='number' id='Vrow"+String(i)+"col"+String(j)+
                    "' oninput='ppedPlotter()'"+" value='1'"+"'>"+"</td>";
            } else {
                result += "<td>"+"<input type='number' id='Vrow"+String(i)+"col"+String(j)+
                    "' oninput='ppedPlotter()'"+" value='0'"+"'>"+"</td>";
            }
        }
    }
        result += "</tr>";

    result += "</tbody></table></td>";
    result += "</td></tr></tbody></table>";
    return result;
}

/** Function which takes array as input and returns a table
* @function
* @param {int} m,n - integers for dimensions of matrix/array
*/
function makeTableInputW(m, n) {
    var result = "<table class='matrixWrapper'><tbody><tr><td>"
    result += "<td>";
    result += "\\(\\vec{w}\\)";
    result += "</td>"
    result += "<td>&nbsp=&nbsp</td>"
    result += "<td><table class='matrix'><tbody>";
    for (var i=0; i<m; i++) {
        result += "<tr>";
        for (var j=0; j<n; j++){
            if (i === 2) {
                result += "<td>"+"<input type='number' id='Wrow"+String(i)+"col"+String(j)+
                    "' oninput='ppedPlotter()'"+" value='1'"+"'>"+"</td>";
            } else {
                result += "<td>"+"<input type='number' id='Wrow"+String(i)+"col"+String(j)+
                    "' oninput='ppedPlotter()'"+" value='0'"+"'>"+"</td>";
            }
        }
    }
        result += "</tr>";

    result += "</tbody></table></td>";
    result += "</td></tr></tbody></table>";
    return result;
}


/** Function which takes array as input and returns a table
* @function
* @param {array} myArray - array to convert to HTML table
*/
function makeTableHTML(myArray) {
    var result = "<table class='matrix'><tbody>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for (var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}

/** Takes 3 vectors u,v,w and returns an HTML table for the product
* @function
* @param{array} u,v,w - three arrays length 3
*/
function tripleProduct(u, v, w) {
    var result = "<table class='matrixWrapper'><tbody><tr><td>";
    result += "<td>" + makeTableHTML(tableVec(u)) + "</td>";
    result += "<td>&nbsp.&nbsp</td>";
    result += "<td>" + makeTableHTML(tableVec(v)) + "</td>";
    result += "<td>x</td>";
    result += "<td>" + makeTableHTML(tableVec(w)) + "</td>";
    result += "<td>=&nbsp" + String(my_pped.volume()) + "&nbsp</td>"
    result += "</td></tr></tbody></table>";
    return result

}

/** Main function
* @function
*/
function main() {
    $("#u").append(makeTableInputU(3,1))
    $("#v").append(makeTableInputV(3,1))
    $("#w").append(makeTableInputW(3,1))
    $("#triple").append(tripleProduct(u,v,w))

    // Give arrows names as well for legends
    var arrow1 = new Arrow3D(u[0],u[1],u[2],[0,0,0], 5,'rgb(0,62,116)',true);
    arrow1.shaft['name'] = 'u'
    var arrow2 = new Arrow3D(v[0],v[1],v[2],[0,0,0], 5,'rgb(2,137,59)',true);
    arrow2.shaft['name'] = 'v'
    var arrow3 = new Arrow3D(w[0],w[1],w[2],[0,0,0], 5,'rgb(255,0,255)',true);
    arrow3.shaft['name'] = 'w'

    var data = [my_pped.gopped(),arrow1.data.shaft,arrow1.data.wings,arrow2.data.shaft,arrow2.data.wings
        ,arrow3.data.shaft,arrow3.data.wings];

    var layout = my_pped.lytpped();
    Plotly.newPlot('graph',data,layout)
}

/** Plot the parallelepiped
* @function
*/
function ppedPlotter() {
    var ux = Number(document.getElementById('Urow0col0').value);
    var uy = Number(document.getElementById('Urow1col0').value);
    var uz = Number(document.getElementById('Urow2col0').value);
    u = [ux,uy,uz];

    var vx = Number(document.getElementById('Vrow0col0').value);
    var vy = Number(document.getElementById('Vrow1col0').value);
    var vz = Number(document.getElementById('Vrow2col0').value);
    v = [vx,vy,vz];

    var wx = Number(document.getElementById('Wrow0col0').value);
    var wy = Number(document.getElementById('Wrow1col0').value);
    var wz = Number(document.getElementById('Wrow2col0').value);
    w = [wx,wy,wz];

    my_pped.u = u;
    my_pped.v = v;
    my_pped.w = w;

    var vol = my_pped.volume();

    var arrow1 = new Arrow3D(u[0],u[1],u[2],[0,0,0], 5,'rgb(0,62,116)',true);
    arrow1.shaft['name'] = 'u'
    var arrow2 = new Arrow3D(v[0],v[1],v[2],[0,0,0], 5,'rgb(2,137,59)',true);
    arrow2.shaft['name'] = 'v'
    var arrow3 = new Arrow3D(w[0],w[1],w[2],[0,0,0], 5,'rgb(255,0,255)',true);
    arrow3.shaft['name'] = 'w'

    // Arrow data and PPed data
    var data = [my_pped.gopped(),arrow1.data.shaft,arrow1.data.wings,arrow2.data.shaft,arrow2.data.wings
        ,arrow3.data.shaft,arrow3.data.wings];
    var layout = my_pped.lytpped();

    Plotly.newPlot('graph',data,layout)
    $("#triple").html(tripleProduct(u, v, w))
}


$(document).ready(main);
