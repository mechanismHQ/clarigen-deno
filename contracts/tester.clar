
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
  b: true,
  c: {
    d: "asdf"
  }
})

(define-public (ret-error (with-err bool))
  (if with-err (err u1) (ok true))
)

(define-public (num (n uint)) (ok n))