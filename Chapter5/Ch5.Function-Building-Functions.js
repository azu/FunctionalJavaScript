/**
 * Created by azu on 2013/09/16.
 */

"use strict";

var assert = require('chai').assert;
var _ = require("underscore");
var existy = require("../lib/existy.js").existy;
var invoker = require("../lib/invoker.js").invoker;
var construct = require("../lib/construct.js").construct;
var always = require("../lib/always.js").always;

/*
    invoker と合わせて使う

    複数のinvokeする関数を渡して、順番の実行していきちゃんと値が返ってきた時点でそれを採用する
 */
function dispatch(/* funs */) {
    var funcs = _.toArray(arguments);
    var size = funcs.length;
    return function (target /*args*/) {
        var ret = undefined;
        var args = _.rest(arguments);
        for (var funcIndex = 0; funcIndex < size; funcIndex++) {
            var func = funcs[funcIndex];
            ret = func.apply(func, construct(target, args));
            if (existy(ret)) {
                return ret;
            }
        }
        return ret;
    };
}

describe("dispatch", function () {
    it("invoker", function () {
        var str = dispatch(invoker('toString', Array.prototype.toString), invoker('toString', String.prototype.toString));
        assert.equal(str("a"), "a");
        assert.equal(str(_.range(10)), "0,1,2,3,4,5,6,7,8,9");
    });
});

/*
   dispatchはinvokerに依存しているわけではないが、 ``construct`` には依存してる。

   invoker を使わない関数をdispatchには渡せて、次のような stringReverse を考えてみる。
 */
function stringReverse(s) {
    if (!_.isString(s)) {
        return undefined;
    }
    return s.split("").reverse().join("");
}
describe("stringReverse", function () {
    it("return reverse string", function () {
        var reverseString = stringReverse("abc");
        assert.equal(reverseString, "cba");
    });
    context("when pass number", function () {
        it("should return undefined", function () {
            var results = stringReverse(1);
            assert.isUndefined(results);
        });
    });
});

/*
    stringReverseも組み合わせてみると
 */
it("arrayとstringのreverse", function () {
    var rev = dispatch(invoker('reverse', Array.prototype.reverse), stringReverse);
    /*
        Arrayのreverseをして、それができないならstringのreverseをするという ``rev``
     */
    assert.deepEqual(rev([1, 2, 3]), [3, 2, 1]);
    assert.equal(rev("str"), "rts");

    /*
    このrev自体も更に発展させて compose する事ができるので、

    alwaysのような常に値が変えるような関数と組み合わせれば、デフォルト値みたいな感じに使える
     */
    var sillyReverse = dispatch(rev, always(42));
    assert.deepEqual(sillyReverse([1, 2, 3]), [3, 2, 1]);
    assert.equal(sillyReverse("str"), "rts");
    // 数値のreverseは実装してないので, alwaysが返す
    assert.equal(sillyReverse(100000), 42);
});

/*
    このdispatchを使うと以下のようなswitchで書いてたケースを違う方法で表せる
 */
function performCommandHardcoded(command) {
    var result;
    switch (command.type) {
        case 'notify':
            result = notify(command.message);
            break;
        case 'join':
            result = changeView(command.target);
            break;
        default :
            alert(command.type);
            break;
    }
    return result;
}

/*
    これをdispatch と ``isa`` のようなものを使えば、
    switchのようなパターンを使わないで実現出来る
 */
function isa(type, action) {
    return function (obj) {
        if (type === obj.type) {
            return action(obj);
        }
    };
}

/*
    switchのように、上から `notify` `join` `defaults` という感じで実行出来る

    またdispatchは値が返ってきた時点で止まるのでbreakと同じような感じになる
 */
var performCommand = dispatch(
    isa('notify', function (obj) {
    return notify(obj.message);
}), isa('join', function (obj) {
    return changeView(obj.target)
}), function (obj) {
    alert(obj.type);
});

/*

# The Essence of Functional Composition

    Mutation は LowLevelな操作である

    "Functions are quanta of abstraction,"

    Mutationは必要なときは確かにあるが、Low-LevelなAPIであるべき。

    ![An “evolved” programmer knows when to use the right tool](evolved.png)

 */

