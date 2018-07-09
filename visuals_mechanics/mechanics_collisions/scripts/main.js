/*
++++++++++++++++++++++++++++++++++++
Pre-defined classes
++++++++++++++++++++++++++++++++++++
*/

class ToolTip{
    constructor(position,title,text){
        this.position = position;
        this.showRect = new Phaser.Rectangle(position.x - showRange/2,position.y - showRange/2,showRange,showRange);
        let roundedRectG =  game.add.graphics(0,0);
        roundedRectG.beginFill(0x003E74);
        roundedRectG.drawRoundedRect(0,0,200,(fontSize + 7)*4,5);
        this.sprite = uiGroup.create(position.x,position.y,roundedRectG.generateTexture());
        this.title = game.add.text(position.x + 5,position.y,title,{font:"20px Fira Sans",fill:"#ffffff"});
        uiGroup.add(this.title);
        this.text = game.add.text(position.x + 5,position.y + fontSize+10,text,{font:"12px Fira Sans",fill:"#ffffff"});
        uiGroup.add(this.text);
        roundedRectG.destroy();
    }
    update(){
        if(game.input.mousePointer.x < this.showRect.x ||
           game.input.mousePointer.x > this.showRect.x + this.showRect.width ||
            game.input.mousePointer.y < this.showRect.y ||
            game.input.mousePointer.y > this.showRect.y + this.showRect.height) {
                this.sprite.visible = false;
                this.text.visible = false;
                this.title.visible = false;

        }else{
            this.sprite.visible = true;
            this.text.visible = true;
            this.title.visible = true;

        }
    }
    updatePosition(position){
        this.position = position;
        this.showRect = new Phaser.Rectangle(position.x - showRange/2,position.y - showRange/2,this.showRect.width,this.showRect.height);
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        this.title.x = position.x + 5;
        this.title.y = position.y;
        this.text.x = position.x + 5;
        this.text.y = position.y + fontSize + 10;

    }
}


/*
++++++++++++++++++++++++++++++++++++
Basic functions
++++++++++++++++++++++++++++++++++++
*/

function zeroV() {
    return new Vector(0, 0);
}


function degToRad(deg) {
    return Math.PI * deg / 180;
}

/*
++++++++++++++++++++++++++++++++++++
Global Variables
++++++++++++++++++++++++++++++++++++
*/

let isRunning = false;
let isColliding = false;


let canvasWidth = 1200;

let canvasHeight = 1200;
canvasWidth = $("#canvasWrapper").width() * window.devicePixelRatio;
canvasHeight = $("#canvasWrapper").width() * window.devicePixelRatio;


let ballradius = 40;

let ball1, ball2, initAngle;

const fontSize = 15;
const showRange = 40;
let borders, centreOfMass1, textScaleDown;

let uiGroup,mainGroup,markerGroup;

let arrowSprites = [];

let traces = [];
let toolTips = {};

let angleSprite,dynamicSF,startingX,startingY;

let d = new Date();

ball1 = {
    Lab: {
        name: "ball1Lab",
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 - 100), (canvasHeight / 6)),
        v: new Vector(0, 0),
        initV: new Vector(0,0),
        postv: new Vector(0, 0)
    },
    CoM: {
        name: "ball1CoM",
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 - 100), (canvasHeight * 3 / 6)),
        v: new Vector(0, 0),
        postv: new Vector(0, 0)
    },
    radius: ballradius,
    color: 0xE9003A
};
ball2 = {
    Lab: {
        name: "ball2Lab",
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 + 100), (canvasHeight / 6)),
        initV:new Vector(0,0),
        v: new Vector(0, 0),
        postv: new Vector(0, 0)
    },
    CoM: {
        name: "ball2CoM",
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 + 100), (canvasHeight * 3 / 6)),

        v: new Vector(0, 0),
        postv: new Vector(0, 0)
    },
    radius: ballradius,
    color: 0x00AEF2
};
ball1.CoM.mass = getReducedMass();
ball2.CoM.mass = getReducedMass();

/*
++++++++++++++++++++++++++++++++++++
UI handling
++++++++++++++++++++++++++++++++++++
*/

