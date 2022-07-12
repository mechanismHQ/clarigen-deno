
;; tester
;; <add a description here>

;; constants
;;

;; data maps and vars
;;

;; private functions
;;

;; public functions
;;

(define-read-only (square (n uint)) (* n n))

(define-read-only (get-tup) {
  a: u1,
  bool-prop: true,
  tuple-prop: {
    sub-prop: "asdf"
  }
})

(define-read-only (merge-tuple (i { min-height: uint }))
  (merge i { max-height: u100000 })
)

(define-public (ret-error (with-err bool))
  (if with-err (err u1) (ok true))
)

(define-public (num (n uint)) (ok n))