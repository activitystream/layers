var path = require('path');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'merge-testset', p);
var merge = require('../merge').merge;

describe.only('merging layers', function () {
    it('file from base layer goes through to result', function () {
        var result = merge(resolve('base-layer-pass-through'), ['top', 'base']);
        expect(result).to.deep.equals([{ file: 'a.json', layers: ['base'] }, { file: 'b.js', layers: ['base'] }]);
    })
})