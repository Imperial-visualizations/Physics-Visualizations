$(window).on('load', function() {//main
    const dom = {//assigning switches and slider

            pswitch: $("#polarisation-switch input"),
            aSlider: $("input#angle"),
            nSlider: $("input#refractive-index-ratio"),
            ampSlider:$("input#amplitude"),
            wSlider:$("input#angular_frequency")
        };
    plt = {//layout of graph
        layout : {
            showlegend: false,
            showscale: false,
            margin: {
                l: 1, r: 0, b: 0, t: 1, pad: 5
            },
            dragmode: 'orbit',
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-1, 1]},
                yaxis: {range: [-1, 1]},
                zaxis: {range: [-1, 1]},

                camera: {
                    up: {x:-1, y: 0, z: 0},//sets which way is up
                    eye: {x: -0.3, y: 2, z: 0.3}//adjust camera starting view
                }
            },
        }
    };

let polarisation_value = $("input[name = polarisation-switch]:checked").val();
let angle_of_incidence = parseFloat($("input#angle").val());
let refractive_ratio   = parseFloat($("input#refractive-index-ratio").val());
let amplitude   = parseFloat($("input#amplitude").val());
let angular_frequency   = parseFloat($("input#angular_frequency").val());

let c = 3e8; // Speed of light
let w_conversion = 6.92e5; // Factor to make plot wavelength reasonable
let size = 500;//give number of points

class Wave{
        constructor(theta, E_0, polarisation, w , n1, width, color,reflect){

        this.theta = theta;
        this.n1 = n1;
        this.E_0 = E_0;
        this.true_w = w;
        this.w = this.true_w / w_conversion;
        this.k = (n1 * this.w)/ c;
        this.B_0 = this.n1 * E_0;
        this.polarisation = polarisation;
        this.x_reflect = reflect;
        //need to find a way to make arrows
        this.sinusoids = this.create_sinusoids();
    };

    element_sine(matrix,size){
        for (let i = 0;i < size;i++){
            matrix[i] = math.sin(matrix[i]);
        }
        return matrix
    }

    create_sinusoids()//fix the math  np stuff
    {
        let z_range = numeric.linspace(0, 1, size);

        let zero = math.zeros(size);

        let k_z_sine = math.multiply(-1,this.element_sine(math.multiply(this.k,z_range),size));

        let E_sine,B_sine;

        if (this.polarisation === "s-polarisation") {
            E_sine = [zero, math.multiply(this.E_0,k_z_sine), z_range];
            B_sine = [math.multiply(this.B_0,k_z_sine),zero, z_range];
        }
        else{
            E_sine = [math.multiply(this.E_0,k_z_sine),zero, z_range];
            B_sine = [zero, math.multiply(this.B_0,k_z_sine), z_range];
        }


        let rot_E_sine = this.rotate_sinusoid(E_sine, this.theta, this.x_reflect);

        let rot_B_sine = this.rotate_sinusoid(B_sine, this.theta, this.x_reflect);

        //let rot_E_sine = E_sine

        //let rot_B_sine = B_sine

        let E_trace = [];
        //console.log(rot_E_sine[0]);
        //console.log(rot_E_sine[2]);

        E_trace.push(
            {//add trace for line of field line
            type: "scatter3d",
            mode: "lines",
            name: "e field",
            //line: {color: "#02893B"},
            x: rot_E_sine[0],
            y: rot_E_sine[1],
            z: rot_E_sine[2],
            opacity: 1,
            line: {
                width: 4,
                color: "#02893B",
                reversescale: false}
            }
        );

        let B_trace = [];
        B_trace.push(
            {//add trace for line of field line
            type: "scatter3d",
            mode: "lines",
            name: "b field",
            //line: {color: "#A51900"},
            x: rot_B_sine[0],
            y: rot_B_sine[1],
            z: rot_B_sine[2],
            opacity: 1,
            line: {
                width: 4,
                color: "#A51900",
                reversescale: false}
            }
        );
        return [E_trace, B_trace]
    };

    transmit(n2){
        this.n2 = n2;
        let theta_i = this.theta;
        let theta_t = this.snell(this.n1, this.n2, theta_i);

        console.log("transmit-transmit angle");
        console.log(theta_t);

        if (isNaN(theta_t) === true){
            console.log('Total internal reflection');
            return false
        }
        else {
            let plot_theta_t = Math.PI + theta_t;

            let E_t0;

            if (this.polarisation === "s-polarisation") {
                E_t0 = this.E_0 * (2. * this.n1 * Math.cos(theta_i)) / (this.n1 * Math.cos(theta_i) + this.n2 * Math.cos(theta_t))
            } else {
                E_t0 = this.E_0 * (2. * this.n1 * Math.cos(theta_i)) / (this.n1 * Math.cos(theta_t) + this.n2 * Math.cos(theta_i))
            }

            return new Wave(plot_theta_t, E_t0, this.polarisation, this.true_w, this.n2, 2, "#EC7300", true)
        }

       };//(theta, E_0, polarisation, w , n1, width, color,reflect)

