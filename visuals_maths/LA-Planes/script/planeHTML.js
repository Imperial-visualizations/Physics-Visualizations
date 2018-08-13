function displayPlane(idName) {
    document.getElementById(idName).innerHTML
        = '<input id=' + "a2Input" + ' type="number" value="0" style="width: 70px"> x + '
        + '<input id=' + "b2Input" + ' type="number" value="1" style="width: 70px"> y + '
        + '<input id=' + "c2Input" + ' type="number" value="0" style="width: 70px"> z = '
        + '<input id=' + "d2Input" + ' type="number" value="3" style="width: 70px">';
    return 0;
}
/*
function displayLine(idName) {
    var current = "<table class='matrixWrapper'>" + "<tbody>" + "<tr>"
        + "<td>" + makeTableHTML([
            [Math.round(historyVectors[index][0]*100)/100],
            [Math.round(historyVectors[index][1]*100)/100],
            [Math.round(historyVectors[index][2]*100)/100]
        ]) + "</td>"
        + "</tr>" + "</tbody>" + "<table>";

    document.getElementById(idName).innerHTML = current;
    return;
}
*/