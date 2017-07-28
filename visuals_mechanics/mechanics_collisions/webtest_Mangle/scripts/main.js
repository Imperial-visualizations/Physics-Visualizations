var isRunning = false;

var canvasWidth = 600;
var canvasHeight = 500;
var game = new Phaser.Game(canvasWidth*2, canvasHeight*2, Phaser.CANVAS, 'canvasWrapper', {
    preload: preload,
    create: create,
    update: update
});


var ballradius = 40;
var ball1, ball2, initAngle,ball1CoM,ball2CoM;

var collide = false;

function Vector(x,y){
    this.x=x;
    this.y=y;
    this.getArg = function() {
        return Math.atan2(this.y, this.x);
    };
    this.getMag = function(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
}
Vector.prototype.toString = function () {
    return "("+this.x.toString()+","+this.y.toString()+")";
};

ball1 = {
    spriteInstance: undefined,
    mass: 1,
    initr: new Vector((canvasWidth / 2 - 100),(canvasHeight / 4)),
    v: new Vector(0,0)
};
ball2 = {
    spriteInstance: undefined,
    mass: 1,
    initr: new Vector((canvasWidth / 2 + 100),(canvasHeight / 4)),
    v: new Vector(0,0)
};
ball1CoM ={
    spriteInstance:undefined,
    mass:getReducedMass(),
    initr:new Vector((canvasWidth / 2 - 100),(canvasHeight* 3 / 4)),
    v:new Vector(0,0)
};
ball2CoM ={
    spriteInstance:undefined,
    mass:getReducedMass(),
    initr:new Vector((canvasWidth / 2 + 100),(canvasHeight * 3/ 4)),
    v:new Vector(0,0)
};

$(".inputs").each(function () {
    // To update the displayed value
    $(this).on('change', function () {
        $("#"+$(this).attr("id") + "Display").text(  $(this).val() + $("#"+$(this).attr("id")+"Display").attr("data-unit")  );
    });
});

$('#ballCollisionAngle').on('change', function () {
    // To update the position of the balls
    initAngle = degToRad(parseFloat($("#ballCollisionAngle").val()));
    ball1.spriteInstance.y = ball1.initr.y + 0.5 * ballradius * Math.sin(initAngle);
    ball2.spriteInstance.y = ball2.initr.y - 0.5 * ballradius * Math.sin(initAngle);
});

$("#runButton").on('click', function () {
    ball1.mass = parseFloat($("#ball1Mass").val());
    ball2.mass = parseFloat($("#ball2Mass").val());
    ball1.v.x = parseFloat($("#ball1VelocityX").val());
    ball1.v.y = parseFloat($("#ball1VelocityY").val());



    ball1CoM.v = vCal(ball1.v,'-',getCoMPosV());
    ball2CoM.v = vCal(ball2.v,'-',getCoMPosV());
    initAngle = degToRad(parseFloat($("#ballCollisionAngle").val()));


    isRunning = !isRunning;



    if ($("#runButton").val() == "Run") {
        $("#runButton").val("Reset");
    } else {
        //Run reset code
        resetSimulation();
        $("#runButton").val("Run");
    }
});
function getCoMPos(){
    return new vCal(new Vector(ball1.x*ball1.mass + ball2.x*ball2.mass,ball1.y * ball1.mass + ball2.y * ball2.mass)
                                ,'*',1.0/(ball1.mass + ball2.mass));
}
function getCoMPosV() {
    return new vCal(new Vector(ball1.v.x*ball1.mass + ball2.v.x*ball2.mass,ball1.v.y*ball1.mass + ball2.v.y*ball2.mass),'*',1.0/(ball1.mass +ball2.mass));
}

function resetSimulation(){
    ball1.spriteInstance.x = ball1.initr.x;
    ball1.spriteInstance.y = ball1.initr.y + 0.5 * ballradius * Math.sin(initAngle);
    ball2.spriteInstance.x = ball2.initr.x;
    ball2.spriteInstance.y = ball2.initr.y - 0.5 * ballradius * Math.sin(initAngle);
    ball1.v.x = parseFloat($("#ball1VelocityX").val());
    ball1.v.y = parseFloat($("#ball1VelocityY").val());
    ball2.v.x = 0;
    ball2.v.y = 0;
    collide = false;
}


function preload() {
    game.stage.backgroundColor = "#f0f0f0";
    
}
function create() {
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;  
    game.scale.setUserScale(0.5, 0.5);
    game.renderer.renderSession.roundPixels = true;  
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    game.stage.backgroundColor = "#f0f0f0";

    var ball1G = game.add.graphics(0, 0);

    ball1G.lineStyle(1, 0xE9003A, 1);
    ball1G.beginFill(0xE9003A, 1);
    ball1G.drawCircle(0, 0, ballradius);


    ball1.spriteInstance = game.add.sprite(ball1.initr.x, ball1.initr.y, ball1G.generateTexture());
    ball1CoM.spriteInstance = game.add.sprite(ball1CoM.initr.x,ball1CoM.initr.y,ball1G.generateTexture());
    ball1.spriteInstance.anchor.set(0.5, 0.5);
    ball1CoM.spriteInstance.anchor.set(0.5,0.5);
    ball1G.destroy();

    var ball2G = game.add.graphics(0, 0);

    ball2G.lineStyle(1, 0x00AEF2, 1);
    ball2G.beginFill(0x00AEF2, 1);
    ball2G.drawCircle(0, 0, ballradius);

    ball2CoM.spriteInstance = game.add.sprite(ball2CoM.initr.x,ball2CoM.initr.y,ball2G.generateTexture());
    ball2.spriteInstance = game.add.sprite(ball2.initr.x, ball2.initr.y, ball2G.generateTexture());
    ball2.spriteInstance.anchor.set(0.5, 0.5);
    ball2CoM.spriteInstance.anchor.set(0.5,0.5);
    ball2G.destroy();
}
function update() {
    if (isRunning) {


        //Centre of mass motion

        ball2CoM.spriteInstance.x += ball2CoM.v.x;
        ball2CoM.spriteInstance.y += ball2CoM.v.y;
        ball1CoM.spriteInstance.x += ball1CoM.v.x;
        ball1CoM.spriteInstance.y += ball1CoM.v.y;


        ball1.spriteInstance.x += ball1.v.x;
        ball1.spriteInstance.y += ball1.v.y;
        ball2.spriteInstance.x += ball2.v.x;
        ball2.spriteInstance.y += ball2.v.y;

        if (Phaser.Rectangle.intersects(ball1.spriteInstance.getBounds(), ball2.spriteInstance.getBounds()) && !collide) {
            onCollision();
        }
    }
}



function getReducedMass() {
    return (ball1.mass * ball2.mass) / (ball1.mass + ball2.mass);
}


vCal = function(input1, action, input2){
    //Vector Calculations
    switch(action) {
        case "-":
            return new Vector( input1.x - input2.x, input1.y - input2.y);
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

function onCollision() {
    var p1Star = vCal(ball1CoM.v,'*',ball1CoM.mass);
    var p2Star = vCal(ball2CoM.v,'*',ball2CoM.mass);

    var q1star = vCal(p1Star,'rotate',Math.PI - initAngle);
    var q2star = vCal(p2Star,'rotate',Math.PI - initAngle);

    ball1CoM.v = vCal(q1star,'*',1/getReducedMass());
    ball2CoM.v = vCal(q2star,'*',1/getReducedMass());

    ball1.v = vCal(ball1CoM.v,'+',getCoMPosV());
    ball2.v = vCal(ball2CoM.v,'+',getCoMPosV());
    collide = true;
}