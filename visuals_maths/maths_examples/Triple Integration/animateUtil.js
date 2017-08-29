var frames, addOn;
var animateIndex = 0, animateLimit = 0;
var duration = 150;
var isPaused = false;
var stops;
var idName;
var counter = 1

function init(sliderName, allFrames, extra=[], stopValues=[0, 0]) {
    idName = sliderName;
    frames = allFrames;
    animateLimit = frames.length;
    addOn = extra;
    stops = stopValues;
    console.log(stops);
    isPaused = true;
    animateIndex = 0;
    var data = [];
    data.push(frames[animateIndex].data[0]);
    data.push(frames[animateIndex].data[1]);
    for (var i = 0, n = addOn.length; i < n; ++i){
        data.push(addOn[i]);
    }
    Plotly.newPlot('graph', data = data);
    reset();
}

function reset() {
    isPaused = true;
    animateIndex = 1;
    historyPlot(animateIndex);
    document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
    resetSlider();
    counter = 1
    document.getElementById('innerXYZ').style.display = "block"
    document.getElementById('middleXYZ').style.display = "none"
    document.getElementById('outerXYZ').style.display = "none"
    return;
}

function historyPlot(index) {
    animateIndex = index;
    var data = [];
    data.push(frames[index].data[0]);
    data.push(frames[index].data[1]);
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
        data.push(frames[animateIndex].data[0]);
        data.push(frames[animateIndex].data[1]);
        Plotly.animate(
            'graph',
            {data: data},
            {
                fromcurrent: true,
                transition: {duration: duration,},
                frame: {duration: duration, redraw: false,},
            }
        );
        pauseComp(duration + 5);
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

function startAnimation (type) {
    if (type === 1){
        if (animateIndex < animateLimit){
        isPaused = !isPaused;
        document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
        requestAnimationFrame(update);
    }
    if (counter === 1){
        document.getElementById('innerXYZ').style.display = "block"
        document.getElementById('middleXYZ').style.display = "none"
        document.getElementById('outerXYZ').style.display = "none"
        counter = counter + 1 
    } else if (counter === 2){
        document.getElementById('innerXYZ').style.display = "none"
        document.getElementById('middleXYZ').style.display = "block"
        document.getElementById('outerXYZ').style.display = "none"

        counter = counter + 1     
    } else if (counter === 3){
        document.getElementById('innerXYZ').style.display = "none"
        document.getElementById('middleXYZ').style.display = "none"
        document.getElementById('outerXYZ').style.display = "block"
        counter = counter + 1  
    }
    }else if (type ===2) {
        if (animateIndex < animateLimit){
        isPaused = !isPaused;
        document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
        requestAnimationFrame(update);
    }
    if (counter === 1){
        document.getElementById('innerZYX').style.display = "block"
        document.getElementById('middleZYX').style.display = "none"
        document.getElementById('outerZYX').style.display = "none"
        counter = counter + 1 
    } else if (counter === 2){
        document.getElementById('innerZYX').style.display = "none"
        document.getElementById('middleZYX').style.display = "block"
        document.getElementById('outerZYX').style.display = "none"

        counter = counter + 1     
    } else if (counter === 3){
        document.getElementById('innerZYX').style.display = "none"
        document.getElementById('middleZYX').style.display = "none"
        document.getElementById('outerZYX').style.display = "block"
        counter = counter + 1  
    }   
    }
    return;
}