/*
++++++++++++++++++++++++++++++++++++
Pre-defined classes
++++++++++++++++++++++++++++++++++++
*/
function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.getArg = function () {
        return Math.atan2(this.y, this.x);
    };
    this.getMag = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    this.toString = function () {
        return "(" + this.x.toString() + "," + this.y.toString() + ")";
    };
}

/*
++++++++++++++++++++++++++++++++++++
Basic functions
++++++++++++++++++++++++++++++++++++
*/

function zeroV() {
    return new Vector(0, 0);
}

function vCal(input1, action, input2) {
    //Vector Calculations
    switch (action) {
        case "-":
            return new Vector(input1.x - input2.x, input1.y - input2.y);
        case "+":
            return new Vector(input1.x + input2.x, input1.y + input2.y);
        case "*":
            return new Vector(input2 * input1.x, input2 * input1.y);
        case "rotate":
            return new Vector(input1.x * Math.cos(input2) - input1.y * Math.sin(input2), input1.x * Math.sin(input2) + input1.y * Math.cos(input2));
        default:
            console.log("undefined operation, " + action);

    }
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



let borders, centreOfMass1, textScaleDown;


let arrowSprites = [];

let traces = [];


let d = new Date();

ball1 = {
    Lab: {
        name: "ball1Lab",
        spriteInstance: undefined,
        mass: 1,
        initr: new Vector((canvasWidth / 2 - 100), (canvasHeight / 6)),
        v: new Vector(0, 0),
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

$('#vector_draw_enable').on('click', updateLabels);

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
        centreOfMass1.x = getCoMR().x;
        centreOfMass1.y = getCoMR().y;


        updateRadius(ball1);
        updateRadius(ball2);

        updateScatterAngle();

        ball1.CoM.spriteInstance.x = canvasWidth - 100 - getCoMR().x;
        ball1.CoM.spriteInstance.y += canvasHeight / 6 - getCoMR().y;
        ball2.CoM.spriteInstance.x = canvasWidth + 100 - getCoMR().x;
        ball2.CoM.spriteInstance.y += canvasHeight / 6 - getCoMR().y;


        recalculateVector();
    }
}

function updateRadius(ball) {
    ball.radius = 40 *  Math.sqrt(ball.Lab.mass);
    let newBallGraphic = game.add.graphics(0, 0);

    newBallGraphic.lineStyle(1, ball.color, 1);
    newBallGraphic.beginFill(ball.color, 1);
    newBallGraphic.drawCircle(0, 0, ball.radius);


    let labTmp = game.add.sprite(ball.Lab.spriteInstance.x, ball.Lab.spriteInstance.y, newBallGraphic.generateTexture());

    let CoMTmp = game.add.sprite(ball.CoM.spriteInstance.x, ball.CoM.spriteInstance.y, newBallGraphic.generateTexture());
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

    document.getElementById('ball1LabVelocityX').disabled = false;
    $("#ball1LabVelocityX").removeClass("disabled");
    document.getElementById('ball1LabMass').disabled = false;
    $("#ball1LabMass").removeClass("disabled");
    document.getElementById('ball2LabMass').disabled = false;
    $("#ball2LabMass").removeClass("disabled");
    document.getElementById('ballCollisionAngle').disabled = false;
    $("#ballCollisionAngle").removeClass("disabled");

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
    } else {
        game.load.image('cofmPNG', 'images/cofm.png');
        game.load.image('p1m1m2', 'images/p1m1m2latex.png');
        game.load.image('p1', 'images/p1latex.png');
        game.load.image('pstar', 'images/pstarlatex.png');
        game.load.image('qstar', 'images/qstarlatex.png');
        game.load.image('q1', 'images/q1latex.png');
        game.load.image('q2', 'images/q2latex.png');
    }
    textScaleDown = window.devicePixelRatio;

}

function clearVectors() {

    for (let i = 0; i < arrowSprites.length; i++) {
        arrowSprites[i].destroy();
    }
    arrowSprites = [];
}


