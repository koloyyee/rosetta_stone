func countArare(_ n: Int) -> String {

	guard n > 0 else { return "" }

	var pairs = Array(repeating: "adak", count: n / 2)
	if n % 2 == 1 { pairs.append("anane") }
	return pairs.joined(separator: " ")
}

var ans = countArare(8)
print(ans)
assert(ans == "adak adak adak adak")

ans = countArare(7)
assert(ans == "adak adak adak anane")
