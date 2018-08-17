$(window).on('load', function() {//main
    const dom = {//define inputs
            tswitch: $("#wave-switch input"),
            aSlider: $("input#angle"),//angle slider
            nSlider: $("input#refractive-index-ratio"),
    };

    let layout = {//define layout of pot
            showlegend: false,
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-2, 2]},
                yaxis: {range: [-2, 2]},
                zaxis: {range: [-2, 2]},
                camera: {
                    eye: {x: 0, y: 0, z: -2}//adjust camera starting view
                }
            },
    };
    //define constants
    let size = 100;
    let w_t = 0;
    let isPlay = false;
    let E_0 = 0.5;
    let wavelength = 0.7;
    let n1 = 1;
    let x_points = numeric.linspace(2, 0, size);//x and y data is always the same and just change z
    let y_points = numeric.linspace(-2, 2, size);

    //constants based of of inputs
    let condition =  $("input[name = wave-switch]:checked").val();
    let angle_of_incidence = parseFloat($("input#angle").val());
    let n2 = parseFloat($("input#refractive-index-ratio").val());

    function snell(theta_i){//snells law
        console.log(Math.sin(theta_i));
        console.log((n1 / n2))
        return Math.asin((n1 / n2) * Math.sin(theta_i));

    };

    function getData_wave_incident(x_data,y_data,theta,E_0){//produces data for the incident wave on the boundry

        let z,z_square = [];
        let k_x = (2*Math.PI*Math.cos(theta))/wavelength;
        let k_y = (2*Math.PI*Math.sin(theta))/wavelength;

        for (let v=0;v < y_data.length ;v++) {
            let z_row = [];
            for (let i = 0; i < x_data.length ; i++) {
                z = E_0* Math.sin(k_x* x_data[i]+k_y*y_data[v]+w_t);
                z_row.push(z);
            }
            z_square.push(z_row);
        }
        return z_square
    }

    function getData_wave_reflected(x_data,y_data,theta,E_0){//produces data for the reflected wave on the boundry

        let z,z_square = [];
        let k_x = (2*Math.PI*Math.cos(theta))/wavelength;
        let k_y = (2*Math.PI*Math.sin(theta))/wavelength;

        for (let v=0;v < y_data.length ;v++) {
            let z_row = [];
            for (let i = 0; i < x_data.length ; i++) {
                z = E_0* Math.sin(k_x* x_data[i]+k_y*y_data[v]-w_t);
                z_row.push(z);
            }
            z_square.push(z_row);
        }
        return z_square
    }

    function transmit(theta){//gives the new amplitude of the transmitted wave
        let theta_i = theta;
        let theta_t = snell(theta_i);
        let E_t0;

        if (isNaN(theta_t) === true){//if snells law return not a number this means total internal refection is occurring hence no transmitted wave(no attenuation accounted for)
                return 0
        }
        else {
                E_t0 = E_0 * (2. * n1 * Math.cos(theta_i)) / (n1 * Math.cos(theta_i) + n2 * Math.cos(theta_t))
            return E_t0
        }
       };

    function reflect(theta) {//gives the amplitude of the refected wave
        if (n1 === n2) {//if both materials have same refractive index then there is no reflection
            return 0
        }
        else {
            let theta_i = theta;
            let theta_t = snell(theta_i);
            console.log(theta_t);
            let E_r0;
            if (isNaN(theta_t) === true){
                E_r0 = E_0;
                console.log("TIR")
            }
            else {
                E_r0 = E_0 * (n1 * Math.cos(theta_i) - n2 * Math.cos(theta_t)) / (n1 * Math.cos(theta_i) + n2 * Math.cos(theta_t))
            }
            console.log(E_r0);
            return E_r0
        }
    };

    function plot_data() {//produces the traces of the plot

        $("#angle-display").html($("input#angle").val().toString()+"°");//update display
        $("#refractive-index-ratio-display").html($("input#refractive-index-ratio").val().toString());

        condition =  $("input[name = wave-switch]:checked").val();//update value of constants
        angle_of_incidence = parseFloat($("input#angle").val());
        n2 = parseFloat($("input#refractive-index-ratio").val());

        let rad_angle = Math.PI * (angle_of_incidence / 180);
        let data = [];

        if (condition === "incident") {//creates trace dependent of the conditions of the system
            let incident_wave = {
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_incident(x_points, y_points, rad_angle,E_0),
                type: 'surface',
                name: "Incident"
            };
            data.push(incident_wave);
        }
        else if(condition === "reflected") {
            let reflected_wave = {
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_reflected(x_points, y_points, -rad_angle, reflect(rad_angle)),
                type: 'surface',
                name: "Reflected"
            };
            data.push(reflected_wave);
        }
        else if (condition === "reflected and incident"){
            let incident_wave = {
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_incident(x_points, y_points, rad_angle,E_0),
                type: 'surface',
                name: "Incident"
            };
            data.push(incident_wave);
            let reflected_wave = {
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_reflected(x_points, y_points, -rad_angle, reflect(rad_angle)),
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
                z: math.add(getData_wave_incident(x_points,y_points,rad_angle,E_0),getData_wave_reflected(x_points,y_points,2*Math.PI - rad_angle,reflect(rad_angle))),
                type: 'surface',
                name:"Reflected and Incident combined"
            };
            data.push(incident_plus_reflected_wave);
        }

        let transmitted_wave = {
            opacity: 1,
            x: math.add(-2,x_data),
            y: y_data,
            z: getData_wave_incident(math.add(-2,x_points),y_points,snell(rad_angle),transmit(rad_angle)),
            type: 'surface',
            name:"Transmitted"
        };

        let opacity_1;//opacity gives qualitative representation of refractive index
        let opacity_2;
        if((1 < n2) && (n2 <= 15)){//decide opacity dependant on refractive index
            opacity_1 = 0;
            opacity_2 = n2/10
        }
        else if((0.1 <= n2) && (n2< 1)){
            opacity_1 = 0.1/n2;
            opacity_2 = 0;
        }
        else{
            opacity_1 = 0;
            opacity_2 = 0;
        }

        let material_1 =//dielectric one
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
        let material_2 =//dielectric two
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

    function play_loop(){//handles the play button
        if(isPlay === true) {
            w_t++;//keeps time ticking
            Plotly.animate("graph",
                {data: plot_data()},
                {
                    fromcurrent: true,
                    transition: {duration: 0,},
                    frame: {duration: 0, redraw: false,},
                    mode: "afterall"
                });
            requestAnimationFrame(play_loop);//prepares next frame
        }
        return 0;
    };

    function initial() {
        Plotly.purge("graph");
        Plotly.newPlot('graph', plot_data(),layout);//create plot

        dom.tswitch.on("change", update_graph);//change of input produces reaction
        dom.aSlider.on("input", update_graph);
        dom.nSlider.on("input", update_graph);

        $('#playButton').on('click', function() {
            document.getElementById("playButton").value = (isPlay) ? "Play" : "Stop";//change button label
            isPlay = !isPlay;
            w_t = 0;//reset time to 0
            requestAnimationFrame(play_loop);
        });
    };
initial();
});