package main


import ( 
	"net/http" 
	    "io/ioutil"
	"fmt" 
)

func main() {
	resp, err := http.Get("https://dummyjson.com/users/1")
	if err != nil {
			fmt.Println("Error:", err)
			return
	}
	defer resp.Body.Close()
	
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body: ", err)
		return
	}

	bodyString := string(bodyBytes)
	fmt.Println("Response Body: ", bodyString)
}

// to run -> go run main.go