(defn leap-year?
  "Checks whether a given year is a leap year"
  [year]
  (cond
    (zero? (mod year 400)) true
    (zero? (mod year 100)) false
    (zero? (mod year 4)) true
    :else false))

(leap-year? 100)