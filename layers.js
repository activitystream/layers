var path = require('path');
var fs = require('fs');
var glob = require('glob');

module.exports = {
    layers: function layers(root, src) {
        var getBaseName = function getBaseName(src) {
            var parts = src.split('-from-');
            if (parts.length !== 2) {
                console.error(`Error: supported only one inheritance at a time, multiple found ${src}`)
            }
            return parts[1];
        }

        var findSrcName = function (root, name) {
            try {
                var fd = fs.openSync(path.join(root, name), 'r');
                fs.closeSync(fd);
                return { src: name };
            } catch (e) {
                var possibleFiles = glob.sync(`${root}/${name}-from-*`);
                if (possibleFiles.length > 1) throw `Multiple defintion of the same name but different base layers: ${possibleFiles}`
                if (possibleFiles.length == 0) throw `Name ${name} could not be found`;
                var srcFile = path.basename(possibleFiles[0]);
                return { src: srcFile, base: getBaseName(srcFile) };
            }
        }
        root = path.resolve(root);
        var layers = [];
        do {
            if (layers.length > 5) throw new Error('Too many layers or circular reference');
            src = findSrcName(root, src);
            layers.push(src.src);
            src = src.base
        } while (src);

        return layers;
    }
}