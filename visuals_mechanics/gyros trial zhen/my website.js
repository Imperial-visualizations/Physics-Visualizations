$(window).on('load',function() {

    // plt is what the layout looks like


let prevx=[0, 0, 0], prevy=[0, 5, 10], prevz=[0,0,0];

let plt = {
            MaxTraceNo: 12,
            layout: {
                autosize: true,
                margin: {
                    l: 0, r: 0, b: 0, t: 1, pad: 5
                },
                scene: {
                    aspectmode: "cube",
                    xaxis: {
                        range: [-40, 40], autorange: false, zeroline: true, showspikes: false
                    },
                    yaxis: {
                        range: [-40, 40], autorange: false, zeroline: true, showspikes: false
                    },
                    zaxis: {
                        range: [-40, 40], autorange: false, zeroline: true, showspikes: false
                    }
                },
                hovermode: false,
                font: {
                    family: "Fira Sans",
                    size: 14
                }
            },
        },

    int = {
        type: "scatter3d",
        x: prevx,
        y: prevy,
        z: prevz,
};
    Plotly.plot("test", [int], plt.layout);
    $("input#KE").on('input', handle_slider);
    $("input#angle").on('input', handle_slider);
    $("input#omega").on('input', handle_slider);

    function handle_slider(){<!--- creates a function which is later called-->

             let KE = 2*parseFloat($("input#KE").val());
             let angle = 2*parseFloat($("input#angle").val());
             let omega = 2*parseFloat($("input#omega").val());
             let cosangle = Math.cos(angle);
             let coske = Math.cos(KE);
             let cosomega = Math.cos(omega)

        prevx[0]=3*coske;
        prevx[1]=3*cosangle;
        prevx[2]=3*cosomega;

        prevy[0]=3*coske;
        prevy[1]=3*cosangle;
        prevy[2]=3*cosomega;

        prevz[0]=3*coske;
        prevz[1]=3*cosangle;
        prevz[2]=3*cosomega;

          Plotly.animate(div="test", {
                   data: [{
                       x: prevx, y: prevy, z: prevz,
                   }

                   ],// dont touch this (apart from to change the variables)!!
                   traces: [0],
                   layout: {},
        }, {
            transition: {duration: 0},
            frame: {duration: 0}
        })
}
});

