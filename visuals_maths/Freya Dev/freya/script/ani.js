'use strict';
// Global variables:
var animationFrames;
var animationIndex, animationLimit;
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

/** resets animation. */
function reset() {
    isPaused = true;
    animationIndex = 0;
    historyPlot(animationIndex);
    document.getElementById(playID).value = (isPaused) ? "Play":"Pause";
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

/** Updates animation. */
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

/**
 * pauses the computation.
 * @param {float} - time duration to pause the computation. (ms)
 */
function pauseComp(ms) {
    ms +=new Date().getTime();
    while (new Date() < ms){}
    return;
}

/** updates linked frame slider value and position. */
function updateSlider() {
    $(sliderID).val(animationIndex);
    $(sliderID + "Display").text(animationIndex);
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
    return;
}