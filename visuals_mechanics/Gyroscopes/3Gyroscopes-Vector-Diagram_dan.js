$(window).on('load',function() {

    let data_arrow;
    let p1, p2, p3; // these 3 will become the 3 dimensional array of arrays that form the gyroscope
    let t = 0; //so that the visualisation starts at the beginning
    let rate;
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

    $("button#playPauseButton").on('click', toggle);  // if the website is interacted with, the specific function is called
    $("button#resetButton").on('click', reset);
    $("input#azimuth").on('input', handle_slider);
    $("input#theta").on('input', handle_slider);
    $("input#rotate").on('input', handle_slider);
    $("input#slowmo").on('input', play);
    $("input#inertia").on('input', inertia_decision);
    $("button#speedupButton").on('click', speed_toggle);

// function that shows/hides the graph buttons when clicked.

    $('.graphSlider').on('click', function () {
        let text = $($(this).children('.showhide')[0]).is(":hidden") ? ["Hide " + $($(this).children('.showhide')).attr('label'), 180] : ["Show " + $($(this).children('.showhide')).attr('label'), 0];
        $($(this).children('.showhide')[0]).slideToggle(400);
        $($(this).children("span")[0]).html(text[0]);
        $($(this).children("svg")[0]).css("transform", "rotate(" + text[1] + "deg)");
    });

    var graphlayout1 = {
        title: 'Plot of wheel angular speed against time',
        xaxis: {
            title: 'Time/s'
        },
        yaxis: {
            title: 'Wheel angular speed/ Initial speed'
        }
    };

    let wheelrotationrate = {
        mode: "scatter",
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        y: [1,0.3678794412,0.1353352832,0.04978706837,0.0183156,0.006737946,0.0024787521,0.000911882,0.0003354626,0.0001234098041],
        //let phi = -0.0065*t**2 + 15*t+25 ; //doesn't seem to be changing whenev
        name: "Wheel rotation rate"
    };

    Plotly.plot("wheelrotationgraph", [wheelrotationrate], graphlayout1);

    var graphlayout2 = {
        title: 'Plot of precession rate against time',
        xaxis: {
            title: 'Time/s'
        },
        yaxis: {
            title: 'Precession rate/Final precession rate'
        }
    };

    let precessionrate = {
        mode: "scatter",
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        y: [0, 0.6321205589, 0.8646647168, 0.9502129316, 0.9816843611, 0.993262053, 0.9975212478, 0.999088118, 0.9996645374, 0.9998765902, 0.9999546001],//let phi = -0.0065*t**2 + 15*t+25 ; //doesn't seem to be changing whenev
        name: "Gyroscope precession rate"
    };

    Plotly.plot("precessionrategraph", [precessionrate], graphlayout2);

    function inertia_decision() { //if played = true the inertia is changed during the animation
        if (played === true) { //the gyroscope wheel radius is also changed and the corresponding precession rate
            play() // the play function is called, which executes another step in the gyro movement
        }
        else {
            handle_slider() //if the animation is not going then the handle slider function is called and the ring radius changed - instead of getting the gyro to move
        }

    }

    let r = 15; // default radius of the gyroscope
    let played; // boolean variable that stores if button pressed or not
    let anim; // animation variable for gyroscope
    let speedup = false; //initially playing at normal speed
    $("#speedupButton").html("Speed up");// the speed up / slow down button initially shows speed up

    function reset() { //resets all parameters to their initial values
        played = true;
        t = 0;
        toggle();

        let azimuth = 0;
        let theta = 0;
        let phi = 0; //doesn't seem to be changing whenever i change the power of i????
        let r = 15;
        let rate = 3.33;
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

        // p1 shows the x coordinates of the points, p2 shows the y coordinates, and p3 shows the z coordinates
        // read DOWNWARDS for a single point (at the same array index)
        p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        $("input#theta").val(theta); //assigning the values of the inputs back into the sliders
        $("input#azimuth").val(azimuth);
        $("input#rotate").val(phi);
        $("input#inertia").val(r);
        $("input#slowmo").val(rate);
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
            anim = setInterval(play, 10);
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


    function play() { //executes a SINGLE step in the play

        if (speedup === true) {
            rate = 1.6
        }
        else {
            rate = 1
        }

        let r = parseFloat($("input#inertia").val());
        let azimuth = t ** 1.45 * (3.14159265359 / 180) * 400 / r;   //how the azimuthal angle that the gyro makes with the x axis
        let theta = (3.14159265359 / 80) * t; //how theta changes over time
        let phi;
        if (t < 18.75) { //phi changes over time, until it stops
            phi = -0.12 * t ** 2 + 4.5 * t
        }
        else
            phi = 42.1875
            ;

        let gpetoke = 6 + 0.5 * t ** 1.05; // how the value of the slider value changes over time (heuristic)
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

        let data_plotted_x = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        let data_plotted_y = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        let data_plotted_z = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        $("input#theta").val(theta); // feeding the values of the parameters back into the sliders
        //$("input#azimuth").val(azimuth);
        //$("input#rotate").val(phi);
        //$("input#gpetoke").val(gpetoke);

        if (played === true) {
            let p1 = [];
            let p2 = [];
            let p3 = [];

            let points = {
                        type: "scatter3d",
                        x: data_plotted_x,
                        y: data_plotted_y,
                        z: data_plotted_z,
                        //u:[],
                        //v:[],
                        //w:[],
                    };

            //console.log(data_plotted);
            //pushing the initial gyroscope points into p1,p2 and p3 to be plotted
            points.x.push(arrow(t).x);
            points.y.push(arrow(t).y);
            points.z.push(arrow(t).z);
            //points.u.push(arrow(t).u);
            //points.v.push(arrow(t).v);
            //points.w.push(arrow(t).w);
            //console.log("before " + arrow(t));
            //let product = arrow(t).push(points);
            //console.log("after " + arrow(t));
            //console.log(points);
            //p1.push(points.x);
            //p2.push(points.y);
            //p3.push(points.z);

            for (let i = 0; i < points.x.length; i++) { // applying rotation matrix as a for loop (rotation around z axis)
            let a = points.x[i];
            points.x[i] = a * cosazimuth - points.y[i] * sinazimuth;
            points.y[i] = a * sinazimuth + points.y[i] * cosazimuth;
        }
            console.log(points);

        /*draw_arrow(points, [0, , ], [0, , ], [0, , ], '#0080FF');

        data.push([{//L vector
                name: 'Angular momentum',
                type: 'scatter3d',
                mode: 'lines',
                line: {width: 10, dash: 'solid', color: '#0080FF'},
                legendgroup: 'l',
                x: [0, Lx],
                y: [0, Ly],
                z: [0, Lz],
            }])*/


        //   = arrow(0).concat(int);
            //console.log("start");
             //console.log("points is" + data_plotted_x);

           //data_plotted.concat(points);
  //          data_plotted = arrow(t).push(points);
            //let arrow_plot = arrow(t);

            //data_plotted.push(arrow_plot);
            //console.log("data");
           //console.log(data_plotted);

            Plotly.animate("test",
                { // actively plotting the gyroscope
                data: [{
                    x:points.x,
                    y:points.y,
                    z:points.z,
                    }],
                traces: [0], //should this be zero?
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

        } else {}

        if (t < 35) {
            t += (rate / 7)
        } //tells the azimuthal and polar angles to keep changing in the for loop
        else {
            t = 0; //when the time reaches a certain point, then it starts again
        }
        return t; // the "time" parameter is returned so it can be used in the reset function
    //    return points;
    };


    function draw_arrow(obj, pointsx, pointsy, pointsz, color) {
        /* Returns an arrowhead based on an inputted line */
        var x = pointsx[1],
            y = pointsy[1],
            z = pointsz[1],
            u = 0.2*(pointsx[1] - pointsx[0]),
            v = 0.2*(pointsy[1] - pointsy[0]),
            w = 0.2*(pointsz[1] - pointsz[0]);
        obj.push({
            type: "cone",
            colorscale: [[0, color],[1,color]],
            x: [x],
            y: [y],
            z: [z],
            u: [u],
            v: [v],
            w: [w],
            sizemode: "absolute",
            sizeref: 0.3*Math.sqrt(Vector.fromArray([x,y,z]).length()),
            showscale: false,
            legendgroup: 's',
        });
    };


    function arrow(t) {
        let theta = (3.14159265359 / 80) * t; //how theta changes over time
        let r = $("input#inertia").val(); //taking the value of radius from the slider
        let azimuth = t ** 1.45 * (3.14159265359 / 180) * 400 / r;   //how the azimuthal angle that the gyro makes with the x axis
        //let cosazimuth = Math.cos(azimuth);
        //let sinazimuth = Math.sin(azimuth);
        let costheta = Math.cos(theta);
        let sintheta = Math.sin(theta);
        let headx = [20.62 * sintheta, 20.62 * sintheta, 20.62 * sintheta];
        let heady = [0, 0, 0];
        let headz = [20.62 * costheta, 20.62 * costheta, 20.62 * costheta];
        let tailx = [20.62 * sintheta, 30 * sintheta, 20.62 * sintheta];
        let taily = [0, 0, 7];
        let tailz = [20.62 * costheta - 7, 30 * costheta, 20.62 * costheta];
        let data_arrowx = [];
        let data_arrowy = [];
        let data_arrowz = [];
        let data_arrow = [];
        let colour = ["red", "green", "blue"];

        for (let i = 0; i < headx.length; i++) {
            data_arrowx.push(headx[i], tailx[i]);
            data_arrowy.push(heady[i], taily[i]);
            data_arrowz.push(headz[i], tailz[i]);

            data_arrow.push({
                type: "scatter3d",
                mode: "lines",
                name: "Vectors",
                line: {width: 10, color: colour[i]},
                x: [headx[i], tailx[i]],
                y: [heady[i], taily[i]],
                z: [headz[i], tailz[i]]
            });

            let [x_2, y_2, z_2, u_2, v_2, w_2] = make_arrows([headx[i], tailx[i]], [heady[i], taily[i]], [headz[i], tailz[i]]);
            data_arrow.push({
                type: "cone",
                colorscale: [[0, colour[i]], [1, colour[i]]],
                name: "arrow",
                x: [x_2],
                y: [y_2],
                z: [z_2],
                u: [u_2],
                v: [v_2],
                w: [w_2],
                sizemode: "absolute",
                sizeref: 6,
                showscale: false,
            })
        };
        return data_arrow;
        }


    function make_arrows(pointsx, pointsy, pointsz) {//return data required to construct field line arrows
        /** Returns an arrowhead based on an inputted line */
        var x = pointsx[1],
            y = pointsy[1],
            z = pointsz[[1]],
            u = 0.1 * (pointsx[1] - pointsx[0]),
            v = 0.1 * (pointsy[1] - pointsy[0]),
            w = 0.1 * (pointsz[1] - pointsz[0]);
        return [x, y, z, u, v, w]
    };




    function calc() {<!--- creates a function which is later called-->
        let azimuth = parseFloat($("input#azimuth").val());
        let theta = parseFloat($("input#theta").val());
        let phi = parseFloat($("input#rotate").val());
        let r = parseFloat($("input#inertia").val());
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

        p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

        for (let i = 0; i < p1.length; i++) { // applying rotation matrix as a for loop
            let a = p1[i];
            p1[i] = a * cosazimuth - p2[i] * sinazimuth;
            p2[i] = a * sinazimuth + p2[i] * cosazimuth;
            p3[i] = p3[i];
        }
    }

    function handle_slider() { //changes the values of the parameters based on what is changed
        calc();

        let r = $("input#inertia").val();
        p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
        p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
        p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];


        Plotly.animate(div = "test", { // actively plotting the gyroscope
                data: [{ //use plotly.animate instead of plotly.plot as plotly.plot plots NEW plots ON TOP OF old ones whereas animate changes the current ones.
                    x: p1, y: p2, z: p3
                }
                ],// dont touch this (apart from to change the variables)!!
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

// graph slider show and hide
    $('.graphSlider').on('click', function () {
        let text = $($(this).children('.showhide2')[0]).is(":hidden") ? ["Hide " + $($(this).children('.showhide2')).attr('label'), 180] : ["Show " + $($(this).children('.showhide2')).attr('label'), 0];
        $($(this).children('.showhide2')[0]).slideToggle(400);
        $($(this).children("span")[0]).html(text[0]);
        $($(this).children("svg")[0]).css("transform", "rotate(" + text[1] + "deg)");

    });

    // initially plotting the gyroscope when the page is loaded
    calc();
    let azimuth = 0;
    let theta = 0;
    let phi = 0;
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

    p1 = [0, 20.62 * sintheta, 38 * sintheta, 20.62 * sintheta + r * costheta * cosphi, 20.62 * sintheta + r * costheta * cosphi_2, 20.62 * sintheta + r * costheta * cosphi_3, 20.62 * sintheta + r * costheta * cosphi_4, 20.62 * sintheta + r * costheta * cosphi_5, 20.62 * sintheta + r * costheta * cosphi_6, 20.62 * sintheta + r * costheta * cosphi_7, 20.62 * sintheta + r * costheta * cosphi_8, 20.62 * sintheta + r * costheta * cosphi];// reads like a matrix
    p2 = [0, 0, 0, r * sinphi, r * sinphi_2, r * sinphi_3, r * sinphi_4, r * sinphi_5, r * sinphi_6, r * sinphi_7, r * sinphi_8, r * sinphi];
    p3 = [0, 20.62 * costheta, 38 * costheta, 20.62 * costheta - r * cosphi * sintheta, 20.62 * costheta - r * sintheta * cosphi_2, 20.62 * costheta - r * sintheta * cosphi_3, 20.62 * costheta - r * sintheta * cosphi_4, 20.62 * costheta - r * sintheta * cosphi_5, 20.62 * costheta - r * sintheta * cosphi_6, 20.62 * costheta - r * sintheta * cosphi_7, 20.62 * costheta - r * sintheta * cosphi_8, 20.62 * costheta - r * cosphi * sintheta];

    int = {
        type: "scatter3d",
        x: p1,
        y: p2,
        z: p3,
    };
    let data_plot = arrow(0).concat(int);
    //console.log("start");
    console.log(data_plot);
    //console.log(points);
    Plotly.plot("test", data_plot, plt.layout); // shows the first plot when the page is loaded
});