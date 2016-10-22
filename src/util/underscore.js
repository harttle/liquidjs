function isString(value){
    return value instanceof String || typeof value === 'string';
}

exports.isString = isString;