$(document).ready(function(){
    $("#lodaingMessage").remove();
});
function updateScatterAngle() {
    initAngle = -degToRad(parseFloat($("#ballCollisionAngle").val()));

    ball1.Lab.spriteInstance.y = ball1.Lab.initr.y + Math.sin(initAngle)*(ball1.radius + ball2.radius)*0.25;
    ball1.CoM.spriteInstance.y = ball1.CoM.initr.y + Math.sin(initAngle)*(ball1.radius + ball2.radius)*0.25;
    ball2.Lab.spriteInstance.y = ball2.Lab.initr.y - Math.sin(initAngle)*(ball1.radius + ball2.radius)*0.25;
    ball2.CoM.spriteInstance.y = ball2.CoM.initr.y - Math.sin(initAngle)*(ball1.radius + ball2.radius)*0.25;


}

$(".inputs").each(function () {
    // To update the displayed value in HTML

    $(this).on('input', updateLabels);

});

$('#vectorDrawEnable').on('click', updateLabels);

function updateLabels() {
    $(".inputs").each(function () {
        // To update the displayed value in HTML
        $("#" + $(this).attr("id") + "Display").text($(this).val() + $("#" + $(this).attr("id") + "Display").attr("data-unit"));
    });
    if (!isRunning) {
        ball1.Lab.mass = parseFloat($("#ball1LabMass").val());
        ball2.Lab.mass = parseFloat($("#ball2LabMass").val());
        ball1.Lab.v.x = parseFloat($("#ball1LabVelocityX").val());

        ball1.CoM.v = vCal(ball1.Lab.v, '-', getCoMV());
        ball2.CoM.v = vCal(ball2.Lab.v, '-', getCoMV());



        updateRadius(ball1);
        updateRadius(ball2);

        updateScatterAngle();

        centreOfMass1.x = getCoMR().x;
        centreOfMass1.y = getCoMR().y;

        ball1.CoM.spriteInstance.x = canvasWidth - 100 - getCoMR().x;
        ball1.CoM.spriteInstance.y += canvasHeight / 6 - getCoMR().y;
        ball2.CoM.spriteInstance.x = canvasWidth + 100 - getCoMR().x;
        ball2.CoM.spriteInstance.y += canvasHeight / 6 - getCoMR().y;


        recalculateVector();
    }
    
    ball1.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball1.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball2.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball2.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
}

function updateRadius(ball) {
    ball.radius = 40 *  Math.sqrt(ball.Lab.mass);
    let newBallGraphic = game.add.graphics(0, 0);

    newBallGraphic.lineStyle(1, ball.color, 1);
    newBallGraphic.beginFill(ball.color, 1);
    newBallGraphic.drawCircle(0, 0, ball.radius);


    let labTmp = mainGroup.create(ball.Lab.spriteInstance.x, ball.Lab.spriteInstance.y, newBallGraphic.generateTexture());

    let CoMTmp = mainGroup.create(ball.CoM.spriteInstance.x, ball.CoM.spriteInstance.y, newBallGraphic.generateTexture());
    ball.Lab.spriteInstance.destroy();
    ball.CoM.spriteInstance.destroy();
    ball.Lab.spriteInstance = labTmp;
    ball.CoM.spriteInstance = CoMTmp;


    ball.Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball.CoM.spriteInstance.anchor.set(0.5, 0.5);
    newBallGraphic.destroy();

}


$("#runButton").on('click', function () {
    if (!isRunning) {
        isRunning = true;
        $("#runButton").val("Reset");
    } else if (isRunning) {
        //Run reset code
        isRunning = false;
        resetSimulation();
        $("#runButton").val("Run");
    }
    //console.log("Pre Collision KE:" + getLabKE().toString());
});


