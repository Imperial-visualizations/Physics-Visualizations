$(window).on('load', function() {
    let max_range=10,N=16,N2=800,max_points=3,max_lines=20,activepoints=[],charges=[],chargebutton=1,opacity=[];
    //creates a NXN array of equally spaced points
    function create_mesh() {
        var x=[], y=[];
        for (let i = 0; i <= N; i++) {
            for (let j = 0; j <= N; j++) {
            x.push(i*max_range/N);
            y.push(j*max_range/N);
        }
        };
        return([x,y])
    };

    function initial_fieldpoints(Qposition,R,number_of_lines){
        let x0=[],y0=[];
        for (let i = 0; i < number_of_lines; i++) {
            let theta = 2*i*(Math.PI/number_of_lines);
            x0.push(Qposition[0]+R*Math.cos(theta));
            y0.push(Qposition[1]+R*Math.sin(theta));
        };
        return([x0,y0])
    }

    function draw_fieldlines(initialx,initialy,streamlines){
            let x_field = [], y_field = [];
            x_field.push(initialx);
            y_field.push(initialy);
            for (let i = 0; i <= N2; i++) {
                let Fx = 0, Fy = 0, Ftotal = 0, currentx = x_field[x_field.length - 1],
                    currenty = y_field[y_field.length - 1];
                for (let k = 0; k < activepoints.length; k++) {
                    let r = Math.sqrt(((currentx - x[activepoints[k]]) ** 2 + (currenty - y[activepoints[k]]) ** 2));
                    Fx += (currentx - x[activepoints[k]]) / (r ** 3);
                    Fy += (currenty - y[activepoints[k]]) / (r ** 3);
                }
                Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2)
                let dx = (max_range / N2) * (Fx / Ftotal),
                    dy = (max_range / N2) * (Fy / Ftotal);
                x_field.push(currentx + dx);
                y_field.push(currenty + dy);
            }
                streamlines.push({x:x_field,y:y_field,visible: true});

    }

    function handle_opacity(){
        let opacity=[];
        for (let i = 0; i < x.length; i++) {
            opacity.push(0);
        }
        for (let i = 0; i < activepoints.length; i++) {
            opacity[activepoints[i]]=1
        }
        return opacity;
    }

    var myPlot = document.getElementById("graph"),
        x=create_mesh()[0],
        y=create_mesh()[1];
    //initialise the field lines with 0 0 0
    let Data=[]
    for (let i = 0; i < max_lines*max_points; i++) {
        Data.push({type: "scatter", mode: "line",line:{color: "#1A40B1"},x:[0],y:[0],hoverinfo:"none"})
    };
        Data.push({ x:x, y:y, type:"scatter", mode:"markers", marker:{size:18,opacity:handle_opacity(),color: "#D81C1C"},hoverinfo: "none" });
    layout = {
        margin: {
                    l: 10, r: 0, b: 0, t: 1, pad: 5
                },
        showlegend: false,
        hovermode: "closest",
        xaxis: {range: [0,max_range],scaleanchor: "x",scaleratio: 1,fixedrange: true,visible: false},
        yaxis: {range: [0,max_range],scaleanchor: "y",scaleratio: 1,fixedrange: true,visible: false},
     };

    Plotly.newPlot("graph", Data,layout,{displayModeBar: false});

    //the function that is carried out when a data point is clicked
    myPlot.on("plotly_click", function(data) {
        let streamlines=[],traces=[];
        if (data.points[0].curveNumber==max_lines*max_points){
        if (activepoints.includes(data.points[0].pointNumber)){
            for (let i = 0; i < activepoints.length; i++) {
                if (activepoints[i]==data.points[0].pointNumber){activepoints.splice(i,1)}
            }
        }else if(activepoints.length>=max_points){
            activepoints.shift();
            charges.shift();
            activepoints.push(data.points[0].pointNumber);
            charges.push(chargebutton);

        }else{
            activepoints.push(data.points[0].pointNumber);
            charges.push(chargebutton)
        };
        opacity = handle_opacity();
        let streamlines=[],traces=[],x0=[],y0=[];


            for (let i = 0; i < activepoints.length; i++) {
                let first_points= initial_fieldpoints([x[activepoints[i]],y[activepoints[i]]], 0.1, max_lines)
                for (let j = 0; j < first_points[0].length; j++) {
                    x0.push(first_points[0][j])
                    y0.push(first_points[1][j])
                }
            }

            for (let i = 0; i < max_points*max_lines; i++) {
                if (typeof x0[i] != 'undefined'){
                draw_fieldlines(x0[i],y0[i],streamlines)
                }else{streamlines.push({visible: false})};
                traces.push(i);
            }
        streamlines.push({marker: {opacity:opacity,}});
        traces.push(max_lines*max_points);
        Plotly.animate(div="graph", {
            data: streamlines,
            traces: traces,
            layout: {}
        },{
            transition: {duration: 0},
            frame: {duration: 0, redraw: true}
        });
        };

    });
});
