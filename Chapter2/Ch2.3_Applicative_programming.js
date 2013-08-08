/**
 * Created by azu on 2013/08/08.
 */
"use strict";
var assert = require('chai').assert;
var _ = require("underscore");
/*
    Applicative programming とは

    > 引数に関数を与え、内部でその関数を利用するという関数の組み合わせ方で処理を構築する方法

    [Applicative Programming - tsimoの日記](http://smkw.hatenablog.com/entry/2013/06/25/110629 "Applicative Programming - tsimoの日記")
*/

/*
    Applicative programmingの例
*/

function doubleAll(array) {
    /*
     具体的には,この匿名関数がApplicativeな部分になる
     map内ではこの渡した関数を呼び出してて、その結果を集めた配列を返す
      */
    return _.map(array, function (n) {
        return n * 2;
    });
}
describe("doubleAll", function () {
    it("double all", function () {
        var numbers = [1, 2, 3, 4, 5];
        var expectNumbers = [2, 4, 6, 8, 10];
        var result = doubleAll(numbers);
        assert.deepEqual(result, expectNumbers);
    });
});
