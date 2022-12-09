---
"clarigen-deno": patch
---

Clarigen now outputs a "constants" property with each contract. This allows you to get the value for your constants from within the JS runtime.

Example:

```clarity
(define-constant my-const u1)
(define-data-var my-var uint u2)
```

Both the constant and the variable's initial value will be added to your contract's type definitions. You can access it like:

```ts
console.log(contract.constants.myConst); // 1n
console.log(contract.constants.myVar); // 2n
```

For variables, only the initial value (when the contract is deployed) is added to the contract's types.
