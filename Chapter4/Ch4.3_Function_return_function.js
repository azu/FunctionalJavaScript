/**
 * Created by azu on 2013/09/01.
 */
"use strict";

var assert = require('chai').assert;
var _ = require("underscore");

/*
## Capturing Variables for Great Good

uniqueな文字列を変えず関数を実装しようとすると単純にやるなら、以下のようになる
 */

function uniqueString(len) {
    return Math.random().toString(36).substr(2, len);
}
describe("uniqueString", function () {
    it("引数で渡した長さの文字列を返す", function () {
        var string = uniqueString(10);
        assert.lengthOf(string, 10);
    });
});

/*
ここで、返す文字列に特定のprefixを付けたいと思ったら、単純にやるなら以下のようにすると思う。
 */
function uniqueString_prefix(prefix) {
    return [prefix, uniqueString(10)].join("");
}
/*
次に考えるのは、prefixを渡してsuffixに呼ばれる度に増えていく値を加えたものを返すような関数を考える。

この場合、単純な関数よりはクロージャーを使った物が浮かぶ。
 */
function makeUniqueStringFunction(start) {
    var COUNTER = start;
    return function (prefix) {
        return [prefix, COUNTER++].join("");
    }
}

describe("uniqueStringIncrement", function () {
    it("increasing suffix", function () {
        var count = 0;
        var uniqueStringIncrement = makeUniqueStringFunction(count);
        assert.equal(uniqueStringIncrement("prefix").split("").pop(), count);
        assert.equal(uniqueStringIncrement("prefix").split("").pop(), count + 1);
    });
});

/*
``makeUniqueStringFunction`` は関数だったので、うまくいくけど、
このuniqueStringがオブジェクトのメソッドだった場合はオブジェクトのプロパティに ``COUNTER`` をつくると思うので良くない場合がある

    var generator = {
        count : 0,
        uniqueString : function(){}
    }

という感じ。
 */


/*
参照透過性の話 - 入力が同じなら返り値も同じ

``makeUniqueStringFunction`` のような関数は参照透過性がないので、避けるべきかもしれない
 */

/*
これを関数と同じようにクロージャーにすれば、オブジェクトであってもCOUNTERを外から見えないように出来るはずだ
 */

var omgenrator = (function (init) {
    var COUNTER = init;
    return {
        uniqueString: function (prefix) {
            return [prefix, COUNTER++].join();
        }
    }
});

