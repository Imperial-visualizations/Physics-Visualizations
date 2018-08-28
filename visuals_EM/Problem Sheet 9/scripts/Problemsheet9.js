$(window).on('load', function() {//main
    const dom = {
            tSlider: $("input#thickness"),//angle slider
            rfSlider: $("input#refractive_index"),
    };
    let spacing = 2;

    let offset = 2;
    let offset_reset = offset;


    let data_left = 0,data_center = 0,data_right = 0;

    let size = 100;
    let t = 0;
    let isPlay = false;
    let t_ad = 1e9;

    let w_0 = 3e8;//gives properties of material
    let w = w_0;
    let c = 3e8; // Speed of light

    let n1 = 1;//material before input dielectric
    let E_0 = 1;
    let width = 10;

    let terms = 7;
    let thickness = parseFloat($("input#thickness").val());
    let n2 = parseFloat($("input#refractive_index").val());

    let offset_max = offset + spacing * terms;

    let k_1 = (w*n1)/c;
    let k_2 = (w*n2)/c;

    let mu_0 = 4*Math.PI*1e-7;
    let ep_0 = 8.85*1e-12;

    let Z_vac = math.sqrt(mu_0/ep_0)/n1;
    let Z_diel = math.sqrt(mu_0/ep_0)/n2;

    let rf_v_d = (1-(Z_vac/Z_diel))/(1+(Z_vac/Z_diel));
    let rf_d_v = (1-(Z_diel/Z_vac))/(1+(Z_diel/Z_vac));
    let tr_v_d = 2/(1+ Z_vac/Z_diel);
    let tr_d_v = 2/(1+ Z_diel/Z_vac);

    let x_data = numeric.linspace(0,width,size);
    let side = (width-thickness)/2;

    let x_data_left = numeric.linspace(0,side,size);
    let x_data_center = numeric.linspace(side,side+thickness,size);
    let x_data_right = numeric.linspace(side+thickness,width,size);

    let plt = {
        layout_sum:{
          title: 'Sum of individual terms',
          showlegend: false,
          margin: {
                l: 20,
                r: 10,
                b: 25,
                t: 40,
                pad: 0
              },
          xaxis: {
            range: [ 0,width]
          },
          yaxis: {
            range: [ -2.3, 2.3]
          },
        },
        layout_individual:{
            title:'Individual terms',
            showlegend: false,
            margin: {
                l: 20,
                r: 10,
                b: 20,
                t: 25,
                pad: 0
              },
          xaxis: {
            range: [ 0, width]
          },
          yaxis: {
            range: [ -1.5, 1 + offset_max]
          },
        },
        layout_trans: {
            title:'Energy Transmission Coefficient versus Thickness',
            showlegend: false,
              margin: {
                l: 20,
                r: 10,
                b: 20,
                t: 40,
                pad: 0
              },
          xaxis: {
            range: [ 0,parseFloat($("#thickness").attr("max"))]
          },
          yaxis: {
            range: [ 0, 1.35]
          },
          },
        layout_amp: {
            title:'Energy Transmission Coefficient of individual terms',
              margin: {
                l: 20,
                r: 10,
                b: 20,
                t: 30,
                pad: 0
              },
          xaxis: {
            tick0:0,
            dtick: 1,
            range: [ 0, terms-1 ]
          },
          yaxis: {
            range: [ 0, 1 ]
          },
        }
    };

    function wave_data_one(){
        let y_data_i = [],y_data_r=[],y_data_t=[];
        for (let i = 0; i < x_data.length; i++) {
            y_data_i.push(E_0 * Math.sin(k_1*x_data_left[i]+ (w*t/t_ad)))//add in time
            y_data_r.push(offset + E_0 * rf_v_d * Math.sin(Math.PI + k_1*side + k_1 * -1 * x_data_left[x_data.length-i] + (w*t/t_ad)));
            y_data_t.push(offset + E_0 * tr_v_d * Math.sin(k_1*side + k_2 * (x_data_center[i]) + (w*t/t_ad)))
        }
        data_left =  math.add(data_left,math.add(y_data_i,math.add(-offset,y_data_r)));
        data_center = math.add(data_center,math.add(-offset,y_data_t));
        offset = offset + spacing ;
        return[[x_data_left,y_data_i],[x_data_left,y_data_r.reverse()],[x_data_center,y_data_t]]
    }

    function create_waves(){
        let direction = 1;
        let data = [];
        let x_data_r,x_data_t;

        for(let v = 0; v < terms; v++) {
            let y_data_r = [];
            let y_data_t = [];
            let pos;
            for (let i = 0; i < x_data.length; i++) {
                if(direction === 1){
                    pos = x_data.length-i;
                }else{
                    pos = i;
                }
                y_data_r.push(offset + E_0 * tr_v_d* Math.pow(rf_d_v,(v+1)) * Math.sin(Math.PI + k_1*side + (v+1)*k_2*thickness + k_2 *direction* x_data_center[pos]+ (w*t/t_ad)));
                y_data_t.push(offset + E_0 *tr_v_d * Math.pow(rf_d_v,(v))* tr_d_v * Math.sin(k_1*side + (v+1)*k_2*thickness + k_1 * x_data_left[x_data.length-pos]+ (w*t/t_ad)))
            }
            x_data_r = x_data_center;
            if(direction === 1){
                x_data_t = x_data_right;
                y_data_r = y_data_r.reverse();
                data_right = math.add(data_right,math.add(-offset,y_data_t));
                data_center = math.add(data_center,math.add(-offset,y_data_r));
            }else{
                x_data_t = x_data_left;
                y_data_t= y_data_t.reverse();
                data_left =  math.add(data_left,math.add(-offset,y_data_t));
                data_center = math.add(data_center,math.add(-offset,y_data_r));
            }
            direction = direction*-1;
            offset = offset + spacing ;
            data.push([[x_data_r,y_data_r],[x_data_t,y_data_t]]);
        }
        return [data,[data_left,data_center,data_right]]
    }

    function plot_data() {//plot traces

        let data_sum = [];
        let data_individual = [];
        let wave_one = wave_data_one();
        let results = create_waves();

        //INDIVIDUAL
        data_individual.push(
            {
                type: "scatter",
                mode: "lines",
                x: [side,side],
                y: [-1.5,offset],
                opacity: 1,
                line: {
                    width: 1,
                    color: "red",
                    reversescale: false}

            });
        data_individual.push(
            {
                type: "scatter",
                mode: "lines",
                x: [side+thickness,side+thickness],
                y: [-1.5,offset],
                opacity: 1,
                line: {
                    width: 1,
                    color: "red",
                    reversescale: false}

            });
        let colour;

        for (let v = 0;v<3;v++){
            if(v === 0){
                colour = "#A51900"
            }else if(v === 1){
                colour = "#0F8291"
            }else{
                colour = "#02893B"
            }

            data_individual.push({
                type: "scatter",
                mode: "lines",
                x: wave_one[v][0],
                y: wave_one[v][1],
                opacity: 1,
                line: {
                    width: 2,
                    color: colour,
                    reversescale: false}
                })
        }

        for(let i = 0; i < terms;i++){
            data_individual.push({
                    type: "scatter",
                    mode: "lines",
                    x: results[0][i][0][0],
                    y: results[0][i][0][1],
                    opacity: 1,
                    line: {
                        width: 2,
                        color: "#0F8291",
                        reversescale: false}
                    })
            data_individual.push({
                    type: "scatter",
                    mode: "lines",
                    x: results[0][i][1][0],
                    y: results[0][i][1][1],
                    opacity: 1,
                    line: {
                        width: 2,
                        color: "#02893B",
                        reversescale: false}
                    })
        }

        //SUM
        data_sum.push(
            {
                type: "scatter",
                mode: "lines",
                x: [side,side],
                y: [-2,2],
                opacity: 1,
                line: {
                    width: 1,
                    color: "red",
                    reversescale: false}

            });
        data_sum.push(
            {
                type: "scatter",
                mode: "lines",
                x: [side+thickness,side+thickness],
                y: [-2,2],
                opacity: 1,
                line: {
                    width: 1,
                    color: "red",
                    reversescale: false}

            });

        data_sum.push({
                type: "scatter",
                mode: "lines",
                x: x_data_left,
                y: results[1][0],
                opacity: 1,
                line: {
                    width: 2,
                    color: "#960078",
                    reversescale: false}

        });
        data_sum.push({
                type: "scatter",
                mode: "lines",
                x: x_data_center,
                y: results[1][1],
                opacity: 1,
                line: {
                    width: 2,
                    color: "#960078",
                    reversescale: false}

        });
        data_sum.push({
                type: "scatter",
                mode: "lines",
                x: x_data_right,
                y: results[1][2],
                opacity: 1,
                line: {
                    width: 2,
                    color: "#960078",
                    reversescale: false}

        });
        offset = offset_reset;
        data_left = 0;
        data_center = 0;
        data_right = 0;
    return [data_sum,data_individual]
    }

    function plot_data_transmission(){
        let transmission = [];
        let x_input = numeric.linspace(0,parseFloat($("#thickness").attr("max")),1000);
        let R = Math.pow(rf_v_d,2);//THIS IS WRONG SHOUDL ADD TO ONE
        $("#energy_reflection_coefficient-display").html(R.toFixed(2));

        for(let i = 0;i<x_input.length;i++){
            transmission.push(1/(1+(Math.pow(Math.sin(x_input[i]*k_2),2)*((4*R))/((1-R)^2))));
        }

        let T = 1/(1+(Math.pow(Math.sin(thickness*k_2),2)*(4*R))/((1-R)^2));//PHYSICS NOT CORRECT
        $("#energy_transmission_coefficient-display").html(T.toFixed(2));

        let transmission_line = {
              x: x_input,
              y: transmission,
              type: 'scatter',
              name: 'Energy Transmission Coefficient',
        };

        let marker = {
                x: [thickness],
                y: [T],
                showlegend: false,
                type: "scatter",
                mode:"markers",
                name: 'Energy Transmission Coefficient',
                marker: {color: "#002147", size: 12}
        };
        return [transmission_line,marker]
    }

    function plot_data_amplitude(){
        let amplitude = [];
        let x_input = numeric.linspace(0,terms);
        let even = [];
        let odd = [];
        for (let i = 0; i < 2*terms; i++){
            if ((i % 2) == 0){
                even.push(i)
            }else{
                odd.push(i)
            }
        }

        for(let i = 0;i<x_input.length;i++){
            amplitude.push(Math.abs(tr_v_d*tr_d_v*Math.pow(rf_d_v,even[i])*Math.cos(odd[i]*thickness*k_2)*E_0));
        }


        let amplitude_line = {
              x: x_input,
              y: amplitude,
              type: 'scatter',
              name: 'Ampltude of Transmission',
        };
        return [amplitude_line]
    }

    function update_graphs(){//update animation
        $("#thickness-display").html($("input#thickness").val());//update display
        $("#refractive_index-display").html($("input#refractive_index").val());

        thickness = parseFloat($("input#thickness").val());
        n2 = parseFloat($("input#refractive_index").val());
        offset_max = 2*spacing + spacing * terms;

        k_2 = (w*n2)/c;
        Z_diel = math.sqrt(mu_0/ep_0)/n2;

        rf_v_d = (1-(Z_vac/Z_diel))/(1+(Z_vac/Z_diel));
        rf_d_v = (1-(Z_diel/Z_vac))/(1+(Z_diel/Z_vac));
        tr_v_d = 2/(1+ Z_vac/Z_diel);
        tr_d_v = 2/(1+ Z_diel/Z_vac);

        side = (width-thickness)/2;
        x_data_left = numeric.linspace(0,side,size);
        x_data_center = numeric.linspace(side,side+thickness,size);
        x_data_right = numeric.linspace(side+thickness,width,size);

        let data = plot_data();

        Plotly.animate("graph_sum",
            {data: data[0]},//updated data
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );

        Plotly.animate("graph_individual",
            {data: data[1]},//updated data
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );

        Plotly.animate("graph transmission",
            {data: plot_data_transmission()},//updated data
            {
                fromcurrent: true,
                transition: {duration: 0,},
                frame: {duration: 0, redraw: false,},
                mode: "afterall"
            }
        );

        Plotly.animate("graph amplitude",
            {data: plot_data_amplitude()},//updated data
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

            let data = plot_data();
            t++;
            Plotly.animate("graph_sum",
                {data: data[0]},
                {
                    fromcurrent: true,
                    transition: {duration: 0,},
                    frame: {duration: 0, redraw: false,},
                    mode: "afterall"
                });
            Plotly.animate("graph_individual",
                {data: data[1]},
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
        $("#terms-display").html($("input#terms").val());//update display
        $("#thickness-display").html($("input#thickness").val());//update display
        $("#refractive_index-display").html($("input#refractive_index").val());

        let data = plot_data();

        Plotly.purge("graph_sum");
        Plotly.newPlot('graph_sum', data[0],plt.layout_sum);//create animation

        Plotly.purge("graph_individual");
        Plotly.newPlot('graph_individual', data[1],plt.layout_individual);//create animation

        Plotly.purge("graph transmission");
        Plotly.newPlot('graph transmission', plot_data_transmission(),plt.layout_trans);//create animation

        Plotly.purge("graph amplitude");
        Plotly.newPlot('graph amplitude', plot_data_amplitude(),plt.layout_amp);//create animation

        dom.tSlider.on("input", update_graphs);
        dom.rfSlider.on("input", update_graphs);

        $('#playButton').on('click', function() {
            document.getElementById("playButton").value = (isPlay) ? "Play" : "Stop";//change play/stop label
            isPlay = !isPlay;
            t = 0;//reset time
            requestAnimationFrame(play_loop);
        });
    };
initial();
});