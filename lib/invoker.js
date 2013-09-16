/**
 * Created by azu on 2013/09/16.
 */
var _ = require("underscore");
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

exports.invoker = invoker;
