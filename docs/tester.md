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

**Maps**

- [`demo-map`](#demo-map)

**Variables**

**Constants**

- [`ERR_UNAUTHORIZED`](#ERR_UNAUTHORIZED)
- [`ERR_ZERO`](#ERR_ZERO)

## Functions

### square

[View in file](../contracts/tester.clar#L11)

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

[View in file](../contracts/tester.clar#L13)

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

[View in file](../contracts/tester.clar#L25)

`(define-read-only (merge-tuple ((i (tuple (min-height uint)))) (tuple (max-height uint) (min-height uint)))`

Test for type casting in TS

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (merge-tuple (i { min-height: uint }))
  (merge i { max-height: u100000 })
)
```

</details>

**Parameters:**

| Name | Type                      | Description                              |
| ---- | ------------------------- | ---------------------------------------- |
| i    | (tuple (min-height uint)) | a tuple with a key that has a dash in it |

### ret-error

[View in file](../contracts/tester.clar#L29)

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

[View in file](../contracts/tester.clar#L36)

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

[View in file](../contracts/tester.clar#L38)

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

## Maps

### demo-map

A map for storing stuff

```clarity
(define-map demo-map { a: uint } bool)
```

[View in file](../contracts/tester.clar#L9)

## Variables

## Constants

### ERR_UNAUTHORIZED

Generic error

```clarity
(define-constant ERR_UNAUTHORIZED (err u400))
```

[View in file](../contracts/tester.clar#L4)

### ERR_ZERO

other error

```clarity
(define-constant ERR_ZERO (err u0))
```

[View in file](../contracts/tester.clar#L6)
