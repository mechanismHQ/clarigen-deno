---
"clarigen-deno": patch
---

Two big DX updates:

1. Contract calls support an "object" syntax
2. Tuples are properly "camel-cased"

### Object vs spread:

Updates the contract call syntax to support function arguments either as an object or an array. Previously, the only supported syntax was to "spread".

For example, given the function:

```clarity
(define-read-only (add (a uint) (b uint)))
```

The "spread" syntax is:

```ts
contract.add(1, 2);
```

Now you can also do:

```ts
contract.add({ a: 1, b: 2 });
```

### Tuples are camel-ized

Previously, tuples (either as arguments or as results) were not properly camel-cased. Now, they are, which makes writing JS much easier.

Example function:

```clarity
(define-read-only (merge-tuple (i { min-height: uint }))
  (merge i { max-height: u100000 })
)
```

Previously, the tuples in both arguments and results were not camel-case:

```ts
// old
const result = contract.mergeTuple({ "min-height": 1n });
const max = result["max-height"];
```

Now it's much cleaner:

```ts
const result = contract.mergeTuple({ minHeight: 1n });
const max = result.maxHeight;
```
