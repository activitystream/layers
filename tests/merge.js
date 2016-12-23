var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'merge-testset', p);
var merge = require('../merge');

describe.only('file merge', function () {
    it('simple JSON merge', function () {
        var result = merge([resolve('a.json'), resolve('b.json'), resolve('c.json')]);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })

    it('JSON > JS', function () {
        var result = merge([resolve('a.json'), resolve('js-override.js')]);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 3 });
    })
    it('JSON > JS > JSON', function () {
        var result = merge([resolve('a.json'), resolve('js-override.js'), resolve('c.json')]);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 10 });
    })
})