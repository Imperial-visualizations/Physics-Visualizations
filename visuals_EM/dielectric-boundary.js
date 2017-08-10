$(window).on('load', function() {

    var dom = {
        intface: $("#interface"),
        loadSpinner: $("#spinner-wrapper")
    };

    $.when(
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_data.JSON"),
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_layout.JSON")
    ).then(function(data, layout) { // i.e., function(JSON1, JSON2) {}
        init(data, layout);

        $("#interface input#angle").on("change", function(event) {
            var index = input2index($(this), data[0]["p"]);
            console.log("Index", index);
            console.log(data[0]["p"][index]);
            for (var i = 0; i < data[0].p[index].length - 1; i += 4) {
                // Length - 1 ignores the mesh3d boundary surface trace

                console.log("Trace", i);

                var update = {
                    data: [{
                        x: data[0].p[index][i].x,
                        y: data[0].p[index][i].y,
                        z: data[0].p[index][i].z
                    }, {
                        x: data[0].p[index][i+1].x,
                        y: data[0].p[index][i+1].y,
                        z: data[0].p[index][i+1].z
                    }, {
                        x: data[0].p[index][i+2].x,
                        y: data[0].p[index][i+2].y,
                        z: data[0].p[index][i+2].z
                    }, {
                        x: data[0].p[index][i+3].x,
                        y: data[0].p[index][i+3].y,
                        z: data[0].p[index][i+3].z
                    }],
                    traces: [i, i+1, i+2, i+3],
                    layout: {}
                };
                Plotly.animate(div="graph", update, {transition: {duration: 0}, frame: {duration: 0, redraw: false}});

            }

        });
    }, function() {
        dom.loadSpinner.children(".spinner-span").html("Error: Failed to load JSON resources");
        dom.loadSpinner.children("div").fadeOut(0);
    });

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

    function update(data) {
        Plotly.restyle(div='graph', data);
    }

});
