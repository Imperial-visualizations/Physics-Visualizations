let playing = true;
let omega = 0;
let buttonIncrease;
let buttonDecrease;
let show = false;
let img;
let dragging = true;
const radius = 160;
let width = $("#spin").width(), height = 0.6*$(window).height();
//$("input[type=range]").on('click', () => {dragging != dragging});
//$("input[type=range]").on('mouseup', () => {dragging = false});

function preload() {
    img = loadImage("Earth_smaller.png");
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
}

function draw() {
    omega = slider.value()
    let flatteningFactor = 1 - omega * omega;
    let a = Math.sqrt(radius * radius / flatteningFactor);
    background(15);
    if (!dragging) {
        orbitControl();
    }
  rotateY((2*omega)*millis()/1000);
  if (show) {
      noFill();
      stroke(225);
      sphere(radius);
  }
  fill(173, 25, 96);
  texture(img)
  ellipsoid(a, radius*flatteningFactor, a, 128);
}
