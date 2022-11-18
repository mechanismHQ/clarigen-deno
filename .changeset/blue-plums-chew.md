---
"clarigen-deno": patch
---

Fixed an issue with `clarigen --watch`, where the "file watcher" would be triggered multiple times in a row, where it should have been debounced.
