$(window).on('load', function() {//main
    const
    dom = {
        mSwitch:    $("#material-switch input"),
        fSwitch:    $("#field-switch input"),
        vSlider:    $("input#voltage")
    },
    plt = {
        layout : {
            showlegend: false,
            showscale: false,
            margin: {
                l: 1, r: 0, b: 0, t: 1, pad: 5
            },
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-1, 1]},
                yaxis: {range: [-1, 1]},
                zaxis: {range: [-1, 1]},
                camera: { eye: {
                    x: 1.5,
                    y: 1.5,
                    z: 0.7,}
                }
            },
        }
    };

    let old_arrow_number = Math.round(parseFloat($("input#voltage").val())/10);
    let old_material = $("input[name = 'material-switch']:checked").val();
    let old_field = $("input[name = 'field-switch']:checked").val();

    $.when().then(function() {//main
        initial();
    });

    function computeData(){

        $("#voltage-display").html($("input#voltage").val().toString()+"V");

        let c_material   = $("input[name = 'material-switch']:checked").val(),
            c_field      = $("input[name = 'field-switch']:checked").val(),
            voltage     = parseFloat($("input#voltage").val());

        let number_of_arrows    = Math.round(voltage/10);
        extra_spacing = (1 / number_of_arrows);

        var data = [
                {//upper
                    color: '#9D9D9D',
                    type: "mesh3d",
                    name: "capacitor",
                    x: [-1, -1, 1, 1, -1, -1, 1, 1],
                    y: [-1, 1, 1, -1, -1, 1, 1, -1],
                    z: [0.9, 0.9, 0.9, 0.9, 1, 1, 1, 1],
                    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
                    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
                },
                {//lower
                    color: '#9D9D9D',
                    type: "mesh3d",
                    name: "capacitor",
                    x: [-1, -1, 1, 1, -1, -1, 1, 1],
                    y: [-1, 1, 1, -1, -1, 1, 1, -1],
                    z: [-0.9, -0.9, -0.9, -0.9, -1, -1, -1, -1],
                    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
                    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
                },
            ];

        if (c_material === "dielectric") {
            data.push(
                {//dielectric
                    opacity: 0.2,
                    color: '#379F9F',
                    type: "mesh3d",
                    name: "dielectric",
                    x: [-1, -1, 1, 1, -1, -1, 1, 1],
                    y: [-1, 1, 1, -1, -1, 1, 1, -1],
                    z: [-0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5],
                    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
                    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
                }
            );
        }


        let number_x, number_y, x, y, z, u, v, w;

        let colour, linewidth = 10, top_of_arrow = 0.9, bottom_of_arrow = -0.75;
        if (c_field == "e-field") {
            colour = "#0F8291"
        } else if (c_field == "p-field") {
            colour = "#D24000"
        } else {
            colour = "#9F004E"
        }

        if ((c_material === "vacuum" && c_field === "e-field") || (c_material === "vacuum" && c_field === "d-field") || (c_material === "dielectric" && c_field === "d-field")) {
            for (let i = 0; i < number_of_arrows; i++) {
                for (let q = 0; q < number_of_arrows; q++) {
                    number_x = ((2 * (i / number_of_arrows)) - 1) + extra_spacing;
                    number_y = ((2 * (q / number_of_arrows)) - 1) + extra_spacing;
                    data.push({
                        type: "scatter3d",
                        mode: "lines",
                        name: "field line",
                        line: {width: linewidth, color: colour},
                        x: [number_x, number_x],
                        y: [number_y, number_y],
                        z: [top_of_arrow, bottom_of_arrow]
                    });
                    let [x, y, z, u, v, w] = make_arrows([number_x, number_x], [number_y, number_y], [top_of_arrow, bottom_of_arrow])
                    data.push({
                        type: "cone",
                        colorscale: [[0, colour], [1, colour]],
                        name: "arrow",
                        x: [x],
                        y: [y],
                        z: [z],
                        u: [u],
                        v: [v],
                        w: [w],
                        sizemode: "absolute",
                        sizeref: 0.2,
                        showscale: false,
                    });
                }
            }
        }
        else if (c_material === "dielectric" && c_field === "p-field") {
            mid_top_of_arrow = 0.5;
            mid_bottom_of_arrow = -0.3;
            for (let i = 0; i < number_of_arrows; i++) {
                for (let q = 0; q < number_of_arrows; q++) {
                    number_x = ((2 * (i / number_of_arrows)) - 1) + extra_spacing
                    number_y = ((2 * (q / number_of_arrows)) - 1) + extra_spacing
                    data.push({
                        type: "scatter3d",
                        mode: "lines",
                        name: "field line",
                        line: {width: linewidth, color: colour},
                        x: [number_x, number_x],
                        y: [number_y, number_y],
                        z: [mid_top_of_arrow, mid_bottom_of_arrow]
                    })
                    let [x, y, z, u, v, w] = make_arrows([number_x, number_x], [number_y, number_y], [mid_top_of_arrow, mid_bottom_of_arrow])
                    data.push({
                        type: "cone",
                        colorscale: [[0, colour], [1, colour]],
                        name: "arrow",
                        x: [x],
                        y: [y],
                        z: [z],
                        u: [u],
                        v: [v],
                        w: [w],
                        sizemode: "absolute",
                        sizeref: 0.2,
                        showscale: false,
                    })
                }
            }
        }
        else if (c_material === "dielectric" && c_field === "e-field") {
            top_of_arrow_above = 0.9;
            bottom_of_arrow_above = 0.65;
            top_of_arrow_below = -0.5;
            bottom_of_arrow_below = -0.75;
            for (var i = 0; i < number_of_arrows; i++) {
                for (var q = 0; q < number_of_arrows; q++) {
                    number_x = ((2 * (i / number_of_arrows)) - 1) + extra_spacing
                    number_y = ((2 * (q / number_of_arrows)) - 1) + extra_spacing
                    //top arrows
                    data.push({
                        type: "scatter3d",
                        mode: "lines",
                        name: "field line",
                        line: {width: linewidth, color: colour},
                        x: [number_x, number_x],
                        y: [number_y, number_y],
                        z: [top_of_arrow_above, bottom_of_arrow_above]
                    })
                    let [x_1, y_1, z_1, u_1, v_1, w_1] = make_arrows([number_x, number_x], [number_y, number_y], [top_of_arrow_above, bottom_of_arrow_above])
                    data.push({
                        type: "cone",
                        colorscale: [[0, colour], [1, colour]],
                        name: "arrow",
                        x: [x_1],
                        y: [y_1],
                        z: [z_1],
                        u: [u_1],
                        v: [v_1],
                        w: [w_1],
                        sizemode: "absolute",
                        sizeref: 0.2,
                        showscale: false,
                    })
                    data.push({
                        type: "scatter3d",
                        mode: "lines",
                        name: "field line",
                        line: {width: linewidth, color: colour},
                        x: [number_x, number_x],
                        y: [number_y, number_y],
                        z: [top_of_arrow_below, bottom_of_arrow_below]
                    })
                    let [x_2, y_2, z_2, u_2, v_2, w_2] = make_arrows([number_x, number_x], [number_y, number_y], [top_of_arrow_below, bottom_of_arrow_below])
                    data.push({
                        type: "cone",
                        colorscale: [[0, colour], [1, colour]],
                        name: "arrow",
                        x: [x_2],
                        y: [y_2],
                        z: [z_2],
                        u: [u_2],
                        v: [v_2],
                        w: [w_2],
                        sizemode: "absolute",
                        sizeref: 0.2,
                        showscale: false,
                    })
                }
            }
        }

        if (data.length < 103) {
            var extensionSize = data.length;
            for (var i = 0; i < (103 - extensionSize); ++i) {
                data.push(
                    {
                        type: "scatter3d",
                        mode: "lines",
                        x: [0],
                        y: [0],
                        z: [0]
                    }
                );
            }
        }
        return data;
    };

    function initial() {
        //showslider
        const maxVolt   = 50,//use max voltage to set the number of empty traces required
            maxArrows   = (maxVolt/10)**2;
        Plotly.purge("graph")
        Plotly.newPlot('graph', computeData(), plt.layout);
        //Hide the slider
        console.log("initialising");
        $('#spinner').fadeOut(500);
        $('.container').fadeIn(500);

        dom.mSwitch.on("change", update_graph);
        dom.fSwitch.on("change", update_graph);
        dom.vSlider.on("input", update_graph);
    }

    function update_graph() {
        let new_trace = []

        let new_V = parseFloat($("input#voltage").val());
        let new_material = $("input[name = 'material-switch']:checked").val();
        let new_field = $("input[name = 'field-switch']:checked").val();

        new_number_of_arrows  = Math.round(new_V/10);

        if ((Math.abs(new_number_of_arrows-old_arrow_number) >= 1) || (new_material != old_material) ||(new_field != old_material)) {
            new_trace = computeData()
        };

        Plotly.animate("graph",
            {data: new_trace},
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );

        old_arrow_number = Math.round(parseFloat($("input#voltage").val())/10);
        old_material = $("input[name = 'material-switch']:checked").val();
        old_field = $("input[name = 'field-switch']:checked").val();

    };

    function make_arrows(pointsx, pointsy, pointsz) {
        /** Returns an arrowhead based on an inputted line */
        var x = pointsx[1],
            y = pointsy[1],
            z = pointsz[[1]],
            u = 0.1 * (pointsx[1] - pointsx[0]),
            v = 0.1 * (pointsy[1] - pointsy[0]),
            w = 0.1 * (pointsz[1] - pointsz[0]);
        return [x, y, z, u, v, w]
    };
});
