/**
 * Created by azu on 2013/09/29.
 */
function validator(message, fn) {
    var hiFn = function (/* args */) {
        return fn.apply(fn, arguments);
    };
    hiFn["message"] = message;
    return hiFn;
}
exports.validator = validator;