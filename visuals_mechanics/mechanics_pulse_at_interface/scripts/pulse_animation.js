    // Defining variables (need to update later anyway so importing from e.g. json is meaningless)
    var n = 801;
    var x = [], y_i = [], y_r = [], y_t = [];
    var t = 0.0;
    var dt = 0.02;
    var v1 = 1;
    var alpha = valueSlider(parseInt($("#alpha").val()));
    var v2 = alpha*v1;
    var A = (v2-v1)/(v1+v2);
    var B = 2*v1/(v1+v2);
    var is_paused = true;
    var layout =
        {
            autosize: false,
            width: 700,
            height: 600,
            margin: {
                l: 50,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
            //plot_bgcolor: '#EBEEEE',
            xaxis: {
                range: [-10, 10]
            },
            yaxis: {
                range: [-1.6, 1.6]
            },
            font: {
                family: 'Lato',
                size: 18,
                color: '#003E74',
                weight: 900
            }
        };


    //(ax+b) *  exp(-(cx+d)^2 + (ex+f))
    // Variables to change wave shape
    var C = 0;
    var D = 1;

    // Slider values (for alpha)
    function valueSlider(position) {
        if (position <= 10) {
            return (position*0.1).toFixed(1);
        } else if (position < 20) {
            return position - 9;
        } else {
            return (position-20)*10+20;
        }
    }

    // Slider alpha
    $('#alpha').on('input', function () {
        alpha = valueSlider(parseInt($("#alpha").val()));
        $("#alphaDisplay").text(" " + alpha);
        v2 = alpha*v1;
         $("#v2Display").text(" " + v2.toFixed(1) + " m/s");
        A = (v2-v1)/(v1+v2);
        B = 2*v1/(v1+v2);
        onReset();
    })

    // Slider v1
    $('#v1').on('input', function () {
        v1 = parseInt($("#v1").val());
        $("#v1Display").text(" " + v1 + " m/s");
        v2 = alpha*v1;
        A = (v2-v1)/(v1+v2);
        B = 2*v1/(v1+v2);
        onReset();
    });

    // Slider pulse shape
    $('#shape1').on('input', function () {
        C = parseFloat($("#shape1").val());
        onReset();
    });

    // Slider pulse shape2
    $('#shape2').on('input', function () {
        D = parseFloat($("#shape2").val());
        onReset();
    });


    for (var i = 0; i < n; i++) {
        x[i] = -10 + i / 40;
        y_i[i] = D*(x[i] + 6 + C) * Math.exp(-1*((x[i] + 6) * (x[i] + 6)) + (x[i] + 6));
        //y_i[i] = (x[i]+3)*Math.exp(-( x[i]+3)*(x[i]+3)+(x[i]+3));
        y_r[i] = 0;
        y_t[i] = 0;
    }

    function onReset() {
        is_paused = true;
        t = 0;
        for (var i = 0; i < n; i++) {
            x[i] = -10 + i / 40;
            y_i[i] = D*(x[i] + 6 + C) * Math.exp(-1*((x[i] + 6) * (x[i] + 6)) + (x[i] + 6));
            y_r[i] = 0;
            y_t[i] = 0;
        }
        Plotly.animate('graph', {
                   data: [{y: y_i}, {y: y_r}, {y: y_t}]
               },
               {transition: {duration: 0}, frame: {duration: 0, redraw: false}
        }
           );
        document.getElementById('run_button').value = (is_paused) ? "Play":"Pause";

    }

    // Data
    // Initial plot
    var incident = {
        x: x,
        y: y_i,
        name: "incident",
        line: {width: 2, color: '#960078', simplify: false}
    };

    var reflected = {
        x: x,
        y: y_r,
        name: "reflected",
        line: {width: 2, color: '#E40043', simplify: false}
    };

    var transmitted = {
        x: x,
        y: y_t,
        name: "transmitted",
        line: {width: 2, color: '#00ACD7', simplify: false}
    };

    var boundary = {
        x: [0,0],
        y: [-4,4],
        mode: "lines",
        name: "boundary",
        line: {width: 3, color: 'black', simplify: false}
    };

    var xline = {
        x: [-15,15],
        y: [0,0],
        mode: "lines",
        showlegend: false,
        line: {width: 2, color: '#003E74', simplify: false}
    };

    // Plot graph with interactivity
    Plotly.plot('graph', [incident, reflected, transmitted, boundary, xline],
        layout
    );

   //-(1.0/3.0)*((-x-0.0)-1.0*(1+1.5))*exp(-((-x-0.0)-1.0*(1+1.5))*((-x-0.0)-1.0*(1.0+1.5))+((-x-0.0)-1.0*(1.0+1.5)))
   // Data update function for animation
   var t_start = t;

   function compute() {
       t += dt;
       // need to find a way to define time limit
       if (t < t_start + 16) {
           for (var i = 0; i < n; i++) {
               if (x[i] < 0) {
                   y_i[i] = D*(x[i] + 6 - v1 * t + C) * Math.exp(-1*((x[i] + 6 - v1 * t) * (x[i] + 6 - v1 * t)) + (x[i] + 6 - v1 * t));
                   y_r[i] = D*A * (-1*x[i] + 6 - v1 * t + C) * Math.exp(-1*((-1*x[i] + 6 - v1 * t) * (-1*x[i] + 6 - v1 * t)) + (-1*x[i] + 6 - v1 * t));
               }
               else if (x[i] > 0) {
                   y_t[i] = D* B * (v1 / v2 * x[i] + 6 - v1 * t + C) * Math.exp(-1*((v1 / v2 * x[i] + 6 - v1 * t) * (v1 / v2 * x[i] + 6 - v1 * t)) + (v1 / v2 * x[i] + 6 - v1 * t));
               }
           }
       }
   }


   // Looping function that updates plot
   function update() {


       if (is_paused === false) {

           compute();

           Plotly.animate('graph',
               {data: [{y: y_i}, {y: y_r}, {y: y_t}]},
               {transition: {duration: 0}, frame: {duration: 0, redraw: false} }
               // vastly speeds up animation but won't update any non-animated properties
           );
           if (v1 > v2) {
               if ((v2 == 0 && t > (19 / v1 )) | t > (9 / v1 + 10 / v2)) {
                   onReset();
               }
               else requestAnimationFrame(update);
           }
           else if (v2 >= v1) {
               if (t > (19 / v1)) {
                   onReset();
               }
               else requestAnimationFrame(update);
           }
       }


   }

   function onStart() {
       is_paused = !is_paused;
       document.getElementById('run_button').value = (is_paused) ? "Play":"Pause";
       requestAnimationFrame(update);
}
