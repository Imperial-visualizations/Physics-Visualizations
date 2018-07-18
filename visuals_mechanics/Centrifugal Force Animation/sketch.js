let playing = true;
let omega = 0;
let buttonIncrease;
let buttonDecrease;
let show = false;
let img;
const radius = 250;
let width = $("#spin").width(), height = 0.8*$(window).height();

function preload() {
    //img = loadImage("Earth_flat.jpg");
    img = loadImage("Earth_smaller.png")
}



function setup() {
    canvas = createCanvas(width,height, WEBGL);
    canvas.parent(spin);
    //buttonDecrease = createButton('Decrease Speed');
    //buttonIncrease = createButton('Increase Speed');
    buttonShow = createButton('Show');
    /*buttonIncrease.mousePressed(function() {
        omega += 0.025;
    })

    buttonDecrease.mousePressed(function() {
        omega -= 0.025;
    })
    */
    buttonShow.mouseOver(function() {
        show = !show;
    })

    buttonShow.mouseOut(function() {
        show = !show;
    })
    slider = createSlider(0, 1, 0, 0);
    slider.position(25, 100);
    slider.style('width', '150px');
}

function draw() {
  omega = slider.value()
  let flatteningFactor = 1-omega*omega;
  //let a = Math.sqrt(radius*radius/(4*flatteningFactor));
  background(255);
  rotateY((2*omega)*millis()/1000);
  if (show === true) {
      noFill();
      stroke(100);
      sphere(radius);
  }
  fill(173, 25, 96);
  texture(img)
  ellipsoid(radius*(1+0.1*omega), radius*flatteningFactor, radius*(1+0.1*omega), 125);
}

function mousePressed() {
    if (mouseX < 800 && mouseY < 640 && mouseX > 80 && mouseY > 50) {
        if (playing) {
            noLoop()
            playing = false
        } else {
            loop()
            playing = true
        }
    }
}

function showOriginal() {
    console.log('This works')
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        omega -= 0.025
    }

    if (keyCode === RIGHT_ARROW) {
        omega += 0.025
    }
}
/*
function mouseDragged() {
    if (mouseX > 400){
        omega += 0.005
    } else {omega -= 0.005}

    if (omega > 0.9) {
        omega = 0.9;
    } else if (omega <= 0) {
        omega = 0;
    }
}
*/