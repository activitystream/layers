var path  = require('path');
var mergeDirectory = require('./merge').mergeDirectory;
var args = process.argv.slice(2);
if (args.length !== 3) throw 'Pass me a base folder, a name to resolve and a place to write the output';
var root = args[0];
var src = args[1];
var out = args[2];


console.log(`output generated at ${path.resolve(out)}`)
mergeDirectory(root, src, out);
