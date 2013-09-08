/**
 * Created by azu on 2013/09/08.
 */
"use strict";

var assert = require('chai').assert;
var _ = require("underscore");
var always = require("../lib/always.js").always;

/*
    オブジェクトをバリデーションする話

    ``checker``　という関数を考えて見る。
    最初にpredicatesな関数を渡して、それでチェックを行う関数を返す高階関数
 */
function checker(/*validators*/) {
    var validators = _.toArray(arguments);
    return function (obj) {
        return _.reduce(validators, function (error, check) {
            if (check(obj)) {
                return error;
            } else {
                /*
                以下みたいな事をしてる

                    error.push(check.message);
                    return error;
                 */
                return _.chain(error).push(check.message).value();
            }
        }, []);
    }
}

describe("checker", function () {
    it("validate function, when pass", function () {
        var alwaysPasses = checker(always(true), always(true));
        var errorMessages = alwaysPasses({});
        assert.lengthOf(errorMessages, 0);
    });
    it("validate function, when fail", function () {
        var fails = always(false);
        fails.message = "a failure in life";
        var alwaysPasses = checker(fails);
        var errorMessages = alwaysPasses({});
        assert.lengthOf(errorMessages, 1);
        assert.equal(errorMessages[0], fails.message);
    });

    it("validator fn", function () {
        var gonnaFail = checker(validator("ZOMG!", always(false)));
        var results = gonnaFail(100);
        assert.lengthOf(results, 1);
        assert.equal(results[0], "ZOMG!");
    });
});

/*
validatorとなる関数に対して自分でmessageというプロパティを追加していたが、
このようなvalidatorを作るような高階関数を作る方が綺麗になる
 */

function validator(message, fn) {
    var hiFn = function (/* args */) {
        return fn.apply(fn, arguments);
    };
    hiFn["message"] = message;
    return hiFn;
}

/*
新たなチェック機能を加えるのは簡単で、チェックする関数を定義すればいい。

ここではキーをもってるかどうかを判定するCheckerを追加する
 */

function hasKeys() {
    var KEYS = _.toArray(arguments);
    var fn = function (obj) {
        return _.every(KEYS, function (key) {
            return _.has(obj, key);
        });
    };
    fn.message = ["must have values for keys:"].concat(KEYS).join(" ");
    return fn;
}
describe("hasKeys", function () {
    function mappable(obj) {
        return _.isObject(obj);
    }

    context("when fail validate", function () {
        it("fail message", function () {
            var checkCommand = checker(validator("must be a map", mappable), hasKeys("msg", "type"));
            var failMessages = checkCommand(32);
            assert.deepEqual(failMessages, ["must be a map", "must have values for keys: msg type"]);
        });
    });
    context("when pass validate", function () {
        it("should return empty []", function () {
            var checkCommand = checker(validator("must be a map", mappable), hasKeys("msg", "type"));
            var failMessages = checkCommand({msg : "blah", type:"display"});
            assert.deepEqual(failMessages, []);
        });
    });
});

/*
# まとめ

高階関数は、以下のような特徴を持つ

* 関数を引数として取る
* 結果として関数を返す

この章では、maxなど関数を渡して使う関数についてやalwaysのように常に同じ値を返すもの、
fnullのようにnullガードするものや、Checkerなどのバリデーションについて書かれていた。
 */