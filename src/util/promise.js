const Promise = require('any-promise');

/*
 * Call functions in serial until someone resolved.
 * @param {Array} iterable the array to iterate with.
 * @param {Array} iteratee returns a new promise.
 * The iteratee is invoked with three arguments: (value, index, iterable). 
 */
function someSeries(iterable, iteratee) {
    var ret = Promise.reject(new Error('init'));
    iterable.forEach(function(item, idx) {
        ret = ret
            .then(x => x)
            .catch(e => iteratee(item, idx, iterable));
    });
    return ret;
}

exports.someSeries = someSeries;
