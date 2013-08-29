function plucker(FIELD) {
    return function (obj) {
        return obj && obj[FIELD];
    };
}
exports.plucker = plucker;