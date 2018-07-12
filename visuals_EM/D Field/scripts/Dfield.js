$(window).on('load', function() {//main
    const
    dom = {//assigning switches and slider
        mSwitch:    $("#material-switch input"),
        fSwitch:    $("#field-switch input"),
        vSlider:    $("input#voltage")
    },
    plt = {//layout of graph
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
                camera: { eye: {//adjust eye so that more of the capacitor is seen
                    x: 1.5,
                    y: 1.5,
                    z: 0.65,}
                }
            },
        }
    };

    let c_material   = $("input[name = 'material-switch']:checked").val();
    let c_field      = $("input[name = 'field-switch']:checked").val();
    let voltage     = parseFloat($("input#voltage").val());

    let old_arrow_number = Math.round(parseFloat($("input#voltage").val())/10);//track the value of the number of field lines before change
    let old_material = $("input[name = 'material-switch']:checked").val();//track the value of the material before change
    let old_field = $("input[name = 'field-switch']:checked").val();//track the value of the field before change


    function computeData(){//produces the data for the animation

        $("#voltage-display").html($("input#voltage").val().toString()+"V");//update value of slider in html

        let number_of_arrows    = Math.round(voltage/10);// convert the voltage selected to a discrete value of field lines
        extra_spacing = (1 / number_of_arrows);//value used to position field lines in center of the capacitor

        var data = [
                {//upper capacitor plate
                    color: '#9D9D9D',
                    type: "mesh3d",
                    name: "capacitor",
                    x: [-1, -1, 1, 1, -1, -1, 1, 1],
                    y: [-1, 1, 1, -1, -1, 1, 1, -1],
                    z: [0.9, 0.9, 0.9, 0.9, 1, 1, 1, 1],
                    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],//order of corners of the 3dmesh, read as column vector
                    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
                },
                {//lower capacitor plate
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

        if (c_material === "dielectric") {//dielectric only created when required
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


        let number_x, number_y;

        let colour, linewidth = 10, top_of_arrow = 0.9, bottom_of_arrow = -0.75;

        if (c_field == "e-field") {//colour represents the field type selected
            colour = "#0F8291"
        } else if (c_field == "p-field") {
            colour = "#D24000"
        } else {
            colour = "#9F004E"
        }

        if ((c_material === "vacuum" && c_field === "e-field") || (c_material === "vacuum" && c_field === "d-field") || (c_material === "dielectric" && c_field === "d-field")) {
            for (let i = 0; i < number_of_arrows; i++) {//used to create grid of field lines hence only square numbers possible
                for (let q = 0; q < number_of_arrows; q++) {
                    number_x = ((2 * (i / number_of_arrows)) - 1) + extra_spacing;
                    number_y = ((2 * (q / number_of_arrows)) - 1) + extra_spacing;
                    data.push({//add trace for line of field line
                        type: "scatter3d",
                        mode: "lines",
                        name: "field line",
                        line: {width: linewidth, color: colour},
                        x: [number_x, number_x],
                        y: [number_y, number_y],
                        z: [top_of_arrow, bottom_of_arrow]
                    });
                    let [x, y, z, u, v, w] = make_arrows([number_x, number_x], [number_y, number_y], [top_of_arrow, bottom_of_arrow])
                    data.push({//add trace for arrow tip
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
        else if (c_material === "dielectric" && c_field === "p-field") {//various if statements due to position of the field lines within the capacitor
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

        if (data.length < 103) {//animate function requires data sets of the same length hence those unused in situation must be filled with empty traces
            var extensionSize = data.length;// 103 represents the maximum traces necessary 2(top and lower capacitor)+1(dielectric)+25(top field line lines)+25(top field line arrows)+25(bottom field line lines)+25(bottom field line arrows)
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

    function initial() {//produces initial plot seen on load

        Plotly.purge("graph")
        Plotly.newPlot('graph', computeData(), plt.layout);

        $('.container').show();//show container after loading finishes

        $('#spinner').hide();

        dom.mSwitch.on("change", update_graph);//on any change the graph will update
        dom.fSwitch.on("change", update_graph);
        dom.vSlider.on("input", update_graph);
    }

    function update_graph() {

        let new_trace = []

        c_material   = $("input[name = 'material-switch']:checked").val(),//update value of the material selected
        c_field      = $("input[name = 'field-switch']:checked").val(),//update value of the field selected
        voltage     = parseFloat($("input#voltage").val());//update value of the voltage slider

        new_number_of_arrows  = Math.round(voltage/10);

        if ((Math.abs(new_number_of_arrows-old_arrow_number) >= 1) || (c_material != old_material) ||(c_field != old_material)) {//will only calculate new graph if the conditions actually change, as discrete field lines only specific voltages produce different number of field lines
            new_trace = computeData()
        };

        Plotly.animate("graph",
            {data: new_trace},//updated data
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );

        old_arrow_number = Math.round(parseFloat($("input#voltage").val())/10);//update old data to new condition before another new change is implemented
        old_material = $("input[name = 'material-switch']:checked").val();
        old_field = $("input[name = 'field-switch']:checked").val();

    };

    function make_arrows(pointsx, pointsy, pointsz) {//return data required to construct field line arrows
        /** Returns an arrowhead based on an inputted line */
        var x = pointsx[1],
            y = pointsy[1],
            z = pointsz[[1]],
            u = 0.1 * (pointsx[1] - pointsx[0]),
            v = 0.1 * (pointsy[1] - pointsy[0]),
            w = 0.1 * (pointsz[1] - pointsz[0]);
        return [x, y, z, u, v, w]
    };

    initial();//run the initial loading

});
