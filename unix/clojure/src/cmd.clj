(ns cmd
  (:require
   [clojure.java.io :as io]
   [clojure.string :as str]))


(defn read-content  "Display content of a file."
  [filename]
  (let [file (str (.getCanonicalPath (io/file "./src")) "/" filename)]
    (println file)
    (if (.exists (io/file file))
      (println (slurp file))
      (println (str "File not found: " filename)))))

(defn list-dir "List current directories."
  [dir]
	(let [directory (io/file (or dir "."))]
   (doseq [ folder (.listFiles directory)]
     (let [dir-name (.getName folder)]
    		 (when ( not (str/includes?  dir-name "."))
 						  (println dir-name))))))

				

(def cmds {:cat read-content, :ls list-dir})

(defn -main [& args]
  (let [cmd-name (first args)
        filename (second args)
        cmd (when cmd-name
              (get cmds (keyword cmd-name)))]
    (if (and cmd filename)
      (cmd filename)
      (println "Unknown command:" cmd))))