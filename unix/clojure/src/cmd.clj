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
  [word filename]
  (let [file (io/file  filename)]
    (if (.exists  file)
      (doseq [line (filter (fn [line] (str/includes? line word)) (str/split-lines (slurp file)))]
        (println line))
      (println "file doesn't exist." (.getAbsolutePath file)))))




(def cmds {:cat read-content :ls list-dir :grep grep-word})

(defn -main [& args]
  (let [cmd-name (first args)
        cmd-key (when cmd-name (keyword cmd-name))
        cmd (get cmds cmd-key)]
    (cond
      ;; grep command (grep word file)
      (and (= cmd-key :grep) (>= (count args) 3))
      (cmd (second args) (last args))

      ;; ls -a command (ls -a directory)
      (and (= cmd-key :ls) (>= (count args) 3))
      (cmd (nth args 2) (second args))

      ;; ls command
      ;; cat command 
      (and cmd (second args) (< (count args) 3))
      (cmd (second args))
      :else
      (println "Usage: cmd <command> [arguments]" cmd))))