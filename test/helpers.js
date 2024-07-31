import '../index.js';

class LiteralMap extends Map {
  // returns an object literal instead
  [Symbol.structuredClone]() {
    return Object.fromEntries([...this]);
  }
}

export const check = cloned => {
  assert(cloned.map.size, 1, 'cloned map wrong size');
  assert(cloned.map.get('a'), 1, 'cloned map wrong value');
  assert(cloned.set.size, 2, 'cloned set wrong size');
  assert(
    [...cloned.set].join('-'),
    [...reference.set].join('-'),
    'cloned set wrong value',
  );
  return cloned;
};

export const reference = {
  value: new LiteralMap([['a', 1], ['b', 2]]),
  map: new Map([['a', 1]]),
  set: new Set([1, 2]),
  array: [1, 2],
};

export const json = '{"value":{"a":1,"b":2},"map":{},"set":{},"array":[1,2]}';

export const assert = (current, expected, message) => {
  if (!Object.is(current, expected)) {
    console.error({ current, expected });
    throw new Error(message);
  }
};
