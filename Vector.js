class Vector {
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
    static Vector(x, y) {
        if (Array.isArray(x)) {
            if (x.length == 2) {
                return [Vector._clean(x[0]), Vector._clean(x[1])];
           }
           else {
               throw new ValueError('Vector is of length ' + x.length + ' instead of length 2');
           }
        }
        else if (x.hasOwnProperty('x') && x.hasOwnProperty('y')) {
            return [Vector._clean(x.x), Vector._clean(x.y)];
        }
        else {
            return [Vector._clean(x), Vector._clean(y)];
        }
    }

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
    static Polar(radius, theta) {
        return Vector.Vector(radius * Math.cos(theta), radius * Math.sin(theta));
    }

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
    static _clean(num) {
        if (isNaN(num)) {
            throw new RangeError('Value is NaN');
        }

        if (!isFinite(num)) {
            throw new RangeError('Value is Infinite');
        }

        if (Math.round(num) == num) {
            return num;
        }

        return Math.round(num * Vector.Precision) / Vector.Precision;
    }

    /**
     * Determine if two numbers are almost equal to eachother. This is based on
     * the Vector.Precision value
     * 
     * @static
     * @private
     * @param {number} a The first value 
     * @param {number} b The second value
     * @returns {boolean} True if the values are almost equal to eachother
     * 
     * @memberof Vector
     */
    static _almostEqual(a, b) {
        return Vector._clean(a) - Vector._clean(b) < Vector.Precision;
    }

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
    static equals(a, b) {
        return Vector._almostEqual(a[0], b[0]) &&
               Vector._almostEqual(a[0], b[1]);
    }

    /**
     * Returns the vector as a string of (x, y)
     *
     * @param {number[]} vec The input vector
     * 
     * @returns {string} The string representation of a vector in (x, y) form
     * @memberof Vector
     */
    static toString(vec) {
        return `(${vec[0]}, ${vec[1]})`;
    }

    /**
     * Get a copy of the input vector
     *
     * @static
     * @param {Vector} vec the vector to be coppied
     * @returns {Vector} The vector copy
     * @memberof Vector
     */
    static copy(vec) {
        return Vector.Vector(vec);
    }

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
    static add(a, b) {
        return Vector.Vector(a[0] + b[0], a[1] + b[1]);
    }

    /**
     * Subtract two vectors element wise
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second Vector
     * @returns {Vector} The vector result of subtracting the two vectors
     * @memberof Vector
     */
    static subtract(a, b) {
        return Vector.Vector(a[0] - b[0], a[1] - b[1]);
    }

    /**
     * Multiply the vector by a scalar value
     *
     * @param {number[]} vec The input vector
     * @param {number} scalar The number to multiply the vector by
     * @returns {Vector} The result of multiplying the vector by a scalar
     *  element wise
     * @memberof Vector
     */
    static multiply(vec, scalar) {
        return Vector.Vector(vec[0] * scalar, vec[1] * scalar);
    }

    /**
     * Divide the vector by a scalar value
     *
     * @param {Vector} vec The input vector
     * @param {number} scalar THe number to multiply the vector by
     * @returns {Vector} The result of multiplying the vector by a scalar
     * @memberof Vector
     */
    static divide(vec, scalar) {
        return Vector.Vector(vec[0] / scalar, vec[1] / scalar);
    }

    //---- Advanced Vector Functions ----

    /**
     * Get the magnitude of the vector
     *
     * @param {Vector} vec The vector to determine the magnitude from
     * @returns {number} The magniture of the vector
     * @memberof Vector
     */
    static magnitude(vec) {
        return Math.sqrt(Vector.magSquared(vec));
    }

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
    static magSquared(vec) {
        return Math.pow(vec[0], 2) + Math.pow(vec[1], 2);
    }

    // Get the unit vector
    /**
     * Get the normal vector of the current vector.
     *
     * @param {Vector} vec The vector to normalize
     * @returns {Vector} A vector that is the normal compenent of the vector
     * @memberof Vector
     */
    static normalize(vec) {
        return Vector.divide(vec, Vector.magnitude(vec));
    }

    /**
     * Get the get the current vector rotated by a certain ammount around
     * a particular point
     *
     * @param {Vector} vec The vector to rotate
     * @param {Vector} around The vector to rotate around
     * @param {number} radians The ammount to rotate
     * 
     * @returns {Vector} The vector that results from rotating the current
     *  vector by a particular ammount
     * @memberof Vector
     */
    rotate(vec, around, radians) {
        return 0;
    }

    /**
     * Get the dot product of two vectors
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns {number} The dot product of the two vectors
     * @memberof Vector
     */
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }

    /**
     * Get the average location between several vectors
     *
     * @param {Vector[]} vectors The list of vectors to average
     * @memberof Vector
     */
    static avg(vectors) {
        let average = Vector.zero();

        for (const vector of vectors) {
            average = Vector.add(average, vector);
        }
        return Vector.divide(average, vectors.length);
    }

    /**
     * Get the cross product of two vectors
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns {number} The cross product of the two vectors
     * @memberof Vector
     */
    static cross(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }

    /**
     * Get the midpoint between two vectors
     *
     * @static
     * @param {Vector} a The first vector
     * @param {Vector} b The second vector
     * @returns The midpoint of two vectors
     * @memberof Vector
     */
    static midpoint(a, b) {
        return Vector.divide(Vector.add(a, b), 2);
    }

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
    static proj(a, b) {
        return Vector.multiply(b, Vector.dot(a, b) / Math.pow(Vector.magnitude(b), 2));
    }

    /**
     * Get the angle between two vectors
     *
     * @static
     * @param {Vector} a The frist vector
     * @param {Vector} b The second vector
     * @returns The angle between vector a and vector b
     * @memberof Vector
     */
    static angle(a, b) {
        return Math.acos(Vector.dot(a, b) / (Vector.magnitude(a) * Vector.magnitude(b)));
    }

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
    static distance(a, b) {
        return Math.sqrt(Vector.distSquared(a, b));
    }

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
    static distSquared(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }

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
    static distToSeg(p, v, w) {
        return Math.sqrt(Vector.distToSegSquared(p, v, w));
    }

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
    static distToSegSquared(p, v, w) {
        const l = Vector.distSquared(v, w);
        if (l === 0) {
            return Vector.distSquared(p, v);
        }
        let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l;
        t = Math.max(0, Math.min(1, t));
        return Vector.distSquared(
            p,
            Vector.Vector(v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]))
        );
    }

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
    perpendiculars(vec) {
        const plus90 = Vector.Vector(-vec[1], vec[0]).normalize();
        const minus90 = Vector.Vector(vec[1], -vec[0]).normalize();
        return [plus90, minus90];
    }

    //---- Standard Static Vector Objects ----

    /**
     * Get a vector of no magnitude and no direction
     *
     * @static
     * @function
     * @returns {Vector} Vector of magnitude zero
     * @memberof Vector
     */
    static zero() {
        "use strict";
        return [0, 0];
    }

    /**
     * Get the unit vector pointing in the positive y direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing up
     * @memberof Vector
     */
    static up() {
        "use strict";
        return [0, 1];
    }

    /**
     * Get the unit vector pointing in the negative y direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing down
     * @memberof Vector
     */
    static down() {
        "use strict";
        return [0, -1];
    }

    /**
     * Get the unit vector pointing in the negative x direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing right
     * @memberof Vector
     */
    static left() {
        "use strict";
        return [-1, 0];
    }

    /**
     * Get the unit vector pointing in the positive x direction
     *
     * @static
     * @function
     * @returns {Vector} Unit vector pointing right
     * @memberof Vector
     */
    static right() {
        "use strict";
        return [1, 0];
    }
}

Vector._p = 8;
Vector.Precision = Math.pow(10, Vector._p);

module.exports = Vector;
//export default Vector;