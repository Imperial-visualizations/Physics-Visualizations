$(window).on('load',function() {
// need to draw disk + cause it to rotate
let p1=[0,5,0],// reads like a matrix
    p2=[0,0,0],
    p3=[0,20,0];

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
                        range: [-25, 25], autorange: false, zeroline: true, showspikes: false
                    },
                    yaxis: {
                        range: [-25, 25], autorange: false, zeroline: true, showspikes: false
                    },
                    zaxis: {
                        range: [-25, 25], autorange: false, zeroline: true, showspikes: false
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
        x: p1,
        y: p2,
        z: p3,
};
    Plotly.plot("test", [int], plt.layout);
    $("input#KE").on('input', handle_slider);
    $("input#angle").on('input', handle_slider);
    $("input#omega").on('input', handle_slider);

    function handle_slider(){<!--- creates a function which is later called-->

             let KE = parseFloat($("input#KE").val());
             let angle = parseFloat($("input#angle").val());
             let omega = parseFloat($("input#omega").val());
             let cosangle = Math.cos(angle);
             let sinangle = Math.sin(angle);
             //let coske = Math.cos(KE);
             //let cosomega = Math.cos(omega);

        p1[1]=20.62*sinangle; //20.62 is the length of the arrow
        p3[1]=20.62*cosangle;

          Plotly.animate(div="test", {
                   data: [{
                       x: p1, y: p2, z:p3 }
                   ],// dont touch this (apart from to change the variables)!!
                   traces: [0],
                   layout: {},
        }, {
            transition: {duration: 0},
            frame: {duration: 0}
        })
}
});

