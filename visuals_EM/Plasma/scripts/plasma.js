$(window).on('load' , function() {
        const dom = {//assigning switches and sliders
            tswitch: $("#wave-switch input"),
            wSlider:$("input#angular_frequency"),
            NSlider:$("input#electron_density")
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
                    up: {x:1, y: 0, z: 0},//sets which way is up
                    eye: {x: 0.1, y: 0, z: -2}//adjust camera starting view
                }
            },
        },
        layout_real:{//layout of real refractive index
                autosize: true,
                xaxis: {
                    range: [0, 15.5],
                    title: " Wavevector, k"
                },
                yaxis: {
                   range: [0, 45],
                    title: "Wave Angular Frequency, w 1e9  " //how to actually type that in math mode ?
                },
                margin: {
                   l: 50, r: 10, b: 50, t: 50, pad: 5
               },
               legend: {
                   x: 0, y: 10,
                   orientation: "h"
               },
               font: {
                   family: "Fira Sans",
                   size: 16
               }
        },
        layout_planewave : {
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
                zaxis: {range: [-2, 2]},

                camera: {
                    up: {x: 0, y: 0, z: 1},//sets which way is up
                    eye: {x: 2, y: 0, z: 0.1}//adjust camera starting view
                }
            },
        },
    };

let w_conversion = 7e5; // Factor to make plot wavelength reasonable
let e = 1.6e-19; // electron charge
let m_e = 9.11e-31;// mass of the electron
let epsilon_0 = 8.85e-12; // epsilon not
let t = 0;
let isPlay = false;

function get_w_plasma(N_e) {
    let eDens = N_e;
    let w_plasma = math.sqrt((eDens* e**2)/(m_e* epsilon_0));
    return w_plasma
}
let electron_density = parseFloat($("input#electron_density").val())*1e17;
let angular_frequency  = parseFloat($("input#angular_frequency").val())*1e10;//set variable based on angular frequency input

let n1 = 1;//material before input dielectric
let amplitude = 0.8;//amplitude of em wave
let c = 3e8; // Speed of light



function zero_array(size){//create array of zeros
    let zero =[];
    for (let i = 0;i<size;i++){
        zero.push(0);
    }
    return zero
}
let size = 100;//give number of points
let zero = zero_array(size);



class Wave {//wave object used to produce em wave
    constructor(E_0, w) {
        this.E_0 = E_0;
        this.true_w = w;
        //this.w = this.true_w / w_conversion;
        this.k = (this.true_w) / c;
        this.B_0 = E_0;//for convenience of visualisation B and E field are same amplitude
    }

    element_cos(matrix, size) {//takes cos of element in matrix
        for (let i = 0; i < size; i++) {
            matrix[i] = math.cos(matrix[i]);
        }
        return matrix
    }

    element_exponential(matrix, size) {//take exponential of element in matrix
        for (let i = 0; i < size; i++) {
            matrix[i] = math.exp(matrix[i]);
        }
        return matrix
    }

