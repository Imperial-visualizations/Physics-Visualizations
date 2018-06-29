$(window).on('load', function() {
    let max_range=10,N=16,N2=50,max_points=3,activepoints=[],opacity=[];
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

    var myPlot = document.getElementById("graph"),
        x=create_mesh()[0],
        y=create_mesh()[1];
    for (let i = 0; i <x.length; i++) {
        opacity.push(0);
    };
        Data = [{type: "contour",ncontours: 15, contours:{start:0,end: 1.6,coloring: "none"},x:[0],y:[0],z:[0],hoverinfo:"none"},
            { x:x, y:y, type:"scatter",
            mode:"markers", marker:{size:18,opacity:opacity},hoverinfo: "none" },
        ],

    layout = {
        hovermode: "closest",
        xaxis: {range: [0,max_range],scaleanchor: "x",scaleratio: 1,fixedrange: true,visible: false},
        yaxis: {range: [0,max_range],scaleanchor: "y",scaleratio: 1,fixedrange: true,visible: false},
     };

    Plotly.newPlot("graph", Data,layout,{displayModeBar: false});

    myPlot.on("plotly_click", function(data) {
        if (data.points[0].curveNumber==1 && $.inArray(data.points[0].pointNumber, activepoints)== -1){

        let x_contour=[],y_contour=[],z_contour=[],Fx=[],Fy=[];
        opacity[data.points[0].pointNumber]=1;
        activepoints.push(data.points[0].pointNumber);

        if (activepoints.length > max_points){
            opacity[activepoints[0]]=0
            activepoints.shift()
        };

        for (let i = 0; i <= N2; i++) {
            for (let j = 0; j <= N2; j++) {
                x_contour.push(i*max_range/N2);
                y_contour.push(j*max_range/N2);
                let dfx=0,dfy=0,U=0;
                for (let k = 0; k < activepoints.length; k++) {
                    let r = Math.sqrt((i*max_range/N2-x[activepoints[k]])**2+(j*max_range/N2-y[activepoints[k]])**2)
                    dfx+=(i*max_range/N2-x[activepoints[k]])/(r**2)
                    dfy+=(j*max_range/N2-y[activepoints[k]])/(r**2)
                    U+=1/r
                }
                z_contour.push(U);

            };
            };

        Plotly.animate(div="graph", {
            data: [{x:x_contour,y:y_contour,z:z_contour,type:"contour"},{marker: {opacity:opacity,}}],
            traces: [0,1],
            layout: {}
        },{
            transition: {duration: 0},
            frame: {duration: 0, redraw: true}
        });
        };

    });
});
