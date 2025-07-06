
///usr/bin/env jbang "$0" "$@" ; exit $?
/// 


/*
 * @lc app=leetcode id=88 lang=java
 *
 * [88] Merge Sorted Array
 *
 * https://leetcode.com/problems/merge-sorted-array/description/
 *
 * algorithms
 * Easy (48.89%)
 * Likes:    15392
 * Dislikes: 2040
 * Total Accepted:    3.7M
 * Total Submissions: 7.2M
 * Testcase Example:  '[1,2,3,0,0,0]\n3\n[2,5,6]\n3'
 *
 * You are given two integer arrays nums1 and nums2, sorted in non-decreasing
 * order, and two integers m and n, representing the number of elements in
 * nums1 and nums2 respectively.
 * 
 * Merge nums1 and nums2 into a single array sorted in non-decreasing order.
 * 
 * The final sorted array should not be returned by the function, but instead
 * be stored inside the array nums1. To accommodate this, nums1 has a length of
 * m + n, where the first m elements denote the elements that should be merged,
 * and the last n elements are set to 0 and should be ignored. nums2 has a
 * length of n.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
 * Output: [1,2,2,3,5,6]
 * Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
 * The result of the merge is [1,2,2,3,5,6] with the underlined elements coming
 * from nums1.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: nums1 = [1], m = 1, nums2 = [], n = 0
 * Output: [1]
 * Explanation: The arrays we are merging are [1] and [].
 * The result of the merge is [1].
 * 
 * 
 * Example 3:
 * 
 * 
 * Input: nums1 = [0], m = 0, nums2 = [1], n = 1
 * Output: [1]
 * Explanation: The arrays we are merging are [] and [1].
 * The result of the merge is [1].
 * Note that because m = 0, there are no elements in nums1. The 0 is only there
 * to ensure the merge result can fit in nums1.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * nums1.length == m + n
 * nums2.length == n
 * 0 <= m, n <= 200
 * 1 <= m + n <= 200
 * -10^9 <= nums1[i], nums2[j] <= 10^9
 * 
 * 
 * 
 * Follow up: Can you come up with an algorithm that runs in O(m + n) time?
 * 
 */

import java.util.Arrays;

public class MergeSortedArray {

    public static void main(String[] args) {
        var n1 = new int[]{1, 2, 3, 0, 0, 0};
        var m = 3;
        var n2 = new int[]{2, 5, 6};
        var n = 3;

        merge(n1, m, n2, n);
    }

    static void merge(int[] nums1, int m, int[] nums2, int n) {
        // m is the number of elements, it will also be the starting point.
        for (int i = m, j = 0; i < nums1.length && j < n; i++) {
            // m is the index of the last element without value in nums1
            // n is the boundary for nums2
            nums1[i] = nums2[j];
            /**
             * nums1 [1, 2, 3, 0 ,0 0] nums2 [2, 5, 6] m 3 <- counts of elems
             * with value in nums1 n 3 <- counts of elems in nums2
             */
            // when i is m = 3 = 0, j is 0 = 2 
            j++;
        }
        Arrays.sort(nums1);
        for (var num : nums1) {
            System.out.println(num);
        }
    }
}
