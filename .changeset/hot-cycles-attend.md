---
"clarigen-deno": patch
---

You can now output multiple Clarigen generated type files. To do so,
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
