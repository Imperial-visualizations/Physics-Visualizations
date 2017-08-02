/*
++++++++++++++++++++++++++++++++++++
Pre-defined classes
++++++++++++++++++++++++++++++++++++
*/
function Vector(x,y){
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

/*
++++++++++++++++++++++++++++++++++++
Basic functions
++++++++++++++++++++++++++++++++++++
*/

function zeroV(){
    return new Vector(0,0);
};

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

/*
++++++++++++++++++++++++++++++++++++
Global Variables
++++++++++++++++++++++++++++++++++++
*/

var isRunning = false;
var isColliding = false;


var canvasWidth = 1200;
var canvasHeight = 1200;
canvasWidth = $("#canvasWrapper").width()*window.devicePixelRatio;
canvasHeight = $("#canvasWrapper").width()*window.devicePixelRatio;

var ballradius = 40;

var ball1, ball2, initAngle; 

var borders, centreOfMass1, textScaleDown;
var arrowSprites = [];
var latexSprites = {};

ball1 = {
    Lab : {
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 - 100),(canvasHeight / 6)),
        bounds: new Phaser.Rectangle(0,0,canvasWidth,canvasHeight/3 - ballradius),
        v: new Vector(0,0)
    },
    CoM : {
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 - 100),(canvasHeight* 3 / 6)),
        bounds: new Phaser.Rectangle(0,canvasHeight/3 + ballradius,canvasWidth,canvasHeight/3 - ballradius*2),
        v: new Vector(0,0)
    }
};
ball2 = {
    Lab:{
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 + 100),(canvasHeight / 6)),
        bounds: new Phaser.Rectangle(0,0,canvasWidth,canvasHeight/3 - ballradius),
        v: new Vector(0,0)
    },
    CoM:{
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 + 100),(canvasHeight * 3 / 6)),
        bounds: new Phaser.Rectangle(0,canvasHeight/3 + ballradius,canvasWidth,canvasHeight/3 -ballradius*2),
        v: new Vector(0,0)
    }
};
ball1.CoM.mass = getReducedMass();
ball2.CoM.mass = getReducedMass();

/*
++++++++++++++++++++++++++++++++++++
UI handling
++++++++++++++++++++++++++++++++++++
*/

function updateScatterAngle(){
    initAngle = degToRad(parseFloat($("#ballCollisionAngle").val()));
    ball1.Lab.spriteInstance.y = ball1.Lab.initr.y + 0.5 * ballradius * Math.sin(initAngle);
    ball2.Lab.spriteInstance.y = ball2.Lab.initr.y - 0.5 * ballradius * Math.sin(initAngle);
    ball1.CoM.spriteInstance.y = ball1.CoM.initr.y + 0.5 * ballradius * Math.sin(initAngle);
    ball2.CoM.spriteInstance.y = ball2.CoM.initr.y - 0.5 * ballradius * Math.sin(initAngle);
}

$(".inputs").each(function () {
    // To update the displayed value in HTML
    $(this).on('input', function () {
        $("#"+$(this).attr("id") + "Display").text(  $(this).val() + $("#"+$(this).attr("id")+"Display").attr("data-unit")  );
        if($(this).attr("id")=="ballCollisionAngle"){
            // To update the position of the balls
            if(!isRunning){
                updateScatterAngle();
            }
        }
    });
});


