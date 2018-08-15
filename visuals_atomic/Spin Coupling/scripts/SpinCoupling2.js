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
                xaxis: {range: [-2, 2]},
                yaxis: {range: [-2, 2]},
                zaxis: {range: [-2, 2]},
                camera: { eye: {//adjust eye so that more of the capacitor is seen
                    x: 1.5,
                    y: 1.5,
                    z: 0.65,}
                }
            },

        }
    }

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

    var t = 0;

    function get_rot_matrix(angle, x, y, z){
    	let c = Math.cos(angle);
    	let s = Math.sin(angle);
    	let C = 1-c;

    	let Q = math.matrix([[x*x*C+c, x*y*C-z*s, x*z*C+y*s],[x*y*C+z*s, y*y*C+c, y*z*C-x*s],[x*z*C-y*s, y*z*C+x*s, z*z*C+c]]);
    	return Q;
    };

    function get_rot_vector(angle){
    	let z = 0.5;
    	let r = 1;
    	
    	let Z = 0.8;
    	let R = 0.5;

    	length = Math.sqrt(Math.pow(r,2)+Math.pow(z,2));
    	r /= length;
    	z /= length;

    	return [R*Math.cos(angle), R*Math.sin(angle), Z,
    			r*Math.cos(angle), r*Math.sin(angle), z];
    };

    function get_data() {
    	let [X,Y,Z,u,v,w] = get_rot_vector(t/50);
        let Q = get_rot_matrix(t/30, u, v, w);

        let point = math.matrix([[0],[0],[1]]);
        var x = math.multiply(Q, point)["_data"][0][0];
        var y = math.multiply(Q, point)["_data"][1][0];
        var z = math.multiply(Q, point)["_data"][2][0];

        let data = [
            {//Spin angular momentum vector
                name: 'Spin Angular Momentum',
                type: 'scatter3d',
                mode: 'lines',
                line: {width: 10, color: 'rgb(0,0,0)', dash: 'solid'},
                x: [0, x],
                y: [0, y],
                z: [0, z],
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
