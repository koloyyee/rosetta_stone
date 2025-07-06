function maxProduct() {
	let expected = 39200;
	let arr = [-100, -98, -1, 2, 3, 4];

	const sorted = arr.sort((a, b) => a - b);

	const len = sorted.length;
	const case1 = sorted[0] * sorted[1] * sorted[len - 1];
	const case2 = sorted[len - 1] * sorted[len - 2] * sorted[len - 3];

	const max = Math.max(case1, case2);
	console.log(max === expected);
}
maxProduct();
