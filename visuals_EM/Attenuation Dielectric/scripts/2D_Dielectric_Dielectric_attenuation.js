$(window).on('load', function() {//main
    const dom = {
            tswitch: $("#wave-switch input"),
            aSlider: $("input#angle"),//angle slider
            afSlider: $("input#angular_frequency"),
    };

    let plt = {
        layout: {
            showlegend: false,
            showscale: false,
            colorbar: false,
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-2, 2]},
                yaxis: {range: [-2, 2]},
                zaxis: {range: [-2, 2]},
                camera: {
                    eye: {x: -1.2, y: 1.2, z: 1}//adjust camera starting view
                }
            },
        }
    };

    let size = 100;
    let t = 0;
    let isPlay = false;
    let E_0 = 1;
    let w_0 = 6e9;//gives properties of material
    let gamma = 0.1*w_0;
    let wd = 0.2*w_0;
    let w_d_squared = wd**2;
    let n1 = 1;//material before input dielectric
    let c = 3e8; // Speed of light
    let n2,k;

    let condition =  $("input[name = wave-switch]:checked").val();
    let angle_of_incidence = parseFloat($("input#angle").val());
    let angular_frequency_ratio = parseFloat($("input#angular_frequency").val())* w_0;
    let w_r = parseFloat($("input#angular_frequency").val());

    function snell(theta_i){//snells law
        return Math.asin((n1 / n2) * Math.sin(theta_i));

    };

    function element_exponential(matrix,size){//take exponential of element in matrix
        for (let i = 0;i < size;i++){
            matrix[i] = math.exp(matrix[i]);
        }
    return matrix
    }

    function getData_wave_incident(x_data,y_data,theta,E_0){//produce daa of incident wave

        let z,z_square = [];
        let k_x = Math.cos(theta)*k;
        let k_y = Math.sin(theta)*k;

        for (let v=0;v < y_data.length ;v++) {
            let z_row = [];
            for (let i = 0; i < x_data.length ; i++) {
                z = E_0* Math.sin(k_x* x_data[i]+k_y*y_data[v]+w_r*t);
                z_row.push(z);
            }
            z_square.push(z_row);
        }
        return z_square
    }

    function getData_wave_reflected(x_data,y_data,theta,E_0){//produce data of reflected

        let z,z_square = [];
        let k_x = Math.cos(theta)*k;
        let k_y = Math.sin(theta)*k;

        for (let v=0;v < y_data.length ;v++) {
            let z_row = [];
            for (let i = 0; i < x_data.length ; i++) {
                z = E_0* Math.sin(k_x* x_data[i]+k_y*y_data[v]-w_r*t);
                z_row.push(z);
            }
            z_square.push(z_row);
        }
        return z_square
    }

    function getData_wave_transmitted(x_data,y_data,theta,E_0,decay){//produce data of transmitted. NEED TO CHECK PHYSICS FOR OVER CRITICAL ANGLE
        let z,z_square = [];
        let k_x = Math.cos(theta)*k;
        let k_y = Math.sin(theta)*k;

        for (let v=0;v < y_data.length ;v++) {
            let z_row = [];
            for (let i = 0; i < x_data.length ; i++) {
                z = E_0* Math.sin(k_x* x_data[i]+k_y*y_data[v]+w_r*t);
                z_row.push(z);
            }
            z_square.push(math.dotMultiply(decay,z_row));//Not entirelly sure the physics is correct need to review
        }
        return z_square
    }

    function transmit(theta){
        let theta_i = theta;
        let theta_t = snell(theta_i);
        let E_t0;

        if (isNaN(theta_t) === true){//if snells law return not a number this means total internal refection is occurring hence no transmitted wave
                return 0
        }
        else {
                E_t0 = E_0 * (2. * n1 * Math.cos(theta_i)) / (n1 * Math.cos(theta_i) + n2 * Math.cos(theta_t))
            return E_t0//create transmitted wave
        }
       };

    function reflect(theta) {
        if (n1 === n2) {//if both materials have same refractive index then there is no reflection
            return 0
        }
        else {
            let theta_i = theta;
            let theta_t = snell(theta_i);
            let E_r0;
            if (isNaN(theta_t) === true){
                E_r0 = E_0;
            }
            else {
                E_r0 = E_0 * (n1 * Math.cos(theta_i) - n2 * Math.cos(theta_t)) / (n1 * Math.cos(theta_i) + n2 * Math.cos(theta_t))
            }
            return E_r0//create reflected wave
        }
    };

    function find_conditions() {//produces the conditions of the wave given the input angular frequency
            let z_range = numeric.linspace(0, -2, size)
            let w = angular_frequency_ratio;
            //calculate real refractive index
            let n_real = 1 - (w_d_squared * (Math.pow(w, 2) - Math.pow(w_0, 2)) / (Math.pow((Math.pow(w, 2) - Math.pow(w_0, 2)), 2) + Math.pow(w, 2) * Math.pow(gamma, 2)));
            //calculate imaginary refractive index
            let n_im = (w_d_squared * w * gamma) / (Math.pow((Math.pow(w, 2) - Math.pow(w_0, 2)), 2) + Math.pow(w, 2) * Math.pow(gamma, 2));

            let k_real = (w * n_real) / c;

            let k_im = (w * n_im) / (c);

            let exp_E = element_exponential(math.multiply(k_im, z_range), size);//exponential decay of amplitude
        return [n_real,k_real,exp_E]
    }

    function plot_data() {//plot traces

        $("#angle-display").html($("input#angle").val().toString()+"°");//update display
        $("#angular_frequency-display").html($("input#angular_frequency").val().toString());

        condition =  $("input[name = wave-switch]:checked").val();//update value of constants
        angle_of_incidence = parseFloat($("input#angle").val());
        angular_frequency_ratio = parseFloat($("input#angular_frequency").val())* w_0;
        w_r = parseFloat($("input#angular_frequency").val());

        let properties = find_conditions();
        n2 = properties[0];
        k = properties[1];

        $("#refractive_index_ratio-display").html(n2.toFixed(2));//update value of refractive index

        if (isNaN(Math.asin(n2))=== true){//update value of citical angle
            $("#critical_angle-display").html("No Total Internal Reflection possible");
        }else{
            $("#critical_angle-display").html(((180*Math.asin(n2))/Math.PI).toFixed(2).toString()+"°");
        }


        let x_data = numeric.linspace(2, 0, size);
        let y_data = numeric.linspace(-2, 2, size);
        let rad_angle = Math.PI * (angle_of_incidence / 180);
        let data = [];

        if (condition === "incident") {
            let incident_wave = { //multiple traces
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_incident(x_data, y_data, rad_angle,E_0),
                type: 'surface',
                name: "Incident"
            };
            data.push(incident_wave);
        }
        else if(condition === "reflected") {
            let reflected_wave = { //multiple traces
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_reflected(x_data, y_data, -rad_angle, reflect(rad_angle)),
                type: 'surface',
                name: "Reflected"
            };
            data.push(reflected_wave);
        }
        else{
            let incident_plus_reflected_wave = {
                opacity: 1,
                x: x_data,
                y: y_data,
                z: math.add(getData_wave_incident(x_data,y_data,rad_angle,E_0),getData_wave_reflected(x_data,y_data,-rad_angle,reflect(rad_angle))),
                type: 'surface',
                name:"Reflected and Incident combined"
            };
            data.push(incident_plus_reflected_wave);
        }

        let transmitted_wave = {
            opacity: 1,
            x: math.add(-2,x_data),
            y: y_data,
            z: getData_wave_transmitted(math.add(-2,x_data),y_data,snell(rad_angle),transmit(rad_angle),properties[2]),
            type: 'surface',
            name:"Transmitted"
        };

        let opacity_1;//opacity is based off the refractive index gives qualatative representation
        let opacity_2;
        if((1 < n2) && (n2 <= 15)){//decide opacity dependant on refractive index
            opacity_1 = 0;
            opacity_2 = n2/5
        }
        else if((0.1 <= n2) && (n2< 1)){
            opacity_1 = 0.4/n2;
            opacity_2 = 0;
        }
        else{
            opacity_1 = 0;
            opacity_2 = 0;
        }

        let material_1 =//first dielectric material
            {
                opacity: opacity_1,
                color: '#379F9F',
                type: "mesh3d",
                name: "material 1",
                z: [-2, -2, 2, 2, -2, -2, 2, 2],
                y: [-2, 2, 2, -2, -2, 2, 2, -2],
                x: [2, 2, 2, 2, 0, 0, 0, 0],
                i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
                j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
            };
        let material_2 =//second dielectric material
            {
                opacity: opacity_2,
                color: '#379F9F',
                type: "mesh3d",
                name: "material 2",
                z: [-2, -2, 2, 2, -2, -2, 2, 2],
                y: [-2, 2, 2, -2, -2, 2, 2, -2],
                x: [0, 0, 0, 0, -2, -2, -2, -2],
                i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
                j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
            };


        data.push(transmitted_wave,material_1,material_2);

        if (data.length < 5) {//animate function requires data sets of the same length hence those unused in situation must be filled with empty traces
            let extensionSize = data.length;
            for (let i = 0; i < (5 - extensionSize); ++i){
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

    return data
    }

    function update_graph(){//update animation
        Plotly.animate("graph",
            {data: plot_data()},//updated data
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );
    };

    function play_loop(){
        if(isPlay === true) {
            t++;
            Plotly.animate("graph",
                {data: plot_data()},
                {
                    fromcurrent: true,
                    transition: {duration: 0,},
                    frame: {duration: 0, redraw: false,},
                    mode: "afterall"
                });
            requestAnimationFrame(play_loop);//loads next frame
        }
        return 0;
    };

    function initial() {
        Plotly.purge("graph");
        Plotly.newPlot('graph', plot_data(),plt.layout);//create animation

        dom.tswitch.on("change", update_graph);
        dom.aSlider.on("input", update_graph);
        dom.afSlider.on("input", update_graph);

        $('#playButton').on('click', function() {
            document.getElementById("playButton").value = (isPlay) ? "Play" : "Stop";//change play/stop label
            isPlay = !isPlay;
            t = 0;//reset time
            requestAnimationFrame(play_loop);
        });
    };
initial();
});