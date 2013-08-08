/**
 * Created by azu on 2013/08/08.
 */
"use strict";
var assert = require('chai').assert;
var _ = require("underscore");

/*
    reduceRightを使ってみる

    reduceの兄弟的な関数、この例は別にreduce使っても問題ないし
*/

/*
    引数に渡した関数を呼び出した結果が全部trueなら、trueを返す
 */
function allOf() {
    return _.reduceRight(arguments, function (truth, fn) {
        return truth && fn();
    }, true);// デフォルトはtrue
}
/*
    引数に渡した関数を呼び出した結果で一つでもtrueなら、trueを返す
 */
function anyOf() {
    return _.reduceRight(arguments, function (truth, fn) {
        return truth || fn();
    }, false);// デフォルトはfalse
}

function T() {
    return true;
}
function F() {
    return false;
}

describe("allOf", function () {
    context("when arguments is empty", function () {
        it("should return true", function () {
            assert.isTrue(allOf());
        });
    });
    context("when all arguments is T", function () {
        it("should return true", function () {
            assert.isTrue(allOf(T, T, T));
        });
    });
    context("when arguments contain F", function () {
        it("should return false", function () {
            assert.isFalse(allOf(T, T, F));
        });
    });
});

describe("anyOf", function () {
    context("when arguments is empty", function () {
        it("should return false", function () {
            assert.isFalse(anyOf());
        });
    });
    context("when all arguments is T", function () {
        it("should return true", function () {
            assert.isTrue(anyOf(T, T, T));
        });
    });
    context("when all arguments is F", function () {
        it("should return false", function () {
            assert.isFalse(anyOf(F, F, F));
        });
    });
    context("when arguments contain T", function () {
        it("should return true", function () {
            assert.isTrue(anyOf(T, F, F));
        });
    });
});


/*
    **reject** は predicateがtrueじゃないものを弾いたものを返す
*/
describe("reject", function () {
    it("example", function () {
        var result = _.reject(["a", "b", 3, "d"], _.isNumber);
        assert.deepEqual(result, ["a", "b", "d"]);
    });
});
/*
    これを、あえて **filter** を使って実装してみるのはどうだろ?
    必要なのはpredicateの返り値を逆転させるHigher-Order Functions。
    ``complement`` という関数を作ってみよう
*/
function complement(predicate) {
    return function () {
        return !predicate.apply(null, _.toArray(arguments));
    }
}

describe("filter", function () {
    it("is same reject", function () {
        // isNumberではないものだけをと出すという事ができる
        var result = _.filter(["a", "b", 3, "d"], complement(_.isNumber));
        assert.deepEqual(result, ["a", "b", "d"]);
    });
});

