const test = require("tape");
const almostEqual = require("almost-equal");
const Vector = require("./Vector");

// ---- Helper Function ----

/**
 * A wrapper for Tape for testing floating point numbers and keeping the
 * functionality of the tape library for recording and printing messages.
 * 
 * @param {Tape} t The tape function variable
 * @param {float} actual The actual input value
 * @param {float} expected The expected value
 * @param {string} msg The message to be printed to the Tape log
 */
function almost(t, actual, expected, msg) {
    if (almostEqual(actual, expected)) {
        t.ok(true, msg);
    } else {
        t.equal(actual, expected, msg);
    }
}

test("Vector constructor list", function(t) {
    const v = Vector.Vector([1, 2]);

    t.deepEqual(v, [1, 2]);
    t.end();
});

test("Vector constructor object", function(t) {
    const v = Vector.Vector({x:1, y:2});

    t.deepEqual(v, [1, 2]);
    t.end();
});

test("Vector constructor seperate", function(t) {
    const v = Vector.Vector(1, 2);

    t.deepEqual(v, [1, 2]);
    t.end();
});

test("Vector equality", function(t) {
    t.ok(Vector.equals([1, 2], [1, 2]));
    t.end();
});

test("Vector inequality", function(t) {
    t.notok(Vector.equals([2, 1], [1, 2]));
    t.end();
});

test("Vector equality floating point", function(t) {
    t.ok(Vector.equals(
         Vector.Vector([1.0000000001, 2.2222222222]),
                       [1.0000000001, 2.2222222222]
    ));
    t.end();
});

test("Vector inequality floating point", function(t) {
    t.notok(Vector.equals(
            Vector.Vector([1.0000000001, 2.2222222222]),
                          [1.001, 2.224]
    ));
    t.end();
});

test("Vector constructor throw error", function(t) {
    try {
       const v1 = Vector([1, NaN]);
       t.fail("Did not throw error on NaN");
    }
    catch (e) {
        t.pass("Threw error on NaN");
    }

    try {
        const v2 = Vector([Infinity, 1]);
        t.fail("Did not throw error on Infinity");
    }
    catch (e) {
        t.pass("Threw error on Infinity");
    }

    t.end();
});

test("Vector to string", function(t) {
    const v = Vector.Vector(1, 2);

    t.equals(Vector.toString(v), "(1, 2)");
    t.end();
});

// ---- Basic Math Functions ----

test("Vector addition two positive", function(t) {
    const v1 = [1, 5];
    const v2 = [4, 3];

    const eq = [5, 8];

    t.deepEqual(Vector.add(v1, v2), eq);
    t.end();
});

test("Vector addition two negative", function(t) {
    const v1 = [-2, -7];
    const v2 = [-4, -3];

    const eq = [-6, -10];

    t.deepEqual(Vector.add(v1, v2), eq);
    t.end();
});

test("Vector subtraction two positive", function(t) {
    const v1 = [1, 5];
    const v2 = [4, 3];

    const eq = [-3, 2];

    t.deepEqual(Vector.subtract(v1, v2), eq);
    t.end();
});

test("Vector subtraction two negative", function(t) {
    const v1 = [-2, -7];
    const v2 = [-4, -3];

    const eq = [2, -4];

    t.deepEqual(Vector.subtract(v1, v2), eq);
    t.end();
});

test("Vector multiplication", function(t) {
    const v = [2, 5];
    const eq = [6, 15];

    t.deepEqual(Vector.multiply(v, 3), eq);
    t.end();
});

test("Vector Division", function(t) {
    const v = [6, 15];
    const eq = [2, 5];

    t.deepEqual(Vector.divide(v, 3), eq);
    t.end();
});

// ---- Advanced Vector Functions ----

test("Vector magnitude", function(t) {
    const v = [3, 4];
    almost(t, Vector.magnitude(v), 5);
    t.end();
});