$("#runButton").on('click', function () {
    ball1.Lab.mass = parseFloat($("#ball1LabMass").val());
    ball2.Lab.mass = parseFloat($("#ball2LabMass").val());
    ball1.Lab.v.x = parseFloat($("#ball1LabVelocityX").val());

    ball1.CoM.v = vCal(ball1.Lab.v,'-',getCoMV());
    ball2.CoM.v = vCal(ball2.Lab.v,'-',getCoMV());
    
    updateScatterAngle();

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



function resetSimulation(){
    ball1.Lab.spriteInstance.x = ball1.Lab.initr.x;
    ball1.Lab.spriteInstance.y = ball1.Lab.initr.y;
    ball2.Lab.spriteInstance.x = ball2.Lab.initr.x;
    ball2.Lab.spriteInstance.y = ball2.Lab.initr.y;

    ball1.CoM.spriteInstance.x = ball1.CoM.initr.x;
    ball1.CoM.spriteInstance.y = ball1.CoM.initr.y;
    ball2.CoM.spriteInstance.x = ball2.CoM.initr.x;
    ball2.CoM.spriteInstance.y = ball2.CoM.initr.y;

    ball1.CoM.v = zeroV();
    ball2.CoM.v = zeroV();


    updateScatterAngle();

    document.getElementById('ball1LabVelocityX').disabled = false;
    $("#ball1LabVelocityX").removeClass("disabled");
    document.getElementById('ball1LabMass').disabled = false;
    $("#ball1LabMass").removeClass("disabled");
    document.getElementById('ball2LabMass').disabled = false;
    $("#ball2LabMass").removeClass("disabled");
    document.getElementById('ballCollisionAngle').disabled = false;
    $("#ballCollisionAngle").removeClass("disabled");

    $("#ball1LabVelocityXDisplay").text(  $("#ball1LabVelocityX").val() + $("#ball1LabVelocityXDisplay").attr("data-unit")  );
    $("#ball1LabVelocityYDisplay").text("0m/s");
    $("#ball2LabVelocityXDisplay").text("0m/s");
    $("#ball2LabVelocityYDisplay").text("0m/s");


    ball1.Lab.v = zeroV();
    ball2.Lab.v = zeroV();
    isColliding = false;

    for (var i = 0; i < arrowSprites.length; i++) {
        arrowSprites[i].destroy();
    }
    arrowSprites = [];

    ball1.CoM.spriteInstance.visible = true;
    ball2.CoM.spriteInstance.visible = true;
    ball1.Lab.spriteInstance.visible = true;
    ball2.Lab.spriteInstance.visible = true;

    centreOfMass1.x = (canvasWidth / 2);
    centreOfMass1.y = (canvasHeight / 6);
}


/*
++++++++++++++++++++++++++++++++++++
Functions based on Global variables and basic functions
++++++++++++++++++++++++++++++++++++
*/

function getReducedMass() {
    return (ball1.Lab.mass * ball2.Lab.mass) / (ball1.Lab.mass + ball2.Lab.mass);
}
function getCoMR(){
    return vCal( vCal(vCal(ball1.Lab.spriteInstance, "*", ball1.Lab.mass ), "+",vCal(ball2.Lab.spriteInstance, "*", ball2.Lab.mass) ) , "*", 1.0/(ball1.Lab.mass + ball2.Lab.mass) );
}
function getCoMV() {
    //return new vCal(new Vector(ball1.Lab.v.x*ball1.Lab.mass + ball2.Lab.v.x*ball2.Lab.mass,ball1.Lab.v.y*ball1.Lab.mass + ball2.Lab.v.y*ball2.Lab.mass),'*',1.0/(ball1.Lab.mass +ball2.Lab.mass));
    return vCal( vCal(vCal(ball1.Lab.v, "*", ball1.Lab.mass ), "+",vCal(ball2.Lab.v, "*", ball2.Lab.mass) ) , "*", 1.0/(ball1.Lab.mass + ball2.Lab.mass) );
}
function getLabKE(){
    return 0.5*ball1.Lab.mass*Math.pow(ball1.Lab.v.getMag(),2) + 0.5*ball2.Lab.mass*Math.pow(ball2.Lab.v.getMag(),2);
}


function onCollision() {
    var pStar = vCal(vCal(ball2.Lab.v,'-',ball1.Lab.v),'*',getReducedMass());
    var pStar_reversed = vCal(pStar,'*',"-1");
    var q1star = vCal(pStar,'rotate', initAngle);
    var q2star = vCal(pStar,'rotate', initAngle - Math.PI);
    ball1.CoM.v = vCal(q1star,'*',1/ball1.Lab.mass);
    ball2.CoM.v = vCal(q2star,'*',1/ball2.Lab.mass);
    p1 = vCal(ball1.Lab.v,"*",ball1.Lab.mass);

    var coMV = getCoMV();
    ball1.Lab.v = vCal(ball1.CoM.v,'+',coMV);
    ball2.Lab.v = vCal(ball2.CoM.v,'+',coMV);

    console.log("Angle p* " + ball1.CoM.v.getArg().toString());
    console.log("Angle q*" + ball2.CoM.v.getArg().toString());
    console.log("DeltaAngle:" + (ball1.CoM.v.getArg() - ball2.CoM.v.getArg()).toString());

    q1 = vCal(ball1.Lab.v,"*",ball1.Lab.mass);
    q2 = vCal(ball2.Lab.v,"*",ball2.Lab.mass);
    if($('#vector_draw_enable').prop('checked')){
        //console.log("Checked");
        var scalefactor = canvasWidth/16;
        drawArrow(new Vector(0,1.0),p1,1,0xE40043);
        drawArrow(new Vector(p1.x,p1.y + 1.0),q1,1,0xE40043);
        drawArrow(new Vector(p1.x,p1.y + 1.0),q2,1,0x00ACD7);


    }
    drawArrow( zeroV() , q1 ,   3,0xDD2501,"q1" );
    drawArrow( q1 , q2 , 3,0x0091D4,'q2' );
    drawArrow( zeroV(),vCal(pStar_reversed,"*",(ball1.Lab.mass/ball2.Lab.mass)),3 ,0xEC7300, "p1m1m2" );
    drawArrow( vCal(pStar_reversed,"*",(ball1.Lab.mass/ball2.Lab.mass)) , pStar_reversed ,  3,0x960078,"pstar" );
    drawArrow( vCal(pStar_reversed,"*",(ball1.Lab.mass/ball2.Lab.mass)) , q1star , 3,0x960078, "qstar" );
    drawArrow(new Vector(0,-0.4),p1, 3,0xE40043,"p1");


    isColliding = true;
    console.log("Post collision KE" + getLabKE().toString());
}


/*
++++++++++++++++++++++++++++++++++++
Phaser.io functions
++++++++++++++++++++++++++++++++++++
*/

var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'canvasWrapper', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.stage.backgroundColor = "#EBEEEE";
    if(window.devicePixelRatio >= 1.5){
        game.load.image('cofmPNG', 'images/cofm.png');
        game.load.image('p1m1m2','images/p1m1m2latex@2x.png');
        game.load.image('p1','images/p1latex@2x.png');
        game.load.image('pstar','images/pstarlatex@2x.png');
        game.load.image('qstar','images/qstarlatex@2x.png');
        game.load.image('q1','images/q1latex@2x.png');
        game.load.image('q2','images/q2latex@2x.png');
    }else{
        game.load.image('cofmPNG', 'images/cofm.png');
        game.load.image('p1m1m2','images/p1m1m2latex.png');
        game.load.image('p1','images/p1latex.png');
        game.load.image('pstar','images/pstarlatex.png');
        game.load.image('qstar','images/qstarlatex.png');
        game.load.image('q1','images/q1latex.png');
        game.load.image('q2','images/q2latex.png');
    }
    textScaleDown = window.devicePixelRatio;
    
}

function create() {
    game.canvasWidth = $("#canvasWrapper").width()*window.devicePixelRatio;
    game.canvasHeight = $("#canvasWrapper").width()*window.devicePixelRatio;
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(1/window.devicePixelRatio, 1/window.devicePixelRatio);
    game.renderer.renderSession.roundPixels = true;  
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);




    game.stage.backgroundColor = "#EBEEEE";


    centreOfMass1 = game.add.sprite((canvasWidth / 2),(canvasHeight * 1 / 6), 'cofmPNG');
    centreOfMass1.anchor.set(0.5,0.5);

    var ball1G = game.add.graphics(0, 0);

    ball1G.lineStyle(1, 0xE9003A, 1);
    ball1G.beginFill(0xE9003A, 1);
    ball1G.drawCircle(0, 0, ballradius);


    ball1.Lab.spriteInstance = game.add.sprite( ball1.Lab.initr.x, ball1.Lab.initr.y, ball1G.generateTexture() );
    ball1.CoM.spriteInstance = game.add.sprite( ball1.CoM.initr.x, ball1.CoM.initr.y, ball1G.generateTexture() );
    ball1.Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball1.CoM.spriteInstance.anchor.set(0.5,0.5);
    ball1G.destroy();

    var ball2G = game.add.graphics(0, 0);

    ball2G.lineStyle(1, 0x00AEF2, 1);
    ball2G.beginFill(0x00AEF2, 1);
    ball2G.drawCircle(0, 0, ballradius);

    ball2.CoM.spriteInstance = game.add.sprite( ball2.CoM.initr.x, ball2.CoM.initr.y, ball2G.generateTexture() );
    ball2.Lab.spriteInstance = game.add.sprite( ball2.Lab.initr.x, ball2.Lab.initr.y, ball2G.generateTexture() );
    ball2.Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball2.CoM.spriteInstance.anchor.set(0.5, 0.5);
    ball2G.destroy();

    var bordersG = game.add.graphics((canvasWidth / 2), (canvasHeight / 2));

    bordersG.lineStyle(6*textScaleDown, 0x003E74, 1);
    bordersG.moveTo(0,0);
    bordersG.lineTo(0, (canvasHeight ));
    bordersG.lineTo((canvasWidth ), (canvasHeight));
    bordersG.lineTo((canvasWidth), 0);
    bordersG.lineTo(0, 0);    

    bordersG.lineStyle(3*textScaleDown, 0x003E74, 1);
    bordersG.moveTo(0, (canvasHeight / 3));
    bordersG.lineTo((canvasWidth), (canvasHeight / 3));
    bordersG.moveTo(0, (canvasHeight * 2 / 3));
    bordersG.lineTo((canvasWidth ), (canvasHeight * 2 / 3));

    borders = game.add.sprite((canvasWidth / 2), (canvasHeight / 2), bordersG.generateTexture());
    borders.anchor.set(0.5,0.5);

    bordersG.destroy();

    var style = { font: (18*textScaleDown)+"px Lato", fill: "#003E74", wordWrap: false, align: "left", backgroundColor: "#EBEEEE" };

    labFrameText = game.add.text(16, 10, "Lab Frame", style);
    labFrameText.anchor.set(0,0);

    centreOfMassFrameText = game.add.text(16, ( canvasHeight/3 + 10 ), "Centre of Mass Frame", style);
    centreOfMassFrameText.anchor.set(0,0);

    vectorDiagramText = game.add.text(16, ( canvasHeight*2/3 + 10 ), "Vector Diagram", style);
    vectorDiagramText.anchor.set(0,0);


    $(".inputs").each(function () {
        // To update the displayed value in HTML
        $("#"+$(this).attr("id") + "Display").text(  $(this).val() + $("#"+$(this).attr("id")+"Display").attr("data-unit")  );

    });
    updateScatterAngle();


}

