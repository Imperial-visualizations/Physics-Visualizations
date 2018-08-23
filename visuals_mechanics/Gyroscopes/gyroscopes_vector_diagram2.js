$(window).on('load',function() {

    let plt = { //layout features
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

    let p1, p2, p3; // these 3 will become the 3 dimensional array of arrays that form the gyroscope
    let t = 0; //so that the visualisation starts at the beginning
    let r = 15; // default radius of the gyroscope
    let played; // boolean variable that stores if button pressed or not
    let anim; // animation variable for gyroscope
    let speedup = false; //initially playing at normal speed
    let rate;

    $("#speedupButton").html("Speed up");// the speed up / slow down button initially shows speed up
    $("input#inertia").on('input', inertia_decision);
    $("button#playPauseButton").on('click', toggle);  // if the website is interacted with, the button name is changed/ pause occurs
    $("button#resetButton").on('click', reset);
    $("input#slowmo").on('input', play);
    $("button#speedupButton").on('click', speed_toggle);

    //generating and plotting a graph of gyroscope precession rate

    var graphlayout1 = {
        title: 'Plot of energies against time',
        xaxis: {
            title: 'Time/s'
        },
        yaxis: {
            title: 'Energy as a fraction of the total energy'
        }
    };

    let totalke = {
        mode: "scatter",
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        y: [1,1,1,1,1,1,1,1,1,1],//let phi = -0.0065*t**2 + 15*t+25 ; //doesn't seem to be changing whenev
        name: 'Total Energy of the gyroscope'
    };

    let gpe = {
        mode: "scatter",
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        y: [1,0.3678794412,0.1353352832,0.04978706837,0.0183156,0.006737946,0.0024787521,0.000911882,0.0003354626,0.0001234098041],
        //let phi = -0.0065*t**2 + 15*t+25 ; //doesn't seem to be changing whenev
        name: "Gyroscope GPE"
    };

    let ke = {
        mode: "scatter",
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        y: [0, 0.6321205589, 0.8646647168, 0.9502129316, 0.9816843611, 0.993262053, 0.9975212478, 0.999088118, 0.9996645374, 0.9998765902, 0.9999546001],//let phi = -0.0065*t**2 + 15*t+25 ; //doesn't seem to be changing whenev
        name: "Gyroscope KE"
    };

    Plotly.plot("energygraph", [totalke,gpe,ke], graphlayout1);

    // graph slider show and hide
    $('.graphSlider').on('click', function () {
        let text = $($(this).children('.showhide')[0]).is(":hidden") ? ["Hide " + $($(this).children('.showhide')).attr('label'), 180] : ["Show " + $($(this).children('.showhide')).attr('label'), 0];
        //$($(this).children('.showhide')[0]).slideToggle(400);
        $($(this).children("span")[0]).html(text[0]);
        $($(this).children("svg")[0]).css("transform", "rotate(" + text[1] + "deg)");
    });

    function inertia_decision() { //if played = true the inertia is changed during the animation
        //console.log("inertia decision");
        if (played === true) { //the gyroscope wheel radius is also changed and the corresponding precession rate
            play() // the play function is called, which executes another step in the gyro movement
        }
        else {
            handle_slider(); //if the animation is not going then the handle slider function is called and the ring radius changed - instead of getting the gyro to move
        }

    }

    function reset() { //resets all parameters to their initial values and plots the gyro in its initial position
        played = true;
        t = 0;
        toggle();
        let azimuth = 0;
        let theta = 0;
        let phi = 0; //doesn't seem to be changing whenever i change the power of i????
        let r = 15;
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let cosphi = Math.cos(phi);
        let sinphi = Math.sin(phi);
        //below are the variables and points that make up the gyroscope wheel
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

        p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];


        $("input#inertia").val(r);
        $("input#gpetoke").val(0);

        int = {
            type: "scatter3d",
            x: p1, //should be the default p1, p2 and p3
            y: p2, //should be the default p1, p2 and p3
            z: p3,
        };
        Plotly.purge(test);
        Plotly.plot("test", [int], plt.layout);
    }

    function speed_toggle() { //this is a button to speed up/slow down
        if (speedup === true) {
            $("#speedupButton").html("Speed up");
            speedup = false;
        }
        else {
            $("#speedupButton").html("Slow down");
            speedup = true;
            //console.log("now should be repeating");
      //      anim = setInterval(play, 20);
            //played = true
        }
        return speedup
    }

    function toggle() { //changing the button text and starting/stopping the gyro
        if (played === true) {
            $("#playPauseButton").html("play");
            played = false;
            clearInterval(anim); //the clear interval means that it only stops at the end of the animation
            $("div#test").stop(true, true);
        }
        else {
            $("#playPauseButton").html("pause");
            played = true;
            //console.log("now should be repeating");
            anim = setInterval(play, 20);
        }
        return played
    }

    function play() { //plots the gyroscope (with a parameter t that changes, so the gyroscope position changes with time)
        if (speedup === true) {
            rate = 1.6
        }
        else {
            rate = 1
        }
        let r = $("input#inertia").val(); //taking the value of radius from the slider
        let azimuth = t ** 1.45 * (3.14159265359 / 180) * 400 / r;   //how the azimuthal angle that the gyro makes with the x axis
        let theta = (3.14159265359 / 80) * t; //how theta changes over time
        let phi;
        if (t < 18.75) { //phi changes over time, until it stops
            phi = -0.12 * t ** 2 + 4.5 * t
        }
        else
            phi = 42.1875
            ;
        let gpetoke = 6 + 0.5 * t ** 1.05; // how the value of the slider value changes over time
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let cosphi = Math.cos(phi);
        let sinphi = Math.sin(phi);
        //below are the variables and points that make up the gyroscope wheel
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

        p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        //$("input#theta").val(theta); // feeding the values of the parameters back into the sliders
        //$("input#azimuth").val(azimuth);
        //$("input#rotate").val(phi);
        $("input#gpetoke").val(gpetoke);

        for (let i = 0; i < p1.length; i++) { // applying rotation matrix as a for loop (rotation around z axis)
            let a = p1[i];
            p1[i] = a * cosazimuth - p2[i] * sinazimuth;
            p2[i] = a * sinazimuth + p2[i] * cosazimuth;
        } //p3 stays the same, because it's a rotation about the z axis.

        if (played === true) {
              let data_plotted = [];
            let points = {//add trace for line of field line
                        type: "scatter3d",
                        mode: "points",
                        name: "gyro",
                        //line: {color: "blue"},
                        x: p1,
                        y: p2,
                        z: p3
                    };
            data_plotted.push(points);

            Plotly.animate("test",
                {data : data_plotted}, {
                    transition: {duration: 0},
                    frame: {
                        duration: 0,
                        redraw: true
                    }
                }
            )
        } else {}

        if (t < 35) {
            t += (rate / 15)
        } //tells the azimuthal and polar angles to keep changing in the for loop
        else {
            t = 0; //when the time reaches a certain point, then it starts again
        }
        return t; // the "time" parameter is returned so it can be used in the reset function
    }


    function handle_slider() { // plots the new points of the gyroscope whenever the value of the slider is changed

        let theta = 0;
        let phi = 0;
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
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


        let r = $("input#inertia").val(); //taking the value of radius from the slider

        p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        Plotly.animate(div = "test", { // actively plotting the gyroscope
                data: [{ //use plotly.animate instead of plotly.plot as plotly.plot plots NEW plots ON TOP OF old ones whereas animate changes the current ones.
                    x: p1, y: p2, z: p3
                }
                ],
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

    }

    function initial() {  // initially plotting the gyroscope when the page is loaded
        let azimuth = 0;
        let theta = 0;
        let phi = 0;

        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let cosphi = Math.cos(phi);
        let sinphi = Math.sin(phi);
        //below are the variables and points that make up the gyroscope wheel
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

        // x, y and z values of the gyroscopes

        p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        int = {
            type: "scatter3d",
            x: p1,
            y: p2,
            z: p3,
        };
        Plotly.plot("test", [int], plt.layout); // shows the first plot when the page is loaded
    }

    initial();

});