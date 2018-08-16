
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
                zaxis: {range: [0,4]},
                camera: { eye: {//adjust eye so that more of the capacitor is seen
                    x: 1.5,
                    y: 1.5,
                    z: 0.65,}
                }
            },
        }
    };

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

    function get_rot_matrix(angle, vector){
    	let [x,y,z] = vector.unit().toArray()
    	let c = Math.cos(angle);
    	let s = Math.sin(angle);
    	let C = 1-c;

    	let Q = math.matrix([[x*x*C+c, x*y*C-z*s, x*z*C+y*s],[x*y*C+z*s, y*y*C+c, y*z*C-x*s],[x*z*C-y*s, y*z*C+x*s, z*z*C+c]]);
    	return Q;
    };

    function get_rot_vector(R, r, d, theta, t){
    	// j vector
    	let j = new Vector((R+r)*Math.sin(theta)*Math.cos(t), (R+r)*Math.sin(theta)*Math.sin(t), (R+r)*Math.cos(theta));

    	// j component of angular momentum
    	let Lj = j.unit().multiply(R);

    	// angular momentum vector (horizontally rotated)
    	let Lhor = Lj.horNormal().multiply(d).add(Lj);

    	return [j,Lj,Lhor];
    };

    function get_data() {
        let [j,Lj,Lhor] = get_rot_vector(2, 1, 0.5, Math.PI/8, t/100);
        
        let [jx,jy,jz] = j.toArray(3);
        let [Ljx, Ljy, Ljz] = Lj.toArray(3);

        let Q = get_rot_matrix(t/20, j);
        let [Lx,Ly,Lz] = Lhor.linearTransform(Q);

        let data = [
            {//Spin angular momentum vector
                name: 'Spin Angular Momentum',
                type: 'scatter3d',
                mode: 'lines',
                line: {width: 10, color: 'rgb(0,0,0)', dash: 'solid'},
                x: [0, Lx],
                y: [0, Ly],
                z: [0, Lz],
            },
            {//j vector
            	type: 'scatter3d',
            	mode: 'lines',
            	line: {width: 10, color: 'rgb(150,0,0)', dash: 'solid'},
            	x: [0, jx],
            	y: [0, jy],
            	z: [0, jz],
            },
            {//Orbital angular momentum vector
            	type: 'scatter3d',
            	mode: 'lines',
            	line: {width: 10, color: 'rgb(0,0,0)', dash: 'dash'},
            	x: [Lx, jx],
            	y: [Ly, jy],
            	z: [Lz, jz],
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
        Plotly.restyle('graph', 
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
