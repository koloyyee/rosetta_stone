
import java.util.Arrays;

///usr/bin/env jbang "$0" "$@" ; exit $?

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
public class MaxProduct {

    public static void main(String[] args) {
        /**
         * if the arr [-100, -98, -1, 2 , 3 , 4 ]
         *
         * sort the array first, scenario 1: array starts with negative, then
         * the product of the first 2 will be a larger positive, then take the
         * product of the first 2 and multiply by the last element
         *
         * scenario 2: just takes the last 3 elements and get the product.
         *
         * We don't need to know the whether the element start with negative or
         * not all we need is to make sure it is sorted, then we compare the 2
         * scenario's product, get the larger one.
         */
        int expected = 39200;
        int[] arr = new int[]{-100, -98, -1, 2, 3, 4};

        Arrays.sort(arr);
        int len = arr.length;
        int case1 = arr[0] * arr[1] * arr[len - 1];
        int case2 = arr[len - 1] * arr[len - 2] * arr[len - 3];

        int max = Integer.max(case1, case2);

        System.out.println(max == expected);

    }
}
