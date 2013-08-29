/**
 * Created by azu on 2013/08/10.
 */
"use strict";
var assert = require('chai').assert;
var _ = require("underscore");
var construct = require("../lib/construct.js").construct;
/*
    `_.pluck`はひとつでも、そのkeyを持ってないものがあると、
    例外を吐いてしまうので、 `_.defaults`でデフォルト値を設定してから取り出す
 */
(function () {
    var books = [
        {
            title: "Chthon", author: "Anthny"
        },
        {
            title: "Grendel", author: "Garder"
        },
        {
            title: "After Dark"
        }
    ];
    var values = _.pluck(_.map(books, function (obj) {
        return _.defaults(obj, {author: "Unknown"});
    }), "author");
})();

/*
    Underscore.js にはデータを色々 pick する関数が充実してる。

    `_.pluck` は Objective-Cの `valueKeyFor` みたいな感じで、keyに一致するValueを配列として取れる。

    これを応用する話をTableのようなデータから色々取り出す関数を作りながら見てみる
*/
(function () {
    /*
        ここではこのような `{Array.<Object>}` の配列を `table` と読んでる

        いわゆる表っぽいオブジェクト
     */

    /**
     * @typedef {Object} Book
     * @property title
     * @property isbn
     * @property ed
     */
    /**
     *
     * @type {Array.<Book>}
     */
    var library = [
        {title: "SICP", isbn: "0262010771", ed: 1},
        {title: "SICP", isbn: "0262510871", ed: 2},
        {title: "Joy of Clojure", isbn: "1935182641", ed: 1}
    ];
    /*
        pluckは便利だが、ひとつのkeyしか扱えないので、SQLのSELECTみたいなもう少し柔軟なものが欲しい。
     */
    it("pluckの威力", function () {
        var values = _.pluck(library, "title");
        assert.deepEqual(values, ["SICP", "SICP", "Joy of Clojure"]);
    });

    /*
        `project` は複数のkeyが取れる `_.pick` みたいな関数
     */
    function project(table, keys) {
        return _.map(table, function (obj) {
            return _.pick.apply(null, construct(obj, keys));
        });
    }

    /*
     [ { title: 'SICP', isbn: '0262010771' },
       { title: 'SICP', isbn: '0262510871' },
       { title: 'Joy of Clojure', isbn: '1935182641' } ]
     */
    var result = project(library, ["title", "isbn"]);

    /*
        SQLでいう AS に該当する rename しながら値を取り出すものを実装したいとする

        > SELECT ed AS edition Form library

        まずは、`table` ではなくてobject単位でrenameをする関数を作る

        `ed` を `edition` というkeyにリネームして取り出す
    */

    function rename(obj, newNames) {
        // _.omitはいわゆるブラックリストでkeyをフィルタする
        /*
        ``` js
        _.omit({name : 'moe', age : 50, userid : 'moe1'}, 'userid');
        => {name : 'moe', age : 50}
        ```

        名前を変更するのは、newNamesのもののみなので最初にそれを取り出して置く
         */
        var placeholder = _.omit.apply(null, construct(obj, _.keys(newNames)));
        /*
        `placeholder` を元にobjを書き換える
         */
        return _.reduce(newNames, function (localObject, newKey, oldKey) {
            if (_.has(obj, oldKey)) {
                localObject[newKey] = obj[oldKey];
                return localObject;
            } else {
                return localObject;
            }
        }, placeholder);
    }

    describe("rename", function () {
        it("should return renamaed object", function () {
            var newObject = rename({"a": 1, "b": 1}, {"a": "newName"});
            assert.sameMembers(_.keys(newObject), ["newName", "b"]);
        });
    });

    /*
    これを元に 先ほどの AS を実装する

    tableのColumnをrenameする関数
     */
    function as(table, newNames) {
        return _.map(table, function (obj) {
            return rename(obj, newNames);
        });
    }

    describe("as", function () {
        it("rename table Column name", function () {
            var result = as(library, {ed: "edition"});
            var expect = [
                {title: "SICP", isbn: "0262010771", edition: 1},
                {title: "SICP", isbn: "0262510871", edition: 2},
                {title: "Joy of Clojure", isbn: "1935182641", edition: 1}
            ];
            assert.deepEqual(result, expect);
        });
    });
    /*
    で、 as だけだと SQLのASとはちょっと違って、SELECTの動作がないので、

    最初に作った `project` と一緒に使うと、同じようになる
     */
    function selectAs(table, renameObject) {
        var values = _.values(renameObject);
        return project(as(library, renameObject), values);
    }

    describe("selectAs", function () {
        it("should return renamed object", function () {
            var results = selectAs(library, {
                ed: "edition"
            });
            var expects = [
                {
                    edition: 1
                },
                {
                    edition: 2
                },
                {
                    edition: 1
                }
            ];
            assert.deepEqual(results, expects);
        });
    });

    /*
        次は SQL の `WHERE` にあたる部分を作ってみよう。

        Applicative natureとしてpredicateとなる関数を受ける関数とする
     */
    function restrict(table, predicate) {
        return _.reduce(table, function (newTable, obj) {
            if (predicate(obj)) {
                return newTable;
            } else {
                return _.without(newTable, obj);
            }
        }, table);
    }

    /**
     *
     * @param {Book} book
     * @returns {boolean}
     */
    function isNotFirstEdition(book){
        return book.ed > 1;
    }
    describe("restrict", function () {
        it("should filter by predicate", function () {
            /*
            ``` sql
            SELECT title, isbn, edition FROM library
            WHERE edition > 1;
            ```

            と同様
             */
            var results = restrict(library, isNotFirstEdition);
            var expect = [
                {title: "SICP", isbn: "0262510871", ed: 2}
            ];
            assert.deepEqual(results, expect);
        });
    });
})();