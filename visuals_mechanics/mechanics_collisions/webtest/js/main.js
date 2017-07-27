var game;

function onClick() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.
    var form = document.getElementById("sim-params");
    var m1 = parseFloat(form.elements[0].value);
    var u1 = parseFloat(form.elements[1].value);
    var m2 = parseFloat(form.elements[2].value);
    var u2 = parseFloat(form.elements[3].value);
    var e = parseFloat(form.elements[4].value);

    if (e > 1.0 || e < 0.0){
        alert("Coefficient of Restitution must be between 0 & 1");
        return;
    }

    if(typeof game !== 'undefined'){
        game.destroy();
    }
    game = new Phaser.Game(500,500, Phaser.AUTO, '', {preload: preload, create: create, update: update});

    var cursors, ball, ball2, redCross, ball2CoM, ballCoM,redCrossCoM,comPos;
    var collide = false;

    function preload() {
        game.load.image('logo', 'assets/ball.png');
        game.load.image('redcross', 'assets/redcross.png');
        game.stage.backgroundColor = '#FFFFFF';
        comPos = {x:game.world.centerX,y:game.world.centerY + 150};
    }

    function create() {
        ball = game.add.sprite(game.world.centerX / 2, game.world.centerY, 'logo');
        ball2 = game.add.sprite(1.5 * game.world.centerX, game.world.centerY, 'logo');
        ballCoM = game.add.sprite(comPos.x * 0.5, comPos.y, 'logo');
        ball2CoM = game.add.sprite(comPos.x *1.5, comPos.y, 'logo');
        redCross = game.add.sprite(getCoMPos(), game.world.centerY, 'redcross');
        redCrossCoM = game.add.sprite(comPos.x,comPos.y,'redcross');
        ball.anchor.setTo(0.5, 0.5);
        ball2.anchor.setTo(0.5, 0.5);
        redCross.anchor.set(0.5, 0.5);
        redCrossCoM.anchor.set(0.5,0.5);
        ballCoM.anchor.set(0.5,0.5);
        ball2CoM.anchor.set(0.5,0.5);
        redCross.scale.setTo(0.6,0.6);
        redCrossCoM.scale.setTo(0.6,0.6);
        cursors = game.input.keyboard.createCursorKeys();
    }

    function getCoMPos() {
        return 1.0 / (m1 + m2) * (ball.x * m1 + ball2.x * m2);
    }

    function update() {
        ball.x += u1;
        ball2.x += u2;
        ballCoM.x = ball.x - getCoMPos() +comPos.x;
        ball2CoM.x = ball2.x - getCoMPos() + comPos.x;
        redCross.x = getCoMPos();
        if (checkOverlap(ball, ball2) && !collide) {
            handleCollision();
        }
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }

    function handleCollision() {
        var v1 = 1.0 / (m1 + m2) * ((m1 - e * m2) * u1 + (1 + e) * m2 * u2),
            v2 = 1.0 / (m1 + m2) * ((m2 - e * m1) * u2 + (1 + e) * m1 * u1);
        u1 = v1;
        u2 = v2;
        collide = true;

    }
}