/** *******************************************************************************************************************
 * Created to simplify some of the vector calculations frequently used in calculations, e.g. addition,
 * subtraction, cos, sin, tan. Soon to include features such as sum (all elements in vector), dot & cross products.
 *
 * - Akash Bhattacharya & Robert King.
 ******************************************************************************************************************* **/

/** Function to check if input, n, is a finite number. **/
var isNumber = function (n) {
    return isFinite(n) && +n === n;
};

// Defining function to create new object
Vector = function(items) {
    this.items = items;
    this.length = this.items.length;
};

Vector.prototype.toString = function () {
    var string = "[";
    for(var i = 0;i < this.length;i++){
        string += this.items[i].toString();
        if(i < this.length - 1) string += ",";
    }

    string += "]";
    return string;
};

/** *************************************************** Addition Function ****************************************** **|
 * Adds one vector/matrix to another.
 * @return {*} Resulting Array from addition
 ** **************************************************************************************************************** **/
Vector.prototype.add = function add(other) {
    // Sanity check - make sure Vectors are of same length.
    if (this.items.length !== other.items.length)
    {
        console.error("Error: Unequal number of elements in each Vector");
        return -1
    }

    if (typeof this.items !== typeof other.items) {
        console.error("Error: Trying to add incompatible data types.");
        return -2
    }

    var result = [];                                                         // Array where resulting vector is stored.

    if (this.items.constructor === Array && other.items.constructor === Array           // Checking data type is array.
        && isNumber(this.items[0]) && isNumber(other.items[0])) {             // Checking element in array is a number.

        for (var i = 0; i < this.items.length; i++) {
            // Adding element i of this array to element i of other array.
            result.push(this.items[i] + other.items[i]);
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && other.items.constructor === Array
             && this.items[0].constructor === Array && other.items[0].constructor === Array) {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            other.items[j] = new Vector(other.items[j]);                                // Converting array to Vector.
            result.push(this.items[j].add(other.items[j]).items)                        // Adding arrays recursively.
        }
    }
    return new Vector(result);                                                    // Returning the resultant array
};

/** *************************************************** Subtract Function ****************************************** **|
 * Subtracts one vector/matrix from another.
 * @return {*} Subtracted Array
 ** **************************************************************************************************************** **/
Vector.prototype.subtract = function(other) {
    // Sanity check - make sure Vectors are of same length.
    if (this.items.length !== other.items.length)
    {
        console.error("Error: Unequal number of elements in each Vector");
        return -1
    }

    if (typeof this.items !== typeof other.items) {
        console.error("Error: Trying to add incompatible data types.");
        return -2
    }

    var result = [];                                                         // Array where resulting vector is stored.

    if (this.items.constructor === Array && other.items.constructor === Array           // Checking data type is array.
        && isNumber(this.items[0]) && isNumber(other.items[0])) {             // Checking element in array is a number.

        for (var i = 0; i < this.items.length; i++) {
            // Subtracting element i of this array from element i of other array.
            result.push(this.items[i] - other.items[i]);
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && other.items.constructor === Array
             && this.items[0].constructor === Array && other.items[0].constructor === Array) {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            other.items[j] = new Vector(other.items[j]);                                // Converting array to Vector.
            result.push(this.items[j].subtract(other.items[j]).items)                   // Adding arrays recursively.
        }
    }
    return new Vector(result);                                                    // Returning the result vector.
};

/** ************************************************* Sum function ************************************************* **|
 * Adds all elements of vector together. Also can add the all the rows of the matrices.
 * @returns {Number} Summed array.
|** **************************************************************************************************************** **/
Vector.prototype.sum = function sum() {
    var sum = 0;

    // Sum of elements in a vector
    if (this.items.constructor === Array && isNumber(this.items[0])) {       // Checking element in array is a number.
        for (var i = 0; i < this.items.length; i++) {
            // Adding element i of this array to element i of other array.
            sum += this.items[i];
        }
    }

    // Sum of elements in a matrix.
    else if (this.items.constructor === Array && this.items[0].constructor === Array)
    {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);
            sum += this.items[j].sum();
        }
    }

    return sum
};

Vector.prototype.mean = function sum() {
    return this.sum / this.length
};

Vector.prototype.mag = function() {
    if (this.items.constructor !== Array || !isNumber(this.items[0])) {
        console.log("This function is only for vectors! Please enter a Vector.");
        return -1
    }
    return Math.sqrt(this.power(2).sum());
};

Vector.prototype.unit = function unit() {
    var magnitude = this.mag();
    return this.multiply(1 / magnitude);
};

