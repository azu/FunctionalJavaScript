/**
 * Created by azu on 2013/08/29.
 */
"use strict";
var assert = require('chai').assert;
var _ = require("underscore");
/*

    ``FACTOR`` は 返される関数内部で保持されてるような感じになる。
 */
function createScaleFunction(FACTOR) {
    return function (v) {
        return _.map(v, function (n) {
            return (n * FACTOR);
        })
    }
}

describe("createScaleFunction", function () {
    it("is test", function () {
        var scale10 = createScaleFunction(10);
        var results = scale10([1, 2, 3]);
        assert.deepEqual(results, [10, 20, 30]);
    });
});

