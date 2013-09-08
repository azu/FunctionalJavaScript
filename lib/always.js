/**
 * Created by azu on 2013/09/08.
 */
function always(VALUE) {
    return function () {
        return VALUE;
    }
}
exports.always = always;