function create() {
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


    ball1.Lab.spriteInstance = game.add.sprite(ball1.Lab.initr.x, ball1.Lab.initr.y, ball1G.generateTexture());
    ball1.CoM.spriteInstance = game.add.sprite(ball1.CoM.initr.x, ball1.CoM.initr.y, ball1G.generateTexture());
    ball1.Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball1.CoM.spriteInstance.anchor.set(0.5, 0.5);
    ball1G.destroy();


    let ball2G = game.add.graphics(0, 0);

    ball2G.lineStyle(1, 0x00AEF2, 1);
    ball2G.beginFill(0x00AEF2, 1);
    ball2G.drawCircle(0, 0, ball2.radius);

    ball2.CoM.spriteInstance = game.add.sprite(ball2.CoM.initr.x, ball2.CoM.initr.y, ball2G.generateTexture());
    ball2.Lab.spriteInstance = game.add.sprite(ball2.Lab.initr.x, ball2.Lab.initr.y, ball2G.generateTexture());
    ball2.Lab.spriteInstance.anchor.set(0.5, 0.5);
    ball2.CoM.spriteInstance.anchor.set(0.5, 0.5);
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
        font: (18 * textScaleDown) + "px Lato",
        fill: "#003E74",
        wordWrap: false,
        align: "left",
        backgroundColor: "#EBEEEE"
    };

    labFrameText = game.add.text(16, 10, "Lab Frame", style);
    labFrameText.anchor.set(0, 0);

    centreOfMassFrameText = game.add.text(16, ( canvasHeight / 3 + 10 ), "Centre of Mass Frame", style);
    centreOfMassFrameText.anchor.set(0, 0);

    vectorDiagramText = game.add.text(16, ( canvasHeight * 2 / 3 + 10 ), "Vector Diagram", style);
    vectorDiagramText.anchor.set(0, 0);

    centreOfMass1 = game.add.sprite((canvasWidth / 2), (canvasHeight  / 6), 'cofmPNG');
    centreOfMass1.anchor.set(0.5, 0.5);

    centreOfMass2 = game.add.sprite(canvasWidth / 2, canvasHeight / 2, "cofmPNG");
    centreOfMass2.anchor.set(0.5, 0.5);

    updateLabels();

}


let t = 0;

function update() {
    if (isRunning) {

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

        document.getElementById('ball1LabVelocityX').disabled = true;
        $("#ball1LabVelocityX").addClass("disabled");
        document.getElementById('ball1LabMass').disabled = true;
        $("#ball1LabMass").addClass("disabled");
        document.getElementById('ball2LabMass').disabled = true;
        $("#ball2LabMass").addClass("disabled");
        document.getElementById('ballCollisionAngle').disabled = true;
        $("#ballCollisionAngle").addClass("disabled");


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

        if (Phaser.Rectangle.intersects(ball1.Lab.spriteInstance.getBounds(), ball2.Lab.spriteInstance.getBounds()) && !isColliding) {
            onCollision();
        }


    }
    t += 1;
}

