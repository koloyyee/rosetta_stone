(ns main
  (:require
   [babashka.http-client :as http]))

(defn -main [& args]
  (try 
   	(let [resp (http/get "https://dummyjson.com/users/1")]
						(println "Status:" (:status resp) )
						(println "Body:" (:body resp) ))
		(catch Exception e
 		 (println "Error:" (str e) ))))
(-main)


;; to run -> bb main.clj