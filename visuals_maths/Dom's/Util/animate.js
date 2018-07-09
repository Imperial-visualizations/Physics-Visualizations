'use strict';
var animationFrames;
var animationIndex, animationLimit;
var duration = 50;
var isPaused = false;
var stops;
var playID, sliderID;

function initAnimation(playButtonID, allFrames, extra=[], layout={}, setDuration = 50, stopValues=[0, 0]) {
    Plotly.purge("graph");
    playID = playButtonID;
    sliderID = "#" + playID.slice() + "Slider";
    duration = setDuration;
    animationFrames = allFrames;
    animationLimit = animationFrames.length;
    stops = stopValues;
    isPaused = true;
    animationIndex = 0;
    var data = [];
    for (var i = 0, n = animationFrames[0].data.length; i < n; ++i) {
        data.push(
            {
                type: animationFrames[0].data.type,
            }
        );
    }
    for (var i = 0, n = extra.length; i < n; ++i){
        data.push(extra[i]);
    }
    Plotly.newPlot("graph", data = data, layout = layout);
    reset();
}

function reset() {
    isPaused = true;
    animationIndex = 0;
    historyPlot(animationIndex);
    document.getElementById(playID).value = (isPaused) ? "Play":"Pause";
    updateSlider();
    return;
}

function historyPlot(index) {
    animationIndex = index;
    var data = [];
    for (var i = 0, n = animationFrames[index].data.length; i < n; ++i) {
        data.push(animationFrames[index].data[i]);
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
    document.getElementById(playID).value = (isPaused) ? "Play":"Pause";
    return;
}

function update() {
    animationIndex++;
    if (animationIndex === animationLimit) {
        isPaused = true;
        document.getElementById(playID).value = "Reset";
        return;
    }
    if (!isPaused) {
        var data = [];
        for (var i = 0, n = animationFrames[1].data.length; i < n; ++i) {
            data.push(animationFrames[animationIndex].data[i]);
        }
        Plotly.animate(
            'graph',
            {data: data},
            {
                fromcurrent: true,
                transition: {duration: duration,},
                frame: {duration: duration, redraw: false,},
                mode: "next"
            }
        );
        pauseComp(duration + 5);
        requestAnimationFrame(update);
        updateSlider();
        //Add stopping functionality here!!!
        if (animationIndex === stops[0] || animationIndex === stops[1]){
            isPaused = !isPaused;
            document.getElementById(playID).value = "Continue";
        }
    }
    return;
}

function pauseComp(ms) {
    ms +=new Date().getTime();
    while (new Date() < ms){}
    return;
}

function updateSlider() {
    $(sliderID).val(animationIndex);
    $(sliderID + "Display").text(animationIndex);
}

function startAnimation() {
    if (animationIndex < animationLimit){
        isPaused = !isPaused;
        document.getElementById(playID).value = (isPaused) ? "Play":"Pause";
        requestAnimationFrame(update);
    } else {
        reset();
    }
    return;
}