function resetSimulation() {
    ball1.Lab.spriteInstance.x = ball1.Lab.initr.x;
    ball1.Lab.spriteInstance.y = ball1.Lab.initr.y;
    ball2.Lab.spriteInstance.x = ball2.Lab.initr.x;
    ball2.Lab.spriteInstance.y = ball2.Lab.initr.y;

    ball1.CoM.spriteInstance.x = ball1.CoM.initr.x;
    ball1.CoM.spriteInstance.y = ball1.CoM.initr.y;
    ball2.CoM.spriteInstance.x = ball2.CoM.initr.x;
    ball2.CoM.spriteInstance.y = ball2.CoM.initr.y;

    $('#ball1LabVelocityX').prop("disabled", false);
    $('#ball1LabMass').prop("disabled", false);
    $('#ball2LabMass').prop("disabled", false);
    $('#ballCollisionAngle').prop("disabled", false);
    $('#vectorDrawEnable').prop("disabled", false);

    $("#ball1LabVelocityXDisplay").text($("#ball1LabVelocityX").val() + $("#ball1LabVelocityXDisplay").attr("data-unit"));
    $("#ball1LabVelocityYDisplay").text("0m/s");
    $("#ball2LabVelocityXDisplay").text("0m/s");
    $("#ball2LabVelocityYDisplay").text("0m/s");

    clearVectors();

    ball1.CoM.spriteInstance.visible = true;
    ball2.CoM.spriteInstance.visible = true;
    ball1.Lab.spriteInstance.visible = true;
    ball2.Lab.spriteInstance.visible = true;

    isColliding = false;


    for (let i = 0; i < traces.length; i++) {
        traces[i].destroy();
    }
    traces = [];

    centreOfMass1.x = (canvasWidth / 2);
    centreOfMass1.y = (canvasHeight / 6);

    ball1.Lab.v.y = 0;
    ball2.Lab.v = zeroV();

    ball1.Lab.postv = zeroV();
    ball1.CoM.postv = zeroV();
    ball2.Lab.postv = zeroV();
    ball2.CoM.postv = zeroV();

    updateLabels();
}

/*
++++++++++++++++++++++++++++++++++++
Functions based on Global letiables and basic functions
++++++++++++++++++++++++++++++++++++
*/

function getReducedMass() {
    return (ball1.Lab.mass * ball2.Lab.mass) / (ball1.Lab.mass + ball2.Lab.mass);
}

function getCoMR() {
    return vCal(new Vector(ball1.Lab.mass * ball1.Lab.spriteInstance.x + ball2.Lab.mass * ball2.Lab.spriteInstance.x, ball1.Lab.mass * ball1.Lab.spriteInstance.y + ball2.Lab.mass * ball2.Lab.spriteInstance.y), '*', 1 / (ball1.Lab.mass + ball2.Lab.mass));
}

function getCoMV() {
    //return new vCal(new Vector(ball1.Lab.v.x*ball1.Lab.mass + ball2.Lab.v.x*ball2.Lab.mass,ball1.Lab.v.y*ball1.Lab.mass + ball2.Lab.v.y*ball2.Lab.mass),'*',1.0/(ball1.Lab.mass +ball2.Lab.mass));
    return vCal(vCal(vCal(ball1.Lab.v, "*", ball1.Lab.mass), "+", vCal(ball2.Lab.v, "*", ball2.Lab.mass)), "*", 1.0 / (ball1.Lab.mass + ball2.Lab.mass));
}

function getLabKE() {
    return 0.5 * ball1.Lab.mass * Math.pow(ball1.Lab.v.getMag(), 2) + 0.5 * ball2.Lab.mass * Math.pow(ball2.Lab.v.getMag(), 2);
}

function onCollision() {
    ball1.Lab.v = ball1.Lab.postv;
    ball2.Lab.v = ball2.Lab.postv;
    ball1.CoM.v = ball1.CoM.postv;
    ball2.CoM.v = ball2.CoM.postv;

    isColliding = true;
}

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Fira Sans']
    }

};


/*
++++++++++++++++++++++++++++++++++++
Phaser.io functions
++++++++++++++++++++++++++++++++++++
*/


let game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, 'canvasWrapper', {
    preload: preload,
    create: create,
    update: update
});


function preload() {
    game.stage.backgroundColor = "#EBEEEE";
    if (window.devicePixelRatio >= 1.5) {
        game.load.image('cofmPNG', 'images/cofm.png');
        game.load.image('p1m1m2', 'images/p1m1m2latex@2x.png');
        game.load.image('p1', 'images/p1latex@2x.png');
        game.load.image('pstar', 'images/pstarlatex@2x.png');
        game.load.image('qstar', 'images/qstarlatex@2x.png');
        game.load.image('q1', 'images/q1latex@2x.png');
        game.load.image('q2', 'images/q2latex@2x.png');
        game.load.image('u1', 'images/u1latex@2x.png');
        game.load.image('v1', 'images/v1latex@2x.png');
        game.load.image('v2', 'images/v2latex@2x.png');
    } else {
        game.load.image('cofmPNG', 'images/cofm.png');
        game.load.image('p1m1m2', 'images/p1m1m2latex.png');
        game.load.image('p1', 'images/p1latex.png');
        game.load.image('pstar', 'images/pstarlatex.png');
        game.load.image('qstar', 'images/qstarlatex.png');
        game.load.image('q1', 'images/q1latex.png');
        game.load.image('q2', 'images/q2latex.png');
        game.load.image('u1', 'images/u1latex.png');
        game.load.image('v1', 'images/v1latex.png');
        game.load.image('v2', 'images/v2latex.png');
    }
     game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    textScaleDown = window.devicePixelRatio;

}

