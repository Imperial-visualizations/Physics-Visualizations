/** *******************************************************************************************************************
 * Created to simplify some of the vector calculations frequently used in calculations, e.g. addition,
 * subtraction, cos, sin, tan. Soon to include features such as sum (all elements in vector), dot & cross products.
 *
 * - Akash B.
 ******************************************************************************************************************* **/

/** Function to check if input, n, is a finite number. **/
var isNumber = function (n) {
    return isFinite(n) && +n === n;
};

// Defining function to create new object
Vector = function(items) {
    this.items = items;
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
    return new Vector(result).items;                                                    // Returning the resultant array
};

/** *************************************************** Subtract Function ****************************************** **|
 * Subtracts one vector/matrix from another.
 * @return {*} Subtracted Array
 ** **************************************************************************************************************** **/
Vector.prototype.subtract = function subtract(other) {
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
    return new Vector(result).items;                                                    // Returning the result vector.
};

/** ************************************************* Sum function ************************************************* **|
 * Adds all elements of vector together. Also can add the all the rows of the matrices.
 * @returns {*} Summed array.
|** **************************************************************************************************************** **/
Vector.prototype.sum = function sum() {
    var result = [];                                                         // Array where resulting vector is stored.
    var sum = 0;
    if (this.items.constructor === Array && isNumber(this.items[0])) {       // Checking element in array is a number.
        for (var i = 0; i < this.items.length; i++) {
            // Adding element i of this array to element i of other array.
            sum += this.items[i];
        }
        result.push(sum);
        return new Vector(result).items
    }

    else if (this.items.constructor === Array && this.items[0].constructor === Array)
    {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);
            sum += this.items[j].sum()[0];
        }
        result.push([sum]);
        return new Vector(result).items
    }
};

/** Column Summation Function
 *
 * @returns {*}
 */
Vector.prototype.colsum = function () {

    // Sanity check.
    if (this.items.constructor !== Array || this.items[0].constructor !== Array || this.items.length < 1)
    {
        console.error("Expected to get Vector of length >= 1.");
        return -1;
    }

    var result = [];
    for (var i = 1; i < this.items.length; i++) {
        this.items[i] = new Vector(this.items[i]).add(new Vector(this.items[i - 1]));
    }
    result.push(this.items[this.items.length - 1]);
    return new Vector(result).items
};

Vector.prototype.rowsum = function() {
    var result = [];
    if (this.items.constructor === Array && this.items[0].constructor === Array)
    {
        for (var j = 0; j < this.items.length; j++) {
            this.items[j] = new Vector(this.items[j]);
            result.push(this.items[j].sum());
        }
    }
    return new Vector(result).items
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
    return new Vector(result).items;                                                // Returning the result vector.
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
        result.push(this.items[i] * other.items[i])              // Multiplying element i of this to element i of other.
    }

    return new Vector(result).sum()                              // Summing products and returning array.
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

/**
 * ==============================================- End of Trig Functions -==============================================
 **/

/**  ************************************************* END ********************************************************* **/
var v1 = new Vector([[[1, 2, 3], [2, 4, 5], [4, 5, 6], [9, 10, 11]]]);
var v2 = new Vector([10, 20, 30]);

console.log(v1.sin());
