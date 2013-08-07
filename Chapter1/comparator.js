/**
 * Created by azu on 2013/08/04.
 */
"use strict";
var assert = require('chai').assert;


describe("sort", function () {
    it("引数なしで実行した場合", function () {
        /*@
         普通にsortすると数値順ではなくて辞書順になってしまう。
         ``Comparator`` を使ってちゃんとSortを実装しよう というはなし
         */
        var results = [2, 3, -1, -6, 0, -108, 42, 10].sort();
        assert.deepEqual(results, [-1, -108, -6, 0, 10, 2, 3, 42]);
    });
});

/*@
 compareFunction で返す定数
 [Array.prototype.sort - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort "Array.prototype.sort - JavaScript | MDN")
 */
var ComparisonResult = {
    ascending: -1,// <
    same: 0,
    descending: 1 // >
};
/*@
 関数を返す関数 compareFunction を返す
 高階関数 - Higher-Order Functions になるけど、
 大文字から始まるみたいな見た目でわかる命名方法が欲しい気がする
 */
function comparator(predicate) {
    return function (x, y) {
        if (predicate(x, y)) {
            return ComparisonResult.ascending
        } else if (predicate(y, x)) {
            return ComparisonResult.descending;
        } else {
            return ComparisonResult.same;
        }
    };
}
/*@
 sortの実際の中身になる関数。
 真偽値 -> comparator を通して -> ``NSComparisonResult`` みたいな
 ``<`` ``==`` ``>`` の3種類の状態にして使う。

 こういう関数は Predicates というらしい

 > Functions that always return a Boolean value (i.e., true or false only), are called predicates.

 最初からsortに直接渡すよりも、小分けすることでテストのしやすさもアップする

 */
function isLessOrEqual(x, y) {
    return x <= y;
}


describe("Comparator", function () {
    it("should return `function`", function () {
        var highOrderFunction = comparator(isLessOrEqual);
        assert.typeOf(highOrderFunction, "function");
    });
    it("test sort", function () {
        var values = [2, 3, -1, -6, 0, -108, 42, 10];
        var expectedSortedValues = [-108, -6, -1, 0, 2, 3, 10, 42];
        var results = values.sort(comparator(isLessOrEqual));
        assert.deepEqual(results, expectedSortedValues);
    });
});
describe("isLessOrEqual", function () {
    it("test <", function () {
        assert.ok(isLessOrEqual(0, 1));
    });
    it("test <, when 0", function () {
        assert.ok(isLessOrEqual(-1, 0));
    });
    it("test <", function () {
        assert.ok(isLessOrEqual(1, 2));
    });
});