var fs = require('fs');
var path = require('path');
var traverse = require('traverse');
var merge = require('deepmerge');
var tmp = require('tmp');
var debug = require('debug')('merge');
var mkdirp = require('mkdirp');
var replaceExt = require('replace-ext');
var overrides = require('./overrides');
var layers = require('./layers');

var ops = {
    list: function (l, actions) {
        var result = l;
        if (actions.remove) {
            result = actions.remove.reduce((agg, item) => agg.filter(i => i != item), l);
        }
        if (actions.add) {
            result = result.concat(actions.add);
        }
        return result;
    }
}

var mergeFiles = function (fileOverrides, target) {
    var resultContent = fileOverrides.reduce((acc, o) => {
        try {
            switch (path.extname(o)) {
                case '.json':
                    return merge(acc, JSON.parse(fs.readFileSync(o, 'utf8')));
                case '.js':
                    return require(o)(acc, ops);
            }
        } catch (ex) {
            console.log("acc=" + JSON.stringify(acc));
            console.log("o=" + JSON.stringify(JSON.parse(fs.readFileSync(o, 'utf8'))));
            throw ex;
        }

    }, {});
    fs.writeFileSync(target, JSON.stringify(resultContent, null, 4), 'utf8');
}
module.exports = {
    mergeFiles: mergeFiles,
    mergeDirectory: function (root, top, output) {
        var output = output || tmp.dirSync().name;
        var l = layers(root, top);
        debug(`found layers: ${JSON.stringify(l)}`);
        var files = overrides(root, l);
        debug(`found files: ${JSON.stringify(files)}`);

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
