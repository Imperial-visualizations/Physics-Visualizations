$(window).on('load', function() {//main
    const dom = {//assigning switches and slider

            pswitch: $("#polarisation-switch input"),//polarisation switch
            aSlider: $("input#angle"),//angle slider
            nSlider: $("input#refractive-index-ratio"),//refractive index slider

        };
    let plt = {//layout of graph
        layout : {
            showlegend: false,
            showscale: false,
            margin: {
                l: 10, r: 10, b: 10, t: 1, pad: 5
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
        },

        layoutFres: {//layout of fresnel graph
                autosize: true,
                xaxis: {
                    range: [0, 90],
                    title: "Angle"
                },
                yaxis: {
                   range: [-1, 2.1]
                },
                margin: {
                   l: 50, r: 10, b: 10, t: 1, pad: 5
               },
               legend: {
                   x: 0, y: 10,
                   orientation: "h"
               },
               font: {
                   family: "Fira Sans",
                   size: 16
               }
            }
    };

let polarisation_value = $("input[name = polarisation-switch]:checked").val();//create variables corresponding to sliders and switches
let angle_of_incidence = parseFloat($("input#angle").val());
let refractive_ratio   = parseFloat($("input#refractive-index-ratio").val());

let amplitude   = 0.1;//set amplitude of EM wave
let angular_frequency  = 4;

let c = 3e8; // Speed of light
let w_conversion = 6.92e5; // Factor to make plot wavelength reasonable
let size = 1000;//give number of points

class Wave{
        constructor(theta, E_0, polarisation, w , n1){
        this.theta = theta;
        this.n1 = n1;
        this.E_0 = E_0;
        this.true_w = w;
        this.w = this.true_w / w_conversion;
        this.k = (n1 * this.w)/ c;
        this.B_0 = E_0;// for simplicity B and E field are the same magnitude
        this.polarisation = polarisation;
        this.sinusoids = this.create_sinusoids(this.n2);
    };

    element_sine(matrix,size){//take element sine in matrix (cosine and sine interchangeable)
        for (let i = 0;i < size;i++){
            matrix[i] = math.sin(matrix[i]);
        }
        return matrix
    }

    create_sinusoids()//crate waves
    {
        let z_range = numeric.linspace(0, 1, size);
        let zero = math.zeros(size);
        let k_z_sine = math.multiply(-1,this.element_sine(math.multiply(this.k,z_range),size));//make sine matrix
        let E_sine,B_sine;
        let rot_E_sine;
        let rot_B_sine;

        if (this.polarisation === "s-polarisation") {//polarisation determines plane of oscillation
            E_sine = [zero, math.multiply(this.E_0, k_z_sine), z_range];
            B_sine = [math.multiply(this.B_0,k_z_sine), zero, z_range];

            rot_E_sine = this.rotate_sinusoid(E_sine, this.theta);//rotate waves to appropriate angle
            rot_B_sine = this.rotate_sinusoid(B_sine, this.theta);
            }
        else{
            E_sine = [math.multiply(this.E_0, k_z_sine), zero, z_range];
            B_sine = [zero, math.multiply(this.B_0, k_z_sine), z_range];
            rot_E_sine = this.rotate_sinusoid(E_sine, this.theta);
            rot_B_sine = this.rotate_sinusoid(B_sine, this.theta);
            }

        let E_trace = [];

        E_trace.push(
            {//electric field trace
            type: "scatter3d",
            mode: "lines",
            name: "e field",
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
            {//magnetic field trace
            type: "scatter3d",
            mode: "lines",
            name: "b field",
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

        return [E_trace, B_trace] //return traces
    };

    transmit(n2){

        this.n2 = n2;
        let theta_i = this.theta;
        let theta_t = snell(this.n1, this.n2, theta_i);
        let plot_theta_t = Math.PI + theta_t;
        let E_t0;

        if (isNaN(theta_t) === true){//if snells law return not a number this means total internal refection is occurring hence no transmitted wave
                return false
        }
        else {
            if (this.polarisation === "s-polarisation") {//change amplitude
                E_t0 = this.E_0 * (2. * this.n1 * Math.cos(theta_i)) / (this.n1 * Math.cos(theta_i) + this.n2 * Math.cos(theta_t))
            } else {
                E_t0 = this.E_0 * (2. * this.n1 * Math.cos(theta_i)) / (this.n1 * Math.cos(theta_t) + this.n2 * Math.cos(theta_i))
            }
            return new Wave(plot_theta_t, E_t0, this.polarisation, this.true_w, this.n2, 2)//create transmitted wave
        }
       };

    reflect(n2)
    {
        this.n2 = n2;

        if (this.n1 === this.n2) {//if both materials have same refractive index then there is no reflection
            return false
        }
        else {
            let theta_i = this.theta;
            let theta_r = theta_i;
            let theta_t = snell(this.n1, this.n2, theta_i);
            let plot_theta_r = -theta_r;

            let E_r0;

            if (isNaN(theta_t) === true){
                E_r0 = this.E_0
            }
            else if (this.polarisation === "s-polarisation") {
                E_r0 = this.E_0 * (this.n1 * Math.cos(theta_i) - this.n2 * Math.cos(theta_t)) / (this.n1 * Math.cos(theta_i) + this.n2 * Math.cos(theta_t))
            }
            else {
                E_r0 = this.E_0 * (this.n1 * Math.cos(theta_t) - this.n2 * Math.cos(theta_i)) / (this.n1 * Math.cos(theta_t) + this.n2 * Math.cos(theta_i))
            }

            return new Wave(plot_theta_r, E_r0, this.polarisation, this.true_w, this.n1, 2)//create reflected wave
        }
    };

    rotate_sinusoid(sinusoid, theta)//rotate the sine waves
    {
        let rotation_matrix = [[Math.cos(theta), 0, Math.sin(theta)], [0, 1, 0], [-Math.sin(theta), 0, Math.cos(theta)]];//create rotation matrix
        let copy = math.transpose(sinusoid);

        for (let i = 0;i<size;i++){
            copy[i] = math.multiply(copy[i],rotation_matrix);//multiply row of position by rotation matrix
        }

        let rotated = math.transpose(copy);
        return  rotated
    };
}


function computeData() {

    $("#angle-display").html($("input#angle").val().toString()+"°");//update display
    $("#refractive-index-ratio-display").html($("input#refractive-index-ratio").val().toString());

    polarisation_value = $("input[name = polarisation-switch]:checked").val();//update variables
    angle_of_incidence = parseFloat($("input#angle").val());
    refractive_ratio   = parseFloat($("input#refractive-index-ratio").val());

    let rad_angle = Math.PI * (angle_of_incidence / 180);

    let Incident = new Wave(rad_angle, amplitude, polarisation_value, angular_frequency*1e15, refractive_ratio/refractive_ratio, 2);//create incident wave
    let Reflected = Incident.reflect(refractive_ratio);//create reflected wave
    let Transmitted = Incident.transmit(refractive_ratio);//create transmitted wave

    let opacity_1;
    let opacity_2;

    if((1 < refractive_ratio) && (refractive_ratio <= 2)){//decide opacity dependant on refractive index
        opacity_1 = 0;
        opacity_2 = refractive_ratio/5
    }
    else if((0.5 <= refractive_ratio) && (refractive_ratio< 1)){
        opacity_1 = 0.2/refractive_ratio;
        opacity_2 = 0;
    }
    else{
        opacity_1 = 0;
        opacity_2 = 0;
    }

    let material_1 = [];
    material_1.push(
        {//material_1 trace
            opacity: opacity_1,
            color: '#379F9F',
            type: "mesh3d",
            name: "material_1",
            x: [-1, -1, 1, 1, -1, -1, 1, 1],
            y: [-1, 1, 1, -1, -1, 1, 1, -1],
            z: [ 1, 1, 1, 1, 0, 0, 0, 0,],
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        }
    );

    let material_2 = [];
    material_2.push(
        {//material_2 trace
            opacity: opacity_2,
            color: '#379F9F',
            type: "mesh3d",
            name: "material_2",
            x: [-1, -1, 1, 1, -1, -1, 1, 1],
            y: [-1, 1, 1, -1, -1, 1, 1, -1],
            z: [0, 0, 0, 0, -1, -1, -1, -1],
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        }
    );

    let plot_data;

    if (Reflected === false) {//both materials have same refractive index
        plot_data =  Incident.sinusoids[0].concat(Incident.sinusoids[1],Transmitted.sinusoids[0],Transmitted.sinusoids[1],material_1,material_2);
    }
    else if (Transmitted === false){//total internal reflection
        plot_data =  Incident.sinusoids[0].concat(Incident.sinusoids[1],Reflected.sinusoids[0],Reflected.sinusoids[1],material_1,material_2);
    }

    else {//incident wave is reflected and refracted
        plot_data = Incident.sinusoids[0].concat(Incident.sinusoids[1],Transmitted.sinusoids[0],Transmitted.sinusoids[1],Reflected.sinusoids[0],Reflected.sinusoids[1],material_1,material_2);
    }

    if (plot_data.length < 8) {//animate function requires data sets of the same length hence those unused in situation must be filled with empty traces
        var extensionSize = plot_data.length;
        for (let i = 0; i < (8 - extensionSize); ++i){
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

function snell(n1, n2, theta_i){//snells law
    return Math.asin((n1 / n2) * Math.sin(theta_i))
};

function compute_fresnel(){//produce data for fresnel curves

        let theta_i = Math.PI * (angle_of_incidence / 180);
        let theta_t = snell(refractive_ratio/refractive_ratio,refractive_ratio,theta_i);

        let t,r,t_marker,r_marker;
        let ratio = refractive_ratio;

        let data = [[],[],[]];
        let crit_angle = (180*Math.asin(refractive_ratio))/Math.PI;
        let angle_max = parseFloat($("#angle").attr("max"));

        if (polarisation_value === "s-polarisation"){//depending on condition of wave different coefficients produced
            if (refractive_ratio <1) {
                if (angle_of_incidence<crit_angle){
                    t_marker = (2 * Math.cos(theta_i)) / (Math.cos(theta_i) + (ratio * Math.cos(theta_t)));
                    r_marker = (Math.cos(theta_i) - ratio * Math.cos(theta_t)) / (Math.cos(theta_i) + ratio * Math.cos(theta_t));
                }
                else{
                    t_marker = 0;
                    r_marker = 1;
                }
            }
            else{
                    t_marker = (2 * Math.cos(theta_i)) / (Math.cos(theta_i) + (ratio * Math.cos(theta_t)));
                    r_marker = (Math.cos(theta_i) - ratio * Math.cos(theta_t)) / (Math.cos(theta_i) + ratio * Math.cos(theta_t));
            }
        }else{
            if (refractive_ratio <1) {
                if (angle_of_incidence<crit_angle){
                    t_marker = 2 * Math.cos(theta_i) / (Math.cos(theta_t) + (ratio * Math.cos(theta_i)));
                    r_marker = (Math.cos(theta_t) - ratio * Math.cos(theta_i)) / (Math.cos(theta_t) + ratio * Math.cos(theta_i));
                }
                else{
                    t_marker =0;
                    r_marker =1;
                }
            }
            else{
                t_marker = 2 * Math.cos(theta_i) / (Math.cos(theta_t) + (ratio * Math.cos(theta_i)));
                r_marker = (Math.cos(theta_t) - ratio * Math.cos(theta_i)) / (Math.cos(theta_t) + ratio * Math.cos(theta_i));
            }
        };


        if (polarisation_value === "s-polarisation"){
            if (refractive_ratio <1) {
                for (let i = 0; i < crit_angle; i++) {
                    let i_rad =  Math.PI * (i / 180);
                    let t_angle = snell(refractive_ratio/refractive_ratio,refractive_ratio,i_rad);
                    t = (2 * Math.cos(i_rad)) / (Math.cos(i_rad) + (ratio * Math.cos(t_angle)));
                    r = (Math.cos(i_rad) - ratio * Math.cos(t_angle)) / (Math.cos(i_rad) + ratio * Math.cos(t_angle));
                    data[0].push(i);
                    data[1].push(t);
                    data[2].push(r);
                }
                for (let i = crit_angle; i < angle_max; i++) {
                    t = 0;
                    r = 1;
                    data[0].push(i);
                    data[1].push(t);
                    data[2].push(r);
                }
            }
            else{
                for (let i = 0; i < angle_max; i++) {
                    let i_rad =  Math.PI * (i / 180);
                    let t_angle = snell(refractive_ratio/refractive_ratio,refractive_ratio,i_rad);
                    t = (2 * Math.cos(i_rad)) / (Math.cos(i_rad) + (ratio * Math.cos(t_angle)));
                    r = (Math.cos(i_rad) - ratio * Math.cos(t_angle)) / (Math.cos(i_rad) + ratio * Math.cos(t_angle));
                    data[0].push(i);
                    data[1].push(t);
                    data[2].push(r);
                }
            }
        }else{
            if (refractive_ratio<1) {
                for (let i = 0; i < crit_angle; i++) {
                    let i_rad =  Math.PI * (i / 180);
                    let t_angle = snell(refractive_ratio/refractive_ratio,refractive_ratio,i_rad);
                    t = 2 * Math.cos(i_rad) / (Math.cos(t_angle) + (ratio * Math.cos(i_rad)));
                    r = (Math.cos(t_angle) - ratio * Math.cos(i_rad)) / (Math.cos(t_angle) + ratio * Math.cos(i_rad));
                    data[0].push(i);
                    data[1].push(t);
                    data[2].push(r);
                }
                for (let i = crit_angle; i < angle_max; i++) {
                    t = 0;
                    r = 1;
                    data[0].push(i);
                    data[1].push(t);
                    data[2].push(r);
                }
            }
            else{
                for (let i = 0; i < angle_max; i++) {
                    let i_rad =  Math.PI * (i / 180);
                    let t_angle = snell(refractive_ratio/refractive_ratio,refractive_ratio,i_rad);
                    t = 2 * Math.cos(i_rad) / (Math.cos(t_angle) + (ratio * Math.cos(i_rad)));
                    r = (Math.cos(t_angle) - ratio * Math.cos(i_rad)) / (Math.cos(t_angle) + ratio * Math.cos(i_rad));
                    data[0].push(i);
                    data[1].push(t);
                    data[2].push(r);
                }
            }
        };

        let Transmission = {
          x: data[0],
          y: data[1],
          type: 'scatter',
          name: 'Transmission coefficient',
        };

        let marker_transmission = {//marker follows current value of angle
            x: [angle_of_incidence],
            y: [t_marker],
            showlegend: false,
            type: "scatter",
            mode:"markers",
            name: 'Transmission coefficient',
            marker: {color: "#002147", size: 12}
        };

        let Reflection = {
          x: data[0],
          y: data[2],
          type: 'scatter',
          name: 'Reflection coefficient',
        };

        let marker_reflection = {
            x: [angle_of_incidence],
            y: [r_marker],
            showlegend: false,
            type: "scatter",
            mode: "markers",
            name: 'Reflection coefficient',
            marker: {color: "#002147", size: 12}
        };
    let fresnel_data = [Transmission,marker_transmission,Reflection,marker_reflection]

    return fresnel_data
};

function update_graph(){//update animation

        Plotly.animate("graph",
            {data: computeData()},//updated data
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );
    }

function update_graph_fresnel(){//update fresnel graph
    Plotly.animate("graph_fresnel",
        {data: compute_fresnel()},//updated data
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
}

function initial(){

    Plotly.purge("graph");
    Plotly.newPlot('graph', computeData(), plt.layout);//create animation

    Plotly.purge("graph_fresnel");
    Plotly.newPlot("graph_fresnel", compute_fresnel(),plt.layoutFres);//create fresnel curves

    $('#spinner').hide();
    $('.container').show();//show container after loading finishes
    $('.rightnav').show();


    dom.pswitch.on("change", update_graph);//on any change the graph will update
    dom.aSlider.on("input", update_graph);
    dom.nSlider.on("input", update_graph);

    dom.aSlider.on("input", update_graph_fresnel);//update fresnel graph
    dom.nSlider.on("input", update_graph_fresnel);

    }

initial();//run the initial loading

});