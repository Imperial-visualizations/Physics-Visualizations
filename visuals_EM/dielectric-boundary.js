$(window).on('load', function() {

    var dom = {
        intface: $("#interface"),
        loadSpinnerWrapper: $("#spinner-wrapper")
    };

    $.when(
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_data.JSON"),
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_layout.JSON")
    ).done(function(data, layout) { // i.e., function(JSON1, JSON2) {}
        plot(data, layout);

        $("#interface input#angle").on("change", function(event) {
            var index = input2index($(this), data[0]["p"]);
            console.log(data[0]["p"][index]);
            for (var i = 0; i < data[0].p[index].length - 1; i++) {
                // Length - 1 ignores the mesh3d boundary surface trace
                // Method 1:
                var update = {
                    x: [data[0].p[index][i].x],
                    y: [data[0].p[index][i].y],
                    z: [data[0].p[index][i].z]
                };
                Plotly.restyle(div="graph", update, i);

                // Method 2:
                // var update = {
                //     data: [{
                //         x: data[0].p[index][i].x,
                //         y: data[0].p[index][i].y,
                //         z: data[0].p[index][i].z
                //     }],
                //     traces: [0],
                //     layout: {}
                // };
                // Plotly.animate(div="graph", update, {transition: {duration: 0}});
            }
            // Method 3:
            // Plotly.newPlot(div='graph', data[0]["p"][index]);

        });
    });

    function plot(data, layout) {
        var plotData = data[0]["p"][4],
            plotLayout = layout[0];

        endLoadingScreen();

        // dom.intface.html(JSON.stringify(plotLayout, null, 2));
        // console.log(input2index($("#interface input#angle"), data[0]["p"]));
        Plotly.plot(div='graph', plotData, layout=plotLayout);
    }

    function endLoadingScreen() {
        dom.loadSpinnerWrapper.fadeOut();
    }

    function input2index(domInput, array) {
        // Compute the corresponding JSON array index for a given input value, rounding to the nearest integer
        var inputValue = domInput.val(),
            maxInput = domInput.attr("max"),
            arrayLen = array.length;
        return Math.round((inputValue / maxInput) * (arrayLen - 1));
    }

    function update(data) {
        Plotly.restyle(div='graph', data);
    }

});