function drawArrow(originV, vectorV, rectIndex, color = 0x006EAF, latexID = "") {

    let origin = new Vector(originV.x, -1 * originV.y);

    let vector = new Vector(vectorV.x, -1 * vectorV.y);
    // Flip directions for canvas y-axis


    let arrowG = game.add.graphics((canvasWidth / 2 - 500 + origin.x), (canvasHeight * 5 / 6 + 100 + origin.y));

    let scaleFactor = 100 * canvasWidth / 1600;

    let mag = vector.getMag() * scaleFactor;

    arrowG.lineStyle(2, color, 1);
    arrowG.moveTo(0, 0);
    arrowG.lineTo(0, 4);
    arrowG.lineTo(0, -4);
    arrowG.lineTo(0, 0);
    arrowG.lineTo(mag, 0);
    arrowG.lineTo(mag, 4);
    arrowG.lineTo(mag, -4);
    arrowG.lineTo(mag, 0);

    arrowG.beginFill(color);
    arrowG.moveTo(mag, 0);
    arrowG.lineTo(mag / 2, 0);
    arrowG.lineTo(mag / 2, 6);
    arrowG.lineTo(mag / 2 + 10, 0);
    arrowG.lineTo(mag / 2, -6);
    arrowG.lineTo(mag / 2, 0);
    arrowG.endFill();

    arrowSprites.push(game.add.sprite((canvasWidth / 2 - 5 * scaleFactor + origin.x * scaleFactor), (canvasHeight * (rectIndex * 2 - 1) / 6 + scaleFactor + origin.y * scaleFactor), arrowG.generateTexture()));
    arrowSprites[arrowSprites.length - 1].anchor.set(0, 0.5);
    arrowSprites[arrowSprites.length - 1].rotation = vector.getArg();

    if (latexID !== "") {
        arrowSprites.push(game.add.sprite((canvasWidth / 2 - 5 * scaleFactor + origin.x * scaleFactor + vector.x * scaleFactor / 2), (canvasHeight * (rectIndex * 2 - 1) / 6 + scaleFactor + origin.y * scaleFactor + vector.y * scaleFactor / 2), latexID));
        arrowSprites[arrowSprites.length - 1].anchor.set(0.5, 0);
    }

    arrowG.destroy();
}

function drawAngle(vecta, vectb, color) {

    let arcG = game.add.graphics(0, 0);
    arcG.lineStyle(8, color);
    arcG.arc(0, 0, 50, vectb.getArg, vecta.getArg(), true);
    arcG.endFill();
}

function recalculateVector() {

    let pStar = vCal(vCal(ball2.Lab.v, '-', ball1.Lab.v), '*', getReducedMass());

    let pStar_reversed = vCal(pStar, '*', -1);

    let q1star = vCal(pStar, 'rotate', initAngle);

    let q2star = vCal(pStar, 'rotate', initAngle - Math.PI);
    ball1.CoM.postv = vCal(q1star, '*', 1 / ball1.Lab.mass);
    ball2.CoM.postv = vCal(q2star, '*', 1 / ball2.Lab.mass);
    p1 = vCal(ball1.Lab.v, "*", ball1.Lab.mass);


    let coMV = getCoMV();
    ball1.Lab.postv = vCal(ball1.CoM.postv, '+', coMV);
    ball2.Lab.postv = vCal(ball2.CoM.postv, '+', coMV);

    q1 = vCal(ball1.Lab.postv, "*", ball1.Lab.mass);
    q2 = vCal(ball2.Lab.postv, "*", ball2.Lab.mass);
    clearVectors();
    if ($('#vector_draw_enable').is(':checked')) {
        console.log("Checked");

        let scalefactor = canvasWidth / 16;
        let colPoint = 100 - (ball2.radius);

        drawArrow(vCal(new Vector(colPoint/scalefactor + 5, 1),'-',p1), p1, 1, 0xE40043);
        drawArrow(new Vector(colPoint/scalefactor + 5, 1), q1, 1, 0xE40043);
        drawArrow(new Vector(colPoint/scalefactor + 5, 1), q2, 1, 0x00ACD7);
    }
    drawArrow(zeroV(), q1, 3, 0xDD2501, "q1");
    drawArrow(q1, q2, 3, 0x0091D4, 'q2');
    drawArrow(zeroV(), vCal(pStar_reversed, "*", (ball1.Lab.mass / ball2.Lab.mass)), 3, 0xEC7300, "p1m1m2");
    drawArrow(vCal(pStar_reversed, "*", (ball1.Lab.mass / ball2.Lab.mass)), pStar_reversed, 3, 0x960078, "pstar");
    drawArrow(vCal(pStar_reversed, "*", (ball1.Lab.mass / ball2.Lab.mass)), q1star, 3, 0x960078, "qstar");
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
        ballG.drawCircle(0, 0, 10);

        traces.push(game.add.sprite(ball.spriteInstance.x, ball.spriteInstance.y, (ballG.generateTexture())));

        ballG.destroy();
    }
}