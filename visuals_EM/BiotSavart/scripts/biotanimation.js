var layout = {
  width: 900,
  height: 450,
  autosize: true,
  scene: {
    xaxis: {range: [-1.5, 1.5], autorange:false, zeroline:false},
    yaxis: {range: [-1.5, 1.5], autorange:false, zeroline:false},
    zaxis: {range: [0, 1.5], autorange:false, zeroline:false},
    aspectmode: 'cube',
    camera: {center: {x:0,y:0,z:0},eye: {x: 1.5,y: -1.5,z: 0.8}}
  },
  margin: {},
          legend: {x:0.75,y:0.75,z:1,
            orientation: 'v',
            fontsize: 20
        },
        font: {
            family: 'Fira',
            size: 16,
            color: '#003E74',
            weight: 900
        },
    
};

var frames, addOn;
var animateIndex = 0, animateLimit = 0;
var duration = 50;
var isPaused = false;
var stops;
var idName;

function initAnimation(sliderName, allFrames, extra=[], layout={}, setDuration = 50, stopValues=[0, 0]) {
    idName = sliderName;
    duration = setDuration;
    frames = allFrames;
    animateLimit = frames.length;
    addOn = extra;
    stops = stopValues;
    isPaused = true;
    animateIndex = 0;
    var data = [];
    for (var i = 0, n = frames[i].length; i < n; ++i) {
        data.push(frames[animateIndex][i]);
    }
    for (var i = 0, n = addOn.length; i < n; ++i){
        data.push(addOn[i]);
    }
    Plotly.newPlot('graph', data = data, layout = layout);
    reset();
}

function reset() {
    isPaused = true;
    animateIndex = 0;
    historyPlot(animateIndex);
    document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
    resetSlider();
    
    return;
}

function historyPlot(index) {
    animateIndex = index;
    var data = [];
    for (var i = 0, n = frames[index].length; i < n; ++i) {
        data.push(frames[index][i]);
    }
    Plotly.animate(
        'graph',
        {data: data},
        {
            fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},
        }
    );
    isPaused = true;
    document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
    return;
}

function update() {
    animateIndex++;
    if (animateIndex === animateLimit) {
        isPaused = true;
        document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
        return;
    }
    if (!isPaused) {
        data = [];
        for (var i = 0, n = frames[1].length; i < n; ++i) { //this was basically frames[1].length
            data.push(frames[animateIndex][i]);
        }
        Plotly.animate(
            'graph',
            {data: data},
            {
                fromcurrent: true,
                transition: {duration: duration,},
                frame: {duration: duration, redraw: false,},
            }
        );
        pauseComp(duration + 1);
        requestAnimationFrame(update);
        resetSlider();
        //Add stopping functionality here!!!
        if (animateIndex === stops[0] || animateIndex === stops[1]){
            isPaused = !isPaused;
            document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
        }
    }
    return;
}

function pauseComp(ms) {
    ms +=new Date().getTime();
    while (new Date() < ms){}
    return;
}

function resetSlider() {
    $(idName).val(animateIndex);
    $(idName + "Display").text(animateIndex);
    return;
}

function startAnimation () {
    if (animateIndex < animateLimit){
        isPaused = !isPaused;
        document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
        requestAnimationFrame(update);
    }
    return;
}


