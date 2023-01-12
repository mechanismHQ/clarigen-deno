;; Test contract for testing Clarigen

;; Generic error
(define-constant ERR_UNAUTHORIZED (err u400))
;; other error
(define-constant ERR_ZERO (err u0))

;; A map for storing stuff
(define-map demo-map { a: uint } bool)

(define-read-only (square (n uint)) (* n n))

(define-read-only (get-tup) {
  a: u1,
  bool-prop: true,
  tuple-prop: {
    sub-prop: "asdf"
  }
})

;; Test for type casting in TS
;; 
;; @param i; a tuple
;; with a key that has a dash in it
(define-read-only (merge-tuple (i { min-height: uint }))
  (merge i { max-height: u100000 })
)

(define-public (ret-error (with-err bool))
  (if with-err (err u1) (ok true))
)

;; Return a number
;; 
;; @param n; the number, of course
(define-public (num (n uint)) (ok n))

(define-public (complex-args
  (numba int)
  (opt-numba (optional int))
  (opt-unumba (optional uint))
  (buffa (buff 10))
  )
  (ok true)
)

(define-non-fungible-token names { name: (buff 48), namespace: (buff 20) })