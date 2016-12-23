var glob = require('glob');

var findLayerFiles = function (root, layer) {
    var refPoint = `${root}/${layer}`
    var files = glob.sync(`${refPoint}/**/*.json`).concat(glob.sync(`${refPoint}/**/*.js`));
    return { layer: layer, files: files.map(p => p.substr(refPoint.length + 1)) };
}

var findFilesOverrides = function (layersFiles) {
    var processedFiles = [];
    var result = [];
    while (layersFiles.length > 0) {
        var currentLayer = layersFiles.pop();
        var unprocessedFiles = currentLayer.files.filter(f => processedFiles.indexOf(f) == -1);
        var overrides = unprocessedFiles.map(f => ({ layers: [currentLayer.layer].concat(layersFiles.filter(l => l.files.indexOf(f) > -1).map(l => l.layer)), file: f }))
        result = result.concat(overrides);
        processedFiles = processedFiles.concat(unprocessedFiles);
    }
    return result;
}

module.exports = function merge(root, layers) {
    var layersFiles = layers.map(l => findLayerFiles(root, l));
    return findFilesOverrides(layersFiles);
}