// Import data in json file as "frames" variable (same data structure as initially output in Python)

    var ourRequest = new XMLHttpRequest();

    ourRequest.open('GET','https://rawgit.com/amna-askari/JSONfilesforVisualisations/master/BiotAnimate.JSON')

    ourRequest.onload=function(){
        
        var data = JSON.parse(ourRequest.responseText);
        Plotly.newPlot(div='graph',data.Frames[0][0],layout)
        console.log(data.Frames[0])
        initAnimation('#animation', data.Frames[0], extra=[], layout=layout, setDuration = 100, stopValues=[11,11])

        $('#animation').on('input', function(){
        i = $(this).val(); 
        console.log("the value of animation is" + i)
        Plotly.restyle(graph, {x: [data.Frames[0][i][0].x], y: [data.Frames[0][i][0].y],z:[data.Frames[0][i][0].z]},[0])
        Plotly.restyle(graph, {x: [data.Frames[0][i][1].x], y: [data.Frames[0][i][1].y],z:[data.Frames[0][i][1].z]},[1])   
        Plotly.restyle(graph, {x: [data.Frames[0][i][2].x], y: [data.Frames[0][i][2].y],z:[data.Frames[0][i][2].z]},[2])   
        Plotly.restyle(graph, {x: [data.Frames[0][i][3].x], y: [data.Frames[0][i][3].y],z:[data.Frames[0][i][3].z]},[3])   
        Plotly.restyle(graph, {x: [data.Frames[0][i][4].x], y: [data.Frames[0][i][4].y],z:[data.Frames[0][i][4].z]},[4])

        });
        
        //data.Frames[]
        $('#position').on('input', function(){
        k1 = $(this).val();
        var k = parseInt(k1)
        console.log(data.Frames[k])
        Plotly.restyle(graph, {x: [data.Frames[k][0][0].x], y: [data.Frames[k][0][0].y],z:[data.Frames[k][0][0].z]},[0])
        Plotly.restyle(graph, {x: [data.Frames[k][0][1].x], y: [data.Frames[k][0][1].y],z:[data.Frames[k][0][1].z]},[1])   
        Plotly.restyle(graph, {x: [data.Frames[k][0][2].x], y: [data.Frames[k][0][2].y],z:[data.Frames[k][0][2].z]},[2])   
        Plotly.restyle(graph, {x: [data.Frames[k][0][3].x], y: [data.Frames[k][0][3].y],z:[data.Frames[k][0][3].z]},[3])   
        Plotly.restyle(graph, {x: [data.Frames[k][0][4].x], y: [data.Frames[k][0][4].y],z:[data.Frames[k][0][4].z]},[4])
        Plotly.restyle(graph, {x: [data.Frames[k][0][5].x], y: [data.Frames[k][0][5].y],z:[data.Frames[k][0][5].z]},[5])
        initAnimation('#animation', data.Frames[k], extra=[], layout=layout, setDuration = 100, stopValues=[11,11])

        $('#animation').on('input', function(){
        i = $(this).val(); 
        console.log("the value of animation is" + i)
        Plotly.restyle(graph, {x: [data.Frames[k][i][0].x], y: [data.Frames[k][i][0].y],z:[data.Frames[k][i][0].z]},[0])
        Plotly.restyle(graph, {x: [data.Frames[k][i][1].x], y: [data.Frames[k][i][1].y],z:[data.Frames[k][i][1].z]},[1])   
        Plotly.restyle(graph, {x: [data.Frames[k][i][2].x], y: [data.Frames[k][i][2].y],z:[data.Frames[k][i][2].z]},[2])   
        Plotly.restyle(graph, {x: [data.Frames[k][i][3].x], y: [data.Frames[k][i][3].y],z:[data.Frames[k][i][3].z]},[3])   
        Plotly.restyle(graph, {x: [data.Frames[k][i][4].x], y: [data.Frames[k][i][4].y],z:[data.Frames[k][i][4].z]},[4])

        }); 
    
        });
    
        /*
        //data.Frames[position][frame][trace]
        initAnimation('#animation', data.Frames[k], extra=[], layout=layout, setDuration = 100, stopValues=[11,11])
        $('#animation').on('input', function(){
        i = $(this).val();
        Plotly.restyle(graph, {x: [data.Frames[k][i][0].x], y: [data.Frames[k][i][0].y],z:[data.Frames[k][i][0].z]},[0])
        Plotly.restyle(graph, {x: [data.Frames[k][i][1].x], y: [data.Frames[k][i][1].y],z:[data.Frames[k][i][1].z]},[1])   
        Plotly.restyle(graph, {x: [data.Frames[k][i][2].x], y: [data.Frames[k][i][2].y],z:[data.Frames[k][i][2].z]},[2])   
        Plotly.restyle(graph, {x: [data.Frames[k][i][3].x], y: [data.Frames[k][i][3].y],z:[data.Frames[k][i][3].z]},[3])   
        Plotly.restyle(graph, {x: [data.Frames[k][i][4].x], y: [data.Frames[k][i][4].y],z:[data.Frames[k][i][4].z]},[4])
            
    
        
                                }); */
        
        
      
      // For reference: dI: 0, dB: 1, R:2, Bfield:3, Circle:4, Point:5
        
        };


        ourRequest.send();
