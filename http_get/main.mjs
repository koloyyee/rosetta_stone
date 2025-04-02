
function main() {
	fetch("https://dummyjson.com/users/1")
	.then(resp => {
		console.log(resp.status)
		return resp.json()
	}).then((data) => {
		console.log(data)
	})
}
main();