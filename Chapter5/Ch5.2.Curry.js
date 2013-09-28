"use strict";

var assert = require('chai').assert;
var _ = require("underscore");
var invoker = require("../lib/invoker.js").invoker;
/*

## Currying

既に ``invoker`` というような名前でみたカリー化である。

[カリー化 != 部分適用 - ((プログラミング | 形式) 言語) について書く日記](http://d.hatena.ne.jp/kmizushima/20091216/1260969166 "カリー化 != 部分適用 - ((プログラミング | 形式) 言語) について書く日記")

 */


function rightAwayInvoker() {
    var args = _.toArray(arguments);
    var method = args.shift();
    var target = args.shift();
    return method.apply(target, args);
}

/*
    `invoke` のように高階関数ではなく、この `rightAwayInvoker` はすぐに呼び出される。
 */
describe("rightAwayInvoker", function () {
    it("invoker for right", function () {
        var result = rightAwayInvoker(Array.prototype.reverse, [1, 2, 3]);
        assert.deepEqual(result, [3, 2, 1]);
    });
    /*
    invoker は高階関数なので、設定された関数をその場で作り出すことができる
     */
    it("invokeとの比較", function () {
        var rev = invoker("reverse", Array.prototype.reverse);
        var result = rev([1, 2, 3]);
        assert.deepEqual(result, [3, 2, 1]);
    });
});

/*
### どちらの方向からカリー化するか

JavaScriptは引数を何個でも取れるので、引数の右側からカリー化した方がいい。

もう一つの理由は " partial application handles working from the left"
 */

function leftCurryDiv(n) {
    return function (d) {
        return n / d;
    }
}
function rightCurryDiv(d) {
    return function (n) {
        return n / d
    }
}

/*
###  カリー化を自動化

次の `curry` 関数は以下のような操作をしてる

* 関数を引数に取る
* 引数を一つ関数を想定して返す

 */

function curry(fn) {
    return function (arg) {
        return fn(arg);
    }
}

/*
一見必要にない関数に見えるが、

例えば、parseIntをmapに渡すような使い方をするときにこの関数の意味が出てくる.

 */

describe("parseInt", function () {
    /*
    parseInt は第二引数が基数になってるので、以下のようにmapで渡すと問題が起きる
     */
    it("normal way", function () {
        var results = ["11", "11", "11", "11"].map(parseInt);
        results.forEach(function (e, idx) {
            if (idx == 0) {
                assert.strictEqual(e, 11);
            } else {
                assert.notStrictEqual(e, 11);
            }
        });
    });
    /*
    そのため、 ``curry`` 関数のように、第一引数しかとらないような関数を返せば、
    mapで渡しても、常に第二引数はnullになるので問題無くなる。
     */
    it("curry way", function () {
        var results = ["11", "11", "11", "11"].map(curry(parseInt));
        assert.deepEqual(results, [11, 11, 11, 11]);
    });
});

/*

### Curry化のデメリット

curry, curry2, curry3 のようなものを作るなら、 curryAll のようなものものを作るといいですが、

``curryAll`` は作ることは出来ますが、経験上実践的なものではないとのこと。
 */

/*
## Partial Application

部分適応のこと

`divPart` は `leftCurryDiv` と似ているが、部分適応とかリー化の違いがある。

[カリー化 != 部分適用 - ((プログラミング | 形式) 言語) について書く日記](http://d.hatena.ne.jp/kmizushima/20091216/1260969166 "カリー化 != 部分適用 - ((プログラミング | 形式) 言語) について書く日記")

 */

function divPart(n) {
    return function (d) {
        return n / d;
    }
}
describe("divPart", function () {
    it("div 10", function () {
        var over10Part = divPart(10);
        var result = over10Part(2);
        assert.equal(result, 5);
    });
});

/*
    ![違い](curry_partical_application.png)

*/
var construct = require("../lib/construct.js").construct;
var cat = require("../lib/construct.js").cat;
/*

 */
function partial1(fn, arg1) {
    return function (/*args*/) {
        var args = construct(arg1, arguments);
        return fn.apply(fn, args);
    }
}

function div(n, d) {
    return n / d;
}
describe("partial1", function () {
    it("capture 1", function () {
        var over10Part1 = partial1(div, 10);
        var result = over10Part1(5);
        assert.equal(result, 2);
    });
});

function partial2(fn, arg1, arg2) {
    return function (/* args */) {
        var args = cat([arg1, arg2], arguments);
        return fn.apply(fn, args);
    }
}
describe("partial2", function () {
    it("capture 2", function () {
        var div10by2 = partial2(div, 10, 2);
        assert.equal(div10by2(), 5);
    });
});

/*
curry化と違って、部分適応は任意の数の引数を取るような関数を作ってもあまり問題ありません
 */
function partial(fn /* pargs*/) {
    var pargs = _.rest(arguments);
    return function (/*args*/) {
        var args = cat(pargs, _.toArray(arguments));
        return fn.apply(fn, args);
    }
}

describe("partial ", function () {
    it("args length 1", function () {
        var over10Partial = partial(div, 10);
        assert.equal(over10Partial(2), 5);
    });
    /*
    仮に引数を多く渡しても無視されるだけなので、カリー化と違って問題がでない
     */
    it("many partial application", function () {
        var p = partial(div, 10, 2, 4, 5);
        assert.equal(p(), 5);
    });
});

var validator = require("../lib/validator").validator;
it("validator", function () {
    var zero = validator("cannot be zero", function (n) {
        return 0 === n;
    });
    var isNumber = validator("arg must be a number", _.isNumber);

    function sqr(n) {
        if (!isNumber(n)) {
            throw new Error(isNumber.message);
        }
        if (zero(n)) {
            throw  new Error(zero.message);
        }
        return n * n;
    }

    var result1 = sqr(10);
    assert.equal(result1, 100);

    assert.throw(function () {
        sqr(0);
    }, "cannot be zero");

    assert.throw(function () {
        sqr("");
    }, "arg must be a number");
});

