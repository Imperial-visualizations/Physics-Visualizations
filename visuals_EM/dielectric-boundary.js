$(window).on('load', function() {

    var dom = {
        intface: $("#interface"),
        loadSpinnerWrapper: $("#spinner-wrapper")
    };

    $.when(
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_data.JSON"),
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_layout.JSON")
    ).done(function(data, layout) {
        plot(data, layout);
    });

    function plot(data, layout) {
        var plotData = data[0]["p"][4],
            plotLayout = layout[0];

        endLoadingScreen();

        dom.intface.html(JSON.stringify(plotLayout, null, 2));
        console.log(plotLayout);
        Plotly.plot(div='graph', plotData, layout=plotLayout);
    }

    function endLoadingScreen() {
        dom.loadSpinnerWrapper.fadeOut();
    }

});
