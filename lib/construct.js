var _ = require("underscore");
function cat() {
    var head = _.first(arguments);
    if (head != null) {
        return head.concat.apply(head, _.rest(arguments));
    } else {
        return [];
    }
}
function construct(head, tail) {
    return cat([head], _.toArray(tail));
}
exports.construct = construct;
exports.cat = cat;