function update() {
    if (isRunning) {
        ball1.Lab.spriteInstance.x += ball1.Lab.v.x;
        ball1.Lab.spriteInstance.y -= ball1.Lab.v.y;
        ball2.Lab.spriteInstance.x += ball2.Lab.v.x;
        ball2.Lab.spriteInstance.y -= ball2.Lab.v.y;

        centreOfMass1.x = getCoMR().x;
        centreOfMass1.y = getCoMR().y;

        //Centre of mass motion

        ball2.CoM.spriteInstance.x += ball2.CoM.v.x;
        ball2.CoM.spriteInstance.y -= ball2.CoM.v.y;
        ball1.CoM.spriteInstance.x += ball1.CoM.v.x;
        ball1.CoM.spriteInstance.y -= ball1.CoM.v.y;

        document.getElementById('ball1LabVelocityX').disabled = true;
        $("#ball1LabVelocityX").addClass("disabled");
        document.getElementById('ball1LabMass').disabled = true;
        $("#ball1LabMass").addClass("disabled");
        document.getElementById('ball2LabMass').disabled = true;
        $("#ball2LabMass").addClass("disabled");
        document.getElementById('ballCollisionAngle').disabled = true;
        $("#ballCollisionAngle").addClass("disabled");

        var velocityDisplay = [ball1.Lab.v.x.toFixed(2),ball1.Lab.v.y.toFixed(2),ball2.Lab.v.x.toFixed(2),ball2.Lab.v.y.toFixed(2)];
        var i=0;
        $(".velocityDisplay").each(function () {
            $(this).text(  velocityDisplay[i]+ $(this).attr("data-unit")  );
            i++;
        });

        ball1.CoM.spriteInstance.visible = Phaser.Rectangle.intersects(ball1.CoM.bounds, ball1.CoM.spriteInstance.getBounds());
        ball2.CoM.spriteInstance.visible = Phaser.Rectangle.intersects(ball2.CoM.bounds, ball2.CoM.spriteInstance.getBounds());
        ball1.Lab.spriteInstance.visible = Phaser.Rectangle.intersects(ball1.Lab.bounds, ball1.Lab.spriteInstance.getBounds());
        ball2.Lab.spriteInstance.visible = Phaser.Rectangle.intersects(ball2.Lab.bounds, ball2.Lab.spriteInstance.getBounds());



        if (Phaser.Rectangle.intersects(ball1.Lab.spriteInstance.getBounds(), ball2.Lab.spriteInstance.getBounds()) && !isColliding) {
            onCollision();
        }


    }
}
function drawArrow(originV,vectorV,rectIndex,color=0x006EAF,latexID = ""){
    var origin = new Vector(originV.x, -1 * originV.y);
    var vector = new Vector(vectorV.x, -1 * vectorV.y);
    // Flip directions for canvas y-axis

    var arrowG = game.add.graphics((canvasWidth / 2 - 500 + origin.x), (canvasHeight * 5 / 6 + 100 + origin.y));
    var scaleFactor = 100 * canvasWidth/1600;
    var mag = vector.getMag()*scaleFactor;

    arrowG.lineStyle(2, color, 1);
    arrowG.moveTo(0,0);
    arrowG.lineTo(0, 4);
    arrowG.lineTo(0, -4);
    arrowG.lineTo(0, 0);
    arrowG.lineTo(mag, 0);
    arrowG.lineTo(mag, 4);
    arrowG.lineTo(mag, -4);
    arrowG.lineTo(mag, 0);

    arrowG.beginFill(color);
    arrowG.moveTo(mag, 0);
    arrowG.lineTo(mag/2, 0);
    arrowG.lineTo(mag/2, 6);
    arrowG.lineTo(mag/2+10, 0);
    arrowG.lineTo(mag/2, -6);
    arrowG.lineTo(mag/2, 0);
    arrowG.endFill();    

    arrowSprites.push( game.add.sprite((canvasWidth / 2 - 5*scaleFactor + origin.x*scaleFactor),(canvasHeight * (rectIndex*2 -1)/ 6 + scaleFactor + origin.y*scaleFactor), arrowG.generateTexture()) );
    arrowSprites[arrowSprites.length-1].anchor.set(0,0.5);
    arrowSprites[arrowSprites.length-1].rotation = vector.getArg();

    if(latexID !== "") {
        arrowSprites.push(game.add.sprite((canvasWidth / 2 - 5 * scaleFactor + origin.x * scaleFactor + vector.x * scaleFactor / 2), (canvasHeight * (rectIndex*2 - 1) / 6 + scaleFactor + origin.y * scaleFactor + vector.y * scaleFactor / 2), latexID));
        arrowSprites[arrowSprites.length - 1].anchor.set(0.5, 0);
    }

    arrowG.destroy();
}
function drawAngle(vecta,vectb,color){
    var arcG = game.add.graphics(0,0);
    arcG.lineStyle(8,color);
    arcG.arc(0,0,50,vectb.getArg, vecta.getArg(),true);
    arcG.endFill();



}