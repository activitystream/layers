var expect = require('chai').expect;
var assert = require('chai').assert;
var layers = require('../layers').layers;
var path = require('path');

describe('layers discovery', function () {
    it('no base layer', function () {
        expect(layers(path.resolve(__dirname, 'no-base-layer'), 'a')).to.deep.equals(['a'])
    })

    it('2 layers', function () {
        expect(layers(path.resolve(__dirname, 'with-base-layer'), 'a')).to.deep.equals(['a-from-b', 'b'])
    })

    it('3 layers', function () {
        expect(layers(path.resolve(__dirname, 'with-2-levels-of-base-layer'), 'a')).to.deep.equals(['a-from-b', 'b-from-c', 'c'])
    })
    it('avoid circular references among layers', function () {
        expect(_ => layers(path.resolve(__dirname, 'with-circular-reference'), 'a')).to.throw(Error);
    })
})