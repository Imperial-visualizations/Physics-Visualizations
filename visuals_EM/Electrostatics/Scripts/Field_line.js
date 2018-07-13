//set global variables
let width = $('#sketch-holder').width(), height = $('#sketch-holder').height(),activepoints = [],activenegpoints = [],
activepospoints = [];
const n_lines = 7,Nvertices=200,max_range=800, R=16, square_size=100,padding = 20;

$("input#pos").on('click',handleposbutton)

$("input#neg").on('click',handlenegbutton)

function handleposbutton(){
    if (activepoints.length<=6) {
        let q = new charge(1, random(width), random(height))
        activepospoints.push(q)
        activepoints.push(q)
    };
}

function handlenegbutton(){
    if(activepoints.length<=6) {
        let q = new charge(-1, random(width), random(height))
        activenegpoints.push(q)
        activepoints.push(q)
    };
}

//draw canvas in which everything p5.js happens
function setup() {
  let canvas = createCanvas(width,height);
    canvas.parent('sketch-holder');
};

//main function that repeats as soon as the last line is called
function draw() {
    clear();
    background('#ffffff');
    let thisFrameMouseX = mouseX;
    let thisFrameMouseY = mouseY;

    noStroke();
    fill("#02893B");
    rect(width/2, height/2, square_size, square_size);

    for (let i = 0; i < activepoints.length; i++) {
        if(activepoints[i].clicked==true){
            activepoints[i].dragposition(thisFrameMouseX,thisFrameMouseY)
        }
    }

    for (let i = 0; i <activepospoints.length; i++) {

        stroke(1);
        fill(color(activepospoints[i].color));
        ellipse(activepospoints[i].x,activepospoints[i].y,R*2);

            let [x0,y0]=initial_fieldpoints([activepospoints[i].x,activepospoints[i].y],activepospoints[i].r,n_lines);
            for (let j = 0; j < x0.length; j++) {
                draw_fieldlines(x0[j],y0[j])
            }
    }
        for (let i = 0; i <activenegpoints.length; i++) {
        stroke(1);
        fill(color(activenegpoints[i].color));
        ellipse(activenegpoints[i].x,activenegpoints[i].y,R*2);

    }


};

//functions that 'move' a charge when it is clicked
function mousePressed() {
    for (let i = 0; i < activepoints.length; i++) {
        activepoints[i].pressed()
    }
};

function mouseReleased() {
    for (let i = 0; i < activepoints.length; i++) {
        activepoints[i].clicked=false;
    }
};


class charge {
    constructor(q,x,y){
        this.q = q
        this.x = x
        this.y=y
        this.r = R
        this.clicked = false
    if (q>0){
        this.color = "#DD2501"
    }
    else{ this.color = "#006EAF"}
}

    pressed(){
        if (dist(mouseX,mouseY,this.x,this.y)<this.r){
            this.clicked = true
        };
    }
    dragposition(mx,my){
        let pointsnearmouse = 0
        for (let i = 0; i < activepoints.length; i++) {
            if(activepoints[i]!=this){
                if (parseFloat(dist(this.x,this.y,activepoints[i].x,activepoints[i].y))<=R*2.2 && parseFloat(dist(mx,my,activepoints[i].x,activepoints[i].y))<=R*2){
                    pointsnearmouse=1
            }
            }
        }
            if(pointsnearmouse==0){
                this.x=mx
                this.y=my
        }

}};


function initial_fieldpoints(Qposition,R,number_of_lines){
    let x0=[],y0=[];
    for (let i = 0; i < number_of_lines; i++) {
        let theta = 2*i*(Math.PI/number_of_lines);
        x0.push(Qposition[0]+R*Math.cos(theta));
        y0.push(Qposition[1]+R*Math.sin(theta));
    };
    return([x0,y0])
    };

function draw_fieldlines(initialx,initialy){
    let xfield0 = initialx, yfield0 = initialy, xfield1=0,yfield1=0;
    for (let i = 0;i<1000;i++) {
        if(xfield0>width+padding || xfield0<0-padding||yfield0>height+padding||yfield0<0-padding){return};
        let Fx = 0, Fy = 0, Ftotal;
        for (let k = 0; k < activepoints.length; k++) {
            let r = Math.sqrt(((xfield0- activepoints[k].x) ** 2 + (yfield0 -activepoints[k].y) ** 2));
            if(r<1){
                return;
            }
            Fx += (activepoints[k].q)*(xfield0 - activepoints[k].x) / (Math.pow(r,3));
            Fy += (activepoints[k].q)*(yfield0 - activepoints[k].y) / (Math.pow(r,3));
            };
        Ftotal = Math.sqrt(Fx ** 2 + Fy ** 2)
        let dx = (max_range / Nvertices) * (Fx / Ftotal),
            dy = (max_range / Nvertices) * (Fy / Ftotal);
        xfield1=xfield0 + dx;
        yfield1=yfield0+dy;
        line(xfield0, yfield0, xfield1, yfield1)
        xfield0 = parseFloat(xfield1)
        yfield0=parseFloat(yfield1)
        }
    };