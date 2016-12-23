var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'merge-testset', p);
var merge = require('../merge');

describe('file merge', function () {
    it('simple JSON merge', function () {
        var result = merge([resolve('a.json'), resolve('b.json'), resolve('c.json')]);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })

    it('simple JSON > JS', function () {
        var result = merge([resolve('a.json'), resolve('js-override.js')]);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 3 });
    })

    it('simple JSON > JS > JSON', function () {
        var result = merge([resolve('a.json'), resolve('js-override.js'), resolve('c.json')]);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })

    describe('JS content manipulations', function () {
        it('array items addition', function () {
            var result = merge([resolve('array.json'), resolve('add-to-array.js')]);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['a', 'b'] });
        })

        it('array items removal', function () {
            var result = merge([resolve('array.json'), resolve('remove-from-array.js')]);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: [] });
        })

        it('array items addition and removal', function () {
            var result = merge([resolve('array.json'), resolve('add-and-remove-array.js')]);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['b'] });
        })
    })
    describe('JSON content manipulations', function () {
        it('array items addition', function () {
            var result = merge([resolve('array.json'), resolve('add-to-array.json')]);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['a', 'b'] });
        })

        it('array items removal', function () {
            var result = merge([resolve('array.json'), resolve('remove-from-array.json')]);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: [] });
        })

        it('array items addition and removal', function () {
            var result = merge([resolve('array.json'), resolve('add-and-remove-array.json')]);
            var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
            expect(resultContent).to.deep.equals({ a: ['b'] });
        })
    })
})