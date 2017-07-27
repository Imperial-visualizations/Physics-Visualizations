var isRunning = false;

var canvasWidth = 800;
var canvasHeight = 500;
var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'CanvasWrapper', {
    preload: preload,
    create: create,
    update: update
});
var ballradius = 40;
var ball1, ball2, initAngle;

var collide = false;

class Vector{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get getArg() {
        return Math.atan2(this.y, this.x);
    }
    get getMag(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

ball1 = {
    spriteInstance: undefined, 
    mass: 1, 
    initr: new Vector((canvasWidth / 2 - 100),(canvasHeight / 2)),
    v: new Vector(0,0)
};
ball2 = {
    spriteInstance: undefined, 
    mass: 1, 
    initr: new Vector((canvasWidth / 2 + 100),(canvasHeight / 2)),
    v: new Vector(0,0)
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
    ball1.spriteInstance.y = ball2.initr.y + 0.5 * ballradius * Math.sin(initAngle);
    ball2.spriteInstance.y = ball2.initr.y - 0.5 * ballradius * Math.sin(initAngle);
});

$("#runButton").on('click', function () {
    ball1.mass = parseFloat( $("#ball1Mass").val() );
    ball1.v.x = parseFloat( $("#ball1VelocityX").val() );
    ball1.v.y = parseFloat( $("#ball1VelocityY").val() );
    ball2.mass = parseFloat( $("#ball2Mass").val() );
    initAngle = degToRad( parseFloat($("#ballCollisionAngle").val()) );

    isRunning = !isRunning;

    if ($("#runButton").val() == "Run") {
        $("#runButton").val("Stop");
    } else {
        $("#runButton").val("Run");
    }
});

function preload() {
    game.stage.backgroundColor = "#f0f0f0";
}
function create() {

    game.stage.backgroundColor = "#f0f0f0";

    var ball1G = game.add.graphics(0, 0);

    ball1G.lineStyle(1, 0xE9003A, 1);
    ball1G.beginFill(0xE9003A, 1);
    ball1G.drawCircle(0, 0, ballradius);


    ball1.spriteInstance = game.add.sprite(ball1.initr.x, ball1.initr.y, ball1G.generateTexture());
    ball1.spriteInstance.anchor.set(0.5, 0.5);

    ball1G.destroy();

    var ball2G = game.add.graphics(0, 0);

    ball2G.lineStyle(1, 0x00AEF2, 1);
    ball2G.beginFill(0x00AEF2, 1);
    ball2G.drawCircle(0, 0, ballradius);


    ball2.spriteInstance = game.add.sprite(ball2.initr.x, ball2.initr.y, ball2G.generateTexture());
    ball2.spriteInstance.anchor.set(0.5, 0.5);

    ball2G.destroy();
}
function update() {
    if (isRunning) {
        ball1.spriteInstance.x += ball1.v.x;
        ball1.spriteInstance.y -= ball1.v.y;
        ball2.spriteInstance.x += ball2.v.x;
        ball2.spriteInstance.y -= ball2.v.y;

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
            break;
        case "+":
            return new Vector( input1.x + input2.x, input1.y + input2.y );
            break;
        case "*":
            return new Vector( input2 * input1.x, input2 * input1.y );
            break;
        case "rotate":
            return new Vector( input1.x * Math.cos(degToRad(input1.getArg)) - input1.y * Math.sin(degToRad(input1.getArg)), input1.x * Math.sin(degToRad(input1.getArg)) + input1.y * Math.cos(degToRad(input1.getArg)) );
            break;
        default:
            return false;
            
    }

}

function degToRad(deg) {
    return Math.PI * deg / 180;
}

function onCollision() {
    var scatterAngle = initAngle * 2;
    var pCom = vCal( vCal( ball1.v, "-", ball2.v ), "*", getReducedMass() );
    var qCom = vCal(pCom, "rotate", scatterAngle);
    var q1 = vCal( vCal( pCom, "*", ball1.mass / ball2.mass) , "+", qCom);
    var q2 = vCal( vCal(ball1.v, "*", ball1.mass), "-", q1 );

    ball1.v = vCal(q1, "*", 1 / ball1.mass);
    ball2.v = vCal(q2, "*", 1 / ball2.mass);
    collide = true;
}