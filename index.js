'use strict';

const fs = require('fs');
const root = this;
const assert = require('assert');

let _dict = ['maçã', 'barraca', 'martelo'];

const dictionary = root.dictionary = fs
                                       .readFileSync('./pt_BR.txt')
                                       .toString()
                                       .split('\n');

const similarity = root.similarity = function similarityHandler(wl, wr) {
  let out = 0;
  wl.split('').map(v => {
    if (wr.indexOf(v) > -1) {
      out += 1;
    }
  });
  return out;
};
assert.equal(similarity('maca', 'maçã'), 3);
assert.equal(similarity('barra', 'barraca'), 5);

const similarities = root.similarities = function similaritiesHandler(w, d) {
  let out = [];
  out = d.filter(v => {
    let s = similarity(v, w);
    let balance = Math.max(v.length, w.length) - Math.min(v.length, w.length);
    return s === v.length && balance < s;
  });
  return out;
};
assert.deepEqual(similarities('maçã', _dict), ['maçã']);
assert.deepEqual(similarities('barraca', _dict), ['barraca']);
