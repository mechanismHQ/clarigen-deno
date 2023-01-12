# counter

[`counter.clar`](../contracts/counter.clar)

The counter contract maintains a single global counter variable. Users can
change the counter by calling `increment` and `decrement`.

**Public functions:**

- [`increment`](#increment)
- [`decrement`](#decrement)

**Read-only functions:**

- [`get-counter`](#get-counter)

**Private functions:**

**Maps**

**Variables**

- [`counter`](#counter)

**Constants**

- [`test-buff`](#test-buff)
- [`buff-const`](#buff-const)
- [`ERR_TEST`](#ERR_TEST)

## Functions

### get-counter

[View in file](../contracts/counter.clar#L9)

`(define-read-only (get-counter () uint)`

Get the current counter

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-counter)
  (var-get counter)
)
```

</details>

### increment

[View in file](../contracts/counter.clar#L22)

`(define-public (increment ((step uint)) (response uint none))`

Increment the counter.

@returns the new value of the counter

<details>
  <summary>Source code:</summary>

```clarity
(define-public (increment (step uint))
  (let (
    (new-val (+ step (var-get counter)))
  ) 
  ;; #[allow(unchecked_data)]
  (var-set counter new-val)
  (print { object: "counter", action: "incremented", value: new-val })
  (ok new-val))
)
```

</details>

**Parameters:**

| Name | Type | Description                             |
| ---- | ---- | --------------------------------------- |
| step | uint | The interval to increase the counter by |

### decrement

[View in file](../contracts/counter.clar#L35)

`(define-public (decrement ((step uint)) (response uint none))`

Decrement the counter

<details>
  <summary>Source code:</summary>

```clarity
(define-public (decrement (step uint))
  (let (
    (new-val (- (var-get counter) step))
  ) 
  ;; #[allow(unchecked_data)]
  (var-set counter new-val)
  (print { object: "counter", action: "decremented", value: new-val })
  (ok new-val))
)
```

</details>

**Parameters:**

| Name | Type | Description                             |
| ---- | ---- | --------------------------------------- |
| step | uint | The interval to increase the counter by |

## Maps

## Variables

### counter

uint

The variable used to hold the global counter.

```clarity
(define-data-var counter uint u1)
```

[View in file](../contracts/counter.clar#L6)

## Constants

### test-buff

```clarity
(define-constant test-buff (buff-to-uint-be 0xdeadbeef))
```

[View in file](../contracts/counter.clar#L13)

### buff-const

```clarity
(define-constant buff-const 0xdeadbeef)
```

[View in file](../contracts/counter.clar#L14)

### ERR_TEST

```clarity
(define-constant ERR_TEST (err u123))
```

[View in file](../contracts/counter.clar#L15)
