# clarigen-deno

## 0.3.7

### Patch Changes

- Updated type stubs to remove unnecessary code

## 0.3.6

### Patch Changes

- [`17abcf1`](https://github.com/mechanismHQ/clarigen-deno/commit/17abcf18a2524c54aec360abd999989af75b1ecf) Thanks [@hstove](https://github.com/hstove)! - Big DX updates:

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

## 0.3.5

### Patch Changes

- [`f7e827d`](https://github.com/mechanismHQ/clarigen-deno/commit/f7e827d9eb1b092c0dbfce8796a261a4bb63d46b) Thanks [@hstove](https://github.com/hstove)! - Added instance methods to `Chain` to support the full Clarinet api

## 0.3.4

### Patch Changes

- [`65582f9`](https://github.com/mechanismHQ/clarigen-deno/commit/65582f9c64c2df9d5043ddd756b8d96228112eee) Thanks [@hstove](https://github.com/hstove)! - fix: changeset action

## 0.3.3

### Patch Changes

- [`c8d6b4a`](https://github.com/mechanismHQ/clarigen-deno/commit/c8d6b4ad6124285569ef7de9955c572e11724c51) Thanks [@hstove](https://github.com/hstove)! - Removed 'commit' option for changesets

* [`2f14353`](https://github.com/mechanismHQ/clarigen-deno/commit/2f14353391bfc2226f3dedbea045759c67d1d8d2) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue decoding principals

## 0.3.2

### Patch Changes

- [`2b6cca8`](https://github.com/mechanismHQ/clarigen-deno/commit/2b6cca8bfdbf4599c35ee5596fe7f513876ae155) Thanks [@hstove](https://github.com/hstove)! - Adds changeset Github action

## 0.3.1

### Patch Changes

- b66cb90: Fixed - removed accounts from index file

## 0.3.0

### Minor Changes

- 7cf0c8f: Updates generated files for Clarinet unit test environments

## 0.2.4

### Patch Changes

- 4dd63d4: Fixed code not included in version

## 0.2.3

### Patch Changes

- 8b4467e: Fixed camelCasing, adds variables to abi

## 0.2.2

### Patch Changes

- c7273ce: Version bump to trigger deno push

## 0.2.1

### Patch Changes

- 0acb708: Changed the outputted file from CLI from 'single.ts' to 'index.ts'

## 0.2.0

### Minor Changes

- 185f6db: First version:

  - CLI to generate types
  - Type-friendly test runner
