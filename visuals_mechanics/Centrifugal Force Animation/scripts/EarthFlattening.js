let playing = true;
let omega = 0;
let buttonIncrease, buttonDecrease, img;
let show = false;
const radius = 160;
let width = $("#spin").width(), height = 0.6 * $(window).height(); //Set's width to be equal to the div with id spin in the HTML page, ensures it has full width

function preload() {
    img = loadImage("../assets/Earth.png");
}

function setup() {
    canvas = createCanvas(width,height, WEBGL);
    canvas.parent(spin);

    buttonShow = createButton('Show Original');
    buttonPlaying = createButton('Play/Pause');
    buttonPlaying.parent(spin);
    buttonShow.parent(spin);

    buttonShow.mouseOver(function() {
        show = !show;
    })

    buttonShow.mouseOut(function() {
        show = !show;
    })

    buttonPlaying.mousePressed(function() {
        if (playing) {
        noLoop()
        playing = false
    } else {
        loop()
        playing = true
    }
    });

    slider = createSlider(0, 1, 0.025, 0);
    slider.position(25, 0)
    slider.parent(animation)
    slider.style('width', '150px');
    sliderLabel = createP("Slider to control ω ")
    sliderLabel.parent(animation)
    sliderLabel.position(25,-25)
    sliderLabel.class("sliderText")

    function windowResized() {
        resizeCanvas($("#spin").width(), 0.6*windowHeight);
    }
}

function draw() {
    omega = slider.value()
    let flatteningFactor = 1 - omega * omega;
    // Mathematical expression for two semi-major axes of the oblate spheroid
    let a = Math.sqrt(radius * radius / flatteningFactor);
    background(25);

    rotateY((2*omega)*millis()/1000);
    // Plots the original sphere so user can compare the flattened Earth to a non-rotating Earth in real time
    if (show) {
        noFill()
        stroke(225);
        sphere(radius)
    }
    fill(173, 25, 96);
    texture(img)

    // Allows user's cursor to direct the light
    let locX = mouseX - height/2;
    let locY = mouseY - width/2;
    pointLight(255, 255, 255, 145, -155, 500)
    pointLight(255, 255, 255, locX, locY, 500)
    pointLight(255, 255, 255, locX, locY, 500)
    pointLight(255, 255, 255, locX, locY, 500)
    pointLight(255, 255, 255, locX, locY, 500)

    ellipsoid(a, radius*flatteningFactor, a, 128);

}
