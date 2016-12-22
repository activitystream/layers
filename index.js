var layers = require('./layers').layers;
var args = process.argv.slice(2);
if (args.length !== 2) throw 'Pass me a base folder and name to resolve';
var root = args[0];
var src = args[1];


console.log(`order of layers: ${layers(root, src)}`)
