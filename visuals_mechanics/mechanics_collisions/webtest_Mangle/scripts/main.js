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

function vCal(input1, action, input2){
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

var canvasWidth = 800;
var canvasHeight = 800;
var ballradius = 40;

var ball1_Lab, ball2_Lab, ball1_CoM, ball2_CoM, initAngle, borders;
var arrowSprites = [];


ball1_Lab = {
    // !! A variable also an object that has 4 properties. !!
    spriteInstance: undefined,
    mass: 1,
    initr: new Vector((canvasWidth / 2 - 100),(canvasHeight / 6)),
    bounds: new Phaser.Rectangle(0,0,canvasWidth,canvasHeight/3 - ballradius),
    v: new Vector(0,0)
};
ball2_Lab = {
    spriteInstance: undefined,
    mass: 1,
    initr: new Vector((canvasWidth / 2 + 100),(canvasHeight / 6)),
    bounds: new Phaser.Rectangle(0,0,canvasWidth,canvasHeight/3 - ballradius),
    v: new Vector(0,0)
};
ball1_CoM ={
    spriteInstance: undefined,
    mass: getReducedMass(),
    initr: new Vector((canvasWidth / 2 - 100),(canvasHeight* 3 / 6)),
    bounds: new Phaser.Rectangle(0,canvasHeight/3 + ballradius,canvasWidth,canvasHeight/3 - ballradius*2),
    v: new Vector(0,0)
};

ball2_CoM ={
    spriteInstance: undefined,
    mass: getReducedMass(),
    initr: new Vector((canvasWidth / 2 + 100),(canvasHeight * 3 / 6)),
    bounds: new Phaser.Rectangle(0,canvasHeight/3 + ballradius,canvasWidth,canvasHeight/3 -ballradius*2),
    v: new Vector(0,0)
};

$(".inputs").each(function () {
    // To update the displayed value in HTML
    $(this).on('input', function () {
        $("#"+$(this).attr("id") + "Display").text(  $(this).val() + $("#"+$(this).attr("id")+"Display").attr("data-unit")  );
    });
});
/*
$('#ballCollisionAngle').on('input', function () {
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
    console.log("Pre Collision KE:"+getLabKE().toString());
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
function getLabKE(){
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

    ball1_Lab.v = zeroV();
    ball2_Lab.v = zeroV();
    isColliding = false;

    for (var i = 0; i < arrowSprites.length; i++) {
        arrowSprites[i].destroy();
    }
    arrowSprites = [];
}

function onCollision() {
    var pStar = vCal(vCal(ball2_Lab.v,'-',ball1_Lab.v),'*',getReducedMass());
    var pStar_reversed = vCal(pStar,'*',"-1");
    var q1star = vCal(pStar,'rotate', initAngle);
    var q2star = vCal(pStar,'rotate', initAngle - Math.PI);
    ball1_CoM.v = vCal(q1star,'*',1/ball1_Lab.mass);
    ball2_CoM.v = vCal(q2star,'*',1/ball2_Lab.mass);
    p1 = vCal(ball1_Lab.v,"*",ball1_Lab.mass);

    var coMV = getCoMV();
    ball1_Lab.v = vCal(ball1_CoM.v,'+',coMV);
    ball2_Lab.v = vCal(ball2_CoM.v,'+',coMV);

    q1 = vCal(ball1_Lab.v,"*",ball1_Lab.mass);
    q2 = vCal(ball2_Lab.v,"*",ball2_Lab.mass);



    drawArrow( zeroV() , q1 , "q1" );
    drawArrow( q1 , q2 , "q2" );
    drawArrow( zeroV(),vCal(pStar_reversed,"*",(ball1_Lab.mass/ball2_Lab.mass)) , "p_CoM*(m1/m2)" );
    drawArrow( vCal(pStar_reversed,"*",(ball1_Lab.mass/ball2_Lab.mass)) , pStar_reversed , "p_CoM" );
    drawArrow( vCal(pStar_reversed,"*",(ball1_Lab.mass/ball2_Lab.mass)) , q1star , "q1_CoM" );
    drawArrow(new Vector(0,-0.3),p1,"p1");


    isColliding = true;
    console.log("Post collision KE" + getLabKE().toString());
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
    game.scale.setUserScale(1/window.devicePixelRatio, 1/window.devicePixelRatio);
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

    var bordersG = game.add.graphics((canvasWidth / 2), (canvasHeight / 2));

    bordersG.lineStyle(12, 0x003E74, 1);
    bordersG.moveTo(0,0);
    bordersG.lineTo(0, (canvasHeight ));
    bordersG.lineTo((canvasWidth ), (canvasHeight));
    bordersG.lineTo((canvasWidth), 0);
    bordersG.lineTo(0, 0);    

    bordersG.lineStyle(6, 0x003E74, 1);
    bordersG.moveTo(0, (canvasHeight / 3));
    bordersG.lineTo((canvasWidth), (canvasHeight / 3));
    bordersG.moveTo(0, (canvasHeight * 2 / 3));
    bordersG.lineTo((canvasWidth ), (canvasHeight * 2 / 3));

    borders = game.add.sprite((canvasWidth / 2), (canvasHeight / 2), bordersG.generateTexture());
    borders.anchor.set(0.5,0.5);

    bordersG.destroy();

    var style = { font: "36px Lato", fill: "#003E74", wordWrap: false, align: "left", backgroundColor: "#f0f0f0" };

    labFrameText = game.add.text(16, 10, "Lab Frame", style);
    labFrameText.anchor.set(0,0);

    centreOfMassFrameText = game.add.text(16, ( canvasHeight/3 + 10 ), "Centre of Mass Frame", style);
    centreOfMassFrameText.anchor.set(0,0);

    vectorDiagramText = game.add.text(16, ( canvasHeight*2/3 + 10 ), "Vector Diagram", style);
    vectorDiagramText.anchor.set(0,0);


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

        $('#ball2labvx').html("Velocity X:" + ball2_Lab.v.x.toString() + "m/s");
        $('#ball2labvy').html("Velocity Y:" + ball2_Lab.v.y.toString() + "m/s");

        ball1_CoM.spriteInstance.visible = Phaser.Rectangle.intersects(ball1_CoM.bounds, ball1_CoM.spriteInstance.getBounds());
        ball2_CoM.spriteInstance.visible = Phaser.Rectangle.intersects(ball2_CoM.bounds, ball2_CoM.spriteInstance.getBounds());
        ball1_Lab.spriteInstance.visible = Phaser.Rectangle.intersects(ball1_Lab.bounds, ball1_Lab.spriteInstance.getBounds());
        ball2_Lab.spriteInstance.visible = Phaser.Rectangle.intersects(ball2_Lab.bounds, ball2_Lab.spriteInstance.getBounds());



        if (Phaser.Rectangle.intersects(ball1_Lab.spriteInstance.getBounds(), ball2_Lab.spriteInstance.getBounds()) && !isColliding) {
            onCollision();
        }


    }
}


function drawArrow(originV ,vectorV, text){
    var origin = new Vector(originV.x, -1 * originV.y);
    var vector = new Vector(vectorV.x, -1 * vectorV.y);
    // Flip directions for canvas y-axis

    var arrowG = game.add.graphics((canvasWidth / 2 - 500 + origin.x), (canvasHeight * 5 / 6 + 100 + origin.y));
    var scaleFactor = 100 * canvasWidth/1600;
    var mag = vector.getMag()*scaleFactor;

    arrowG.lineStyle(2, 0x006EAF, 1);
    arrowG.moveTo(0,0);
    arrowG.lineTo(mag, 0);

    arrowG.beginFill(0x006EAF);
    arrowG.moveTo(mag, 0);
    arrowG.lineTo(mag/2, 0);
    arrowG.lineTo(mag/2, 6);
    arrowG.lineTo(mag/2+10, 0);
    arrowG.lineTo(mag/2, -6);
    arrowG.lineTo(mag/2, 0);
    arrowG.endFill();    

    var style = { font: "24px Georgia", fill: "#006EAF", wordWrap: false, align: "centre", backgroundColor: "#f0f0f0" };
    arrowSprites.push( game.add.text((canvasWidth / 2 - 500*canvasWidth/1600 + origin.x*scaleFactor + vector.x*scaleFactor/2), (canvasHeight * 5 / 6 + 100*canvasHeight/1600 + origin.y*scaleFactor + vector.y*scaleFactor/2), text, style) );

    arrowSprites.push( game.add.sprite((canvasWidth / 2 - 500 *canvasWidth/1600 + origin.x*scaleFactor),(canvasHeight * 5 / 6 + 100*canvasHeight/1600 + origin.y*scaleFactor), arrowG.generateTexture()) );
    arrowSprites[arrowSprites.length-1].anchor.set(0,0.5);
    arrowSprites[arrowSprites.length-1].rotation = vector.getArg();
    arrowG.destroy();
}