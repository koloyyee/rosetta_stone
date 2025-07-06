(defn unique-in-order [input]
  (dedupe input))

(unique-in-order [0 0 0 0 1 1 1 2 2 0 0 1 1 1])


(= (unique-in-order [1 2 3]), [1 2 3])
(= (unique-in-order "ABC"), [\A \B \C])
(= (unique-in-order '(1 2 3)), [1 2 3])
(= (unique-in-order [0 0 0 0 1 1 1 2 2 0 0 1 1 1]) [0 1 2 0 1])
(= (unique-in-order "AAAABBBCCDAABBB") [\A \B \C \D \A \B])



(defn unique-in-order-2 [input]
  (reduce #(if (= (peek %1) %2)
             %1
             (conj %1 %2)) [] input))

(= (unique-in-order-2 [1 2 3]), [1 2 3])
(= (unique-in-order-2 "ABC"), [\A \B \C])
(= (unique-in-order-2 '(1 2 3)), [1 2 3])
(= (unique-in-order-2 [0 0 0 0 1 1 1 2 2 0 0 1 1 1]) [0 1 2 0 1])
(= (unique-in-order-2 "AAAABBBCCDAABBB") [\A \B \C \D \A \B])


(defn unique-in-order-3 [input]
  (mapcat set ( partition-by identity input)))

(def input [ 3 3 1 1 1 1  2 2  ])

(mapcat set (partition-by identity input))