import { check, reference, json, assert } from './helpers.js';

assert(
  JSON.stringify(check(structuredClone(reference))),
  json,
  'worker: invalid structuredClone',
);

addEventListener('message', ({ data }) => {
  assert(
    JSON.stringify(check(data)),
    json,
    'worker: invalid structuredClone',
  );
  postMessage(reference);
});
