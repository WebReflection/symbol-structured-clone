// (c) Andrea Giammarchi - MIT
const STRUCTURED_CLONE = 'structuredClone';

// avoid re-patching the already patched env
if (!(STRUCTURED_CLONE in Symbol)) {
  const { isArray } = Array;
  const { entries, fromEntries, prototype: { toString } } = Object;
  const { [STRUCTURED_CLONE]: clone, postMessage: pm, Worker } = globalThis;

  const symbol = Symbol.for(STRUCTURED_CLONE);

  const patch = data => {
    if (symbol in data) return data[symbol]();
    if (isArray(data)) return data.map(resolve);
    if (data instanceof Map) return new Map([...data].map(pair));
    if (data instanceof Set) return new Set([...data].map(resolve));
    return toString.call(data) === '[object Object]' ?
      fromEntries([...entries(data)].map(value)) :
      data
    ;
  };

  const value = ([key, value]) => [key, resolve(value)];
  const pair = ([key, value]) => [resolve(key), resolve(value)];
  const resolve = data => typeof data === 'object' && data ? patch(data) : data;

  // Symbol.structuredClone
  Symbol[STRUCTURED_CLONE] = symbol;
  // global structuredClone
  globalThis[STRUCTURED_CLONE] = (data, ...rest) => clone(resolve(data), ...rest);
  // global postMessage (worker)
  if (pm) globalThis.postMessage = (data, ...rest) => pm(resolve(data), ...rest);
  // Worker.prototype.postMessage (main)
  if (Worker) {
    const { postMessage } = Worker.prototype;
    Worker.prototype.postMessage = function (data, ...rest) {
      return postMessage.call(this, resolve(data), ...rest);
    };
  }
}
