# clarigen-deno

## 0.5.5

### Patch Changes

- [`aaa12d6`](https://github.com/mechanismHQ/clarigen-deno/commit/aaa12d647d5d510fe45105b1a1db611e046a9901) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue where a project's requirements didn't have the correct contract identifier for simnet environment

## 0.5.4

### Patch Changes

- [`127a4ad`](https://github.com/mechanismHQ/clarigen-deno/commit/127a4ad0b2a975d062b4006237e41922f043c75d) Thanks [@hstove](https://github.com/hstove)! - Fixes an issue when running the Clarinet wrapper using externally-installed cli

## 0.5.3

### Patch Changes

- [`4904ab9`](https://github.com/mechanismHQ/clarigen-deno/commit/4904ab949d74f7d16a432e4687aafdba65a95b92) Thanks [@hstove](https://github.com/hstove)! - Fixes `clarigen init` command due to .toml files not being included from deno.land package manager

## 0.5.2

### Patch Changes

- [`868684c`](https://github.com/mechanismHQ/clarigen-deno/commit/868684c4cba2a8bae6ec066511483ebc0cb5348a) Thanks [@hstove](https://github.com/hstove)! - Fixes issues with ABI types when using conditionals to infer Clarity type

## 0.5.1

### Patch Changes

- [`174a74a`](https://github.com/mechanismHQ/clarigen-deno/commit/174a74a4d3e76a2ace4619766a0a3bdd8a48e2f8) Thanks [@hstove](https://github.com/hstove)! - Fixes an issue when getting contract variables/constants for project requirements

## 0.5.0

### Minor Changes

- [`22a2ea7`](https://github.com/mechanismHQ/clarigen-deno/commit/22a2ea78c02ddf83b5b20e0bb5d22ce93b9e4bd2) Thanks [@hstove](https://github.com/hstove)! - Updates the `ClarityAbiNonFungibleToken` type to include a JS-native type.

  Fixed an issue when fetching variables in projects that use requirements.

## 0.4.16

### Patch Changes

- [`50e8996`](https://github.com/mechanismHQ/clarigen-deno/commit/50e8996558ac3a04b70fb8f11ccad704c4def778) Thanks [@hstove](https://github.com/hstove)! - Updated `clarinet` deno package dependency to 1.3.1

## 0.4.15

### Patch Changes

- [`b73538d`](https://github.com/mechanismHQ/clarigen-deno/commit/b73538d985645987086f6ef8d91ca8c79b92df5c) Thanks [@hstove](https://github.com/hstove)! - The documentation generator has been updated to include maps and variables!

  Previously, generated docs only included functions. Now, all maps and variables are included as well. Additionally, if you include comments directly above any maps, variables, and constants, those comments will be parsed and included in generated documentation.

## 0.4.14

### Patch Changes

- [`d57411f`](https://github.com/mechanismHQ/clarigen-deno/commit/d57411ffae443611d1950c5b8546c2a6632835df) Thanks [@hstove](https://github.com/hstove)! - When building docs, excluded contracts are not included in the README

## 0.4.13

### Patch Changes

- [`e919d0a`](https://github.com/mechanismHQ/clarigen-deno/commit/e919d0a4162c39fbbcea5a82fb48a89a05a912ff) Thanks [@hstove](https://github.com/hstove)! - You can now output multiple Clarigen generated type files. To do so,
  use `outputs` with an array of paths, instead of `output`. Example:

  ```toml
  [esm]
  outputs = ["src/clarigen.ts", "other/types.ts"]
  ```

  You can also exclude specific contracts from having documentation generated. To do so, use the `exclude` (array) in your `Clarigen.toml`. Each entry in `exclude` should be the contract name - without file extensions or paths. Example:

  ```toml
  [docs]
  exclude = ["ft-trait"]
  ```

## 0.4.12

### Patch Changes

- [`02d7542`](https://github.com/mechanismHQ/clarigen-deno/commit/02d754272203c0fc2f2b20259d86bd19c9aa71fd) Thanks [@hstove](https://github.com/hstove)! - Export type "UnknownArgs"

## 0.4.11

### Patch Changes

- [`15a3f18`](https://github.com/mechanismHQ/clarigen-deno/commit/15a3f1878462255218168087e0accdf8b1beab5d) Thanks [@hstove](https://github.com/hstove)! - Updated `contractFactory` behavior - now all contract calls will have the full identifier - not just the contractName.

## 0.4.10

### Patch Changes

- [`ecce3ed`](https://github.com/mechanismHQ/clarigen-deno/commit/ecce3ed620097ace3ba62940daffd8852c83b852) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with `contractFactory`, where the contractName was wrong.

## 0.4.9

### Patch Changes

- [`cc58a0f`](https://github.com/mechanismHQ/clarigen-deno/commit/cc58a0f4483e7be314b9dcf17162a1b1791e00ff) Thanks [@hstove](https://github.com/hstove)! - Clarigen now outputs a "constants" property with each contract. This allows you to get the value for your constants from within the JS runtime.

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

## 0.4.8

### Patch Changes

- [`588876f`](https://github.com/mechanismHQ/clarigen-deno/commit/588876f7862a78f4fbb88cd9046a81eaef54782d) Thanks [@hstove](https://github.com/hstove)! - Adds a `deno.helper` configuration option. If present, a helper file will be generated, which includes helpful and common imports for Clarinet testing environments.

## 0.4.7

### Patch Changes

- [`7c9073e`](https://github.com/mechanismHQ/clarigen-deno/commit/7c9073eb668925377022256bdc13a6258aee9d04) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with `clarigen --watch`, where the "file watcher" would be triggered multiple times in a row, where it should have been debounced.

* [`fa41cd0`](https://github.com/mechanismHQ/clarigen-deno/commit/fa41cd0fe5e540b09c34eea179dc6db2b8ab0f13) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with contracts that have an NFT where the "key" is a tuple type

## 0.4.6

### Patch Changes

- [`6636047`](https://github.com/mechanismHQ/clarigen-deno/commit/66360473428f53887504032cfc7b210e237a32fa) Thanks [@hstove](https://github.com/hstove)! - When generating files, contracts are sorted by name. This prevents git changes due to the indeterminant way that Clarinet outputs contract order

## 0.4.5

### Patch Changes

- [`89ce01f`](https://github.com/mechanismHQ/clarigen-deno/commit/89ce01f44610a4f641dac4fbae0e97e4a9bb9469) Thanks [@hstove](https://github.com/hstove)! - - Fixed a bug where an error would throw if there was no `output` in the `esm` section of config
  - Added `chain.burnBlockHeight`

## 0.4.4

### Patch Changes

- [`3d737d0`](https://github.com/mechanismHQ/clarigen-deno/commit/3d737d0f24c0092f50459e02d4ecf8777cbc0a2f) Thanks [@hstove](https://github.com/hstove)! - Adds a top-level `mod.ts` file for easier imports

## 0.4.3

### Patch Changes

- Added a new `docs` command to the CLI! This will parse your contracts and automatically generate documentation for each of your contracts. Included in the docs are comments and rich type information.

- [`daaf0b5`](https://github.com/mechanismHQ/clarigen-deno/commit/daaf0b58f88e68413aa15120b67ee67310b719f7) Thanks [@hstove](https://github.com/hstove)! - Internally updated to Clarinet v1!

* [`daaf0b5`](https://github.com/mechanismHQ/clarigen-deno/commit/daaf0b58f88e68413aa15120b67ee67310b719f7) Thanks [@hstove](https://github.com/hstove)! - Updated the types for `rovOk` and `rovErr` to properly throw type errors if the function doesn't return a `response`

## 0.4.2

### Patch Changes

- [`4055962`](https://github.com/mechanismHQ/clarigen-deno/commit/4055962941a091ab12bbdd256be5629e803ba542) Thanks [@hstove](https://github.com/hstove)! - Adds `tx*` helpers to `Chain` for simpler DX

## 0.4.1

### Patch Changes

- [`420cd6c`](https://github.com/mechanismHQ/clarigen-deno/commit/420cd6cd21dc6ce5675d77855ef113fb9be726ba) Thanks [@hstove](https://github.com/hstove)! - Adds `--watch` option to main CLI command

* [`420cd6c`](https://github.com/mechanismHQ/clarigen-deno/commit/420cd6cd21dc6ce5675d77855ef113fb9be726ba) Thanks [@hstove](https://github.com/hstove)! - Includes accounts, deployment IDs with ESM

- [`db95d1c`](https://github.com/mechanismHQ/clarigen-deno/commit/db95d1c83af511d1faef905e9c5d87fb19214d19) Thanks [@hstove](https://github.com/hstove)! - Added `simnet` export to ESM, if `include_accounts` is configured.

## 0.4.0

### Minor Changes

- [`52d697e`](https://github.com/mechanismHQ/clarigen-deno/commit/52d697e7188b40d9e2df7faa4b449420444aee41) Thanks [@hstove](https://github.com/hstove)! - Clarigen now comes with a fully-featured CLI, powered by Deno and Clarinet

### Patch Changes

- [`555b763`](https://github.com/mechanismHQ/clarigen-deno/commit/555b76332ecf26153f02488f12ad47704f5ef48a) Thanks [@hstove](https://github.com/hstove)! - Fixed an issue with clarinet scripts importing Cliffy modules

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
