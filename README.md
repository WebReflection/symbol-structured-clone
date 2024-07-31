# symbol-structured-clone

A Symbol.structuredClone proposal / polyfill to hopefully help moving forward [this long standing WHATWG issue](https://github.com/whatwg/html/issues/7428#issuecomment-2259007298).

```js
// either globally, or as module, or as worker
import 'symbol-structured-clone';

class LiteralMap extends Map {
  // when cloned or via postMessage
  // it will return an object literal instead
  [Symbol.structuredClone]() {
    return Object.fromEntries([...this]);
  }
}

const lm = new LiteralMap([['a', 1], ['b', 2]]);

structuredClone(reference);
// {"a": 1, "b": 2}

postMessage(lm);
// event.data received as
// {"a": 1, "b": 2}
```

That's it 👋
