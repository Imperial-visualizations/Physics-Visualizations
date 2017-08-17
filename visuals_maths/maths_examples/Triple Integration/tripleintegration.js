function Zintegratorelement(xinit, yinit,zinit,number){
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            zz.push(zinit[j] +(0.1*number))     
        }
        newcube = {
        type: "mesh3d",
        x: xinit ,
        y: yinit,
        z: zz,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 1.0,
        color: 'rgb(0,0,0)',  

        showscale: false, }
    return newcube
}


function Zintegratortotal(xinit, yinit,zinit,number){
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (zinit[j] != 0){
                zz.push(zinit[j] +(0.1*number))        
            } else 
            {
                zz.push(0)
            }
        }
        newcube = {
        type: "mesh3d",
        x: xinit ,
        y: yinit,
        z: zz,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        opacity: 1.0,
        color: 'rgb(165,25,0)',  

        showscale: false, }
    return newcube
}

function Yintegratorelement(xinit, yinit, zinit, number){
    yy = []
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            ylim = yinit[j] +(0.1*number)
            if (zinit[j] != 0) {
                zlim = 1 - ylim
            } else {
                zlim = 0 
            }
            yy.push(ylim)
            zz.push(zlim)
        }
    newcube = {
        type: "mesh3d",
        x: xinit,
        y: yy,
        z: zz,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 0.8,
        color: 'rgb(0,0,0)',  

        showscale: false,}
    return newcube
}

function Yintegratortotal(xinit, yinit, zinit, number){
    yy = []
    zz = []
    for (var j = 0 ; j < 8 ; j++) {  //This is to loop through 8 points of the cube
            if (yinit[j] != 0) {
            ylim = yinit[j] +(0.1*number)
            } else {
                ylim = 0 
            }
            if (zinit[j] != 0) {
                zlim = 1 - ylim
            } else {
                zlim = 0 
            }
            yy.push(ylim)
            zz.push(zlim)
        }
    newcube = {
        type: "mesh3d",
        x: xinit,
        y: yy,
        z: zz,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
        opacity: 0.8,
        color: 'rgb(210,64,0)',  

        showscale: false,}
    return newcube
}

function Xintegratorelement(xinit, yinit, zinit, number){
    xx = []
    yy = []
    zz = []
    for (var j = 0; j <6 ; j++){
        xlim = xinit[j] + (0.1*number)
        if (yinit[j] != 0) {
                ylim = 1 - xlim
            } else {
                ylim = 0 
            }
        if (zinit[j] != 0) {
                zlim = 1 - (ylim+xlim)
            } else {
                zlim = 0 
            }
            xx.push(xlim)
            yy.push(ylim)
            zz.push(zlim)
    }
            newcube = {
                type: "mesh3d",
                x: xx,
                y: yy,
                z: zz,
                i: [3,0,0,1,3,3],
                j: [5,1,3,3,0,2],
                k: [4,2,1,4,2,5],
                opacity: 0.5,
                color: '(0,0,0)', 
                showscale: false            
                }
    return newcube

}
function Xintegratortotal(xinit, yinit, zinit, number){
    xx = []
    yy = []
    zz = []
    for (var j = 0; j <6 ; j++){
        if (xinit[j] != 0){
            xlim = xinit[j] + (0.1*number)
            
        } else {
            xlim = 0
        }
        
        if (yinit[j] != 0) {
                ylim = 1 - xlim
            } else {
                ylim = 0 
            }
        if (zinit[j] != 0) {
                zlim = 1 - (ylim+xlim)
            } else {
                zlim = 0 
            }
            xx.push(xlim)
            yy.push(ylim)
            zz.push(zlim)
    }
            newcube = {
                type: "mesh3d",
                x: xx,
                y: yy,
                z: zz,
                i: [3,0,0,1,3,3],
                j: [5,1,3,3,0,2],
                k: [4,2,1,4,2,5],
                opacity: 0.5,
                color: 'rgb(255,255,255)', 
                showscale: false            
                }
    return newcube

}


var a = 1
var b = 1
var c = 1

