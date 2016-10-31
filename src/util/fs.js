const fs = require('fs');

function readFileAsync(filepath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filepath, 'utf8', function(err, content) {
            err ? reject(err) : resolve(content);
        });
    });
};

function statFileAsync(path) {
    return new Promise(function(resolve, reject) {
        fs.stat(path, (err, stat) => err ? reject(err) : resolve(stat))
    });
};

function pathResolve(root, path) {
    if (path[0] == '/') return path;

    var arr = root.split('/').concat(path.split('/'));
    var result = [];
    arr.forEach(function(slug) {
        if (slug == '..') result.pop();
        else if (!slug || slug == '.');
        else result.push(slug);
    });
    return '/' + result.join('/');
}

module.exports = {
    readFileAsync,
    pathResolve,
    statFileAsync
};
