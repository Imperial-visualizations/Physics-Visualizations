let playing = true;
let omega = 0;
let buttonIncrease;
let buttonDecrease;
let show = false;
let img;
let orbit = true;
const radius = 160;
let width = $("#spin").width(), height = 0.6 * $(window).height();

function preload() {
    img = loadImage("Earth.png");
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
    slider = createSlider(0, 0.8, 0.025, 0);
    slider.position(25, 0)
    slider.parent(animation)
    slider.style('width', '150px');

    $("input[type=range]").mousedown(function() {
        orbit = false;
    });
    $("input[type=range]").mouseup(function() {
            orbit = true;
    });

    $("button").click(function() {
        orbit = !orbit
    })
}

function draw() {
    omega = slider.value()
    let flatteningFactor = 1 - omega * omega;
    let a = Math.sqrt(radius * radius / flatteningFactor);

    background(25);
    if (orbit) {
        //orbitControl();
    }
    rotateY((2*omega)*millis()/1000);
    if (show) {
        noFill()
        stroke(225);
        sphere(radius)
    }
    fill(173, 25, 96);
    texture(img)

    let locX = mouseX - height/2;
    let locY = mouseY - width/2;

    pointLight(255, 255, 255, locX, locY, 500)
    pointLight(255, 255, 255, locX, locY, 500)
    pointLight(255, 255, 255, locX, locY, 500)
    pointLight(255, 255, 255, locX, locY, 500)
    pointLight(255, 255, 255, locX, locY, 500)


    ellipsoid(a, radius*flatteningFactor, a, 128);

}
