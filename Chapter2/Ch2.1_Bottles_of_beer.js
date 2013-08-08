/**
 * Created by azu on 2013/08/07.
 */

var assert = require('chai').assert;
var _ = require("underscore");
/*
 - Start at 99
 - Sing the following for each number down to 1:
     - X bottles of beer on the wall
     - X bottles of beer
     - Take one down, pass it around
     - X-1 bottles of beer on the wall
 - Subtract one from the last number and start over with the new value
 - When you finally get to the number 1, sing the following last line instead:
    - No more bottles of beer on the wall
 */

// 素の命令形のプログラミング Imperative Programmingで書くと
(function () {
    "use strict";
    var lyrics = [];
    for (var bottles = 99; bottles > 0; bottles--) {
        lyrics.push(bottles + " bottles of beer on the wall");
        lyrics.push(bottles + " bottles of beer");
        lyrics.push("Take one down, pass it around");
        if (bottles > 1) {
            lyrics.push((bottles - 1) + " bottles of beer on the wall");
        } else {
            lyrics.push("No more bottles of beer on the wall!");
        }
    }
})();

// 関数型スタイルで実装してみる
(function () {
    "use strict";
    /*
    ロジックとなる部分の関数
     */
    function lyricSegment(n) {
        return _.chain([])
            .push(n + " bottles of beer on the wall")
            .push(n + " bottles of beer")
            .push("Take one down, pass it around")
            .tap(function (lyrics) {
                if (n > 1) {
                    lyrics.push((n - 1) + " bottles of beer on the wall");
                } else {
                    lyrics.push("No more bottles of beer on the wall!");
                }
            }).value();
    }

    function song(start, end, lyricGen) {
        // 99...1 の配列を作成
        var arr = _.range(start, end, -1);
        return _.reduce(arr, function (memo, n) {
            return memo.concat(lyricGen(n));
        }, []);
    }

    describe("song", function () {
        context("when 99..1", function () {
            before(function () {
                this.results = song(99, 0, lyricSegment);
            });
            it("should have count Of 99 * 4", function () {
                assert.lengthOf(this.results, 99 * 4);
            });
        });
    });
})();
