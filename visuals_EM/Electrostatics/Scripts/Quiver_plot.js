$(window).on('load', function() {
    var max_range=10,N=16,N2=40,max_points=3;
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
        y=create_mesh()[1]
        Data = [{type: "contour",ncontours: 15, contours:{start:0,end: 1.5,coloring: "none"},x:[0],y:[0],z:[0],hoverinfo:"none"},
            { x:x, y:y, type:"scatter",
            mode:"markers", marker:{size:18},hoverinfo: "none" },

             ],
    layout = {
        hovermode: "closest",
        xaxis: {range: [0,max_range],scaleanchor: "x",scaleratio: 1,fixedrange: true,visible: false},
        yaxis: {range: [0,max_range],scaleanchor: "y",scaleratio: 1,fixedrange: true,visible: false},
     };
    Plotly.newPlot("graph", Data,layout,{displayModeBar: false});

    myPlot.on("plotly_click", function(data) {
        if (data.points[0].curveNumber==1){
        var opacity = [],x=[],y=[],z=[];
        for (let i = 0; i <= N2; i++) {
            for (let j = 0; j <= N2; j++) {
                console.log(i*max_range/N2)
                x.push(i*max_range/N2);
                y.push(j*max_range/N2);
                z.push(Math.sqrt(1/((i*max_range/N2-data.points[0].x)**2+(j*max_range/N2-data.points[0].y)**2)));
            }
            }
        for (let i = 0; i <Data[1].x.length ; i++) {
            if(i==data.points[0].pointNumber){
                opacity.push(1)
            }else{
                opacity.push(0)
            };
        };

        Plotly.animate(div="graph", {
            data: [{x:x,y:y,z:z,type:"contour"},{marker: {opacity:opacity,}}],
            traces: [0,1],
            layout: {}
        },{
            transition: {duration: 0},
            frame: {duration: 0, redraw: true}
        });
        };

    });
});
