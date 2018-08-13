$(window).on('load', function() {//main

    let size = 100;
    let w_t = 0;
    let isPlay = false;
    let n1 = 1;
    let n2 = 1.5;
    let E_0 = 0.5;

    let condition =  $("input[name = wave-switch]:checked").val();
    let wavelength = parseFloat($("input#wavelength").val());
    let angle_of_incidence = parseFloat($("input#angle").val());


    const dom = {
            tswitch: $("#wave-switch input"),
            aSlider: $("input#angle"),//angle slider
            wSlider: $("input#wavelength")
    };

    let layout = {
            showlegend: false,
            scene: {
                aspectmode: "cube",
                xaxis: {range: [-2, 2]},
                yaxis: {range: [-2, 2]},
                zaxis: {range: [-2, 2]},
                camera: {
                    eye: {x: 0, y: 0, z: -2.2}//adjust camera starting view
                }
            },
    };

    function snell(n1, n2, theta_i){//snells law
        console.log(Math.asin((n1 / n2) * Math.sin(theta_i)));
        return Math.asin((n1 / n2) * Math.sin(theta_i));

    };

    function getData_wave_incident(x_data,y_data,theta){

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

    function getData_wave_reflected(x_data,y_data,theta){

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
        return math.multiply(-1,z_square)
    }

    function plot_data() {

        $("#angle-display").html($("input#angle").val().toString()+"°");//update display
        $("#wavelength-display").html($("input#wavelength").val().toString());

        condition =  $("input[name = wave-switch]:checked").val();
        angle_of_incidence = parseFloat($("input#angle").val());
        wavelength = parseFloat($("input#wavelength").val());

        let x_data = numeric.linspace(2, 0, size);
        let y_data = numeric.linspace(-2, 2, size);
        let rad_angle = Math.PI * (angle_of_incidence / 180);
        let data = [];

        if (condition === "incident") {
            let incident_wave = { //multiple traces
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_incident(x_data, y_data, rad_angle),
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
                z: getData_wave_reflected(x_data, y_data, 2 * Math.PI - rad_angle),
                type: 'surface',
                name: "Reflected"
            };
            data.push(reflected_wave);
        }
        else if (condition === "reflected and incident"){
            let incident_wave = { //multiple traces
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_incident(x_data, y_data, rad_angle),
                type: 'surface',
                name: "Incident"
            };
            data.push(incident_wave);
            let reflected_wave = { //multiple traces#
                opacity: 1,
                x: x_data,
                y: y_data,
                z: getData_wave_reflected(x_data, y_data, 2 * Math.PI - rad_angle),
                type: 'surface',
                name: "Reflected"
            };
            data.push(reflected_wave);
        }
        else{
            let incident_plus_reflected_wave = {//IS REFLECTED WAVE GOING IN RIGHT DIRECTION???????
                opacity: 1,
                x: x_data,
                y: y_data,
                z: math.add(getData_wave_incident(x_data,y_data,rad_angle),getData_wave_reflected(x_data,y_data,2*Math.PI - rad_angle)),
                type: 'surface',
                name:"Reflected and Incident combined"
            };
            data.push(incident_plus_reflected_wave);
        }

        let transmitted_wave = { //multiple traces
            opacity: 1,
            x: math.add(-2,x_data),
            y: y_data,
            z: getData_wave_incident(math.add(-2,x_data),y_data,snell(n1,n2,rad_angle)),
            type: 'surface',
            name:"Transmitted"
        };

        let boundry =
            {
                opacity: 0.3,
                color: '#379F9F',
                type: "mesh3d",
                name: "boundry",
                z: [-2, -2, 2, 2, -2, -2, 2, 2],
                y: [-2, 2, 2, -2, -2, 2, 2, -2],
                x: [0, 0, 0, 0, -2, -2, -2, -2],
                i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
                j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
                k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
            };

        data.push(boundry);
        data.push(transmitted_wave);


        if (data.length < 4) {//animate function requires data sets of the same length hence those unused in situation must be filled with empty traces
            let extensionSize = data.length;
            for (let i = 0; i < (4 - extensionSize); ++i){
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
            w_t++;
            Plotly.animate("graph",
                {data: plot_data()},
                {
                    fromcurrent: true,
                    transition: {duration: 0,},
                    frame: {duration: 0, redraw: false,},
                    mode: "afterall"
                });
            requestAnimationFrame(play_loop);
        }
        return 0;
    };

    function initial() {
        Plotly.purge("graph");
        Plotly.newPlot('graph', plot_data(),layout);//create animation

        dom.tswitch.on("change", update_graph);
        dom.aSlider.on("input", update_graph);
        dom.wSlider.on("input", update_graph);

        $('#playButton').on('click', function() {
            document.getElementById("playButton").value = (isPlay) ? "Play" : "Stop";
            isPlay = !isPlay;
            w_t = 0;
            requestAnimationFrame(play_loop);
        });
    };
initial();
});