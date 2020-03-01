'use strict';

const root = this;
const assert = require('assert');

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
    return s > 0 && balance === 0;
  });
  return out;
};
assert.deepEqual(similarities('maca', ['maçã', 'barraca', 'martelo']), ['maçã']);
