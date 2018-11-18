$(window).on('load',function() {

    //initializing variables
    let p1, p2, p3;
    let t = 0;
    let r = 12.5;
    let played;
    let anim;
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
    };

    //buttons and interactivity
    $("button#playPauseButton").on('click', toggle);
    $("button#resetButton").on('click', reset);
    $("input#theta").on('input', handle_slider);

        let theta = parseFloat($("input#theta").val());
        let phi = 0 ;
        let azimuth = 0;
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let cosazimuth = Math.cos(azimuth);
        let sinazimuth = Math.sin(azimuth);
        let cosphi = Math.cos(phi); // the first ones
        let sinphi = Math.sin(phi);
        let cosphi_2 = Math.cos(phi + 0.785398163); //offset by pi/4
        let sinphi_2 = Math.sin(phi + 0.785398163);
        let cosphi_3 = Math.cos(phi + 1.57079632679); //offset by pi/2
        let sinphi_3 = Math.sin(phi + 1.57079632679);
        let cosphi_4 = Math.cos(phi + 2.35619449019); //offset by 3pi/4
        let sinphi_4 = Math.sin(phi + 2.35619449019);
        let cosphi_5 = Math.cos(phi + 3.14159265359); //offset by pi
        let sinphi_5 = Math.sin(phi + 3.14159265359);
        let cosphi_6 = Math.cos(phi - 2.35619449019); //offset by 3pi/4
        let sinphi_6 = Math.sin(phi - 2.35619449019);
        let cosphi_7 = Math.cos(phi - 1.57079632679); //offset by pi/2
        let sinphi_7 = Math.sin(phi - 1.57079632679);
        let cosphi_8 = Math.cos(phi - 0.785398163); //offset by -pi/4
        let sinphi_8 = Math.sin(phi - 0.785398163);


        p1 = [0, 20.62 * sintheta, 38 * sintheta,  20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3,20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r*sinphi_2, r*sinphi_3,r*sinphi_4, r*sinphi_5, r*sinphi_6, r*sinphi_7, r*sinphi_8,  r * sinphi];
        p3 = [0, 20.62 * costheta,  38 * costheta,  20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        for (let i = 0; i < p1.length; i++) { // applying rotation matrix using a for loop, currently works
            let a = p1[i];
            p1[i] = a * cosazimuth - p2[i] * sinazimuth;
            p2[i] = a * sinazimuth + p2[i] * cosazimuth; }

        let int = {
            type: "scatter3d",
            x: p1,
            y: p2,
            z: p3,
        };

        Plotly.plot("test", [int], plt.layout);

    function reset() { //resets all the variables and draws the gyroscope at its initial position
        played = true;
        toggle();
        t = 0;
        let theta = 0;
        let phi = 0; //doesn't seem to be changing whenever i change the power of i????
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let cosphi = Math.cos(phi);
        let sinphi = Math.sin(phi);
        let cosphi_2 = Math.cos(phi + 0.785398163); //offset by pi/4
        let sinphi_2 = Math.sin(phi + 0.785398163);
        let cosphi_3 = Math.cos(phi + 1.57079632679); //offset by pi/2
        let sinphi_3 = Math.sin(phi + 1.57079632679);
        let cosphi_4 = Math.cos(phi + 2.35619449019); //offset by 3pi/4
        let sinphi_4 = Math.sin(phi + 2.35619449019);
        let cosphi_5 = Math.cos(phi + 3.14159265359); //offset by pi
        let sinphi_5 = Math.sin(phi + 3.14159265359);
        let cosphi_6 = Math.cos(phi - 2.35619449019); //offset by 3pi/4
        let sinphi_6 = Math.sin(phi - 2.35619449019);
        let cosphi_7 = Math.cos(phi - 1.57079632679); //offset by pi/2
        let sinphi_7 = Math.sin(phi - 1.57079632679);
        let cosphi_8 = Math.cos(phi - 0.785398163); //offset by -pi/4
        let sinphi_8 = Math.sin(phi - 0.785398163);

        p1 = [0, 20.62 * sintheta, 38 * sintheta,  20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3,20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r*sinphi_2, r*sinphi_3,r*sinphi_4, r*sinphi_5, r*sinphi_6, r*sinphi_7, r*sinphi_8,  r * sinphi];
        p3 = [0, 20.62 * costheta,  38 * costheta,  20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        $("input#theta").val(theta); //assigning the values of the inputs back into the slider

        let int = {
            type: "scatter3d",
            x: p1,
            y: p2,
            z: p3,
        };

        Plotly.purge(test); // removes any previous plotly plots
        Plotly.plot("test", [int], plt.layout); // plots the gyroscope plots
    }

    function toggle() { // changing the button name and calls play() function every 10 milliseconds to draw the gyrocope
        if (played === true) {
            $("#playPauseButton").html("play");
            played = false;
            clearInterval(anim); //the clear interval means that it only stops at the end of the animation
            $("div#test").stop(true, true);
        }
        else {
            $("#playPauseButton").html("pause");
            played = true;
            anim = setInterval(play, 10); // calls the play function every 10 milliseconds
        }
        return played
    }

    function play() { // function that makes a plot of the gyroscope that changes every time it is called (because parameters are t dependent and the variable t is changed every loop)
        let azimuth = t*(3.14159265359 / 180) * 25;
        let theta = parseFloat($("input#theta").val());//converts slider value into float, converts that into a decimal and then back into a float to be added;//parsefloat converts string into number but rounds also..
        //theta += (3.14159265359 / 6000)*(t*1.01); //num.toFixed function is used otherwise parsefloat rounds the value up
        let phi =  15*t ; //-0.012*t**2 //doesn't seem to be changing whenever i change the power of i????
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let cosphi = Math.cos(phi);
        let sinphi = Math.sin(phi);
        let cosazimuth = Math.cos(azimuth);
        let sinazimuth = Math.sin(azimuth);
        let cosphi_2 = Math.cos(phi + 0.785398163); //offset by pi/4
        let sinphi_2 = Math.sin(phi + 0.785398163);
        let cosphi_3 = Math.cos(phi + 1.57079632679); //offset by pi/2
        let sinphi_3 = Math.sin(phi + 1.57079632679);
        let cosphi_4 = Math.cos(phi + 2.35619449019); //offset by 3pi/4
        let sinphi_4 = Math.sin(phi + 2.35619449019);
        let cosphi_5 = Math.cos(phi + 3.14159265359); //offset by pi
        let sinphi_5 = Math.sin(phi + 3.14159265359);
        let cosphi_6 = Math.cos(phi - 2.35619449019); //offset by 3pi/4
        let sinphi_6 = Math.sin(phi - 2.35619449019);
        let cosphi_7 = Math.cos(phi - 1.57079632679); //offset by pi/2
        let sinphi_7 = Math.sin(phi - 1.57079632679);
        let cosphi_8 = Math.cos(phi - 0.785398163); //offset by -pi/4
        let sinphi_8 = Math.sin(phi - 0.785398163);

        p1 = [0, 20.62 * sintheta, 38 * sintheta,  20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3,20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r*sinphi_2, r*sinphi_3,r*sinphi_4, r*sinphi_5, r*sinphi_6, r*sinphi_7, r*sinphi_8,  r * sinphi];
        p3 = [0, 20.62 * costheta,  38 * costheta,  20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        $("input#theta").val(theta); // feeding the values of the parameters back into the sliders

        for (let i = 0; i < p1.length; i++) { // applying rotation matrix as a for loop (rotation around z axis)
            let a = p1[i];
            p1[i] = a * cosazimuth - p2[i] * sinazimuth;
            p2[i] = a * sinazimuth + p2[i] * cosazimuth;
             } //p3 stays the same, because it's a rotation about the z axis.

        if (played === true) {
            Plotly.animate(div = "test", {
                    data: [{
                        x: p1, y: p2, z: p3
                    }],// dont touch this (apart from to change the variables)!!
                    traces: [0],
                    layout: {
                        "camera": {}
                    },
                }, {
                    transition: {duration: 0},
                    frame: {
                        duration: 0,
                        redraw: true
                    }
                }
            )
        } else {
        }
        t += 1/3 //tells the azimuthal and polar angles to keep changing in the for loop
            // }
        //when the time variable reaches a certain value, then it starts again
      return t
    }

    function calc() {// generates the positions of the points which are passed into the handle_slider function to be plotted
        let theta = parseFloat($("input#theta").val());
        let phi = 0 ;
        let azimuth = 0;
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let cosazimuth = Math.cos(azimuth);
        let sinazimuth = Math.sin(azimuth);
        let cosphi = Math.cos(phi); // the first ones
        let sinphi = Math.sin(phi);
        let cosphi_2 = Math.cos(phi + 0.785398163); //offset by pi/4
        let sinphi_2 = Math.sin(phi + 0.785398163);
        let cosphi_3 = Math.cos(phi + 1.57079632679); //offset by pi/2
        let sinphi_3 = Math.sin(phi + 1.57079632679);
        let cosphi_4 = Math.cos(phi + 2.35619449019); //offset by 3pi/4
        let sinphi_4 = Math.sin(phi + 2.35619449019);
        let cosphi_5 = Math.cos(phi + 3.14159265359); //offset by pi
        let sinphi_5 = Math.sin(phi + 3.14159265359);
        let cosphi_6 = Math.cos(phi - 2.35619449019); //offset by 3pi/4
        let sinphi_6 = Math.sin(phi - 2.35619449019);
        let cosphi_7 = Math.cos(phi - 1.57079632679); //offset by pi/2
        let sinphi_7 = Math.sin(phi - 1.57079632679);
        let cosphi_8 = Math.cos(phi - 0.785398163); //offset by -pi/4
        let sinphi_8 = Math.sin(phi - 0.785398163);


        p1 = [0, 20.62 * sintheta, 38 * sintheta,  20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3,20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r*sinphi_2, r*sinphi_3,r*sinphi_4, r*sinphi_5, r*sinphi_6, r*sinphi_7, r*sinphi_8,  r * sinphi];
        p3 = [0, 20.62 * costheta,  38 * costheta,  20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        for (let i = 0; i < p1.length; i++) { // applying rotation matrix using a for loop, currently works
            let a = p1[i];
            p1[i] = a * cosazimuth - p2[i] * sinazimuth;
            p2[i] = a * sinazimuth + p2[i] * cosazimuth;
        } return p1,p2,p3
    }

    function handle_slider(){// plots the points of the gyroscope whenever the value of the slider is changed
          calc();
                  Plotly.animate(div="test", {
                   data: [{
                       x: p1,
                       y: p2,
                       z: p3 }
                   ],
                   traces: [0],
                   layout: {"camera": {
              }},
        }, {
              transition: {duration: 0},
              frame: {duration: 0,
              redraw: true
              }
          }
        );
        return theta
    }


});
