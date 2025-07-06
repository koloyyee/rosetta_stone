
;; [628] Maximum Product of Three Numbers

(defn max-product-1 []
  (let [expected 39200
        arr  [-100 -98 -1 2 3 4]
        sorted-arr (sort arr)
        case1 (reduce * 1
                      (concat (take 2 sorted-arr) [(last sorted-arr)]))
        case2 (->> sorted-arr
                   (take-last 3)
                   (reduce * 1))
							 m (max case1 case2)]
			 (= expected m )))

(def expect 39200)
(def arr [-100 -98 -1 2 3 4])

(def sorted-arr (sort arr))

(def case1
  (let [neg-arr (concat (take 2 sorted-arr) [(last sorted-arr)])]
    (reduce * 1 neg-arr)))
(def case2
  (->> sorted-arr
       (take-last 3)
       (reduce * 1)))

(def m (max case1 case2))
(= expect m)



(max-product-1)

(def c1 (->> arr
             (sort)
             (first)
             (second)
             (last)))