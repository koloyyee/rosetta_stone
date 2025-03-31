(ns newaverage.core
  (:require
   [clojure.test :refer [deftest is testing]]))

(defn new-avg-1 [arr navg]
  (let [sum (apply + arr)
        result (- (* navg (inc (count arr))) sum)]
    (if (> result 0) (Math/round (Math/ceil result))
        (throw (IllegalArgumentException. "something bad happened.")))))
(defn new-avg [arr navg]
  (-> arr
      (count)
      (inc)
      (* navg)
      (- (apply + arr))
      (Math/ceil)
      (int)
      (#(if (neg? %) (throw (IllegalArgumentException. "")) %))))

(def arr [14, 30, 5, 7, 9, 11, 16])
(def navg 90)
(def expected 628)
(count arr)
(- (* navg (+ 1 (count arr))) (apply + arr))

(defn test-assert [act exp]
  (is (= act exp)))

(deftest a-test1
  (testing "new-avg"
    (test-assert (new-avg [14, 30, 5, 7, 9, 11, 16] 90) 628)
    (test-assert (new-avg [14, 30, 5, 7, 9, 11, 15] 92) 645)
    (is (thrown? IllegalArgumentException (new-avg [14, 30, 5, 7, 9, 11, 15] 2)))))
(a-test1)

(test-assert (new-avg [14, 30, 5, 7, 9, 11, 16] 90) 628)

(test-assert (new-avg [14, 30, 5, 7, 9, 11, 15] 92) 645)
(is (thrown? IllegalArgumentException (new-avg [14, 30, 5, 7, 9, 11, 15] 2)))
(new-avg [14, 30, 5, 7, 9, 11, 15] 2)