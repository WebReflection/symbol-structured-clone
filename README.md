# symbol-structured-clone

<sup>**Social Media Photo by [Ricardo Gomez Angel](https://unsplash.com/@rgaleriacom) on [Unsplash](https://unsplash.com/)**</sup>


A Symbol.structuredClone proposal / polyfill to hopefully help moving forward [this long standing WHATWG issue](https://github.com/whatwg/html/issues/7428#issuecomment-2259007298), also [discussed at TC39](https://es.discourse.group/t/symbol-clone-to-ease-out-structuredclone-implicit-conversion/2035/7).

**[Live Test](https://webreflection.github.io/symbol-structured-clone/test/)**

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

### A note for Proxies

The `has(key)` trap should check `if (key === Symbol.structuredClone) return true;` in case there is also a `get(ref, key)` trap that eventually provide that callback for cloning purpose.

- - -

That's it 👋
