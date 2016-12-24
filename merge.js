var fs = require('fs');
var path = require('path');
var traverse = require('traverse');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var replaceExt = require('replace-ext');
var overrides = require('./overrides');
var layers = require('./layers');

var ops = {
    list: function (l, actions) {
        if (actions.remove) {
            l = actions.remove.reduce((agg, item) => agg.filter(i => i != item), l);
        }
        if (actions.add) {
            l = l.concat(actions.add);
        }
        return l;
    }
}

var mergeJSON = function (base, json) {
    var traversedBase = traverse(base);
    traverse(json).forEach(function (el) {
        var add = el.add;
        var remove = el.remove;
        if (add || remove) {
            this.update(ops.list(traversedBase.get(this.path), el));
        }
    })
    return Object.assign(base, json);
}

var mergeFiles = function (fileOverrides, target) {
    var resultContent = fileOverrides.reduce((acc, o) => {
        switch (path.extname(o)) {
            case '.json':
                return mergeJSON(acc, JSON.parse(fs.readFileSync(o, 'utf8')));
            case '.js':
                return require(o)(acc, ops);
        }

    }, {});
    fs.writeFileSync(target, JSON.stringify(resultContent, null, 4), 'utf8');
}
module.exports = {
    mergeFiles: mergeFiles,
    mergeDirectory: function (root, top, output) {
        var output = output || tmp.dirSync().name;
        var l = layers(root, top);
        var files = overrides(root, l);

        files.forEach(f => {
            var targetFile = path.resolve(output, f.file);
            targetFile = replaceExt(targetFile, '.json');
            mkdirp.sync(path.dirname(targetFile));
            var srcFiles = f.layers.map(l => path.resolve(root, l, f.file));
            mergeFiles(srcFiles, targetFile);
        });
        return output;
    }
}
