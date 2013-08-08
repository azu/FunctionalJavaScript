/**
 * Created by azu on 2013/08/08.
 */
"use strict";
var assert = require('chai').assert;
var _ = require("underscore");

/*
    最初は `[1, 2, 3, 4, 5]` のような配列を扱う想定だったが、
    途中から `{a: 1, b: 2}` のようなオブジェクトも扱えるようにしたい。


    ``_.map`` に ``_.identity`` をApplicativeする時を考える

    * [_.identity(value)](https://github.com/enja-oss/Underscore/blob/master/docs/Utility.md#identity-_identityvalue-%E5%8E%9F%E6%96%87 "_.identity(value)")
*/

/*
    _.identity は引数そのものを返す関数なので、
 */
var object = _.map({a: 1, b: 2}, _.identity);
// => [1,2] となってしまう は _.mapがvalueを扱ってる事がわかる

var arrayOfArray = _.map({a: 1, b: 2}, function (value, key) {
    return [key, value];
});
//=> [['a', 1], ['b', 2]]