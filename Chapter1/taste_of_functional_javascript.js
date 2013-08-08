/**
 * Created by azu on 2013/08/04.
 */
"use strict";
var assert = require("assert");

function existy(x) {
    return x != null;
}

function truthy(x) {
    return (x !== false) && existy(x);
}

describe("Existy", function () {
    it("nullじゃないならtrue", function () {
        var expected = [false, false, true, true, true];
        var results = [null, undefined, 1, 2, false].map(existy);
        assert.deepEqual(results, expected);
    });
});
describe("Truthy", function () {
    it("falsyの逆バージョン", function () {
        var expected = [false, false, true, true, false];
        var results = [ null, undefined, 1, 2, false].map(truthy);
        assert.deepEqual(results, expected);
    });
});
