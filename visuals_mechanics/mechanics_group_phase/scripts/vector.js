/** *******************************************************************************************************************
 * Created by Akash B to simplify some of the vector calculations frequently used in calculations, e.g. addition,    **
 * subtraction, cos, sin, tan. Soon to include features such as sum (all elements in vector), dot & cross products.  **
 ******************************************************************************************************************* **/

/** Function to check if input, n, is a finite number. **/
var isNumber = function (n) {
    return isFinite(n) && +n === n;
};

// Defining function to create new object
Vector = function(items) {
    this.items = items;
};

/** *************************************************** Add function ******************************************** **/
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
    return new Vector(result);                                                          // Returning the result vector.
};

/** ************************************* Subtract function *********************************************** **/
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

/** *************************************************** Sine function ********************************************** **/
Vector.prototype.sin = function sin() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Subtracting element i of this array from element i of other array.
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

/** ************************************************** Cosine function ********************************************* **/
Vector.prototype.cos = function cos() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Subtracting element i of this array from element i of other array.
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

/** ************************************************ Tangent function ********************************************** **/
Vector.prototype.cos = function cos() {

    var result = [];                                                         // Array where resulting vector is stored.
    if (this.items.constructor === Array && isNumber(this.items[0])) {

        for (var i = 0; i < this.items.length; i++) {
            // Subtracting element i of this array from element i of other array.
            result.push(Math.cos(this.items[i]));
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


/**  ************************************************* End ********************************************************* **/
var v1 = new Vector([3.1415, 1.57, 0.01]);
var v2 = new Vector([10, 12, 13], [3.1415, 1.57, 0.01]);

console.log(v2.sin());
