(def strng "abcd")
(def array [0 3 1 2])
(def expected "acdb")

(require '[clojure.string :as str] )
(defn scramble [strng array]
  (->> (map vector strng array)
       (sort-by second)
   	   (map first)
   	   (str/join "")))

(= expected (scramble strng array))
