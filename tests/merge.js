var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var resolve = p => path.resolve(__dirname, 'merge-testset', p);
var merge = require('../merge');

describe.only('file merge', function () {
    it('JSON file', function () {
        var result = merge([resolve('a.json'), resolve('b.json'), resolve('c.json')]);
        var resultContent = JSON.parse(fs.readFileSync(result, 'utf8'));
        expect(resultContent).to.deep.equals({ a: 3 });
    })
})