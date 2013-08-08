/**
 * Created by azu on 2013/08/09.
 */
"use strict";
var assert = require('chai').assert;
var _ = require("underscore");
/*
    concatをargumentsでやる関数を作ってみよう
    ``arguments`` をちょっと使い過ぎな気がする
*/
function cat() {
    var head = _.first(arguments);
    if (head != null) {
        return head.concat.apply(head, _.rest(arguments));
    } else {
        return [];
    }
}

describe("cat", function () {
    it("is concat arguments", function () {
        var results = cat([1, 2, 3], [4, 5], [6, 7]);
        var expect = [1, 2, 3, 4, 5, 6, 7];
        assert.deepEqual(results, expect);
    });
});

/*
    cat は配列しか受け取れない感じになってる。
    これを関数も受け取れて処理できるようにしたい

    まず手始めに、element,[array] を受け取るようなconcatを作る
*/

function construct(head, tail) {
    return cat([head], _.toArray(tail));
}

describe("construct", function () {
    it("headとなるelementと配列を受け取り結合する", function () {
        var results = construct(42, [1, 2, 3]);
        var expect = [42, 1, 2, 3];
        assert.deepEqual(results, expect);
    });
});
/*
    ここで、Applicative な関数であるmapCatを追加する。

    要は関数を受け取って使う関数のこと。(Applicative natureはfn)

    うけとる ``fn`` はmapの ``fn`` と同じ

 */
function mapCat(fn, array) {
    return cat.apply(null, _.map(array, fn));
}

describe("mapCat", function () {
    it("is test", function () {
        var results = mapCat(function (elem) {
            // construct によって、 [elem , ","] というのが作られる
            return construct(elem, [","]);
        }, [1, 2, 3]);
        var expect = [1, ",", 2, ",", 3, ","];
        assert.deepEqual(results, expect);
    });
});

/*
    mapCatは elem, "," となって最後に、","が残ってしまうので、
    それを外す関数 ``butLast`` を作ってみる
*/

function butLast(coll) {
    return _.toArray(coll).slice(0, -1);
}

/*
  ``butLast`` を mapCat に適応する関数 を作ってみる。
  
  mapCatの結果に対して butLastを適応するのもいいけど、関数的にそういう関数を作ってみる
*/

function interpose(inter, coll) {
    return butLast(mapCat(function (elem) {
        return construct(elem, [inter]);
    }, coll));
}

/*
    ここで言いたいことは、関数型プログラミングは
    徐々に低レベルな関数から、個別に機能する関数を定義していく事が重要になってるって事。


 */
describe("interpose", function () {
    it("mapCat -> butLast", function () {
        var results = interpose(",", [1, 2, 3]);
        var expect = [1, ",", 2, ",", 3]; // 最後の","がないことが違う
        assert.deepEqual(results, expect);
    });
});

