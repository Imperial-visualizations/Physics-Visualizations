$(window).on('load', function() {//main
    const
    dom = {//assigning switches and slider
        fineSplitButton: $("#fineSplit"),
        fineUnsplitButton: $("#fineUnsplit"),
        hyperfineSplitButton: $("#hyperfineSplit"),
        hyperfineUnsplitButton: $("#hyperfineUnsplit"),
        zeemanSplitButton: $("#zeemanSplit"),
        zeemanUnsplitButton: $("#zeemanUnsplit"),
        BFieldSlider: $("#BFieldSlider"),
    };

    var fine = false,
        hyperfine = false,
        zeeman = false;

    dom.fineSplitButton.click(function() {
        $(this).hide();
        dom.fineUnsplitButton.show();
        dom.hyperfineSplitButton.show();
        dom.zeemanSplitButton.show();
        fine = true;
        update_graph();
    });
    
    dom.fineUnsplitButton.click(function() {
        $(this).hide();
        dom.fineSplitButton.show();
        dom.hyperfineSplitButton.hide();
        dom.hyperfineUnsplitButton.hide();
        dom.zeemanSplitButton.hide();
        dom.zeemanUnsplitButton.hide();
        dom.BFieldSlider.hide();
        fine = false;
        hyperfine = false;
        zeeman = false;
        update_graph();
    });

    dom.hyperfineSplitButton.click(function() {
        $(this).hide();
        dom.hyperfineUnsplitButton.show();
        hyperfine = true;
        update_graph();
    });

    dom.hyperfineUnsplitButton.click(function() {
        $(this).hide();
        dom.hyperfineSplitButton.show();
        hyperfine = false;
        update_graph();
    });

    dom.zeemanSplitButton.click(function() {
        $(this).hide();
        dom.zeemanUnsplitButton.show();
        dom.BFieldSlider.show();
        zeeman = true;
        update_graph();
    });

    dom.zeemanUnsplitButton.click(function() {
        $(this).hide();
        dom.zeemanSplitButton.show();
        dom.BFieldSlider.hide();
        zeeman = false;
        update_graph();
    });

    dom.BFieldSlider.on("change", update_graph);

    function initial() {
        
        /*var svg = d3.select("#graph")
           .append("div")
           .classed("svg-container", true) //container class to make it responsive
           .append("svg")
           //responsive SVG needs these 2 attributes and no width and height attr
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "0 0 600 400")
           //class to make it responsive
           .classed("svg-content-responsive", true);
        */
        var svg = d3.select('#graph').append("svg")
            .attr("width", '100%')
            .attr("height", '100%');

        var circle = svg.append("circle")
            .attr("cx", 30)
            .attr("cy", 30)
            .attr("r", 20);
        
        svg.selectAll(".bar")
            .data([150, 230, 180, 90])
            .enter()
            .append("rect")
            .attrs({
                class : "bar",
                width : function(d) {return d;},
                height: "40",
                y : function(d, i) {return i*50 + 10;},
                x : "10"
            });

        $('#spinner').hide();
        $('.container').show();//show container after loading finishes
    };



    function update_graph() {
        
    };
    
    
    initial();
});