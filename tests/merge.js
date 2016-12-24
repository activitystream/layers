var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'merge-testset', p);
var merge = require('../merge');
var overrides = require('../overrides');
var layers = require('../layers');
var tmp = require('tmp');

describe('file merge', function () {
    let result;
    beforeEach(function () {
        result = tmp.fileSync().name;
    });

    it('simple JSON merge', function () {
        merge([resolve('a.json'), resolve('b.json'), resolve('c.json')], result);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })

    it('simple JSON > JS', function () {
        merge([resolve('a.json'), resolve('js-override.js')], result);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 3 });
    })

    it('simple JSON > JS > JSON', function () {
        merge([resolve('a.json'), resolve('js-override.js'), resolve('c.json')], result);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })

    describe('JS content manipulations', function () {
        it('array items addition', function () {
            merge([resolve('array.json'), resolve('add-to-array.js')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['a', 'b'] });
        })

        it('array items removal', function () {
            merge([resolve('array.json'), resolve('remove-from-array.js')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: [] });
        })

        it('array items addition and removal', function () {
            merge([resolve('array.json'), resolve('add-and-remove-array.js')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['b'] });
        })
    })
    describe('JSON content manipulations', function () {
        it('array items addition', function () {
            merge([resolve('array.json'), resolve('add-to-array.json')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['a', 'b'] });
        })

        it('array items removal', function () {
            merge([resolve('array.json'), resolve('remove-from-array.json')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: [] });
        })

        it('array items addition and removal', function () {
            merge([resolve('array.json'), resolve('add-and-remove-array.json')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['b'] });
        })
    })
})

var mkdirp = require('mkdirp');
var replaceExt = require('replace-ext');
describe('merge tree', function(){
    var resolve = p => path.resolve(__dirname, 'mergetree-testset', p);
    it('should layers of trees', function(){
        var root = resolve('base-layer-pass-through');
        var l = layers(root, 'top');
        var files = overrides(root, l);

        var tmpDir = tmp.dirSync();
        files.forEach(f => {
            var targetFile = path.resolve(tmpDir.name, f.file);
            targetFile = replaceExt(targetFile, '.json');
            mkdirp.sync(path.dirname(targetFile));
            var srcFiles = f.layers.map(l => path.resolve(root, l, f.file));
            merge(srcFiles, targetFile);
        });

        var resultContent = JSON.parse(fs.readFileSync(path.resolve(tmpDir.name, 'a.json'), 'utf8'));
        expect(resultContent).to.deep.equals({ a: 1 });
        resultContent = JSON.parse(fs.readFileSync(path.resolve(tmpDir.name, 'b.json'), 'utf8'));
        expect(resultContent).to.deep.equals({ b: true });
        
    })
})