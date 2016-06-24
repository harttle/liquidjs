const Liquid = require('..');

module.exports = function() {

    var    engine = Liquid({
            root: '/root/',
            extname: '.html'
        });
    function express(filePath, options, callback) {
        fs.readFile(filePath, function(err, content) {
            if (err) return callback(new Error(err));
            // this is an extremely simple template engine
            var rendered = content.toString().replace('#title#', '<title>' + options.title + '</title>')
                .replace('#message#', '<h1>' + options.message + '</h1>');
            return callback(null, rendered);
        });
    }
    return express;
};