function clearVectors() {

    for (let i = 0; i < arrowSprites.length; i++) {
        arrowSprites[i].destroy();
    }
    arrowSprites = [];
}


function create() {

    markerGroup = game.add.group();
    mainGroup = game.add.group();
    uiGroup = game.add.group();

    game.canvasWidth = $("#canvasWrapper").width() * window.devicePixelRatio;
    game.canvasHeight = $("#canvasWrapper").width() * window.devicePixelRatio;
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);


    game.stage.backgroundColor = "#EBEEEE";


    let ball1G = game.add.graphics(0, 0);

    ball1G.lineStyle(1, 0xE9003A, 1);
    ball1G.beginFill(0xE9003A, 1);
    ball1G.drawCircle(0, 0, ball1.radius);


    ball1.Lab.spriteInstance = mainGroup.create(ball1.Lab.initr.x, ball1.Lab.initr.y, ball1G.generateTexture());
    ball1.CoM.spriteInstance = mainGroup.create(ball1.CoM.initr.x, ball1.CoM.initr.y, ball1G.generateTexture());
    ball1.Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball1.CoM.spriteInstance.anchor.set(0.5, 0.5);
    ball1.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball1.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball1G.destroy();


    let ball2G = game.add.graphics(0, 0);

    ball2G.lineStyle(1, 0x00AEF2, 1);
    ball2G.beginFill(0x00AEF2, 1);
    ball2G.drawCircle(0, 0, ball2.radius);

    ball2.CoM.spriteInstance = mainGroup.create(ball2.CoM.initr.x, ball2.CoM.initr.y, ball2G.generateTexture());
    ball2.Lab.spriteInstance = mainGroup.create(ball2.Lab.initr.x, ball2.Lab.initr.y, ball2G.generateTexture());
    ball2.Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball2.CoM.spriteInstance.anchor.set(0.5, 0.5);
    ball2.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball2.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball2G.destroy();


    let bordersG = game.add.graphics((canvasWidth / 2), (canvasHeight / 2));

    bordersG.lineStyle(6 * textScaleDown, 0x003E74, 1);
    bordersG.moveTo(0, 0);
    bordersG.lineTo(0, (canvasHeight ));
    bordersG.lineTo((canvasWidth ), (canvasHeight));
    bordersG.lineTo((canvasWidth), 0);
    bordersG.lineTo(0, 0);

    bordersG.lineStyle(3 * textScaleDown, 0x003E74, 1);
    bordersG.moveTo(0, (canvasHeight / 3));
    bordersG.lineTo((canvasWidth), (canvasHeight / 3));
    bordersG.moveTo(0, (canvasHeight * 2 / 3));
    bordersG.lineTo((canvasWidth ), (canvasHeight * 2 / 3));

    borders = game.add.sprite((canvasWidth / 2), (canvasHeight / 2), bordersG.generateTexture());
    borders.anchor.set(0.5, 0.5);

    bordersG.destroy();


    let style = {
        font: (18 * textScaleDown) + "px Fira Sans",
        fill: "#003E74",
        wordWrap: false,
        align: "left",
        backgroundColor: "#EBEEEE"
    };

    labFrameText = game.add.text(16, 10, "Lab Frame", style);
    labFrameText.anchor.set(0, 0);
    uiGroup.add(labFrameText);

    centreOfMassFrameText = game.add.text(16, ( canvasHeight / 3 + 10 ), "Centre of Mass Frame", style);
    centreOfMassFrameText.anchor.set(0, 0);
    uiGroup.add(centreOfMassFrameText);

    vectorDiagramText = game.add.text(16, ( canvasHeight * 2 / 3 + 10 ), "Vector Diagram", style);
    vectorDiagramText.anchor.set(0, 0);
    uiGroup.add(vectorDiagramText);

    centreOfMass1 = mainGroup.create((canvasWidth / 2), (canvasHeight  / 6), 'cofmPNG');
    centreOfMass1.z = 1;
    centreOfMass1.anchor.set(0.5, 0.5);



    centreOfMass2 = mainGroup.create(canvasWidth / 2, canvasHeight / 2, "cofmPNG");
    centreOfMass2.z = 1;
    centreOfMass2.anchor.set(0.5, 0.5);

    mainGroup.sort();
    updateLabels();

    ball1.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball1.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball2.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    ball2.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;

}


