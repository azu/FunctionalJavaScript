/**
 * Created by azu on 2013/09/01.
 */

"use strict";

var assert = require('chai').assert;
var _ = require("underscore");

/*
    前回 ``finder`` のかわりに、 ``best`` という 引数を少なくした形を実装したが、
    これが常に正義ではないかもしれないという事について。
 */

/*
    3つの関数についてやっていき、それぞれの性質とトレードオフについて述べていく章
 */

/*
    最初はシンプルな ``repeat`` 関数
 */

/*
    0 から times - 1 まで、VALUEを繰り返した配列を返す
 */
function repeat(times, VALUE) {
    return _.map(_.range(times), function () {
        return VALUE;
    });
}
describe("repeat", function () {
    it("should return array of repeat VALUE with times", function () {
        var results = repeat(4, "Major");
        assert.deepEqual(results, ["Major", "Major", "Major", "Major"]);
    });
});


/*
## Use Functions, not values

``repeat`` はシンプルな実相だが、幾つか足りない部分がある、

**value** を繰り返すより、 **function**を繰り返したほうが幾分が良いことがある。

少し ``repeat`` を変更して、 ``repeatedly`` を実装してみる

 */

function repeatedly(times, fn) {
    return _.map(_.range(times), fn);
}

/*
基本的には functionを受け入れたほうが汎用性があり、mapなどとの相性もよい
 */

describe("repeatedly", function () {
    it("should repeat function with times", function () {
        var results = repeatedly(3, function () {
            return Math.floor((Math.random() * 10) + 1);
        });
        for (var i = 0; i < results.length; i++) {
            assert.ok(results[i] <= 10);
        }
    });
});

/*
``repeat`` に対して ``repeatedly`` はより open-endedになってる。

これを更に包含的なものを感がてみると、timesの部分も関数にするという形になってくる

そのような性質をもった ``iterateUntil`` を定義してみる
 */

function iterateUntil(fn, check, init) {
    var ret = [];
    var results = fn(init);
    while (check(results)) {
        ret.push(results);
        results = fn(results);
    }
    return ret;
}

/*
``iterateUntil`` は2つの関数を引数にとり、

check : falseになったらその時点で終了する stop の役割

iterateUntilは正方向送りのループを繰り返す関数。
 */
describe("iterateUntil", function () {
    it("repeat 2^ ", function () {
        var results = iterateUntil(function (n) {
            return n + n;
        }, function (n) {
            return n <= 1024;
        }, 1);
        assert.deepEqual(results, [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
    });
});

/*
関数を返す関数というのは、これまでにも何回もでてきていて、また関数を受け取る関数のほうが汎用性があるという話をした。

しかし、定数を繰り返すというようなもの(引数を無視する値を返す)を書くときに、無名関数で囲むのは何かだるい

そういう用途に便利な ``always`` というものを実装してみよう.

``always`` のような関数は **combinator** として知られている
 */
function always(VALUE) {
    return function () {
        return VALUE;
    }
}

describe("always", function () {
    it("repeat always same value", function () {
        var old = repeatedly(3, function () {
            return "FIRE";
        });
        var alwaysResult = repeatedly(3, always("FIRE"));
        assert.deepEqual(old, alwaysResult);
    });
    /*
        ``always`` はクロージャーであるので、ひとつの値をキャプチャーした関数を返す。

        つまり、以下のように関数をキャプチャーした場合も、同じ関数を返す高階関数を返すという事ができる
     */
    it("function capturing", function () {
        var f = always(function () {
            /* 関数をキャプチャして返す */
        });
        assert.strictEqual(f(), f());
    });
    /*
    もちろん、同じ実装をそれぞれキャプチャもの同士をひかくしても、
    キャプチャされたもののアドレスはことなるので、以下はequalではない
     */
    it("other always is not equal", function () {
        var f = always(function () {
        });
        var g = always(function () {
        });
        assert.notStrictEqual(f(), g());
    });
});

/*
他の関数を返す関数の例として ``invoker`` という関数を作ってみよう。

 */
function invoker(NAME, METHOD) {
    return function (target /*args*/) {
        if (target == null) {
            fail("Must provide a target");
        }
        var targetMethod = target[NAME];
        var args = _.rest(arguments);

        if (target != null && METHOD == targetMethod) {
            return targetMethod.apply(target, args);
        }
    };
}
describe("invoker", function () {
    it("map with reverse", function () {
        /*
        関数型スタイルでは実行のtargetも引数として渡せると綺麗になる。

        メリットとして、mapされたオブジェクトがそのメソッドを実行出来ない場合はundefinedになるというJavaScriptっぽい性質もある
         */
        var rev = invoker("reverse", Array.prototype.reverse);
        var mapResults = _.map([
            [1, 2, 3]
        ], rev);
        assert.deepEqual(mapResults, [
            [3, 2, 1]
        ]);
    });
});
