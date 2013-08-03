/**
 * Created by azu on 2013/08/04.
 */
"use strict";

var ComparisonResult = {
    ascending: -1,// <
    same: 0,
    descending: 1 // >
};

function comparator(predicate) {
    return function (x, y) {
        if (predicate(x, y)) {
            return ComparisonResult.ascending
        } else if (predicate(y, x)) {
            return ComparisonResult.descending;
        } else {
            return ComparisonResult.same;
        }
    };
}

function isLessOrEqual(x, y) {
    return x <= y;
}


exports.testComparator = function (test) {
    var values = [2, 3, -1, -6, 0, -108, 42, 10];
    var expectedSortedValues = [-108, -6, -1, 0, 2, 3, 10, 42];
    var results = values.sort(comparator(isLessOrEqual));
    test.deepEqual(results, expectedSortedValues);
    test.done();
};

exports.testIsLessOrEqual = function (test) {
    test.ok(isLessOrEqual(0, 1));
    test.ok(isLessOrEqual(-1, 0));
    test.ok(isLessOrEqual(1, 2));
    test.done();
};
