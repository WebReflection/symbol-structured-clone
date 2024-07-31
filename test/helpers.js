import '../index.js';

class LiteralMap extends Map {
  // returns an object literal instead
  [Symbol.structuredClone]() {
    return Object.fromEntries([...this]);
  }
}

export const reference = new LiteralMap([['a', 1], ['b', 2]]);
export const json = '{"a":1,"b":2}';

export const assert = (current, expected, message) => {
  if (!Object.is(current, expected))
    throw new Error(message);
};
