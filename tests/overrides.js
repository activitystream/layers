var path = require('path');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'overrides-testset', p);
var overrides = require('../overrides');

describe('file overrides', function () {
    it('file from base layer goes through to result', function () {
        var result = overrides(resolve('base-layer-pass-through'), ['top', 'base']);
        expect(result).to.deep.equals([{ file: 'a.json', layers: ['base'] }, { file: 'b.js', layers: ['base'] }]);
    })
    
    it('file from top layer overrides base layer', function () {
        var result = overrides(resolve('simple-override'), ['top', 'base']);
        expect(result).to.deep.equals([{ file: 'a.json', layers: ['base', 'top'] }, { file: 'b.js', layers: ['base'] }]);
    })

    it('file from top layer with no base layer revision', function () {
        var result = overrides(resolve('no-override'), ['top', 'base']);
        expect(result).to.deep.equals([{ file: 'b.js', layers: ['base'] }, { file: 'a.json', layers: ['top'] }]);
    })
})