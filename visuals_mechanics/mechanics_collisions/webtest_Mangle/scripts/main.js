/*
++++++++++++++++++++++++++++++++++++
Pre-defined objects & Global variables
++++++++++++++++++++++++++++++++++++
*/
function Vector(x,y){
    // !! A constructor function of object "Vector" that has 2 arguments. !!
    this.x=x;
    this.y=y;
    this.getArg = function() {
        return Math.atan2(this.y, this.x);
    };
    this.getMag = function(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    this.toString = function(){
        return "("+this.x.toString()+","+this.y.toString()+")";
    };
};

function zeroV(){
    // !! A function that doesn't have arguments. !!
    return new Vector(0,0);
};
// Equivalent:
// zeroV = function(){
//     return new Vector(0,0);
// };

vCal = function(input1, action, input2){
    //Vector Calculations
    switch(action) {
        case "-":
            return new Vector( input1.x - input2.x, input1.y - input2.y );
        case "+":
            return new Vector( input1.x + input2.x, input1.y + input2.y );
        case "*":
            return new Vector( input2 * input1.x, input2 * input1.y );
        case "rotate":
            return new Vector( input1.x * Math.cos(input2) - input1.y * Math.sin(input2), input1.x * Math.sin(input2) + input1.y * Math.cos(input2));
        default:

    }
};

function degToRad(deg) {
    return Math.PI * deg / 180;
}

var isRunning = false;
var isColliding = false;

var canvasWidth = 1200;
var canvasHeight = 1200;
var ballradius = 40;

var ball1_Lab, ball2_Lab, ball1_CoM, ball2_CoM, initAngle, borders;


ball1_Lab = {
    // !! A variable also an object that has 4 properties. !!
    spriteInstance: undefined,
    mass: 1,
    initr: new Vector((canvasWidth / 2 - 100),(canvasHeight / 6)),
    v: new Vector(0,0)
};
ball2_Lab = {
    spriteInstance: undefined,
    mass: 1,
    initr: new Vector((canvasWidth / 2 + 100),(canvasHeight / 6)),
    v: new Vector(0,0)
};
ball1_CoM ={
    spriteInstance: undefined,
    mass: getReducedMass(),
    initr: new Vector((canvasWidth / 2 - 100),(canvasHeight* 3 / 6)),
    v: new Vector(0,0)
};

ball2_CoM ={
    spriteInstance: undefined,
    mass: getReducedMass(),
    initr: new Vector((canvasWidth / 2 + 100),(canvasHeight * 3 / 6)),
    v: new Vector(0,0)
};

$(".inputs").each(function () {
    // To update the displayed value in HTML
    $(this).on('change', function () {
        $("#"+$(this).attr("id") + "Display").text(  $(this).val() + $("#"+$(this).attr("id")+"Display").attr("data-unit")  );
    });
});
/*
$('#ballCollisionAngle').on('change', function () {
    // To update the position of the balls
    initAngle = degToRad(parseFloat($("#ballCollisionAngle").val()));
    ball1_Lab.spriteInstance.y = ball1_Lab.initr.y + 0.5 * ballradius * Math.sin(initAngle);
    ball2_Lab.spriteInstance.y = ball2_Lab.initr.y - 0.5 * ballradius * Math.sin(initAngle);
});
*/
$("#runButton").on('click', function () {
    ball1_Lab.mass = parseFloat($("#ball1LabMass").val());
    ball2_Lab.mass = parseFloat($("#ball2LabMass").val());
    ball1_Lab.v.x = parseFloat($("#ball1LabVelocityX").val());
    ball1_Lab.v.y = parseFloat($("#ball1LabVelocityY").val());

    ball1_CoM.v = vCal(ball1_Lab.v,'-',getCoMV());
    ball2_CoM.v = vCal(ball2_Lab.v,'-',getCoMV());
    initAngle = degToRad(parseFloat($("#ballCollisionAngle").val()));

    if (!isRunning) {
        $("#runButton").val("Reset");
    } else if(isRunning){
        //Run reset code
        resetSimulation();
        $("#runButton").val("Run");
    }

    isRunning = !isRunning;
});

function getReducedMass() {
    return (ball1_Lab.mass * ball2_Lab.mass) / (ball1_Lab.mass + ball2_Lab.mass);
}
function getCoMR(){
    return vCal( vCal(vCal(ball1_Lab.spriteInstance, "*", ball1_Lab.mass ), "+",vCal(ball2_Lab.spriteInstance, "*", ball2_Lab.mass) ) , "*", 1.0/(ball1_Lab.mass + ball2_Lab.mass) );
}
function getCoMV() {
    //return new vCal(new Vector(ball1_Lab.v.x*ball1_Lab.mass + ball2_Lab.v.x*ball2_Lab.mass,ball1_Lab.v.y*ball1_Lab.mass + ball2_Lab.v.y*ball2_Lab.mass),'*',1.0/(ball1_Lab.mass +ball2_Lab.mass));
    return vCal( vCal(vCal(ball1_Lab.v, "*", ball1_Lab.mass ), "+",vCal(ball2_Lab.v, "*", ball2_Lab.mass) ) , "*", 1.0/(ball1_Lab.mass + ball2_Lab.mass) );
}
function getKE(){
    return 0.5*ball1_Lab.mass*Math.pow(ball1_Lab.v.getMag(),2) + 0.5*ball2_Lab.mass*Math.pow(ball2_Lab.v.getMag(),2);
}




function resetSimulation(){
    ball1_Lab.spriteInstance.x = ball1_Lab.initr.x;
    ball1_Lab.spriteInstance.y = ball1_Lab.initr.y;
    ball2_Lab.spriteInstance.x = ball2_Lab.initr.x;
    ball2_Lab.spriteInstance.y = ball2_Lab.initr.y;

    ball1_CoM.spriteInstance.x = ball1_CoM.initr.x;
    ball1_CoM.spriteInstance.y = ball1_CoM.initr.y;
    ball2_CoM.spriteInstance.x = ball2_CoM.initr.x;
    ball2_CoM.spriteInstance.y = ball2_CoM.initr.y;

    ball1_CoM.v = zeroV();
    ball2_CoM.v = zeroV();
    /* 
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    "Vector" should only be one of the follows:
    1. object that requires a constructor function to create
    and returns an Instance of that object
    (like class in python)
    2. object which works like an dictionary in Python 
    with properties that can be either a value, a function,
    or another object.

    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */

    ball1_Lab.v.x = parseFloat($("#ball1LabVelocityX").val());
    ball1_Lab.v.y = parseFloat($("#ball1LabVelocityY").val());
    ball2_Lab.v.x = 0;
    ball2_Lab.v.y = 0;
    isColliding = false;
}

function onCollision() {
    var p1Star = vCal(ball1_CoM.v,'*',ball1_CoM.mass);
    var p2Star = vCal(ball2_CoM.v,'*',ball2_CoM.mass);
    var q1star = vCal(p1Star,'rotate', Math.PI - initAngle);
    var q2star = vCal(p2Star,'rotate', Math.PI - initAngle);
    ball1_CoM.v = vCal(q1star,'*',1/ball1_Lab.mass);
    ball2_CoM.v = vCal(q2star,'*',1/ball2_Lab.mass);
    
    var coMV = getCoMV();
    ball1_Lab.v = vCal(ball1_CoM.v,'+',coMV);
    ball2_Lab.v = vCal(ball2_CoM.v,'+',coMV);
    isColliding = true;
}






var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'canvasWrapper', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.stage.backgroundColor = "#f0f0f0";
    
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;  
    game.scale.setUserScale(0.5, 0.5);
    game.renderer.renderSession.roundPixels = true;  
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    game.stage.backgroundColor = "#f0f0f0";

    var ball1_graph = game.add.graphics(0, 0);

    ball1_graph.lineStyle(1, 0xE9003A, 1);
    ball1_graph.beginFill(0xE9003A, 1);
    ball1_graph.drawCircle(0, 0, ballradius);


    ball1_Lab.spriteInstance = game.add.sprite( ball1_Lab.initr.x, ball1_Lab.initr.y, ball1_graph.generateTexture() );
    ball1_CoM.spriteInstance = game.add.sprite( ball1_CoM.initr.x, ball1_CoM.initr.y, ball1_graph.generateTexture() );
    ball1_Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball1_CoM.spriteInstance.anchor.set(0.5,0.5);
    ball1_graph.destroy();

    var ball2_graph = game.add.graphics(0, 0);

    ball2_graph.lineStyle(1, 0x00AEF2, 1);
    ball2_graph.beginFill(0x00AEF2, 1);
    ball2_graph.drawCircle(0, 0, ballradius);

    ball2_CoM.spriteInstance = game.add.sprite( ball2_CoM.initr.x, ball2_CoM.initr.y, ball2_graph.generateTexture() );
    ball2_Lab.spriteInstance = game.add.sprite( ball2_Lab.initr.x, ball2_Lab.initr.y, ball2_graph.generateTexture() );
    ball2_Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball2_CoM.spriteInstance.anchor.set(0.5, 0.5);
    ball2_graph.destroy();

    // var graphics = game.add.graphics(0, 0);

    // graphics.beginFill(0xFF3300);
    // graphics.lineStyle(10, 0xffd900, 1);
    
    // graphics.lineStyle(2, 0x0000FF, 1);
    // graphics.drawRect(50, 250, 100, 100);

    // //  Then generate a texture from it and apply the texture to the sprite
    // sprite = game.add.sprite(400, 300, graphics.generateTexture());
    // sprite.anchor.set(0.5);

    // //  And destroy the original graphics object
    // graphics.destroy();
}

function update() {
    if (isRunning) {


        ball1_Lab.spriteInstance.x += ball1_Lab.v.x;
        ball1_Lab.spriteInstance.y -= ball1_Lab.v.y;
        ball2_Lab.spriteInstance.x += ball2_Lab.v.x;
        ball2_Lab.spriteInstance.y -= ball2_Lab.v.y;

        //Centre of mass motion

        ball2_CoM.spriteInstance.x += ball2_CoM.v.x;
        ball2_CoM.spriteInstance.y -= ball2_CoM.v.y;
        ball1_CoM.spriteInstance.x += ball1_CoM.v.x;
        ball1_CoM.spriteInstance.y -= ball1_CoM.v.y;


        if (Phaser.Rectangle.intersects(ball1_Lab.spriteInstance.getBounds(), ball2_Lab.spriteInstance.getBounds()) && !isColliding) {
            onCollision();
        }
        console.log(getKE());
    }
}