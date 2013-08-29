/**
 * Created by azu on 2013/08/29.
 */
"use strict";

var assert = require('chai').assert;
var _ = require("underscore");

var plucker = require("../lib/plucker.js").plucker;
/*
    関数を取る関数 - 高階関数
    が関数型スタイルプログラミングでとても大事な概念.

    すでに mapやreduceなどで見たきたけど、もっともっと色々な事をやっていく
 */

/*
    まずは典型的な例として ``max`` を見ていく
 */

it("max example", function () {
    assert.equal(_.max([1, 2, 3, 4, 5]), 5);
});

/*
    ``_.max`` は 配列内から最大値をとれるが、
    これもhigher-orderな関数で、第二引数に関数を取れる。
 */
it("second argument", function () {
    var people = [
        {name: "Fred", age: 65},
        {name: "Lucy", age: 36}
    ];
    /*
        maxは常にgreater than > で比較していく感じ
     */
    var oldPerson = _.max(people, function (p) {
        return p.age;
    });
    assert.deepEqual(oldPerson, {name: "Fred", age: 65});
});

/*
    ``finder`` という関数を考えてみる

    1. 比較できる値を作る関数
    2. 比較してbestな値を返す
 */

function finder(valueFun, bestFun, all) {
    return _.reduce(all, function (best, current) {
        var bestValue = valueFun(best);
        var currentValue = valueFun(current);
        return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
    })
}

/*
    この ``finder`` で ``_.max`` と同様のことをやってみよう
 */
describe("finder", function () {
    it("is best max", function () {
        var all = [1, 2, 3, 4, 5];
        /*
            ``_.identity`` は受け取った値をそのまま返す関数

            一見意味がない関数に見えるけど、関数型プログラミングの領域では、関数で考えるので必要になる。
            underscoreの中ではデフォルトのイテレータとして使われてる。
         */
        var maxValue = finder(_.identity, Math.max, all);
        assert.equal(maxValue, _.max(all));
    });
    /*
        ``_.max`` の第二引数と同じような感じでやる場合
     */
    var people = [
        {name: "Fred", age: 65},
        {name: "Lucy", age: 36}
    ];
    it("valueFun is plucker", function () {
        var results = finder(plucker("age"), Math.max, people);
        assert.deepEqual(results, {name: "Fred", age: 65});
    });
    it("pluck name", function () {

        function isStartWith(CHAR) {
            return function (x, y) {
                return x.charAt(0) === CHAR ? x : y;
            }
        }

        /*
            This Function of course prefers names that start with the letter L.

            という関数になる
         */
        var results = finder(plucker("name"), isStartWith("L"), people);
        assert.deepEqual(results, {name: "Lucy", age: 36});
    });
});

/*
    ``finder`` という関数を作ったけど、

    ``return x.charAt(0) === CHAR ? x : y;`` と

    ``return (bestValue === bestFun(bestValue, currentValue)) ? best : current;``

    でロジックが重複しているように見える。

    これは ``finder`` じたいに

    * ``bestFun`` は x > y であること
    * どうやって値を取り出すかを決める ``valueFun``

     というのが入ってるからである。

     もっときれいな感じに ``best`` を実装してみよう

 */

function best(fn, coll) {
    return _.reduce(coll, function (x, y) {
        return fn(x, y) ? x : y;
    });
}

describe("best", function () {
    it("is best", function () {
        var all = [1, 2, 3, 4, 5];
        var maxValue = best(function (x, y) {
            return x > y;
        }, all);
        assert.equal(maxValue, _.max(all));
    });

});