let t = 0;

function update() {
    game.world.sort('z',Phaser.Group.SORT_ASCENDING);
    for(let key in toolTips){
        toolTips[key].update();
    }
    if (isRunning){
        ball1.Lab.spriteInstance.x += ball1.Lab.v.x;
        ball1.Lab.spriteInstance.y -= ball1.Lab.v.y;
        ball2.Lab.spriteInstance.x += ball2.Lab.v.x;
        ball2.Lab.spriteInstance.y -= ball2.Lab.v.y;


        if ((t % (ball1.Lab.v.getMag() * 3)) < 1) {
            addTrace(ball1.Lab);
        }
        if ((t % (ball2.Lab.v.getMag() * 3)) < 1) {
            addTrace(ball2.Lab);
        }
        if ((t % (ball1.CoM.v.getMag() * 3)) < 1) {
            addTrace(ball1.CoM);
        }
        if ((t % (ball2.CoM.v.getMag() * 3)) < 1) {
            addTrace(ball2.CoM);
        }

        centreOfMass1.x = getCoMR().x;
        centreOfMass1.y = getCoMR().y;

        //Centre of mass motion

        ball2.CoM.spriteInstance.x += ball2.CoM.v.x;
        ball2.CoM.spriteInstance.y -= ball2.CoM.v.y;
        ball1.CoM.spriteInstance.x += ball1.CoM.v.x;
        ball1.CoM.spriteInstance.y -= ball1.CoM.v.y;

        $('#ball1LabVelocityX').prop("disabled", true);
        $('#ball1LabMass').prop("disabled", true);
        $('#ball2LabMass').prop("disabled", true);
        $('#ballCollisionAngle').prop("disabled", true);
        $('#vectorDrawEnable').prop("disabled", true);

        let velocityDisplay = [ball1.Lab.v.x.toFixed(2), ball1.Lab.v.y.toFixed(2), ball2.Lab.v.x.toFixed(2), ball2.Lab.v.y.toFixed(2)];

        let i = 0;
        $(".velocityDisplay").each(function () {
            $(this).text(velocityDisplay[i] + $(this).attr("data-unit"));
            i++;
        });

        if(ball1.Lab.spriteInstance.y + ball1.radius/2 > canvasHeight/3) ball1.Lab.spriteInstance.visible = false;
        if(ball2.Lab.spriteInstance.y + ball2.radius/2 > canvasHeight/3) ball2.Lab.spriteInstance.visible = false;
        if(ball1.CoM.spriteInstance.y - ball1.radius/2 < canvasHeight/3) ball1.CoM.spriteInstance.visible = false;
        if(ball1.CoM.spriteInstance.y + ball1.radius/2 > canvasHeight*2/3) ball1.CoM.spriteInstance.visible = false;
        if(ball2.CoM.spriteInstance.y  - ball2.radius/2 < canvasHeight/3) ball2.CoM.spriteInstance.visible = false;
        if(ball2.CoM.spriteInstance.y + ball2.radius/2 > canvasHeight*2/3) ball2.CoM.spriteInstance.visible = false;

        if (!isColliding && Math.pow(ball1.Lab.spriteInstance.x - ball2.Lab.spriteInstance.x,2) + Math.pow(ball1.Lab.spriteInstance.y - ball2.Lab.spriteInstance.y,2) <= Math.pow(ball1.radius+ball2.radius,2)/4) {
            onCollision();
        }

        ball1.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
        ball1.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
        ball2.Lab.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
        ball2.CoM.spriteInstance.blendMode = PIXI.blendModes.DARKEN;
    }
    t += 1;
}

