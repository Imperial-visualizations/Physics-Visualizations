$(window).on('load',function() {
// $("Slider.Onclick") function{
// when the button is pressed, cause the azimuthal and polar angle to change
//
//
// }

    let p1,p2,p3 ;
           // point = [1,1,1]
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


    $("input#azimuth").on('input', handle_slider);
    $("input#theta").on('input', handle_slider);
    $("input#rotate").on('input', handle_slider);
    let r = 12.5;

    $("#playPauseButton").on('click', function(){

        //change the slider input and polar angle so we have a genuine rotating gyroscope
        function handleplaybutton(){
        function nexttimestep(){
            let R = parseFloat(dom.animationInput.val())
            if(R==10){
                dr= 0; //used to be -0.4
            }else if (R==1){
                dr=0.4;
            };
            R = dr + R;
            dom.animationInput.val(R)
    });*/

    function calc(){<!--- creates a function which is later called-->

             let azimuth = parseFloat($("input#azimuth").val());
             let theta = parseFloat($("input#theta").val());
             let phi = parseFloat($("input#rotate").val());
             let costheta = Math.cos(theta);
             let sintheta = Math.sin(theta);
             let cosphi = Math.cos(phi);
             let sinphi = Math.sin(phi);
             let cosphi_plus = Math.cos(phi + 1.57079632679); //offset by pi/2
             let sinphi_plus = Math.sin(phi + 1.57079632679);
             let cosphi_minus = Math.cos(phi - 1.57079632679); //offset by pi/2
             let sinphi_minus = Math.sin(phi - 1.57079632679);
             let cosphi_pi = Math.cos(phi + 3.14159265359); //offset by pi/2
             let sinphi_pi = Math.sin(phi + 3.14159265359);
             let cosazimuth = Math.cos(azimuth);
             let sinazimuth = Math.sin(azimuth);
             /*let cosazimuth_plus = Math.cos(azimuth + 0.451548);
             let cosazimuth_minus = Math.cos(azimuth - 0.451548); //arctan(10/20.62)
             let sinazimuth_plus = Math.cos(azimuth + 0.451548);
             let sinazimuth_minus = Math.cos(azimuth - 0.451548); //arctan(10/20.62)*/
             //let coske = Math.cos(KE);
             //let cosomega = Math.cos(omega);

        p1 = [0, 20.62*sintheta, 20.62*sintheta + r*costheta*cosphi, 20.62*sintheta + r*costheta*cosphi_pi, 20.62*sintheta + r*costheta*cosphi_pi, 20.62*sintheta + r*costheta*cosphi_plus ,20.62*sintheta + r*costheta*cosphi_minus],// reads like a matrix
        p2 = [0, 0, r*sinphi, r*sinphi_pi, r*sinphi_pi,  r*sinphi_plus, r*sinphi_minus];
        p3 = [0, 20.62*costheta,20.62*costheta - r*cosphi*sintheta, 20.62*costheta-r*sintheta*cosphi_pi, 20.62*costheta- r*sintheta*cosphi_pi, 20.62*costheta- r*sintheta*cosphi_plus, 20.62*costheta - r*sintheta*cosphi_minus];

        for (let i = 0; i < p1.length; i++) { // applying rotation matrix as a for loop
             let a = p1[i];
            p1[i] = a * cosazimuth - p2[i] * sinazimuth;
            p2[i] = a * sinazimuth + p2[i] * cosazimuth;
            p3[i] = p3[i];
        }
        /*p1[1]=20.62*sintheta*cosazimuth; //20.62 is the length of the arrow
        p2[1]=20.62*sintheta*sinazimuth;
        p3[1]=20.62*costheta;*/
        // generating the gyro ring made up of particles that rotates with it
        /*p1[3] = p1[1] + r*costheta*cosphi;//*cosazimuth;//*sinangle;
        p2[3] = p2[1] + r*sinphi;//*sinangle; // just *sinazimuth?
        p3[3] = p3[1] - r*cosphi*sintheta;//*cosangle;*/
        //p1[4] = p1[1] + r*costheta*cosphi_pi;//*cosazimuth;//*cosazimuth;//*sinangle;
        //p2[4] = p2[1] + r*sinphi_pi;//*sinazimuth;//sinangle;
        //p3[4] = p3[1] - r*sintheta*cosphi_pi;//*cosangle;
        //p1[5] = p1[1] + r*costheta*cosphi_plus;//*cosazimuth_plus;//*sinangle;//*cosazimuth; // clockwise
        //p2[5] = p2[1] + r*sinphi_plus;//*sinazimuth_minus;//*sinazimuth;//*sinangle;//*sinazimuth;
        //p3[5] = p3[1] - r*sintheta*cosphi_plus;//*cosangle;
        //p1[6] = p1[1] + r*costheta*cosphi_minus;//*cosazimuth_plus;//*sinangle;//*cosazimuth; //clockwise
        //p2[6] = p2[1] + r*sinphi_minus;//*sinazimuth_minus;//*sinazimuth;//*sinazimuth*sinangle;//*sinazimuth;
        //p3[6] = p3[1] - r*sintheta*cosphi_minus;//*cosangle;//+ r*cosangle*cosphi2;
}

function handle_slider(){
        calc();
                  Plotly.animate(div="test", {
                   data: [{
                       x: p1, y: p2, z:p3 }
                   ],// dont touch this (apart from to change the variables)!!
                   traces: [0],
                   layout: {"camera": {
              }},
        }, {
              transition: {duration: 0},
              frame: {duration: 0,
              redraw: true
              }
          }
        )

}






calc();
        int = {
            type: "scatter3d",
            x: p1,
            y: p2,
            z: p3,
        };

    Plotly.plot("test", [int], plt.layout);

});