    reflect(n2)
    {
        this.n2 = n2;

        if (this.n1 === this.n2) {
            console.log('Refractive indices equal - no reflection');
            return false
        }
        else {
            let theta_i = this.theta;
            let theta_r = theta_i;
            let theta_t = this.snell(this.n1, this.n2, theta_i);
            let plot_theta_r = -theta_r;
            //console.log("reflect-transmit_angle");
            //console.log(theta_t);

            let E_r0;

            if (isNaN(theta_t) === true){
                console.log("snell-not a number")
                E_r0 = this.E_0
            }
            else if (this.polarisation === "s-polarisation") {
                E_r0 = this.E_0 * (this.n1 * Math.cos(theta_i) - this.n2 * Math.cos(theta_t)) / (this.n1 * Math.cos(theta_i) + this.n2 * Math.cos(theta_t))
            }
            else {
                E_r0 = this.E_0 * (this.n1 * Math.cos(theta_t) - this.n2 * Math.cos(theta_i)) / (this.n1 * Math.cos(theta_t) + this.n2 * Math.cos(theta_i))
            }

            console.log(E_r0);

            return new Wave(plot_theta_r, E_r0, this.polarisation, this.true_w, this.n1, 2, "#EC7300", true)
        }
    };//(theta, E_0, polarisation, w , n1, width, color,reflect)


    snell(n1, n2, theta_i)
    {
        return Math.asin((n1 / n2) * Math.sin(theta_i))
    };



    rotate_sinusoid(sinusoid, theta, x_reflect)
    {
        let rotation_matrix = [[Math.cos(theta), 0, Math.sin(theta)], [0, 1, 0], [-Math.sin(theta), 0, Math.cos(theta)]];

        let copy = math.transpose(sinusoid);

        if (x_reflect === false) {
            for (let i = 0;i<size;i++){

                copy[i] = math.multiply(copy[i],rotation_matrix);//is this doing it correctly???
            }
        }

        else if(x_reflect === true) {
            let x_reflect_matrix = [[1, 0, 0],
                [0, -1, 0],
                [0, 0, 1]];

            let transf_matrix = math.multiply(x_reflect_matrix, rotation_matrix);

            for (let i = 0;i<size;i++){
                copy[i] = math.multiply(copy[i],transf_matrix);
            }
        }

        let rotated = math.transpose(copy);
        return  rotated
    };
}

function computeData() {

    $("#angle-display").html($("input#angle").val().toString()+"°");
    $("#refractive-index-ratio-display").html($("input#refractive-index-ratio").val().toString());

    $("#amplitude-display").html($("input#amplitude").val().toString());
    $("#angular_frequency-display").html($("input#angular_frequency").val().toString());


    polarisation_value = $("input[name = polarisation-switch]:checked").val();
    angle_of_incidence = parseFloat($("input#angle").val());
    refractive_ratio   = parseFloat($("input#refractive-index-ratio").val());

    amplitude   = parseFloat($("input#amplitude").val());
    angular_frequency = parseFloat($("input#angular_frequency").val());


    let rad_angle = Math.PI * (angle_of_incidence / 180);
    let Incident = new Wave(rad_angle, amplitude, polarisation_value, angular_frequency*1e15, refractive_ratio/refractive_ratio, 2, "#EC7300", true);//(theta, E_0, polarisation, w , n1, width, color,reflect)

    let Reflected = Incident.reflect(refractive_ratio);
    let Transmitted = Incident.transmit(refractive_ratio);

    let surface = [];
    surface.push(
        {//boundary
            opacity: 0.2,
            color: '#379F9F',
            type: "mesh3d",
            name: "boundary",
            x: [-1, 1, 1, -1],//[0, 0, 0, 0],
            y: [-1, -1, 1, 1],
            z: [0, 0, 0, 0],//[-1, 1, 1, -1],
            i: [0, 1, 2, 3],
            j: [1, 2, 3, 0],
            k: [2, 3, 0, 1],
        }
    );

    let plot_data;

    if (Transmitted === false) {
        plot_data = Incident.sinusoids[0].concat(Incident.sinusoids[1],Reflected.sinusoids[0],Reflected.sinusoids[1],surface);
        console.log("no transmit");
    }

    else if (Reflected === false) {
        plot_data =  Incident.sinusoids[0].concat(Incident.sinusoids[1],Transmitted.sinusoids[0],Transmitted.sinusoids[1],surface);
        console.log("transmit, no reflect");
    }
    else {
        plot_data = Incident.sinusoids[0].concat(Incident.sinusoids[1],Transmitted.sinusoids[0],Transmitted.sinusoids[1],Reflected.sinusoids[0],Reflected.sinusoids[1],surface);
        console.log("transmit and reflect");
    }

    if (plot_data.length < 7) {//animate function requires data sets of the same length hence those unused in situation must be filled with empty traces
        var extensionSize = plot_data.length;// 103 represents the maximum traces necessary 2(top and lower capacitor)+1(dielectric)+25(top field line lines)+25(top field line arrows)+25(bottom field line lines)+25(bottom field line arrows)
        for (let i = 0; i < (7 - extensionSize); ++i) {
            plot_data.push(
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

    return plot_data
}

function update_graph(){

        Plotly.animate("graph",
            {data: computeData()},//updated data
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );
        console.log("end");
    }

function initial(){

    Plotly.purge("graph")
    Plotly.newPlot('graph', computeData(), plt.layout);

    $('#spinner').hide();
    $('.container').show();//show container after loading finishes
    $('.rightnav').show();


    dom.pswitch.on("change", update_graph);//on any change the graph will update
    dom.aSlider.on("input", update_graph);
    dom.nSlider.on("input", update_graph);
    dom.ampSlider.on("input", update_graph);
    dom.wSlider.on("input",update_graph);

    }

initial();//run the initial loading

});