    singlewave(w_input, w_plasma, stage) {//create incident waves{
        let y_range;
        let E_0cos;
        let E_trace = [];
        let B_trace = [];
        let w_t = w_input * t;

        if (stage === "incident") {
            y_range = numeric.linspace(-1, 0, size);
            E_0cos =  math.multiply(this.E_0,this.element_cos(math.add(math.multiply(this.k, y_range), -w_t), size));
        }
        else if (stage === "reflection") {
            y_range = numeric.linspace(-1, 0, size);
            E_0cos = math.multiply(this.E_0, this.element_cos(math.add(math.multiply(this.k, math.multiply(-1, y_range)),w_t), size));
        }
        else if (stage === "propagation") {
            y_range = numeric.linspace(0, 1, size);
            let n = math.sqrt(1 - (w_plasma / w_input) ** 2); //real
            E_0cos = math.multiply(this.E_0, this.element_cos(math.add(math.multiply((w_input * n) / c, y_range), -w_t), size));
        }
        else if (stage === "exponential") {
            y_range = numeric.linspace(0, 1, size);
            let n = math.sqrt(((w_plasma / w_input) ** 2) - 1);
            let Amp =[];
            Amp = math.multiply(this.E_0, this.element_cos(math.add(math.multiply(this.k, y_range), -w_t), size));
            for (let m=0; m<Amp.length; ++m) {
                E_0cos = math.multiply(Amp[m], this.element_exponential(math.multiply((-w_input * n) / c, y_range), size));
            }
        }
        E_trace.push(//Electric field trace
            {
                type: "scatter3d",
                mode: "lines",
                name: "E-field",
                x: zero,
                y: y_range,
                z: E_0cos,
                opacity: 1,
                line: {
                    width: 4,
                    color: "#02893B",
                    reversescale: false
                }
            }
        );
        B_trace.push(//Magnetic field trace
            {
                type: "scatter3d",
                mode: "lines",
                name: "B-field",
                x: E_0cos,
                y: y_range,
                z: zero,
                opacity: 1,
                line: {
                    width: 4,
                    color: "#A51900",
                    reversescale: false
                }
            }
        );

        return [E_trace, B_trace]
    }
    planewave(w_input,w_plasma, stage) {
        let w_t = w_input * t;
        let x_trace = numeric.linspace(-1, 1, size); //z or x
        let y_trace;
        let z_trace = [];
        let E_trace = [];
        let EMwave;

        if (stage === "incident") {
            y_trace= numeric.linspace(-1, 0, size);
            EMwave = math.multiply(this.E_0, this.element_cos(math.add(math.multiply(this.k, y_trace), -w_t), size));
        }

        else if (stage === "propagation") {
            y_trace= numeric.linspace(0, 1, size);
            let n = math.sqrt(1 - (w_plasma / w_input) ** 2); //real
            EMwave = math.multiply(this.E_0, this.element_cos(math.add(math.multiply((w_input * n) / c, y_trace), -w_t), size));
        }
        else if (stage === "reflection")  {
            y_trace= numeric.linspace(-1, 0, size);
            let phase = w_input * t - Math.PI;
            EMwave = math.multiply(this.E_0, this.element_cos(math.add(math.multiply(-this.k, math.multiply(1, y_trace)), phase), size));
        }

        else if (stage === "exponential"){ //exponential
            y_trace= numeric.linspace(0, 1, size);
            let Amp =[];
            Amp = math.multiply(this.E_0, this.element_cos(math.add(math.multiply(this.k, y_trace), -w_t), size));
            let n = math.sqrt(((w_plasma / w_input) ** 2) -1); //imaginary
            for (let m=0; m<Amp.length; ++m) {
                EMwave = math.multiply(Amp[m], this.element_exponential(math.multiply((-w_input * n) / c, y_trace), size));
            }
        }
        else if (stage === "combined") {
            let phase = w_input * t ;
            y_trace= numeric.linspace(-1, 0, size);
            let init = math.multiply(this.E_0, this.element_cos(math.add(math.multiply(this.k, y_trace), -w_t), size));
            let refl = math.multiply(this.E_0, this.element_cos(math.add(math.multiply(this.k, math.multiply(-1, y_trace)), phase), size));
            EMwave = math.add(init,refl);
        }
        for (let i = 0; i < size; ++i) {
            z_trace[i] = [];
            for (let j = 0; j < size; ++j) {
                z_trace[i].push(EMwave[i]);
            }
        }
        E_trace.push(//Electric field trace
            {
                type: "surface",
                name: "E-field",
                x: x_trace,
                y: y_trace,
                z: z_trace,
                opacity: 1,
            }
        );
        return [E_trace]
    }

    empty_traces() {
    let empty = [];
    let x_range = math.zeros(size);
    let y_range = math.zeros(size);

    let z_trace = [];
    for (let i = 0; i < size; ++i) {
        z_trace[i] = [];
        for (let j = 0; j < size; ++j) {
            z_trace[i].push(0);
        }
    }
    empty.push(
                {
                    type: "surface",
                    name: "e field incident",
                    x: x_range,
                    y: y_range,
                    z: z_trace,
                    opacity: 0
                }
    );
    return [empty]
    }
}

