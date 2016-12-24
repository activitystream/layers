var expect = require('chai').expect;
var assert = require('chai').assert;
var layers = require('../layers');
var path = require('path');

var resolve = p => path.resolve(__dirname, 'discovery-testset', p);

describe('layers discovery', function () {
    it('no base layer', function () {
        expect(layers(resolve('no-base-layer'), 'a')).to.deep.equals(['a'])
    })

    it('2 layers', function () {
        expect(layers(resolve('with-base-layer'), 'a')).to.deep.equals(['a-from-b', 'b'])
    })

    it('3 layers', function () {
        expect(layers(resolve('with-2-levels-of-base-layer'), 'a')).to.deep.equals(['a-from-b', 'b-from-c', 'c'])
    })
    it('avoid circular references among layers', function () {
        expect(_ => layers(resolve('with-circular-reference'), 'a')).to.throw(Error);
    })
})