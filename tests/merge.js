var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'merge-testset', p);
var mergeFiles = require('../merge').mergeFiles;
var mergeDirectory = require('../merge').mergeDirectory;
var tmp = require('tmp');

describe('file merge', function () {
    let result;
    beforeEach(function () {
        result = tmp.fileSync().name;
    });

    it('simple JSON merge', function () {
        mergeFiles([resolve('a.json'), resolve('b.json'), resolve('c.json')], result);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })

    it('simple JSON > JS', function () {
        mergeFiles([resolve('a.json'), resolve('js-override.js')], result);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 3 });
    })

    it('simple JSON > JS > JSON', function () {
        mergeFiles([resolve('a.json'), resolve('js-override.js'), resolve('c.json')], result);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })

    describe('JS content manipulations', function () {
        it('array items addition', function () {
            mergeFiles([resolve('array.json'), resolve('add-to-array.js')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['a', 'b'] });
        })

        it('array items removal', function () {
            mergeFiles([resolve('array.json'), resolve('remove-from-array.js')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: [] });
        })

        it('array items addition and removal', function () {
            mergeFiles([resolve('array.json'), resolve('add-and-remove-array.js')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['b'] });
        })
    })
    describe('JSON content manipulations', function () {
        it('array items addition', function () {
            mergeFiles([resolve('array.json'), resolve('add-to-array.json')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['a', 'b'] });
        })

        it('array items removal', function () {
            mergeFiles([resolve('array.json'), resolve('remove-from-array.json')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: [] });
        })

        it('array items addition and removal', function () {
            mergeFiles([resolve('array.json'), resolve('add-and-remove-array.json')], result);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['b'] });
        })
    })
})

describe('merge tree', function(){
    var resolve = p => path.resolve(__dirname, 'mergetree-testset', p);
    it('should layers of trees', function(){
        var output = mergeDirectory(resolve('base-layer-pass-through'), 'top')

        var resultContent = JSON.parse(fs.readFileSync(path.resolve(output, 'a.json'), 'utf8'));
        expect(resultContent).to.deep.equals({ a: 1 });
        resultContent = JSON.parse(fs.readFileSync(path.resolve(output, 'b.json'), 'utf8'));
        expect(resultContent).to.deep.equals({ b: true });
        
    })
})