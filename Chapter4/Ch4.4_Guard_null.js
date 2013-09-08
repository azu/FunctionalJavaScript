/**
 * Created by azu on 2013/09/08.
 */
"use strict";

var assert = require('chai').assert;
var _ = require("underscore");
var existy = require("../lib/existy.js").existy;
/*
次のように falsy な値が含まれてる意図しない結果になってしまう
 */
(function () {
    var nums = [1, 2, 3, null, 5];
    _.reduce(nums, function (total, n) {
        return total * n;
    });// => 0

    // something({a: null });
})();
/*
こういうのチェックするために ``fnull`` という関数を考える。

``fnull`` はnullチェックをして、ちゃんと値があるならそのまま、ないならデフォルト値を使う。

関数を返す関数の特性を利用して、デフォルト値は関数を作るときに指定する
 */
function fnull(fn /*defaults */) {
    var defaults = _.rest(arguments);
    return function (/*args */) {
        // nullチェックをしてから引数を再構築
        var args = _.map(arguments, function (e, i) {
            return existy(e) ? e : defaults[i]
        });
        return fn.apply(null, args);
    }
}
describe("fnull", function () {
    it("safemult", function () {
        var safeMult = fnull(function (total, n) {
            return total * n;
        }, 1, 1);// total : 1, n : 1 がデフォルト値
        var nums = [1, 2, 3, null, 5];
        var total = _.reduce(nums, safeMult);
        assert.equal(total, 30);
    });
});

/*
配列にfalsyが混じっていた場合はfnullで、次はオブジェクトにnullが指定されていた場合に、
同じような昨日を指せる ``defaults`` という関数を考える
 */

function defaults(obj) {
    return function (localObj, key) {
        var val = fnull(_.identity, obj[key]);// d[key]がデフォルト値
        return localObj && val(localObj[key]);
    }
}

/*
    defaultsのような仕組みは直接値にアクセスする前に一つレイヤーを挟めるのが便利

    関数型スタイルはこういうカプセル化がやりやすい
 */
describe("defaults", function () {
    it("safeなオブジェクト", function () {
        /*
        criticalの値を返す単純な関数
         */
        function doSomething(config) {
            /*
                criticalのデフォルト値を100としている
             */
            var lookup = defaults({critical: 100});
            return lookup(config, 'critical');
        }

        var res_1 = doSomething({critical: 9});
        assert.equal(res_1, 9);

        var res_2 = doSomething({});
        assert.equal(res_2, 100);

    });
});
