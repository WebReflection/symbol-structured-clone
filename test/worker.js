import { reference, json, assert } from './helpers.js';

assert(
  JSON.stringify(structuredClone(reference)),
  json,
  'worker: invalid structuredClone',
);

addEventListener('message', ({ data }) => {
  assert(
    JSON.stringify(data),
    json,
    'worker: invalid structuredClone',
  );
  postMessage(reference);
});