var zz, yy
var frames = []
var data = [{
    type: "mesh3d",
    x: [0, 0, 0, a],
    y: [0, 0, b, 0],
    z: [0, c, 0, 0],
    i: [0, 0, 0, 1],
    j: [1, 2, 3, 2],
    k: [2, 3, 1, 3],
    intensity: [0, 0.33, 0.66, 1],
    colorscale: [
      [0, 'rgb(0,62,116)'],
      [1, 'rgb(0,62,116)']
    ],
    opacity: 0.5,
    showscale : false
  },{
    type: "mesh3d",
    x: [0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.1, 0.1] ,
    y: [0., 0.1, 0.1, 0., 0., 0.1, 0.1, 0.],
    z: [0., 0., 0., 0., 0.1, 0.1, 0.1, 0.1],
    i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
    j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
    k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
    intensity: [0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1],
    opacity: 0.3,
    colorscale: [
          [0, 'rgb(255,255,255)'],
          [0.5, 'rgb(0,133,202)'],
          [1, 'rgb(0,62,116)']
        ],

    showscale: false
    }
];



xxinit = [0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.1, 0.1];
yyinit = [0., 0.1, 0.1, 0., 0., 0.1, 0.1, 0.];
zzinit = [0., 0., 0., 0., 0.1, 0.1, 0.1, 0.1];
xxinit2 = [0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.1, 0.1] ,
yyinit2 = [0., 0.1, 0.1, 0.1, 0., 0.1, 0.1, 0.],
zzinit2 = [1., 0.9, 0.9, 0.8, 0.0, 0.0, 0.0, 0.0]
xxinit3 = [0.0, 0.0, 0.0, 0.1, 0.1, 0.1]
yyinit3 =[0.0, 0.0, 1.0, 0.0, 0.0, 0.9]
zzinit3 =  [0.0, 1.0, 0.0, 0.0, 0.9, 0.0]

  var frames = [];
for (var i = 0; i < 8; ++i) {
      frames.push({
        "data": [Zintegratortotal(xxinit,yyinit,zzinit,i),
                 Zintegratorelement(xxinit,yyinit,zzinit,i)],
        "name": i
    })
  }
for (var i = 0; i < 8; ++i) {
      frames.push({
        "data": [Yintegratortotal(xxinit2,yyinit2,zzinit2,i),
                Yintegratorelement(xxinit2,yyinit2,zzinit2,i)],
        "name": i + 8
    })
  }
for (var i = 0; i < 10; ++i) {
      frames.push({
        "data": [Xintegratortotal(xxinit3,yyinit3,zzinit3,i),
                Xintegratorelement(xxinit3,yyinit3,zzinit3,i)],
        "name": i + 16
    })
  }

var steps=[]

  for (var i = 0; i < 26; ++i) {
    steps.push({
      "label": "R1",
      "method": "animate",
      "args": [
        [i],
        {
          "mode": "immediate",
          "transition": {
            "duration": 300,
          },
          "frame": {
            "duration": 300,
            "redraw": false
          }
        }
      ]
    })
  }
  var sliders= [{
    "active": 0,
    "currentvalue": {"prefix": "Trasformation: "},
    "pad": {"t":10},
    "steps": steps
  }];
  var layout = {
    "width": 700, "height": 600,
    "margin": {l:0, r:0, t:0, b:0},
    "hovermode": "closest",
    "updatemenus": [
      {
        "x": 0.0, "y": 1,
        "xanchor": "left", "yanchor": "top",
        "showactive": false,
        "type": "buttons",
        "pad": {"t": 87, "r": 10},
        "buttons": [
          {
            "method": "animate",
            "args": [null, {"fromcurrent": true, "transition": {"duration": 150, "easing": "quadratic-in-out"}, "frame": {"duration": 150, "redraw":false}}],
            "label": "Play"
          },
          {
            "method": "animate",
            "args":[[null], {"mode": "immediate", "transition": {"duration": 0}, "frame": {"duration": 0, "redraw": false}}],
            "label": "Pause"
          }
        ]
      }
    ],
    "showlegend": false,
    "sliders": sliders,
      scene: {
    xaxis: {range: [-1, 2]},
    yaxis: {range: [-1, 2]},
    zaxis: {range: [-1, 2]}
    }
  }
  
Plotly.newPlot('graph', {data:data, frames: frames, layout: layout})