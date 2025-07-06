
/*
 * @lc app=leetcode id=628 lang=java
 *
 * [628] Maximum Product of Three Numbers
 *
 * https://leetcode.com/problems/maximum-product-of-three-numbers/description/
 *
 * algorithms
 * Easy (45.18%)
 * Likes:    4385
 * Dislikes: 705
 * Total Accepted:    411.7K
 * Total Submissions: 908.7K
 * Testcase Example:  '[1,2,3]'
 *
 * Given an integer array nums, find three numbers whose product is maximum and
 * return the maximum product.
 * 
 * 
 * Example 1:
 * Input: nums = [1,2,3]
 * Output: 6
 * Example 2:
 * Input: nums = [1,2,3,4]
 * Output: 24
 * Example 3:
 * Input: nums = [-1,-2,-3]
 * Output: -6
 * 
 * 
 * Constraints:
 * 
 * 
 * 3 <= nums.length <= 10^4
 * -1000 <= nums[i] <= 1000
 * 
 * 
 */
func maxProduct() {

 let expected = 39200
 let arr = [-100, -98, -1 , 2 ,3 ,4 ] 
 let sortedArr = arr.sorted()
 
let case1 = sortedArr.prefix(2).reduce(1, *) * sortedArr.last!
let case2 = sortedArr.suffix(3).reduce(1 , *);

let max = max(case1, case2)
print(max == expected)

}
maxProduct()