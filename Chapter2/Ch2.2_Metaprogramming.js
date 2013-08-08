/**
 * Created by azu on 2013/08/08.
 */
"use strict";
/*
    JavaScriptは `this` の参照が動的な言語
*/
var assert = require('chai').assert;
/*
これを利用して次のようにも書ける
 */
function Point2D(x, y) {
    this._x = x;
    this._y = y;
}
/*
    メタプログラミング的に、Point3DはPoint2Dコンストラクタを利用してる
 */
function Point3D(x, y, z) {
    Point2D.call(this, x, y);
    this._z = z;
}
// do
(function () {
    var point2D = new Point2D(0, 1);
    console.log(point2D);

    var point3D = new Point3D(10, -1, 100);
    console.log(point3D);
})();