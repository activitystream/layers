var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'mergetree-testset', p);
var mergeFiles = require('../merge').mergeFiles;
var mergeDirectory = require('../merge').mergeDirectory;
var tmp = require('tmp');

describe('tree merge', function () {
    let result;
    beforeEach(function () {
        result = tmp.fileSync().name;
    });

    it('should handle null leaf nodes in base json', function(){
        const output = mergeDirectory(resolve('null-in-base'), 'base');

        const resultContent = JSON.parse(fs.readFileSync(path.resolve(output, 'a.json'), 'utf8'));
        expect(resultContent).to.deep.equals({ a: null });

    });
    it('should handle overriding a single key of a subtree and produce the other parts of the subtree without changes', function(){
        const output = mergeDirectory(resolve('subtree-merge'), 'top');
        const resultContent = JSON.parse(fs.readFileSync(path.resolve(output, 'a.json'), 'utf8'));
        expect(resultContent).to.deep.equals({
            "a": "va",
            "b": {
                "ba": "ba1",
                "bb": "bb2"
            }
        });

    });
});