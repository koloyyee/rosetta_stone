(ns len-of-last-word
  (:require
   [clojure.string :as str]))

(def s " fly  me to the moon ")

;; (defn len-of-last-word
;;   [^String s]
;;   (->> s
;;        (str/trim)
;;        (#(str/split % #"\s+"))
;;        last
;;        count))
(defn len-of-last-word [s]
  (-> s
      (str/split #"\s+")
      last
      count))

(println (len-of-last-word s))