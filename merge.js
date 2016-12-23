var fs = require('fs');
var path = require('path');
var tmp = require('tmp');

module.exports = function merge(fileOverrides) {
    var resultContent = fileOverrides.reduce((acc, o) => {
        switch(path.extname(o)){
            case '.json' : 
                return Object.assign(acc, JSON.parse(fs.readFileSync(o, 'utf8')));
            case '.js' : 
                return require(o)(acc);
        }
        
    }, {});
    var tmpobj = tmp.fileSync();
    fs.writeFileSync(tmpobj.fd, JSON.stringify(resultContent, null, 4), 'utf8');
    return tmpobj.name;
}
