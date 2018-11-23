$(window).on('load', function() {//main
    const
    dom = {//assigning switches and slider

    },
    plt = {//layout of graph
        layout : {
            legend: {x: 0, y: 0, orientation: 'h'},
            showscale: false,
            margin: {
                l: 1, r: 0, b: 0, t: 1, pad: 5
            },
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-1, 1]},
                yaxis: {range: [-1, 1]},
                zaxis: {range: [-1, 4], tickvals: [-1,0,1,2,3,4], ticktext: [-1,0,1,2,3,4]},
                camera: { eye: {//adjust eye so that more of the capacitor is seen
                    x: 1.5,
                    y: 1.5,
                    z: 0.65,}
                }
            },

        }
    }

    var x = [], y = [], z = [];
    var ms = 0.5, ml = 1, j = 1.5;
    var t = 0;

    var playAnimation = true;
    var startButton = $("#startAnimation")
    var stopButton = $("#stopAnimation")

    startButton.hide();
    startButton.click(function() {
        $(this).hide();
        stopButton.show();

        playAnimation = true;
        update_graph();
    });
    stopButton.click(function() {
        $(this).hide();
        startButton.show();

        playAnimation = false;
    });

    function update_vals() {
        ms = $('#spin_number').val();
        ml = $('#magnetic_number').val();
        j = +ms + +ml;
        //l = $('#azimuthal_number').val();
    };
    $("#spin_number").on("change", update_vals);
    $("#magnetic_number").on("change", update_vals);
    //$("#azimuthal_number").on("change", update_vals);

    function get_data() {
        let cylinder_x = [], cylinder_y = [];
        let cylinder_spin_z = [], cylinder_azim_z = [];
        for (let i = 0; i<20; i++) {
            cylinder_x.push(Math.cos(6.28*i/20));
            cylinder_y.push(Math.sin(6.28*i/20));
            cylinder_spin_z.push(ms);
            cylinder_azim_z.push(ml);
            
            cylinder_x.push(0);
            cylinder_y.push(0);
            cylinder_spin_z.push(0);
            cylinder_azim_z.push(0);
        };
        var data = [
            {//Spin angular momentum vector
                name: 'Spin Angular Momentum',
                type: 'scatter3d',
                mode: 'lines',
                line: {width: 10, color: 'rgb(0,0,0)', dash: 'solid'},
                x: [0, Math.cos(-t/100), 0, Math.cos(t/80), 0, 0],
                y: [0, Math.sin(-t/100), 0, Math.sin(t/80), 0, 0],
                z: [0, ms, 0, ml, 0, j],
            },
            {//Spin angular momentum vector
                name: 'Projections',
                type: 'scatter3d',
                mode: 'lines',
                line: {width: 10, color: 'rgb(0,0,0)', dash: 'dash'},
                x: [Math.cos(-t/100), 0, Math.cos(t/80), 0],
                y: [Math.sin(-t/100), 0, Math.sin(t/80), 0],
                z: [ms, j, ml, j],
            },
            {//Spin cylinder
                name: 'Spin Cylinder',
                type: 'mesh3d',
                color: 'rgb(300,0,0)',
                opacity: 0.4,
                x: cylinder_x,
                y: cylinder_y,
                z: cylinder_spin_z,
            },
            {//Angular momentum cylinder
                name: 'Angular Momentum Cylinder',
                type: 'mesh3d',
                color: 'rgb(0,300,0)',
                opacity: 0.4,
                x: cylinder_x,
                y: cylinder_y,
                z: cylinder_azim_z,
            },
        ];
        return data; 
    };

    function initial() {        
        Plotly.purge("graph")
        Plotly.newPlot('graph', get_data(), plt.layout)

        $('#spinner').hide();
        $('.container').show();//show container after loading finishes
    };

    function update_graph() {
        Plotly.animate("graph",
            {data: get_data()},
            {
                fromcurrent: true,
                frame: {duration: 0, redraw: true,},
                transition: {duration: 0, easing: 'cubic-in-out'},
                mode: 'afterall',
            });

        if (playAnimation == true) {
            t++;
            requestAnimationFrame(update_graph);    
        };
    };

    initial();
    requestAnimationFrame(update_graph);
});
