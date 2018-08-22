
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
                zaxis: {range: [-2,2]},
                camera: { eye: {
                    x: 1.5,
                    y: 1.5,
                    z: 0.65,}
                }
            },
        }
    };

    //Starts and stops the animation when button is pushed
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

    function get_rot_matrix(angle, vector){//Returns rotation matrix about an arbitrary axis
    	let [x,y,z] = vector.unit().toArray()
    	let c = Math.cos(angle);
    	let s = Math.sin(angle);
    	let C = 1-c;

    	let Q = math.matrix([[x*x*C+c, x*y*C-z*s, x*z*C+y*s],[x*y*C+z*s, y*y*C+c, y*z*C-x*s],[x*z*C-y*s, y*z*C+x*s, z*z*C+c]]);
    	return Q;
    };

    function angular_momentum(j, l, s, mj, t){//Returns the angular momentum vectors
    	
    	// angle between J vector and z-axis
    	let theta = Math.acos(mj/j);

    	// J vector
    	let J = new Vector(j*Math.sin(theta)*Math.cos(t), j*Math.sin(theta)*Math.sin(t), j*Math.cos(theta));
    	
    	// angles lambda opposite L and sigma opposite S in the JLS triangle
    	let lambda = Math.acos((j*j+s*s-l*l)/(2*j*s));
    	let sigma = Math.acos((j*j-s*s+l*l)/(2*j*l));

    	// L vector and S vector
    	let L = new Vector(l*Math.sin(theta+sigma)*Math.cos(t), l*Math.sin(theta+sigma)*Math.sin(t), l*Math.cos(theta+sigma));
    	let S = new Vector(s*Math.sin(theta-lambda)*Math.cos(t), s*Math.sin(theta-lambda)*Math.sin(t), s*Math.cos(theta-lambda));
    	
    	return [J,L,S];
    };

    function get_data() {
        let s = +$('#s').val();
        let l = +$('#l').val();
        let mj = +$('#mj').val();
        document.getElementById("j_variable_text").innerHTML = l + s;

        let [J,L,S] = angular_momentum(Math.sqrt((s+l)*(s+l+1)), Math.sqrt(l*(l+1)), Math.sqrt(s*(s+1)), mj, t/50);

        plt.layout.scene.xaxis.range = [-J.length(), J.length()];
        plt.layout.scene.yaxis.range = [-J.length(), J.length()];
        plt.layout.scene.zaxis.range = [-J.length(), J.length()];

        let [Jx,Jy,Jz] = J.toArray(3);

        let L_cone = {x: [], y: [], z: []};
        let S_cone = {x: [], y: [], z: []};
        let J_cone = {x: [], y: [], z: []};
        let Z = new Vector(0,0,1);

        for (let i=0; i<50; i++) {
        	L_cone.x.push(0); L_cone.y.push(0); L_cone.z.push(0);
        	S_cone.x.push(0); S_cone.y.push(0); S_cone.z.push(0);
			J_cone.x.push(0); J_cone.y.push(0); J_cone.z.push(0);

        	L_cone.x.push(L.linearTransform(get_rot_matrix(i,J))[0]);
        	L_cone.y.push(L.linearTransform(get_rot_matrix(i,J))[1]);
        	L_cone.z.push(L.linearTransform(get_rot_matrix(i,J))[2]);

        	S_cone.x.push(S.linearTransform(get_rot_matrix(i,J))[0]);
        	S_cone.y.push(S.linearTransform(get_rot_matrix(i,J))[1]);
        	S_cone.z.push(S.linearTransform(get_rot_matrix(i,J))[2]);

        	J_cone.x.push(J.linearTransform(get_rot_matrix(i,Z))[0]);
        	J_cone.y.push(J.linearTransform(get_rot_matrix(i,Z))[1]);
        	J_cone.z.push(J.linearTransform(get_rot_matrix(i,Z))[2]);
        };

        let Q = get_rot_matrix(t/20, J);
        
        let [Lx,Ly,Lz] = L.linearTransform(Q);
        let [Sx,Sy,Sz] = S.linearTransform(Q);
        
        let data = [
            {//J vector
                name: 'J',
                type: 'scatter3d',
                mode: 'lines',
                line: {width: 10, dash: 'solid', color: '#9400D3'},
                legendgroup: 'j',
                x: [0, Jx],
                y: [0, Jy],
                z: [0, Jz],
            },
            {//L vector
            	name: 'L',
            	type: 'scatter3d',
            	mode: 'lines',
            	line: {width: 10, dash: 'solid', color: '#0080FF'},
            	legendgroup: 'l',
            	x: [0, Lx],
            	y: [0, Ly],
            	z: [0, Lz],
            },
            {//L vector extension onto S
            	type: 'scatter3d',
            	mode: 'lines',
            	line: {width: 10, dash: 'dash', color: '#0080FF'},
            	legendgroup: 'l',
            	showlegend: false,
            	x: [Sx, Jx],
            	y: [Sy, Jy],
            	z: [Sz, Jz],
            },            
            {//S vector
            	name: 'S',
            	type: 'scatter3d',
            	mode: 'lines',
            	line: {width: 10, dash: 'solid', color: '#50C878'},
            	legendgroup: 's',
            	x: [0, Sx],
            	y: [0, Sy],
            	z: [0, Sz],
            },
          	{//S vector extension onto L
            	type: 'scatter3d',
            	mode: 'lines',
            	line: {width: 10, dash: 'dash', color: '#50C878'},
            	legendgroup: 's',
            	showlegend: false,
            	x: [Lx, Jx],
            	y: [Ly, Jy],
            	z: [Lz, Jz],
            },
        //];

        /* 
        mesh3d does not support legendgroup!
        Need to add a scatter data set with name "Cones", and have get_data
        check for getElementByID('graph').data["Cones"].visible == true or false
        and depending on the result push the following Cones data: */
            {//L vector cone
            	type: 'mesh3d',
            	color: '#0080FF',
            	opacity: 0.4,
            	x: L_cone.x,
            	y: L_cone.y,
            	z: L_cone.z,
            },
            {//S vector cone
            	type: 'mesh3d',
            	color: '#50C878',
            	opacity: 0.4,
            	x: S_cone.x,
            	y: S_cone.y,
            	z: S_cone.z,
            },
            {//J vector cone
            	type: 'mesh3d',
            	color: '#9400D3',
            	opacity: 0.4,
            	x: J_cone.x,
            	y: J_cone.y,
            	z: J_cone.z,
            },
        ];

        return data;
    };

    function select_disable() {//Enables/disables the different options in the selecters
        let s = +$('#s').val();
        let l = +$('#l').val();
        let j = s+l;

        for (let i = -8; i <= 8; i++) {
            if ((Math.abs(0.5*i % 1) == (j % 1)) && (Math.abs(0.5*i) <= j)) {
                document.getElementById("mj"+ 0.5*i).disabled=false;
            } else {
                document.getElementById("mj"+ 0.5*i).disabled=true;
            };
        };
        document.getElementById("mj").selectedIndex = 8-2*j;

        update_graph();
    };

    function initial() {//Plots the initial data and shifts from loading to container       
        Plotly.purge("graph")
        Plotly.newPlot('graph', get_data(), plt.layout)

        $('#spinner').hide();
        $('.container').show();//show container after loading finishes
    };

    function update_graph() {//Updates the data
        Plotly.animate('graph', 
        	{data: get_data()},
        	{
                fromcurrent: true,
                frame: {duration: 0, redraw: true,},
                transition: {duration: 0},
                mode: 'next', //Gives Uncaught errors with 'next' and 'immediate', but runs much slower with 'afterall'
            });

        if (playAnimation == true) {
            t++;
            requestAnimationFrame(update_graph);  
        };	
    };

    $("#s").on("change", select_disable);
    $("#l").on("change", select_disable);

    initial();
    update_graph();
    //requestAnimationFrame(update_graph);
    // Runs faster with update_graph() but probably runs safer with request
});
