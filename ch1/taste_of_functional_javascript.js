/**
 * Created by azu on 2013/08/04.
 */
"use strict";
function existy(x) {
    return x != null;
}

function truthy(x) {
    return (x !== false) && existy(x);
}

exports.testExisty = function (test) {
    var expected = [false, false, true, true, true];
    var results = [null, undefined, 1, 2, false].map(existy);
    test.deepEqual(results, expected);
    test.done();
};
exports.testTruthy = function (test) {
    var expected = [false, false, true, true, false];
    var results = [ null, undefined, 1, 2, false].map(truthy);
    test.deepEqual(results, expected);
    test.done();
};