function drawArrow(originV, vectorV, rectIndex, color = 0x006EAF, latexID = "") {
    // let origin,vector;
    let scaleFactor;
    let disStarting = 1;
    if(rectIndex === 3) {
        // vector = new Vector(vectorV.x * 7 /dynamicSF,-1*vectorV.y*7/dynamicSF);
        // if(latexID === 'p1'){
        //     origin = new Vector(originV.x,-1*originV.y);
        // }
        // else{
        //      origin = new Vector(originV.x * 7/dynamicSF,-1*originV.y * 7 /dynamicSF);
        // }
        // // Flip directions for canvas y-axis

        scaleFactor = dynamicSF;
    }else{
        // vector = new Vector(vectorV.x,-1*vectorV.y);
        // origin = new Vector(originV.x, -1 * originV.y);

        scaleFactor = canvasWidth / 16;
        disStarting = 0;
    }

    let arrowG = game.add.graphics(0,0);

    let mag = vectorV.getMag() * scaleFactor;

    arrowG.lineStyle(2, color, 1);
    arrowG.moveTo(0, 0);
    arrowG.lineTo(0, 4);
    arrowG.lineTo(0, -4);
    arrowG.lineTo(0, 0);
    arrowG.lineTo(mag, 0);

    for (var i = 1; i <= Math.floor(vectorV.getMag()); i++) {
        arrowG.lineTo(i*scaleFactor, 0);
        arrowG.lineTo(i*scaleFactor, 4);
        arrowG.lineTo(i*scaleFactor, -4);
        arrowG.lineTo(i*scaleFactor, 0);
    }    

    arrowG.lineTo(mag, 0);
    arrowG.lineTo(mag, 4);
    arrowG.lineTo(mag, -4);
    arrowG.lineTo(mag, 0);



    arrowG.beginFill(color);
    arrowG.moveTo(mag / 2, 0);
    arrowG.lineTo(mag / 2, 0);
    arrowG.lineTo(mag / 2, 6);
    arrowG.lineTo(mag / 2 + 10, 0);
    arrowG.lineTo(mag / 2, -6);
    arrowG.lineTo(mag / 2, 0);
    arrowG.endFill();


    arrowSprites.push(markerGroup.create((canvasWidth / 2 + startingX*disStarting + originV.x * scaleFactor), (canvasHeight * (rectIndex * 2 - 1) / 6 + startingY*disStarting - originV.y * scaleFactor), arrowG.generateTexture()));
    arrowSprites[arrowSprites.length - 1].anchor.set(0, 0.5);
    arrowSprites[arrowSprites.length - 1].rotation = -1*vectorV.getArg();
    console.log(-1*vectorV.getArg());

    if (latexID !== "") {
        arrowSprites.push(markerGroup.create((canvasWidth / 2 + startingX*disStarting + originV.x * scaleFactor + vectorV.x * scaleFactor / 2), (canvasHeight * (rectIndex * 2 - 1) / 6 + startingY*disStarting - originV.y * scaleFactor - vectorV.y * scaleFactor / 2), latexID));
        arrowSprites[arrowSprites.length - 1].anchor.set(0.5, 0);
    }

    arrowG.destroy();
}

function drawAngle(vecta, vectb,pos,color) {
    let arcG = game.add.graphics(0, 0);
    arcG.lineStyle(8, color);
    arcG.arc(0, 0, 50, Math.max(vecta.getArg(),vectb.getArg()), Math.min(vecta.getArg(),vectb.getArg()), true);
    arcG.endFill();
    if(angleSprite != null) angleSprite.destroy();
    angleSprite =  markerGroup.create(pos.x + canvasWidth/2,pos.y + canvasHeight/6,arcG.generateTexture());
    angleSprite.anchor.set(0,0.5);
    arcG.destroy();

}

function getLabP(){
    return new Vector(ball1.Lab.v.x* ball1.Lab.mass + ball2.Lab.v.x*ball2.Lab.mass,ball2.Lab.v.y*ball2.Lab.mass+ball1.Lab.mass*ball1.Lab.v.y);
}

