# counter

[`counter.clar`](../contracts/counter.clar)

counter let's get started with smart contracts

**Public functions:**

- [`increment`](#increment)
- [`decrement`](#decrement)

**Read-only functions:**

- [`read-counter`](#read-counter)

**Private functions:**

## Functions

### increment

[View in file](../contracts/counter.clar#L5)

`(define-public (increment ((step uint)) (response uint none))`

<details>
  <summary>Source code:</summary>

```clarity
(define-public (increment (step uint))
    (let ((new-val (+ step (var-get counter)))) 
        ;; #[allow(unchecked_data)]
        (var-set counter new-val)
        (print { object: "counter", action: "incremented", value: new-val })
        (ok new-val)))
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| step | uint |             |

### decrement

[View in file](../contracts/counter.clar#L12)

`(define-public (decrement ((step uint)) (response uint none))`

<details>
  <summary>Source code:</summary>

```clarity
(define-public (decrement (step uint))
    (let ((new-val (- (var-get counter) step))) 
        ;; #[allow(unchecked_data)]
        (var-set counter new-val)
        (print { object: "counter", action: "decremented", value: new-val })
        (ok new-val)))
```

</details>

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| step | uint |             |

### read-counter

[View in file](../contracts/counter.clar#L19)

`(define-read-only (read-counter () (response uint none))`

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-counter)
    (ok (var-get counter)))
```

</details>