function computeData() {

    $("#angular_frequency-display").html($("input#angular_frequency").val().toString());//update value of display
    $("#electron_density-display").html($("input#electron_density").val().toString()); //update value of electron density

    electron_density = parseFloat($("input#electron_density").val()) *1e17;
    let w_p = get_w_plasma(electron_density);
    angular_frequency = parseFloat($("input#angular_frequency").val())*1e10;//update variable value

    if (angular_frequency>w_p) {
        let n = math.sqrt(1 - (w_p / angular_frequency) ** 2); //real
        $("#refr_index_real").html(n);
        $("#refr_index_imaginary").html(0);
    }
    else {
        let n = math.sqrt(((w_p / angular_frequency) ** 2)-1); //imaginary made real
        $("#refr_index_real").html(0);
        $("#refr_index_imaginary").html(n);
    }


    let Opacity;
    if ( w_p>4.88e9 || w_p<1.01e10) { //to control the density of plasma
        Opacity = 0.2 + (w_p - 4.88e9)/1.69e10;
    }
    else if (w_p>1.01e10 || w_p<2.18e10) {
        Opacity = 0.8;
    }
    else {
        Opacity = 0.2;
    }
    let Incident = new Wave(amplitude,angular_frequency,n1);//create wave
    let init = Incident.singlewave(angular_frequency,w_p, "incident"); // incidents wave
    let prop = Incident.singlewave(angular_frequency, w_p, "propagation");//propagates wave
    let exp = Incident.singlewave(angular_frequency, w_p, "exponential");
    let empty = Incident.empty_traces();
    let material_1 = [];
    let data =[];

    material_1.push(
        {//plasma
            opacity: Opacity,
            color: '#FF0',
            type: "mesh3d",
            name: "plasma",
            x: [-1, -1, 1, 1, -1, -1, 1, 1],
            y: [0, 1, 1, 0, 0, 1, 1, 0],
            z: [ 1, 1, 1, 1, -1, -1, -1, -1],
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        }
    );
    if (angular_frequency > w_p) {
       data = init[0].concat(init[1],prop[0],prop[1],material_1);//data = Incident.sinusoids[0].concat(Incident.sinusoids[1], dielectric_bit[0],dielectric_bit[1],material_1);
        //add all traces to one variable
    }
    else if(angular_frequency === w_p){ //wave fully reflected
        data = init[0].concat(init[1],empty[0],empty[0],material_1);
    }
    else { // wave exponentially decays
        data = init[0].concat(init[1],exp[0],exp[1],material_1);
    }
return data
}

function compute_data_disp() {//produces data for dispersion relationship graph
    let kc_squared = numeric.linspace(0, 2e19, size);
    let y = []; // w
    let k_actual = [];
    let y_straight = [];
    electron_density = parseFloat($("input#electron_density").val())*1e17;
    let w_p = get_w_plasma(electron_density);
    let w_p_scaled = w_p/1e9;

    for (let i = 0; i < size; i++) {
        k_actual.push(Math.sqrt(kc_squared[i]/c**2));
        y.push(Math.sqrt(kc_squared[i]/1e16 + w_p_scaled**2));
        y_straight.push(k_actual[i]*c/1e8);
    }
    let data = [k_actual, y];
    let data_s = [k_actual,y_straight];
    let y_marker;
    let k_marker;

    let plasma_disp = {
        x: data[0],
        y: data[1],
        type: 'scatter',
        name: 'plasma dispersion',
    };

    let straight = {
        x: data_s[0],
        y: data_s[1],
        type: 'scatter',
        name: 'vacuum dispersion',
    };

    if (angular_frequency >= w_p){
        k_marker = Math.sqrt((angular_frequency**2/1e18 - w_p_scaled**2)/c**2)*1e8;
        y_marker = angular_frequency/1e9;
        let message = {
            x: [12.5],
            y: [15],
            mode: 'text',
            text: ['k - real, wave propagates through plasma'],
            textposition: 'top',
            type: 'scatter',
            colour: '#F00'
        };
    }
    else {
        k_marker = NaN;
        y_marker = NaN;
        let message = {
            x: [12.5],
            y: [15],
            mode: 'text',
            text: 'k - imaginary, no wave propagation',
            textposition: 'top',
            type: 'scatter',
            colour: '#F00'
        };
    }
    let marker = {
        x: [k_marker],
        y: [y_marker],
        showlegend: false,
        type: "scatter",
        mode: "markers",
        name: 'dispersion relation',
        marker: {color: "#002147", size: 12}
    };
    return [plasma_disp, straight, marker]
}

