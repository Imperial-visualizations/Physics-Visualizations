'use strict';
// Global variables:
var animationFrames;
var animationIndex = 0, animationLimit;
var duration = 50;
var isPaused = false;
var stops;
var playID, sliderID;

/**
 * initialises the animation frames.
 * @param {string} playButtonID - Play button ID.
 * @param {object} allFrames - The frames needed to animate.
 * @param {list} extra - list of objects with inanimated plots.
 * @param {object} layout - layout for the animation.
 * @param {float} setDuration - frame transition duration (ms).
 * @param {list} stopValues - stopping points (limit: upto 2 stops can be introduced)
 */
function initAnimation(playButtonID, allFrames, extra=[], layout={}, setDuration = 50, stopValues=[]) {
    Plotly.purge("graph");
    playID = playButtonID;
    sliderID = "#" + playID.slice() + "Slider";
    duration = setDuration;
    animationFrames = allFrames;
    animationLimit = animationFrames.length;
    stops = stopValues;
    isPaused = true;
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
    Plotly.newPlot("graph", data, layout);
    reset();
}

/** resets animation. */
function reset() {
    isPaused = true;
    animationIndex = 0;
    historyPlot(animationIndex);
    document.getElementById(playID).value = "Play";
    updateSlider();
    return;
}

/**
 * plots index-th frame
 * @param {int} index - index of the frame
 */
function historyPlot(index) {
    animationIndex = index;
    var data = [];
    for (var i = 0, n = animationFrames[index].data.length; i < n; ++i) {
        data.push(animationFrames[index].data[i]);
    }
    Plotly.animate('graph',
        {data: data},
        {   fromcurrent: true,
            transition: {duration: 0,},
            frame: {duration: 0, redraw: false,},},
    );
    isPaused = true;
    document.getElementById(playID).value = "Play";
    return;
}

/** Updates animation. */
function update() {
    if (++animationIndex === animationLimit) {
        isPaused = true;
        document.getElementById(playID).value = "Reset";
        return 0;
    }
    if (!isPaused) {
        var data = [];
        for (var i = 0, n = animationFrames[animationIndex].data.length; i < n; ++i) {
            data.push(animationFrames[animationIndex].data[i]);
        }
        Plotly.animate('graph',
            {data: data},
            {   fromcurrent: true,
                transition: {duration: duration,},
                frame: {duration: duration, redraw: false,},
                mode: "next"},
        );
        for (var i=0; i<stops.length; ++i) {
            if (animationIndex === stops[i]){
                isPaused = !isPaused;
                document.getElementById(playID).value = "Continue";
                return 0;
            }
        }
        updateSlider();
        requestAnimationFrame(update);
    }
    return 0;
}

/** updates linked frame slider value and position. */
function updateSlider() {
    $(sliderID).val(animationIndex);
    $(sliderID + "Display").text(animationIndex);
    return 0;
}

/** Starts the animation. */
function startAnimation() {
    if (animationIndex < animationLimit){
        isPaused = !isPaused;
        document.getElementById(playID).value = (isPaused) ? "Play":"Pause";
        requestAnimationFrame(update);
    } else {
        reset();
    }
    return 0;
}

function addEmptyObjects3d(data, numberObj){
    for (var i=0; i < numberObj; ++i){
        data.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            line: {width: 0}
        });
    }
    return;
}