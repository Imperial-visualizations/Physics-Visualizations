//Slider Value and Matrix grid Value
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

//Matrix Display Value
function displayRotationMatrix() {
    var angle = document.getElementById("rotator").value;
    var cosAngle = "cos("+String(Math.abs(angle))+"π"+")";
    var sinAngle1 = "sin(0)", sinAngle2 = "-sin(0)";
    if (angle > 0) {
        sinAngle1 = "sin(" + String(angle)+"π)"; sinAngle2 = "-sin(" + String(angle)+"π)";
    } else if (angle < 0) {
        sinAngle1 = "-sin(" + String(-angle)+"π)"; sinAngle2 = "sin(" + String(-angle)+"π)";
    }
    if (rotationType === 1) {
        document.getElementById("rotateMatrix").innerHTML=makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", cosAngle, sinAngle2],
                ["0", sinAngle1, cosAngle]
            ]
        )
    } else if (rotationType === 2) {
        document.getElementById("rotateMatrix").innerHTML=makeTableHTML(
            [
                [cosAngle, "0", sinAngle1],
                ["0", "1", "0"],
                [sinAngle2, "0", cosAngle]
            ]
        )
    } else if (rotationType === 3) {
        document.getElementById("rotateMatrix").innerHTML=makeTableHTML(
            [
                [cosAngle, sinAngle2, "0"],
                [sinAngle1, cosAngle, "0"],
                ["0", "0", "1"]
            ]
        )
    }
}
function displayReflectionMatrix() {
    if (reflectionType === 1) {
        document.getElementById("reflectMatrix").innerHTML=makeTableHTML(
            [
                ["-1", "0", "0"],
                ["0", "1", "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (reflectionType === 2) {
        document.getElementById("reflectMatrix").innerHTML=makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", "-1", "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (reflectionType === 3) {
        document.getElementById("reflectMatrix").innerHTML=makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", "1", "0"],
                ["0", "0", "-1"]
            ]
        )
    }
}
function displayScaleMatrix() {
    var factor = document.getElementById("scaler").value;
    if (scaleType === 1) {
        document.getElementById("scaleMatrix").innerHTML=makeTableHTML(
            [
                [String(factor), "0", "0"],
                ["0", "1", "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (scaleType === 2) {
        document.getElementById("scaleMatrix").innerHTML=makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", String(factor), "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (scaleType === 3) {
        document.getElementById("scaleMatrix").innerHTML=makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", "1", "0"],
                ["0", "0", String(factor)]
            ]
        )
    }
}