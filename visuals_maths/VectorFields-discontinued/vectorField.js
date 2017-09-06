function parseAsString() {
    var xString = String(document.getElementById("xInput").value)
    var yString = String(document.getElementById("yInput").value)
    if (xString === null ) {
        var xString = "0"
    } if (yString === null) {
        var yString = "0"
    }
    myObject = {x: xString, y: yString}
    console.log(myObject)
    return myObject
}


function main() {
    var data = [{x:[],y:[],type:'scatter'}]
    var layout = {
        x:{
            range:[-2,2]
        },
        y: {
            range:[-2,2]
        }
    }
    Plotly.newPlot('vecPlot',data,layout)
}

$(document).ready(main)