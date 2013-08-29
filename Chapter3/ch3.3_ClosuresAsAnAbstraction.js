/**
 *
 * Created by azu on 2013/08/29.
 */
"use strict";

var assert = require('chai').assert;
var _ = require("underscore");
/*
    クロージャーを使えばプライベートっぽいものを作れる。
    ``makeAdder`` と ``complement`` を実装しながらそれを学ぶ
 */

/*
    キーを指定する  ``plucker`` の場合
 */
function plucker(FIELD) {
    return function (obj) {
        return obj && obj[FIELD];
    };
}
describe("plucker", function () {
    var book = {title: "Functional JavaScript", author: "fogus"};
    var books = [
        {title: "Functional JavaScript"},
        {stars: 1},
        {title: "Testable JavaScript"}
    ];
    it("plucker title", function () {
        var getTitle = plucker("title");
        assert.equal(getTitle(book), book["title"]);
    });
    it("plucker index", function () {
        var third = plucker(2);
        assert.equal(third(books), books[2]);
    });
    /*
       ``getTitle`` をfilterのpredicateみたいな感じにも使える
     */
    it("filter title", function () {
        var getTitle = plucker("title");
        var results = _.filter(books, getTitle);
        assert.deepEqual(results, [
            {title: "Functional JavaScript"},
            {title: "Testable JavaScript"}
        ])
    });
});
