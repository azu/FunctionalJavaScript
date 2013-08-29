/**
 * Created by azu on 2013/08/29.
 */
var assert = require('chai').assert;
var _ = require("underscore");


/*
    ``shadowed`` という変数が宣言されてるけど、
    後から同じモノが宣言されれば、そちらが優先される
 */
var shadowed = 0;
function argShadow(shadowed) {
    return ["Value is" , shadowed].join(" ");
}
describe("Shadowing", function () {
    "use strict";
    it("後からの宣言で上書きされる", function () {
        assert.equal(argShadow(100), "Value is 100");
        assert.equal(argShadow(), "Value is ");
    });
});