Vector.prototype.power = function power(number) {
    if (!isNumber(number)) {
        console.error("Exponent " + number + " is not valid.");
        return -1;
    }

    var result = [];

    if (this.items.constructor === Array && isNumber(this.items[0])) {
        for (var i = 0; i < this.items.length; i++) {
            result.push(Math.pow(this.items[i], number));
        }
    }

    else if (this.items.constructor === Array && this.items[0].constructor === Array) {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);
            result.push(this.items[j].power(number));
        }
    }

    return new Vector(result);
};
/**
 * function rotates vector by degrees theta and returns the new vector
 * @param {Number} theta - the angle to rotate the vector by
 * @returns {Vector} - a new vector which represents the vector object rotated by degrees thetea.
 */
Vector.prototype.rotate = function rotate(theta) {

    var new_x = 0;
    var new_y = 0;

    // 2D rotation
    if (this.items.length === 2 && isNumber(this.items[0])) {
        new_x = (this.items[0] * Math.cos(theta)) - (this.items[1] * Math.sin(theta));
        new_y = (this.items[0] * Math.sin(theta)) + (this.items[1] * Math.cos(theta));
        return new Vector([new_x, new_y]);
    }

    else {
        console.error("Sorry, only supports 2D rotation for now!");
        return -1;
    }
};

/** ******************************************** Column Summation Function ***************************************** **|
 * Adds columns of a 2D matrix.
 * @returns {*} Resultant matrix.
 ** **************************************************************************************************************** **/
Vector.prototype.colsum = function () {

    // Sanity check.
    if (this.items.constructor !== Array || this.items[0].constructor !== Array || this.items.length < 2)
    {
        console.error("Expected to get Vector of length >= 2.");
        return -1;
    }

    var result = [];
    for (var i = 1; i < this.items.length; i++) {
        this.items[i] = new Vector(this.items[i]).add(new Vector(this.items[i - 1]));
    }
    result.push(this.items[this.items.length - 1]);
    return result;
};

/** ********************************************  Row Summation Function  ****************************************** **|
 * Adds columns of a 2D matrix.
 * @returns {*} Resultant matrix.
 ** **************************************************************************************************************** **/
Vector.prototype.rowsum = function() {
    var result = [];
    if (this.items.constructor === Array && this.items[0].constructor === Array)
    {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);
            result.push(this.items[j].sum());
        }
    }
    return result;
};

/** **********************************************  Multiplying function  ****************************************** **|
 * Performs scalar multiplication of vectors or matrices.
 * @param other Int.
 * @returns {*} Result array.
 ** **************************************************************************************************************** **/
Vector.prototype.multiply = function multiply(other) {

    var result = [];                                                         // Array where resulting vector is stored.

    // Scalar multiplication.
    if (this.items.constructor === Array && isNumber(this.items[0]) && isNumber(other)) {
        // Scalar multiplication of a vector.
        for (var i = 0; i < this.items.length; i++) {
            result.push(this.items[i] * other);
        }
    }
    // Scalar multiplication of a matrix
    else if (this.items.constructor === Array && this.items[0].constructor === Array && isNumber(other)) {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                              // Converting array to Vector.
            result.push(this.items[j].multiply(other));
        }
    }

    return new Vector(result);                                            // Returning the result vector.
};

/** ************************************************ Dot Product Function ****************************************** **|
 * Finds dot product of 2 Vectors.
 * @return {*} Array with dot product
 ** **************************************************************************************************************** **/
Vector.prototype.dot = function dot(other) {
    if ((this.items.constructor !== Array || other.items.constructor !== Array) &&
        (!isNumber(this.items[0]) || !isNumber(other.items[0])) ) {
        console.error("Error: Values must both be vectors. Incompatible data types.");
        return -2
    }

    if (this.items.length !== other.items.length) {
        console.error("Error. Vectors must be of same length.");
        return -1
    }

    var result = [];

    for (var i = 0; i < this.items.length; i++) {
        result.push(this.items[i] * other.items[i]) ;             // Multiplying element i of this to element i of other.
    }

    return result.sum();                              // Summing products and returning array.
};


/**
 *=====================================================- Trig Functions -===============================================
 **/

/** ***************************************************** Sin function ********************************************* **|
 * Calculates sine of all numbers in Vector array.
 * @returns {*} Array with sin values.
 ** **************************************************************************************************************** **/
Vector.prototype.sin = function sin() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Calculating sine of every numerical element in the array
            result.push(Math.sin(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].sin());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** ***************************************************** Cos function ********************************************* **|
 * Calculates cosine of all numbers in Vector array.
 * @returns {*} Array with cos values.
 ** **************************************************************************************************************** **/
Vector.prototype.cos = function cos() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Calculating cosine of every single element in array.
            result.push(Math.cos(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].cos());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** ***************************************************** Tan function ********************************************* **|
 * Calculates tangent of all numbers in Vector array.
 * @returns {*} Array with tan values.
 ** **************************************************************************************************************** **/
