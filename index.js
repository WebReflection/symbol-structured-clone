// (c) Andrea Giammarchi - MIT
const STRUCTURED_CLONE = 'structuredClone';

// avoid re-patching the already patched env
if (!(STRUCTURED_CLONE in Symbol)) {
  const { isArray } = Array;
  const { entries, prototype: { toString: ts } } = Object;
  const { [STRUCTURED_CLONE]: sc, postMessage, Worker } = globalThis;

  const symbol = Symbol.for(STRUCTURED_CLONE);

  const clone = (known, data, value) => {
    known.set(data, value);
    return value;
  };

  const array = (known, data, value) => {
    known.set(data, value);
    for (let i = 0, { length } = data; i < length; i++)
      value[i] = resolve(known, data[i]);
    return value;
  };

  const map = (known, data, value) => {
    known.set(data, value);
    for (const [k, v] of data)
      value.set(resolve(known, k), resolve(known, v));
    return value;
  };

  const set = (known, data, value) => {
    known.set(data, value);
    for (const v of data)
      value.add(resolve(known, v));
    return value;
  };

  const object = (known, data, value) => {
    known.set(data, value);
    for (const [k, v] of entries(data))
      value[k] = resolve(known, v);
    return value;
  };

  function patch(known, data) {
    // this proposal
    if (symbol in data) return clone(known, data, data[symbol]());
    // arrays
    if (isArray(data)) return array(known, data, []);
    // maps
    if (data instanceof Map) return map(known, data, new Map);
    // sets
    if (data instanceof Set) return set(known, data, new Set);
    // object literals
    if (ts.call(data) === '[object Object]') return object(known, data, {});
    // avoid all these checks further whatever data is
    known.set(data, data);
    return data;
  }

  const resolve = (known, data) => (
    typeof data === 'object' && data ?
      (known.get(data) || patch(known, data)) :
      data
  );

  // Symbol.structuredClone
  Symbol[STRUCTURED_CLONE] = symbol;

  // global structuredClone
  globalThis[STRUCTURED_CLONE] = (data, ...rest) => sc(
    resolve(new Map, data),
    ...rest
  );

  // global postMessage (worker)
  if (postMessage) {
    globalThis.postMessage = function (data, ...rest) {
      return postMessage.call(
        this,
        resolve(new Map, data),
        ...rest
      );
    };
  }

  // Worker.prototype.postMessage (main)
  if (Worker) {
    const { postMessage } = Worker.prototype;
    Worker.prototype.postMessage = function (data, ...rest) {
      return postMessage.call(
        this,
        resolve(new Map, data),
        ...rest
      );
    };
  }
}
