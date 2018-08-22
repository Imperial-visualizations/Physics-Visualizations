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
    },
    plt = {//layout of graph
        layout : {
            autosize: true,
            font: {
                family: "Fira Sans",
                size: 16,
            },
            xaxis: {
                autorange: true,
                showgrid: true,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
            },
            yaxis: {
                autorange: false,
                showgrid: true,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
                range: [-2,12],
            },
            margin: {
                l: 0, r: 0, b: 0, t: 0, pad: 0,
            },
            hovermode: false,
        }
    };

    var fine = false;
    var hyperfine = false;
    var zeeman = false;

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

    function push_line(x0, x1, y0, y1, c) {
        data.push({mode: 'lines', line: {width: 3, color: c}, x: [x0, x1], y: [y0, y1], showlegend: false});
    };

    function get_data() {
        data = [];
        var h = 3;
        var fsplit = 0.8;
        var hfsplit = 0.4;
        var B = 0.02*dom.BFieldSlider.val();

        for (let l=0; l<=3; l++) {
            push_line(0, 0.9, l*h, l*h, '#000000');
            
            for (let j=Math.abs(l-0.5); j<=Math.abs(l+0.5); j++) {
                
                if (fine == true && l != 0) {
                    if (j == Math.abs(l-0.5)) {
                        var fineShift = -fsplit;
                    } else {
                        var fineShift = fsplit;
                    };
                } else {
                    var fineShift = 0;
                };

                push_line(1.1, 1.9, l*h+fineShift, l*h+fineShift, '#FF2D00');
                push_line(0.9, 1.1, l*h, l*h+fineShift, '#000000');

                for (let F=j-0.5; F<=j+0.5; F++) {
                    
                    if (hyperfine == true) {
                        if (F == j-0.5) {
                            var hyperfineShift = -hfsplit;
                        } else {
                            var hyperfineShift = hfsplit;
                        };
                    } else {
                        var hyperfineShift = 0;
                    };

                    push_line(2.1, 2.9, l*h+fineShift+hyperfineShift, l*h+fineShift+hyperfineShift, '#33FF33');
                    push_line(1.9, 2.1, l*h+fineShift, l*h+fineShift+hyperfineShift, '#000000');

                    for (let mF=-F; mF<=F; mF++) {
                        if (zeeman == true && hyperfine == true) {
                            var zeemanShift = B*mF;
                        } else if (zeeman == true && fine == true) {
                            var zeemanShift = B*j; //so that all the lines overlay with the mj lines instead of standing out at mj = 0
                        } else {
                            var zeemanShift = 0;
                        };
                        
                        push_line(3.1, 3.9, l*h+fineShift+hyperfineShift+zeemanShift, l*h+fineShift+hyperfineShift+zeemanShift, '#FF6600');
                        push_line(2.9, 3.1, l*h+fineShift+hyperfineShift, l*h+fineShift+hyperfineShift+zeemanShift, '#000000');
                    };
                };

                for (let mj=-j; mj<=j; mj++) {
                    if (zeeman == true && fine == true && hyperfine == false) {
                        var zeemanShift = B*mj;
                    } else if (zeeman == true && hyperfine == true) {
                        var zeemanShift = B*(j+0.5); //so that all the lines overlay with the mF lines instead of standing out at mF = 0
                    } else {
                        var zeemanShift = 0;
                    };

                    push_line(3.1, 3.9, l*h+fineShift+hyperfineShift+zeemanShift, l*h+fineShift+hyperfineShift+zeemanShift, '#AB00FF');
                    push_line(2.9, 3.1, l*h+fineShift+hyperfineShift, l*h+fineShift+hyperfineShift+zeemanShift, '#000000');
                };
            };
        };

        data.push({mode: "text", x: [1.5], y: [-1], text: "Fine splitting", textfont: {family: "Fira Sans", size: 20}, showlegend: false});
        data.push({mode: "text", x: [2.5], y: [-1], text: "Hyperfine splitting", textfont: {family: "Fira Sans", size: 20}, showlegend: false});
        data.push({mode: "text", x: [3.5], y: [-1], text: "Zeeman splitting", textfont: {family: "Fira Sans", size: 20}, showlegend: false});

        return data;
    };

    function initial() {
        Plotly.purge("graph")
        Plotly.newPlot('graph', get_data(), plt.layout)

        $('#spinner').hide();
        $('.container').show();//show container after loading finishes
    };

    function update_graph() {
        Plotly.animate("graph", {
            data: get_data(),
            layout: plt.layout
        }, {
            transition: {
                duration: 500,
                easing: 'cubic-in-out'
            }
        });
    };

    initial();
});