Vector.prototype.tan = function tan() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {

            // Checking if angle is a multiple of pi/2, in which case push NaN
            if (this.items[i] % (Math.PI / 2) === 0) {
                result.push(NaN)
            }

            else {
                result.push(Math.tan(this.items[i]));
            }
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].tan());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** **************************************************** Sinh function ********************************************* **|
 * Calculates hyperbolic sine of all numbers in Vector array.
 * @returns {*} Array with sinh values.
 ** **************************************************************************************************************** **/
Vector.prototype.sinh = function sinh() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            result.push(Math.sinh(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].sinh());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** **************************************************** Cosh function ********************************************* **|
 * Calculates hyperbolic cosine of all numbers in Vector array.
 * @returns {*} Array with cosh values.
 ** **************************************************************************************************************** **/
Vector.prototype.cosh = function cosh() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            result.push(Math.cosh(this.items[i]));

        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].cosh());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** **************************************************** Tanh function ********************************************* **|
 * Calculates hyperbolic tangent of all numbers in Vector array.
 * @returns {*} Array with tanh values.
 ** **************************************************************************************************************** **/
Vector.prototype.tanh = function tanh() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            result.push(Math.tanh(this.items[i]));

        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].tanh());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/**
 * ==============================================- End of Trig Functions -==============================================
 **/

/**
 *==============================================- Inverse Trig Functions -==============================================
 **/

/** ************************************************* arcsin function ********************************************** **|
 * Calculates inverse sine of all numbers in Vector array.
 * @returns {*} Array with arcsine values.
 ** **************************************************************************************************************** **/
Vector.prototype.asin = function asin() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Putting error message on console when value outside domain detected.
            if (Math.abs(this.items[i]) > 1) {
                console.error("Value " + this.items[i] + " is outside domain of arcsin.")
            }

            // Calculating arcsin of every numerical element in the array
            result.push(Math.asin(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].asin());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};
/** ************************************************ arcsinh function ********************************************** **|
 * Calculates inverse sine of all numbers in Vector array.
 * @returns {*} Array with hyperbolic arcsine values.
 ** **************************************************************************************************************** **/
Vector.prototype.asinh = function asinh() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Putting error message on console when value outside domain detected.
            if (Math.abs(this.items[i]) > 1) {
                console.error("Value " + this.items[i] + " is outside domain of arcsin.")
            }

            // Calculating arcsin of every numerical element in the array
            result.push(Math.asinh(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].asinh());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** ************************************************* arccos function ********************************************** **|
 * Calculates inverse cosine of all numbers in Vector array.
 * @returns {*} Array with arccos values.
 ** **************************************************************************************************************** **/
Vector.prototype.acos = function acos() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Putting error message on console when value outside domain detected.
            if (Math.abs(this.items[i]) > 1) {
                console.error("Value " + this.items[i] + " is outside domain of arcsin.")
            }

            // Calculating arccos of every numerical element in the array
            result.push(Math.acos(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].acos());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** ************************************************ arccosh function ********************************************** **|
 * Calculates inverse cosine of all numbers in Vector array.
 * @returns {*} Array with hyperbolic arccos values.
 ** **************************************************************************************************************** **/
Vector.prototype.acosh = function acosh() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Putting error message on console when value outside domain detected.
            if (Math.abs(this.items[i]) > 1) {
                console.error("Value " + this.items[i] + " is outside domain of arcsin.")
            }

            // Calculating arccos of every numerical element in the array
            result.push(Math.acosh(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].acosh());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** ************************************************* arctan function ********************************************** **|
 * Calculates inverse tangent of all numbers in Vector array.
 * @returns {*} Array with arctan values.
 ** **************************************************************************************************************** **/
Vector.prototype.atan = function atan() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Calculating arctan of every numerical element in the array
            result.push(Math.atan(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].atan());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** ************************************************* arctanh function ********************************************* **|
 * Calculates inverse tangent of all numbers in Vector array.
 * @returns {*} Array with  hyperbolic arctan values.
 ** **************************************************************************************************************** **/
Vector.prototype.atanh = function atanh() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Calculating arctanh of every numerical element in the array
            result.push(Math.atanh(this.items[i]));
        }
    }

    // Case if the element in the arrays are more arrays (i.e. matrices).
    else if (this.items.constructor === Array && this.items[0].constructor === Array) {

        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);                                  // Converting array to Vector.
            result.push(this.items[j].atanh());
        }
    }
    return new Vector(result).items;                                                    // Returning the result vector.
};

/**
 * ==========================================- End of Inverse Trig Functions -==========================================
 **/

/**  ************************************************* END ********************************************************* **/
