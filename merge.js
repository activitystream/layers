var fs = require('fs');
var path = require('path');
var traverse = require('traverse');
var tmp = require('tmp');

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
    traverse(json).forEach(function(el){
        var add = el.add;
        var remove = el.remove;
        if (add || remove){
          this.update(ops.list(traversedBase.get(this.path), el));
        }
    })
    return Object.assign(base, json);
}

module.exports = function merge(fileOverrides, target) {
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
