$(window).on('load', function() {

    var dom = {
        intface: $("#interface"),
        loadSpinner: $("#spinner-wrapper")
    };

    $.when(
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_data.JSON"),
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_layout.JSON")
    ).then(function(data, layout) { // i.e., function(JSON1, JSON2) {// success}, function() {// error}

        init(data, layout);

        $("#interface input#angle").on("input", function() {
            var index = input2index($(this), data[0].p);
            updatePlot(data[0].p, index);
        });

    }, JSONLoadError);


    function init(data, layout) {
        var plotData = data[0]["p"][10],
            plotLayout = layout[0];

        endLoadingScreen();

        // dom.intface.html(JSON.stringify(plotLayout, null, 2));
        // console.log(input2index($("#interface input#angle"), data[0]["p"]));
        Plotly.plot(div='graph', plotData, layout=plotLayout);
    }


    function endLoadingScreen() {
        dom.loadSpinner.fadeOut(0);
    }


    function input2index(domInput, array) {
        // Compute the corresponding JSON array index for a given input value, rounding to the nearest integer
        var inputValue = domInput.val(),
            maxInput = domInput.attr("max"),
            arrayLen = array.length;
        return Math.round((inputValue / maxInput) * (arrayLen - 1));
    }


    function updatePlot(data, index) {

        var updateData = {};
        for (var i = 0; i < data[index].length - 1; i++) {
            updateData[i] = {
                    x: data[index][i].x,
                    y: data[index][i].y,
                    z: data[index][i].z
            };
        }
        Plotly.animate(div="graph", {
            data: Object.keys(updateData).map(function(key) {return updateData[key];}),
            traces: Object.keys(updateData).map(Number),
            layout: {}
        }, {
            transition: {duration: 0},
            frame: {duration: 0, redraw: false}
        });
    }


    function JSONLoadError() {
        dom.loadSpinner.children(".spinner-span").html("Error: Failed to load JSON resources");
        dom.loadSpinner.children("div").fadeOut(0);
    }

});
