(ns cmd
  (:require
   [clojure.java.io :as io]
   [clojure.string :as str]))


(defn read-content  "Display content of a file."
  [filename]
  (let [file (str (.getCanonicalPath (io/file "./src")) "/" filename)]
    (if (.exists (io/file file))
      (println (slurp file))
      (println (str "File not found: " filename)))))


(defn list-dir "List current directories."
  [dir & [subcommand]]
  (let [directory (io/file (or dir "."))]
    (doseq [folder (.listFiles directory)]
      (let [item (.getName folder)]
        (if (= subcommand "-a")
          (println item)
          (when-not (.startsWith item ".")
            (println item)))))))


(defn grep-word "Grep the line with target string."
  ;; [word filename]
  [args]
  (if (< (count args) 2)
    (println "Usage: grep <word> <filename>")
    (let [[word filename] [(first args) (second args)]
          file (io/file  filename)]
      (if (.exists  file)
         ;; (doseq [line (filter (fn [line] (str/includes? line word)) (str/split-lines (slurp file)))]
        (->> file
             slurp
             str/split-lines
             (filter #(str/includes? % word))
             (run! println))
        (println "file doesn't exist."  filename)))))


(defn tail
  "tail n lines file"
  [args]
  (let [args-count (count args)
        filename (if (>=  args-count  2) (second args) (first args))
        n-lines (if (>= args-count 2) (Integer/parseInt (first args)) 5)
        file (io/file filename)]
    (if (.exists file)
      (->> file
           slurp
           (str/split-lines)
           (take-last n-lines)
           (run! println))
      (println "File" filename "doesn't exists."))))

(defn sort-lines
  "sort [-r] filename
 -r for reverse sort"
  [args]
  ; get all the lines, create a new ordered seq
  (let [[flag filename] (if (> (count args) 1)
                          [(first args) (second args)]
                          [nil (first args)])
        file (io/file filename)]
    (if (.exists file)
      (let [lines (str/split-lines (slurp file))
            sorted-lines (cond
                           (= flag "-r") (sort #(compare %2 %1) lines)
                           :else
                           (sort lines))]
        (doseq [line sorted-lines]
          (println line)))
      (println "File" filename "doesn't exist."))))

(def cmds {:cat read-content :ls list-dir :grep grep-word :tail tail :sort sort-lines})

(defn -main [& args]
  (let [cmd-name (first args)
        cmd-key (when cmd-name (keyword cmd-name))
        cmd (get cmds cmd-key)]
    (cond
      ;; grep command (grep word file)
      ;; (and (= cmd-key :grep) (>= (count args) 3))
      ;; (cmd (second args) (last args))
      (= cmd-key :grep)
      (grep-word (rest args))

      ;; ls -a command (ls -a directory)
      (and (= cmd-key :ls) (>= (count args) 3))
      (cmd (nth args 2) (second args))

      (= cmd-key :tail)
      (tail (rest args))
      (= cmd-key :sort)
      (sort-lines (rest args))
      ;; ls command
      ;; cat command 
      (and cmd (second args) (< (count args) 3))
      (cmd (second args))
      :else
      (println "Usage: cmd <command> [arguments]" cmd))))