function compute_data_planewave() {
    electron_density = parseFloat($("input#electron_density").val())*1e17;
    let w_p = get_w_plasma(electron_density);
    angular_frequency = parseFloat($("input#angular_frequency").val())*1e10;//update variable values
    let condition =  $("input[name = wave-switch]:checked").val();

    let Incident = new Wave(amplitude,angular_frequency,n1);//create wave
    let init = Incident.planewave(angular_frequency,w_p, "incident"); // incidents wave
    let prop = Incident.planewave(angular_frequency, w_p,"propagation");//propagates wave
    let refl = Incident.planewave(angular_frequency, w_p, "reflection");
    let exp = Incident.planewave(angular_frequency, w_p, "exponential");
    let empty = Incident.empty_traces();
    let comb = Incident.planewave(angular_frequency,w_p,"combined");

    let material_1 = [];
    let data =[];

    let Opacity;
    if ( w_p>4.88e9 || w_p<1.01e10) { //to control the density of plasma
        Opacity = 0.2 + (w_p - 4.88e9)/1.69e10;
    }
    else if (w_p>1.01e10 || w_p<2.18e10) {
        Opacity = 0.8;
    }
    else {
        Opacity = 0.2;
    }

    material_1.push(
        {//plasma
            opacity: Opacity,
            color: '#FF0',
            type: "mesh3d",
            name: "plasma",
            x: [-1, -1, 1, 1, -1, -1, 1, 1],
            y: [0, 1, 1, 0, 0, 1, 1, 0],
            z: [ 2, 2, 2, 2, -2, -2, -2, -2],
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        }
    );

     if (angular_frequency > w_p) {
        data = init[0].concat(prop[0], empty[0], material_1);
        //add all traces to one variable
     }
     else if(angular_frequency === w_p){ //wave fully reflected
         if (condition === "incident") {
             data = init[0].concat(empty[0], empty[0], material_1);
         }
         else if (condition === "reflected") {
             data = refl[0].concat(empty[0], empty[0],material_1);
         }
         else {//combined
             data = comb[0].concat(material_1)
         }

     }
     else { // wave exponentially decays
         if (condition === "incident") {
             data = init[0].concat(exp[0], material_1);
         }
         else if (condition === "reflected") {
             data = refl[0].concat(exp[0],  material_1);
         }
         else { //combined
             data = comb[0].concat(exp[0],material_1)
             //data = combined[0].concat(exp[0],material_1)
         }
     }
    return data
}
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
function update_graph_disp() {//update refractive index graph

    Plotly.animate("graph_disp",
        {data: compute_data_disp()},//updated data
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
}
function update_surface() {

    Plotly.animate("graph_planewave",
        {data: compute_data_planewave()},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );
}
 function play_loop(){
        if(isPlay === true) {
            t++;
            Plotly.animate("graph_planewave",
                {data: compute_data_planewave()},
                {
                    fromcurrent: true,
                    transition: {duration: 0,},
                    frame: {duration: 0, redraw: false,},
                    mode: "afterall"
                });
            Plotly.animate("graph",
                {data: computeData()},
                {
                    fromcurrent: true,
                    transition: {duration: 0,},
                    frame: {duration: 0, redraw: false,},
                    mode: "afterall"
                });
            requestAnimationFrame(play_loop);
        }
        return 0;
 }
function initial(){
    Plotly.purge("graph");
    Plotly.newPlot('graph', computeData(),plt.layout);//create animation plot

    Plotly.purge("graph_planewave");
    Plotly.newPlot('graph_planewave', compute_data_planewave(),plt.layout_planewave);

    Plotly.purge("graph_disp");
    Plotly.newPlot('graph_disp', compute_data_disp(), plt.layout_real);


    $('.container').show();//show container after loading finishes

    $('#spinner').hide();//hide loading spinner


    dom.wSlider.on("input",update_graph);
    dom.NSlider.on("input",update_graph);

    dom.wSlider.on("input", update_graph_disp);
    dom.NSlider.on("input", update_graph_disp);

    dom.wSlider.on("input", update_surface);
    dom.NSlider.on("input", update_surface);
    dom.tswitch.on("change", update_surface);

    $('#playButton').on('click', function() {
            document.getElementById("playButton").value = (isPlay) ? "Play" : "Stop";
            isPlay = !isPlay;
            t = 0;
            requestAnimationFrame(play_loop);
    });
}
$(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');
            initPlot(); //This is re-plot depends on the href!!!!!!!!!!!!!!
            return false;
        });
    });
initial();//run the initial loading
});
