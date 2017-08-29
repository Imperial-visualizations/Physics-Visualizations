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
    for (var i = 0, n = frames[1].data.length; i < n; ++i) {
        data.push(frames[animateIndex].data[i]);
    }
    for (var i = 0, n = addOn.length; i < n; ++i){
        data.push(addOn[i]);
    }
    Plotly.newPlot('graph', data = data, layout = layout);
    reset();
}

function reset() {
    isPaused = true;
    animateIndex = 1;
    historyPlot(animateIndex);
    document.getElementById('playPause').value = (isPaused) ? "Play":"Pause";
    resetSlider();
    return;
}

function historyPlot(index) {
    animateIndex = index;
    var data = [];
    for (var i = 0, n = frames[index].data.length; i < n; ++i) {
        data.push(frames[index].data[i]);
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
        for (var i = 0, n = frames[1].data.length; i < n; ++i) {
            data.push(frames[animateIndex].data[i]);
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