function recalculateVector() {

    let results = doPhysics({mass:ball1.Lab.mass,initV:ball1.Lab.v},{mass:ball2.Lab.mass,initV:ball2.Lab.v},initAngle);


    ball1.CoM.postv = results[0];
    ball2.CoM.postv = results[1];
    p1 = vCal(ball1.Lab.v, "*", ball1.Lab.mass);

    let coMV = getCoMV();
    ball1.Lab.postv = vCal(ball1.CoM.postv, '+', coMV);
    ball2.Lab.postv = vCal(ball2.CoM.postv, '+', coMV);

    q1 = vCal(ball1.Lab.postv, "*", ball1.Lab.mass);
    q2 = vCal(ball2.Lab.postv, "*", ball2.Lab.mass);

    let pStar = vCal(vCal(ball2.Lab.v, '-', ball1.Lab.v), '*', getReducedMass());
    let q2Star = vCal(vCal(ball2.Lab.postv,'-',ball1.Lab.postv),'*',getReducedMass());
    let q1Star = vCal(q2Star,'*',-1);

    dynamicSF = 1;

    if( ( p1.getMag()/Math.abs(q1.y)) <= ( (canvasWidth*0.6) / (canvasHeight/3*0.6) ) ){
        // fit to Math.abs(q1.y)
        dynamicSF = (canvasHeight/3*0.6)/(Math.abs(q1.y)+0.4);
    }else if( ( p1.getMag()/Math.abs(q1.y)) > ( (canvasWidth*0.6) / (canvasHeight/3*0.6) ) ){
        // fit to p1.getMag()
        dynamicSF = (canvasWidth*0.6)/p1.getMag();
    }else{}

    startingX = -1*(dynamicSF*p1.getMag()/2);
    startingY = (dynamicSF*(q1.y-0.4)/2);

    if('comLab' in toolTips){
        toolTips['comLab'].updatePosition(getCoMR());
    }else {
        toolTips['comLab'] = new ToolTip(new Vector(getCoMR().x,getCoMR().y),"Centre of Mass","The single point in the system where\n all the total mass of the object can\n be taken to act at.");
    }

    clearVectors();
    if ($('#vectorDrawEnable').is(':checked')) {
        console.log("Checked");

        let scalefactor = canvasWidth / 16;
        let colPoint = 100-ball2.radius;

        drawArrow(vCal(new Vector(colPoint/scalefactor, 0 - (Math.sin(initAngle)*(ball1.radius + ball2.radius)*0.25)/scalefactor ),'-',ball1.Lab.v), ball1.Lab.v, 1, 0xE40043, "u1");
        drawArrow(new Vector(colPoint/scalefactor, 0 - (Math.sin(initAngle)*(ball1.radius + ball2.radius)*0.25)/scalefactor ), ball1.Lab.postv, 1, 0xD24000, "v1");
        drawArrow(new Vector((ball2.Lab.spriteInstance.x-canvasWidth*0.5)/scalefactor, (Math.sin(initAngle)*(ball1.radius + ball2.radius)*0.25)/scalefactor),ball2.Lab.postv, 1, 0x00ACD7, "v2");
        //CoM frame
        drawArrow(new Vector(0-pStar.x ,0),pStar,2,0x960078,'pstar');
        drawArrow(new Vector(pStar.x,0),vCal(pStar,'*',-1),2,0x960078,'pstar');
        drawArrow(new Vector(0,0),q1Star,2,0x960078,'qstar');
        drawArrow(new Vector(0,0),q2Star,2,0x960078,'qstar');
    }
    drawArrow(zeroV(), q1, 3, 0xDD2501, "q1");
    drawArrow(q1, q2, 3, 0x0091D4, 'q2');
    drawArrow(zeroV(), vCal(vCal(pStar,'*',-1), "*", (ball1.Lab.mass / ball2.Lab.mass)), 3, 0xEC7300, "p1m1m2");
    drawArrow(vCal(vCal(pStar,'*',-1), "*", (ball1.Lab.mass / ball2.Lab.mass)),vCal(pStar,'*',-1), 3, 0x960078, "pstar");
    drawArrow(vCal(vCal(pStar,'*',-1), "*", (ball1.Lab.mass / ball2.Lab.mass)), q1Star, 3, 0x960078, "qstar");
    drawArrow(new Vector(0, -0.4), p1, 3, 0xE40043, "p1");
}

function addTrace(ball) {
    let ballG = game.add.graphics(0, 0);
    let color;
    if (ball.name === "ball1Lab" || ball.name === "ball1CoM") {
        color = 0xE9003A;
    } else if (ball.name === "ball2Lab" || ball.name === "ball2CoM") {
        color = 0x00AEF2;
    }

    if(ball.spriteInstance.visible){
        ballG.lineStyle(1, color, 1);
        ballG.beginFill(color, 1);
        ballG.drawCircle(0, 0, 7);

        traces.push(markerGroup.create(ball.spriteInstance.x, ball.spriteInstance.y, (ballG.generateTexture())));
        traces[traces.length -1].anchor.set(0.5,0.5);
        ballG.destroy();
    }
}
