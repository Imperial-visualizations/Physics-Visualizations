//Slider Value and Matrix grid Value
function makeTableHTML(myArray) {
    var result = "<table class='matrix'><tbody>";
    for(var i=0, n=myArray.length; i<n; ++i) {
        result += "<tr>";
        for(var j=0, m=myArray[i].length; j<m; ++j){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</tbody></table>";
    return result;
}

//Matrix Display Value
function displayRotationMatrix(angle, rotationType) {
    var result;
    var cosAngle = "cos("+String(Math.abs(angle))+"π"+")";
    var sinAngle1 = "sin(0)", sinAngle2 = "-sin(0)";
    if (angle === "0" || angle === "-2" || angle === "2"){
        cosAngle = "1"; sinAngle1 = "0"; sinAngle2 = "0";
    } else if (angle > 0) {
        sinAngle1 = "sin(" + String(angle)+"π)"; sinAngle2 = "-sin(" + String(angle)+"π)";
    } else if (angle < 0) {
        sinAngle1 = "-sin(" + String(-angle)+"π)"; sinAngle2 = "sin(" + String(-angle)+"π)";
    }
    if (rotationType === "rotateX") {
        result = makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", cosAngle, sinAngle2],
                ["0", sinAngle1, cosAngle]
            ]
        )
    } else if (rotationType === "rotateY") {
        result = innerHTML=makeTableHTML(
            [
                [cosAngle, "0", sinAngle1],
                ["0", "1", "0"],
                [sinAngle2, "0", cosAngle]
            ]
        )
    } else if (rotationType === "rotateZ") {
        result = innerHTML=makeTableHTML(
            [
                [cosAngle, sinAngle2, "0"],
                [sinAngle1, cosAngle, "0"],
                ["0", "0", "1"]
            ]
        )
    }
    return result;
}
function displayReflectionMatrix(reflectionType) {
    var result;
    if (reflectionType === "reflectX") {
        result = makeTableHTML(
            [
                ["-1", "0", "0"],
                ["0", "1", "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (reflectionType === "reflectY") {
        result = makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", "-1", "0"],
                ["0", "0", "1"]
            ]
        )
    } else if (reflectionType === "reflectZ") {
        result = makeTableHTML(
            [
                ["1", "0", "0"],
                ["0", "1", "0"],
                ["0", "0", "-1"]
            ]
        )
    }
    return result;
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