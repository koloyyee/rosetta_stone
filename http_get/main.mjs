
function main() {
	fetch("https://dummyjson.com/users/1")
	.then(resp => {
		console.log("Status: " , resp.status)
		return resp.json()
	}).then((data) => {
		console.log("Body: " , data)
	})
}
main();

// to run -> node main.mjs