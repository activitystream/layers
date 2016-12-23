var fs = require('fs');
var tmp = require('tmp');

module.exports = function merge(fileOverrides) {
    var resultContent = fileOverrides.reduce((acc, o) => {
        return Object.assign(acc, JSON.parse(fs.readFileSync(o, 'utf8')));
    }, {});
    var tmpobj = tmp.fileSync();
    fs.writeFileSync(tmpobj.fd, JSON.stringify(resultContent, null, 4), 'utf8');
    return tmpobj.name;
}
