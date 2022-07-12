---
"clarigen-deno": patch
---

Big DX updates:

1. Contract calls support an "object" syntax
2. Tuples are properly "camel-cased"
3. Integer types are `number | bigint` now in all arguments

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

### Integer types for arguments

Previously, if a function had a `uint` or `int` argument, you could already pass the argument as `number | bigint`. However, if you had a type where the integer was within a type (like `(list uint)`), you could only use `bigint`.

Now, you can use `number | bigint` within any argument type that has an integer.
