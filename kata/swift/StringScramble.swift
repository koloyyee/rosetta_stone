let strng = "abcd"
let array = [0, 3, 1, 2]
let expected = "acdb"

func scramble(_ strng: String,_ array: [Int]) -> String {
	var ans : [String] = Array(repeating: "", count: strng.count)
	for (c, idx) in zip(strng, array) {
		ans[idx] = String(c)
	}
	return ans.joined(separator: "")
}
print( expected == scramble(strng, array))