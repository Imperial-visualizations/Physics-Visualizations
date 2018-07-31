$(window).on('load', function() {
        const dom = {//assigning switches and sliders
            pswitch: $("#polarisation-switch input"),
            wSlider:$("input#angular_frequency"),
        }
    let isShown = false;
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
                zaxis: {range: [-1, 2]},

                camera: {
                    up: {x:1, y: 0, z: 0},//sets which way is up
                    eye: {x: 0.1, y: 2, z: 0}//adjust camera starting view
                }
            },
        },
        layout_real:{//layout of real refractive index
                autosize: true,
                xaxis: {
                    range: [0, 2],
                    title: "Angular frequency ratio"
                },
                yaxis: {
                    title:"Real n"
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
        layout_img:{//layout of imaginary refactive index
                autosize: true,
                xaxis: {
                    range: [0, 2],
                    title: "Angular frequency ratio"
                },
                yaxis: {
                    title:"Imaginary n"
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
        }
    };

let w_conversion = 7e5; // Factor to make plot wavelength reasonable
let w_0 = 2e10;//gives properties of material
let gamma = 0.1*w_0;
let wd = 0.1*w_0;
let w_d_squared = wd**2;

let polarisation_value = $("input[name = polarisation-switch]:checked").val();//set variables based on value of polarisation
let angular_frequency_ratio   = parseFloat($("input#angular_frequency").val())* w_0;//set variable based on angular frequency input

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
let size = 10000;//give number of points
let zero = zero_array(size);


class Wave{//wave object used to produce em wave
    constructor(E_0, polarisation, w) {
            this.E_0 = E_0;
            this.true_w = w;
            //this.w = this.true_w / w_conversion;
            this.k = (this.true_w) / c;
            this.B_0 = E_0;//for convenience of visualisation B and E field are same amplitude
            this.polarisation = polarisation;
            this.sinusoids = this.create_sinusoids_incident();
        }
    element_cos(matrix,size){//takes cos of element in matrix
        for (let i = 0; i < size ;i++){
            matrix[i] = math.cos(matrix[i]);
        }
    return matrix
    }

    element_exponential(matrix,size){//take exponential of element in matrix
        for (let i = 0;i < size;i++){
            matrix[i] = math.exp(matrix[i]);
        }
    return matrix
    }

    create_sinusoids_incident()//create incident waves
    {
        let z_range = numeric.linspace(-1, 0, size);

        let k_z_cos = this.element_cos(math.multiply(this.k,z_range),size);
        let E_cos,B_cos;

        if (this.polarisation === "s-polarisation") {
            E_cos = [zero, math.multiply(this.E_0, k_z_cos), z_range];//polarisation determines axis of oscillation
            B_cos = [math.multiply(this.B_0,k_z_cos), zero, z_range];
            }
        else{
            E_cos = [math.multiply(this.E_0, k_z_cos), zero, z_range];
            B_cos = [zero, math.multiply(this.B_0, k_z_cos), z_range];
            }

        let E_trace = [];

        E_trace.push(//Electric field trace
            {
            type: "scatter3d",
            mode: "lines",
            name: "e field incident",
            x: E_cos[0],
            y: E_cos[1],
            z: E_cos[2],
            opacity: 1,
            line: {
                width: 4,
                color: "#02893B",
                reversescale: false}
            }
        );

        let B_trace = [];
        B_trace.push(//Magnetic field trace
            {
            type: "scatter3d",
            mode: "lines",
            name: "b field incident",
            x: B_cos[0],
            y: B_cos[1],
            z: B_cos[2],
            opacity: 1,
            line: {
                width: 4,
                color: "#A51900",
                reversescale: false}
            }
        );
        return [E_trace, B_trace]
    };


    attenuation(w_input){

    let w = w_input;

    let z_range = numeric.linspace(0, 1, size);
    //calculate real refractive index
    let n_real = 1 - (w_d_squared*(Math.pow(w,2)-Math.pow(w_0,2))/(Math.pow((Math.pow(w,2)-Math.pow(w_0,2)),2) + Math.pow(w,2)*Math.pow(gamma,2)));
    //calculate imaginary refractive index
    let n_im = (w_d_squared*w*gamma)/(Math.pow((Math.pow(w,2) - Math.pow(w_0,2)),2)+Math.pow(w,2)*Math.pow(gamma,2));

    let k_real = (w*n_real)/c;

    let k_im = (w*n_im)/(c);

    let exp_E = this.element_exponential(math.multiply(-k_im,z_range),size);//exponential decay of amplitude

    let k_z_cos = this.element_cos(math.multiply(k_real,z_range),size);

    let decayed_cos = math.dotMultiply(exp_E,k_z_cos);

    let E_end_amp = this.E_0*exp_E.slice(-1);//find final value of amplitude
    let B_end_amp = this.B_0*exp_E.slice(-1);

    let shift = k_real*1;//phase shift of wave for transmitted wave


    let E_cos_atten,B_cos_atten;

    if (this.polarisation === "s-polarisation") {
        E_cos_atten = [zero, math.multiply(this.E_0, decayed_cos), z_range];
        B_cos_atten = [math.multiply(this.B_0,decayed_cos), zero, z_range];
        }
    else{
        E_cos_atten = [math.multiply(this.E_0, decayed_cos), zero, z_range];
        B_cos_atten = [zero, math.multiply(this.B_0, decayed_cos), z_range];
        }

    let E_trace_atten = [];

    E_trace_atten.push(
        {
        type: "scatter3d",
        mode: "lines",
        name: "e field attenuated",
        x: E_cos_atten[0],
        y: E_cos_atten[1],
        z: E_cos_atten[2],
        opacity: 1,
        line: {
            width: 4,
            color: "#02893B",
            reversescale: false}
        }
    );

    let B_trace_atten = [];

    B_trace_atten.push(
        {
        type: "scatter3d",
        mode: "lines",
        name: "b field attenuated",
        x: B_cos_atten[0],
        y: B_cos_atten[1],
        z: B_cos_atten[2],
        opacity: 1,
        line: {
            width: 4,
            color: "#A51900",
            reversescale: false}
        }
    );
    return [E_trace_atten,B_trace_atten,E_end_amp,B_end_amp,shift,n_im]
    };


    create_sinusoids_transmitted(E_end_amp,B_end_amp,shift)
    {
        let z_range = numeric.linspace(1, 2, size);
        let z_range_shift = math.add(-1,z_range);

        let o_cos = math.multiply(this.k,z_range_shift);
        let c_input = math.add(shift,o_cos);//add shift to transmitted wave

        let k_z_cos = this.element_cos(c_input,size);

        let E_cos,B_cos;

        if (this.polarisation === "s-polarisation") {
            E_cos = [zero, math.multiply(E_end_amp, k_z_cos), z_range];
            B_cos = [math.multiply(B_end_amp,k_z_cos), zero, z_range];
            }
        else{
            E_cos = [math.multiply(E_end_amp, k_z_cos), zero, z_range];
            B_cos = [zero, math.multiply(B_end_amp, k_z_cos), z_range];
            }

        let E_trace = [];

        E_trace.push(
            {
            type: "scatter3d",
            mode: "lines",
            name: "e field transmitted",
            x: E_cos[0],
            y: E_cos[1],
            z: E_cos[2],
            opacity: 1,
            line: {
                width: 4,
                color: "#02893B",
                reversescale: false}
            }
        );

        let B_trace = [];
        B_trace.push(
            {
            type: "scatter3d",
            mode: "lines",
            name: "b field transmitted",
            x: B_cos[0],
            y: B_cos[1],
            z: B_cos[2],
            opacity: 1,
            line: {
                width: 4,
                color: "#A51900",
                reversescale: false}
            }
        );
        return [E_trace, B_trace]//return traces
    };
};

function computeData() {

    $("#angular_frequency-display").html($("input#angular_frequency").val().toString());//update value of display

    angular_frequency_ratio = parseFloat($("input#angular_frequency").val())*(w_0);//update variable values
    polarisation_value = $("input[name = polarisation-switch]:checked").val();

    let Incident = new Wave(amplitude,polarisation_value,angular_frequency_ratio,n1);//create wave

    let dielectric_bit = Incident.attenuation(angular_frequency_ratio);//create attenuated wave
    let Transmitted = Incident.create_sinusoids_transmitted(dielectric_bit[2],dielectric_bit[3],dielectric_bit[4]);//create transmitted wave

    let n_im_max = (w_d_squared*w_0*gamma)/(Math.pow((Math.pow(w_0,2) - Math.pow(w_0,2)),2)+Math.pow(w_0,2)*Math.pow(gamma,2));

    let refectrive_index = dielectric_bit[5]/(1.2*n_im_max);//use refractive index to change opacity of dielectric

    let material_1 = [];
    material_1.push(
        {//dielectric
            opacity: refectrive_index,
            color: '#379F9F',
            type: "mesh3d",
            name: "material_1",
            x: [-1, -1, 1, 1, -1, -1, 1, 1],
            y: [-1, 1, 1, -1, -1, 1, 1, -1],
            z: [ 1, 1, 1, 1, 0, 0, 0, 0],
            i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
            j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
            k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        }
        );
    let data = Incident.sinusoids[0].concat(Incident.sinusoids[1], dielectric_bit[0],dielectric_bit[1],Transmitted[0],Transmitted[1],material_1);
    //add all traces to one variable
return data
};

function compute_data_rn() {//produces data for real refractive index graph

    let x = numeric.linspace(0, 2, size);

    let y = [];
    let w;

    for( let i = 0; i < size; i++){
        w = (x[i])*w_0;
        y.push(1 - (w_d_squared*(Math.pow(w,2)-Math.pow(w_0,2))/(Math.pow((Math.pow(w,2)-Math.pow(w_0,2)),2) + Math.pow(w,2)*Math.pow(gamma,2))));
    }
    let real_n = (1 - (w_d_squared*(Math.pow(angular_frequency_ratio,2)-Math.pow(w_0,2))/(Math.pow((Math.pow(angular_frequency_ratio,2)-Math.pow(w_0,2)),2) + Math.pow(angular_frequency_ratio,2)*Math.pow(gamma,2))));

    data = [x,y];

    let r_rn = {
          x: data[0],
          y: data[1],
          type: 'scatter',
          name: 'Real n',
    };

    let marker = {
            x: [parseFloat($("input#angular_frequency").val())],
            y: [real_n],
            showlegend: false,
            type: "scatter",
            mode:"markers",
            name: 'Real n',
            marker: {color: "#002147", size: 12}
    };

    return [r_rn,marker]
}

function compute_data_in() {//produces data for imaginary refractive index graph

    let x = numeric.linspace(0, 2, size);
    let y = [];
    let w;

    for(let i = 0; i< size; i++){
        w = x[i]*w_0;
        y.push((w_d_squared*w*gamma)/(Math.pow((Math.pow(w,2) - Math.pow(w_0,2)),2)+Math.pow(w,2)*Math.pow(gamma,2)));
    }

    let img_n = (w_d_squared*angular_frequency_ratio*gamma)/(Math.pow((Math.pow(angular_frequency_ratio,2) - Math.pow(w_0,2)),2)+Math.pow(angular_frequency_ratio,2)*Math.pow(gamma,2))
    data = [x,y];

    let r_in = {
          x: data[0],
          y: data[1],
          type: 'scatter',
          name: 'Imaginary n',
    };

    let marker = {
            x: [parseFloat($("input#angular_frequency").val())],
            y: [img_n],
            showlegend: false,
            type: "scatter",
            mode:"markers",
            name: 'Imaginary n',
            marker: {color: "#002147", size: 12}
    };

    return [r_in,marker]
}

function update_graph_n(){//update refractive index graph

    Plotly.animate("graph_rn",
        {data: compute_data_rn()},//updated data
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );

    Plotly.animate("graph_in",
        {data: compute_data_in()},//updated data
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
            mode: "afterall"
        }
    );

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
};


function initial(){
    Plotly.purge("graph");
    Plotly.newPlot('graph', computeData(),plt.layout);//create animation plot

    $('.container').show();//show container after loading finishes

    $('#spinner').hide();//hide loading spinner

    dom.pswitch.on("change", update_graph);//update graph animation
    dom.wSlider.on("input",update_graph);

    $('#graphButton').on('click', function() {
         $('#graph_container').toggle('show');

            Plotly.purge("graph_rn");
            Plotly.newPlot('graph_rn', compute_data_rn(),plt.layout_real);//create real refractive index graph

            Plotly.purge("graph_in");
            Plotly.newPlot('graph_in', compute_data_in(),plt.layout_img);//create imaginary refractive index graph

            dom.wSlider.on("input",update_graph_n);//update refractive index graph

        document.getElementById("graphButton").value = (isShown) ? "Show Graphs":"Hide Graphs";
        console.log(isShown);
        isShown = !isShown;
    });
}
initial();//run the initial loading
});
