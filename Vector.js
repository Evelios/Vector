module.exports = (function() {
    /**
     * @class Vector
     *
     * This is a basic Vector class. This vector class is based off a list data
     * type. So all vectors are stored as a list of [x, y]. These vectors can
     * me rotated, translated, stretched, pulled, and generally geometrically
     * played with.
     * 
     * @property {number} Precision The precision of the floating point numbers
     * 
     * @summary Create a 2D Vector object
     */

    //---- Default Constructor ----

    const _p = 8;
    const Precision = Math.pow(10, _p);

    /**
     * Create a vector object from a List or Object type vector notation.
     * 
     * @example
     * // Seperate
     * var vec = Vector(x, y);
     * 
     * // Array
     * var vec = Vector([x, y]);
     * 
     * // Object
     * var vec = Vector({x, y});
     * 
     * @static
     * @param {object|Array} vec The input vector 
     * 
     * @returns {Array} The vector array in the form [x, y]
     * @throws {TypeError} If the array is NaN or infinity
     * @memberof Vector
     */
    const Vector = function(x, y) {
        if (Array.isArray(x)) {
            if (x.length == 2) {
                return [_clean(x[0]), _clean(x[1])];
           }
           else {
               throw new ValueError('Vector is of length ' + x.length + ' instead of length 2');
           }
        }
        else if (x.hasOwnProperty('x') && x.hasOwnProperty('y')) {
            return [_clean(x.x), _clean(x.y)];
        }
        else {
            return [_clean(x), _clean(y)];
        }
    };

    //---- Alternate Polar Constructor ----

    /**
     * Create a vector from polar coordinates
     *
     * @static
     * @param {number} radius The radius of the vector
     * @param {number} theta The angle of the vector in radians.
     *  Should be between 0 and 2*PI
     * 
     * @returns The rectangular vector produced from the polar coordinates
     *
     * @memberof Vector
     */
    const Polar = function(radius, theta) {
        return Vector(radius * Math.cos(theta), radius * Math.sin(theta));
    };

    //---- Helper Functions ----
    
    /**
     * Cleans up the number to make sure that the value is not NaN and is finite.
     * It also checks for floating point precision and rounds based on the
     * vector floating point precision.
     * 
     * @static
     * @private
     * 
     * @param {number} num The number to be cleaned
     * @returns {number} The cleaned output number
     *  
     * @throws {RangeError} Throws range error if the value is NaN or -Inf or +Inf 
     * @memberof Vector
     */
    const _clean = function(num) {
        if (isNaN(num)) {
            throw new RangeError('Value is NaN');
        }

        if (!isFinite(num)) {
            throw new RangeError('Value is Infinite');
        }

        if (Math.round(num) == num) {
            return num;
        }

        return Math.round(num * Precision) / Precision;
    };

    /**
     * Determine if two numbers are almost equal to eachother. This is based on
     * the Precision value
     * 
     * @static
     * @private
     * @param {number} a The first value 
     * @param {number} b The second value
     * @returns {boolean} True if the values are almost equal to eachother
     * 
     * @memberof Vector
     */
    const _almostEqual = function(a, b) {
        return _clean(a) - _clean(b) < Precision;
    };

    /**
     * Determine if two vectors are equal to eachother
     * 
     * @static
     * @param {Vector} a The first vector 
     * @param {Vector} b The second vector
     * @returns {boolean} True if the two vectors are equal to eachother
     * 
     * @memberof Vector
     */
    const equals = function(a, b) {
        return _almostEqual(a[0], a[1]) &&
               _almostEqual(b[0], b[1]);
    };

    /**
     * Returns the vector as a string of (x, y)
     *
     * @param {number[]} vec The input vector
     * 
     * @returns {string} The string representation of a vector in (x, y) form
     * @memberof Vector
     */
    const toString = function(vec) {
        return `(${vec[0]}, ${vec[1]})`;
    };

    /**
     * Get a copy of the input vector
     *
     * @static
     * @param {Vector} vec the vector to be coppied
     * @returns {Vector} The vector copy
     * @memberof Vector
     */
    const copy = function(vec) {
        return Vector(vec);
    };

    //---- Vector Properties ----

    /**
     * Get the magnitude of the vector
     *
     * @param {Vector} vec The vector to determine the magnitude from
     * @returns {number} The magniture of the vector
     * @memberof Vector
     */
    const magnitude = function(vec) {
        return Math.sqrt(magSquared(vec));
    };

    /**
     * Get the magnitude of the vector squared. Use this value if you only need
     * a number to compare the vectors to and don't need the actual value. This
     * will save from using the expensive computation of the square route
     * function.
     * 
     * @static
     * @param {Vector} vec The vector to determine the squared magnitude from
     * @returns {number} The magnitude of the vector squared 
     * 
     * @memberof Vector
     */
    const magSquared = function(vec) {
        return Math.pow(vec[0], 2) + Math.pow(vec[1], 2);
    };

    /**
     * Get the angle of the input vector
     * 
     * @static
     * @param {Vector} vec The input vector
     * @returns {number} The angle of the vector in radians
     * 
     * @memberof Vector
     */
    const angle = function(vec) {
        const x = vec[0];
        const y = vec[1];
        if (x === 0) {
            return y == 0 ?     0          :
                   y >  0 ?     Math.PI / 2:
                            3 * Math.PI / 2;
        } else if (y === 0) {
            return x >= 0 ? 0 : Math.PI;
        }

        let angle = Math.atan(y/x);
        angle = (x < 0 && y < 0) ? angle + Math.PI   : // Quadrant III
                (x < 0)          ? angle + Math.PI   : // Quadrant II
                (y < 0)          ? angle + 2*Math.PI : // Quadrant IV
                                   angle             ; // Quadrant I
        
        return angle;
    };

    //---- Basic Math Functions ----

    /**
     * Add two vectors element wise
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns {Vector} The vector result of adding the two vectors
     * @memberof Vector
     */
    const add = function(a, b) {
        return Vector(a[0] + b[0], a[1] + b[1]);
    };

    /**
     * Subtract two vectors element wise
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second Vector
     * @returns {Vector} The vector result of subtracting the two vectors
     * @memberof Vector
     */
    const subtract = function(a, b) {
        return Vector(a[0] - b[0], a[1] - b[1]);
    };

    /**
     * Multiply the vector by a scalar value
     *
     * @param {number[]} vec The input vector
     * @param {number} scalar The number to multiply the vector by
     * @returns {Vector} The result of multiplying the vector by a scalar
     *  element wise
     * @memberof Vector
     */
    const multiply = function(vec, scalar) {
        return Vector(vec[0] * scalar, vec[1] * scalar);
    };

    /**
     * Divide the vector by a scalar value
     *
     * @param {Vector} vec The input vector
     * @param {number} scalar THe number to multiply the vector by
     * @returns {Vector} The result of multiplying the vector by a scalar
     * @memberof Vector
     */
    const divide = function(vec, scalar) {
        return Vector(vec[0] / scalar, vec[1] / scalar);
    };

    //---- Advanced Vector Functions ----
    
    /**
     * Get the normal vector of the current vector.
     *
     * @param {Vector} vec The vector to normalize
     * @returns {Vector} A vector that is the normal compenent of the vector
     * @memberof Vector
     */
    const normalize = function(vec) {
        return divide(vec, magnitude(vec));
    };

    /**
     * Get the get the current vector rotated by a certain ammount clockwise
     * around a particular point
     *
     * @static
     * @param {Vector} vec The vector to rotate
     * @param {Vector} around The vector to rotate around
     * @param {number} angle The ammount to rotate a positive angle rotates
     *  the vector clockwise
     * 
     * @returns {Vector} The vector that results from rotating the current
     *  vector by a particular ammount
     * @memberof Vector
     */
    const rotate = function(vec, around, angle) {
        const x = vec[0];
        const y = vec[1];
        const x_origin = around[0];
        const y_origin = around[1];

        const x_rotated = ((x - x_origin) * Math.cos(angle)) - 
                          ((y_origin - y) * Math.sin(angle)) + x_origin;
        const y_rotated = ((y_origin - y) * Math.cos(angle)) -
                          ((x - x_origin) * Math.sin(angle)) + y_origin;
        return Vector(x_rotated, y_rotated);
    };

    /**
     * Get the dot product of two vectors
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns {number} The dot product of the two vectors
     * @memberof Vector
     */
    const dot = function(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    };

    /**
     * Get the average location between several vectors
     *
     * @param {Vector[]} vectors The list of vectors to average
     * @memberof Vector
     */
    const avg = function(vectors) {
        let average = zero();

        for (const vector of vectors) {
            average = add(average, vector);
        }
        return divide(average, vectors.length);
    };

    /**
     * Get the cross product of two vectors
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns {number} The cross product of the two vectors
     * @memberof Vector
     */
    const cross = function(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    };

    /**
     * Get the midpoint between two vectors
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns The midpoint of two vectors
     * @memberof Vector
     */
    const midpoint = function(a, b) {
        return divide(add(a, b), 2);
    };

    /**
     * Get the projection of vector a onto vector b
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns The projection vector of a onto b
     * @memberof Vector
     *
     * @todo Add assertion for non-zero length b vector
     */
    const proj = function(a, b) {
        return multiply(b, dot(a, b) / Math.pow(magnitude(b), 2));
    };

    /**
     * Get the angle between two vectors
     *
     * @static
     * @param {Vector} a The frist vector
     * @param {Vector} b The second vector
     * @returns The angle between vector a and vector b
     * @memberof Vector
     */
    const angleBetween = function(a, b) {
        return Math.acos(dot(a, b) / (magnitude(a) * magnitude(b)));
    };

    /**
     * Get the euclidean distance between two vectors
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns The euclidean distance between a and b
     * @see {@link distSquared}
     * @memberof Vector
     */
    const distance = function(a, b) {
        return Math.sqrt(distSquared(a, b));
    };

    /**
     * Get the euclidean distnace squared between two vectors.
     * This is used as a helper for the distnace function but can be used
     * to save on speed by not doing the square root operation.
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns The euclidean distance squared between vector a and vector b
     * @see {@link distnace}
     * @memberof Vector
     */
    const distSquared = function(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    };

    /**
     * Get the shortest distance between the point p and the line
     * segment v to w.
     *
     * @static
     * @param {Vector} p The vector point
     * @param {Vector} v The first line segment endpoint
     * @param {Vector} w The second line segment endpoint
     * @returns The shortest euclidean distance between point
     * @see {@link distToSeg2}
     * @see {@link http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment}
     * @memberof Vector
     */
    const distToSeg = function(p, v, w) {
        return Math.sqrt(distToSegSquared(p, v, w));
    };

    /**
     * Get the shortest distance squared between the point p and the line
     * segment v to w.
     *
     * @static
     * @param {Vector} p The vector point
     * @param {Vector} v The first line segment endpoint
     * @param {Vector} w The second line segment endpoint
     * @returns The shortest euclidean distance squared between point
     * @see {@link distToSeg}
     * @see {@link http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment}
     * @memberof Vector
     */
    const distToSegSquared = function(p, v, w) {
        const l = distSquared(v, w);
        if (l === 0) {
            return distSquared(p, v);
        }
        let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l;
        t = Math.max(0, Math.min(1, t));
        return distSquared(
            p, Vector(v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]))
        );
    };

    /**
     * Get the two normal vectors that are perpendicular to the current vector
     *
     * @param {Vector} vec The vector to find the perpendiculars from
     * @returns {Vector[]} The two normal vectors that are perpendicular
     *  to the vector. The first vector is the normal vector that is +90 deg or
     *  +PI/2 rad. The second vector is the noraml vector that is -90 deg or
     *  -PI/2 rad.
     * @memberof Vector
     */
    const perpendiculars = function(vec) {
        const plus90 = Vector(-vec[1], vec[0]).normalize();
        const minus90 = Vector(vec[1], -vec[0]).normalize();
        return [plus90, minus90];
    };

    //---- Standard Static Vector Objects ----

    /**
     * Get a vector of no magnitude and no direction
     *
     * @static
     * @function
     * @returns {Vector} Vector of magnitude zero
     * @memberof Vector
     */
    const zero = function() {
        "use strict";
        return [0, 0];
    };

    /**
     * Get the unit vector pointing in the positive y direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing up
     * @memberof Vector
     */
    const up = function() {
        "use strict";
        return [0, 1];
    };

    /**
     * Get the unit vector pointing in the negative y direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing down
     * @memberof Vector
     */
    const down = function() {
        "use strict";
        return [0, -1];
    };

    /**
     * Get the unit vector pointing in the negative x direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing right
     * @memberof Vector
     */
    const left = function() {
        "use strict";
        return [-1, 0];
    };

    /**
     * Get the unit vector pointing in the positive x direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing right
     * @memberof Vector
     */
    const right = function() {
        "use strict";
        return [1, 0];
    };

    return {
        Vector: Vector,
        Polar: Polar,
        equals: equals,
        toString: toString,
        copy: copy,
        magnitude: magnitude,
        magSquared: magSquared,
        angle: angle,
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide,
        normalize: normalize,
        rotate: rotate,
        dot: dot,
        avg: avg,
        cross: cross,
        midpoint: midpoint,
        proj: proj,
        angleBetween: angleBetween,
        distance: distance,
        distSquared: distSquared,
        distToSeg: distToSeg,
        distToSegSquared: distToSegSquared,
        zero: zero,
        up: up,
        down: down,
        left: left,
        right: right,
    };

}());