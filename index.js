'use strict';

const root = this;

const fs = require('fs');
const knn = require('knn-rank');
const assert = require('assert');

let _dict = ['maçã', 'barraca', 'martelo'];

const dictionary = root.dictionary = fs
                                       .readFileSync('./pt_BR.txt')
                                       .toString()
                                       .split('\n');

const toObject = root.toObject = function toObjectHandler(w) {
  let out = {};
  w.split('').map(v => {
    let keys = Object.keys(out);
    if (keys.indexOf(v) === -1) {
      out[v] = 1;
    } if (keys.indexOf(v) > -1) {
      out[v] += 1;
    }
  });
  return out;
};
assert.deepEqual(toObject('maçã'), {'m': 1, 'a': 1, 'ç': 1, 'ã': 1});

const proximity = root.proximity = function proximityHandler(w, d) {
  let out = [];
  out = knn.neighbors(toObject(w), d.map(v => toObject(v)));
  return out;
};
assert.deepEqual(proximity('maçã', ['maçã']), knn
                                                .neighbors(toObject('maçã'),
                                                          [toObject('maçã')]));
const proximities = root.proximities = function proximitiesHandler(w, d) {
  let out = [];
  let cache = proximity(w, d);
  out = d.filter((v, i) => {
    return cache[i] === 0;
  });
  return out;
};
assert.deepEqual(proximities('maçã', ['maçã', 'barraca']), ['maçã']);

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

const ratio = root.ratio = function rationHandler(w1, w2, sep='') {
  let out = null;
  if (typeof(w1) !== 'string' && typeof(w2) !== 'string') {
    return out;
  }
  const SEP = sep;
  let tokens1 = w1.split(SEP);
  let tokens2 = w2.split(SEP);
  let tokensLengthMax = Math.max(tokens1.length, tokens2.length);
  let tokensLengthMin = Math.min(tokens1.length, tokens2.length);
  let tokensScore = tokensLengthMax - tokensLengthMin / 100;
  out = tokensScore;
  return out;
}
assert.ok(ratio('quero maçã', 'quero uma maçã') > 0);
assert.ok(ratio('quero uma maçã', 'quero uma maçã'), 100);
assert.equal(ratio(10, 10), null);

knn.extend(root, knn);