test("Vector angle", function(t) {
    const v1 = [ 0,  4];
    const v2 = [-1,  0];
    const v3 = [ 0, -2];
    const v4 = [ 1,  0];
    const v5 = [ 0,  0]; // Zero
    const v6 = [ 2,  2]; // Q1
    const v7 = [-2,  2]; // Q2
    const v8 = [-2, -2]; // Q3
    const v9 = [ 2, -2]; // Q4

    const a1 =     Math.PI / 2;
    const a2 =     Math.PI;
    const a3 = 3 * Math.PI / 2;
    const a4 =     0;
    const a5 =     0;
    const a6 =     Math.PI / 4;
    const a7 = 3 * Math.PI / 4;
    const a8 = 5 * Math.PI / 4;
    const a9 = 7 * Math.PI / 4;

    almost(t, Vector.angle(v1), a1, "Up");
    almost(t, Vector.angle(v2), a2, "Left");
    almost(t, Vector.angle(v3), a3, "Down");
    almost(t, Vector.angle(v4), a4, "Right");
    almost(t, Vector.angle(v5), a5, "Zero");
    almost(t, Vector.angle(v6), a6, "Generic Q1");
    almost(t, Vector.angle(v7), a7, "Generic Q2");
    almost(t, Vector.angle(v8), a8, "Generic Q3");
    almost(t, Vector.angle(v9), a9, "Generic Q4");

    t.end();
});

test("Vector clamp : unchanged", function(t) {
    const v = [3, 3];
    const limit = 5;

    t.deepEquals(Vector.clamp(v, limit), v);
    t.end();
});

test("Vector clamp : unchanged", function(t) {
    const v = [3, 3];
    const limit = Math.sqrt(2);

    const a = [1, 1];

    t.deepEquals(Vector.clamp(v, limit), a);
    t.end();
});

test("Vector normal", function(t) {
    const v = [3, 4];

    t.ok(Vector.equals(Vector.normalize(v), [3/5, 4/5]));
    t.end();
});

test("Vector rotation - Origin", function(t) {
    const v1 = [3, 4];
    const v2 = [1, 1];
    const amm = Math.PI / 2;

    const a1 = [4, -3];
    const a2 = [1, -1];

    t.deepEquals(Vector.rotate(v1, [0, 0], amm), a1);
    t.deepEquals(Vector.rotate(v2, [0, 0], amm), a2);
    t.end();
});

test("Vector rotation - Point", function(t) {
    const v1 = [3, 4];
    const v2 = [1, 1];
    const about = [-1, -1];
    const amm = Math.PI / 2;

    const a1 = [4, -5];
    const a2 = [1, -3];

    t.deepEquals(Vector.rotate(v1, about, amm), a1);
    t.deepEquals(Vector.rotate(v2, about, amm), a2);
    t.end();
});

test("Vector inverse", function(t) {
    const v1 = [-1,  4];
    const v2 = [ 5, -3];

    const a1 = [ 1, -4];
    const a2 = [-5,  3];

    t.deepEquals(Vector.inverse(v1), a1);
    t.deepEquals(Vector.inverse(v2), a2);
    t.end();
})

test("Vector Dot Product", function(t) {
    const v1 = [5, 6];
    const v2 = [3, 4];

    const eq = 5 * 3 + 6 * 4;

    t.equal(Vector.dot(v1, v2), eq);
    t.end();
});

test("Vector Cross Product", function(t) {
    const v1 = [5, 6];
    const v2 = [3, 4];

    const eq = 4 * 5 - 6 * 3;

    t.equal(Vector.cross(v1, v2), eq);
    t.end();
});

//---- Static Vector Functions ----

test("Vector Midpoint", function(t) {
    const v1 = [2, 4];
    const v2 = [4, 8];

    const eq = [3, 6];

    t.deepEqual(Vector.midpoint(v1, v2), eq);
    t.end();
});

test("Vector Projection", function(t) {
    const v1 = [1, 2];
    const v2 = [3, 4];

    const eq = Vector.multiply([3, 4], 11 / 25);
    t.deepEqual(Vector.proj(v1, v2), eq);
    t.end();
});

test("Vector Angle Between Vectors", function(t) {
    const v1 = [5, 5];
    const v2 = [0, 7];

    const eq = Math.PI / 4;

    almost(t, Vector.angleBetween(v1, v2), eq);
    t.end();
});

test("Vector Averaging", function(t) {
    const v1 = [8, 7];
    const v2 = [7, 4];
    const v3 = [3, 1];
    const points = [v1, v2, v3];
    const eq = [6, 4];

    t.deepEqual(Vector.avg(points), eq);
    t.end();
});

test("Vector distance", function(t) {
    const v1 = [2, 4];
    const v2 = [4, 6];

    t.equals(Vector.distance(v1, v2), 2 * Math.SQRT2);
    t.end();
});