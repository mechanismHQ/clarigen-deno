# tester

[`tester.clar`](../contracts/tester.clar)

Test contract for testing Clarigen

**Public functions:**

- [`ret-error`](#ret-error)
- [`num`](#num)
- [`complex-args`](#complex-args)

**Read-only functions:**

- [`square`](#square)
- [`get-tup`](#get-tup)
- [`merge-tuple`](#merge-tuple)

**Private functions:**

## Functions

### square

[View in file](../contracts/tester.clar#L7)

`(define-read-only (square ((n uint)) uint)`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (square (n uint)) (* n n))
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| n    | uint |             |

### get-tup

[View in file](../contracts/tester.clar#L9)

`(define-read-only (get-tup () (tuple (a uint) (bool-prop bool) (tuple-prop (tuple (sub-prop (string-ascii 4))))))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-tup) {
  a: u1,
  bool-prop: true,
  tuple-prop: {
    sub-prop: "asdf"
  }
})
```

</details>

### merge-tuple

[View in file](../contracts/tester.clar#L17)

`(define-read-only (merge-tuple ((i (tuple (min-height uint)))) (tuple (max-height uint) (min-height uint)))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (merge-tuple (i { min-height: uint }))
  (merge i { max-height: u100000 })
)
```

</details>

**Parameters:**

| Name | Type                      | Description |
| ---- | ------------------------- | ----------- |
| i    | (tuple (min-height uint)) |             |

### ret-error

[View in file](../contracts/tester.clar#L21)

`(define-public (ret-error ((with-err bool)) (response bool uint))`

<details>
  <summary>Source code:</summary>

```clarity
(define-public (ret-error (with-err bool))
  (if with-err (err u1) (ok true))
)
```

</details>

**Parameters:**

| Name     | Type | Description |
| -------- | ---- | ----------- |
| with-err | bool |             |

### num

[View in file](../contracts/tester.clar#L28)

`(define-public (num ((n uint)) (response uint none))`

Return a number

<details>
  <summary>Source code:</summary>

```clarity
(define-public (num (n uint)) (ok n))
```

</details>

**Parameters:**

| Name | Type | Description           |
| ---- | ---- | --------------------- |
| n    | uint | the number, of course |

### complex-args

[View in file](../contracts/tester.clar#L30)

`(define-public (complex-args ((numba int) (opt-numba (optional int)) (opt-unumba (optional uint)) (buffa (buff 10))) (response bool none))`

<details>
  <summary>Source code:</summary>

```clarity
(define-public (complex-args
  (numba int)
  (opt-numba (optional int))
  (opt-unumba (optional uint))
  (buffa (buff 10))
  )
  (ok true)
)
```

</details>

**Parameters:**

| Name       | Type            | Description |
| ---------- | --------------- | ----------- |
| numba      | int             |             |
| opt-numba  | (optional int)  |             |
| opt-unumba | (optional uint) |             |
| buffa      | (buff 10)       |             |
