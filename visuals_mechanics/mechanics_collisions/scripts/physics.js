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

function doPhysics(ball1,ball2,scatterAngle){
    let reducedMass =( ball1.mass*ball2.mass) / (ball2.mass + ball1.mass);
    let pStar = vCal(vCal(ball2.initV, '-', ball1.initV), '*',reducedMass);
    let q1star = vCal(pStar, 'rotate', scatterAngle);
    let q2star = vCal(pStar, 'rotate', scatterAngle - Math.PI);
    return [vCal(q1star, '*', 1 / ball1.mass), vCal(q2star, '*', 1 / ball2.mass)];
}