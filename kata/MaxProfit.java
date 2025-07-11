
///usr/bin/env jbang "$0" "$@" ; exit $?

/*
 * @lc app=leetcode id=121 lang=java
 *
 * [121] Best Time to Buy and Sell Stock
 *
 * https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/
 *
 * algorithms
 * Easy (53.49%)
 * Likes:    31545
 * Dislikes: 1196
 * Total Accepted:    5.3M
 * Total Submissions: 9.8M
 * Testcase Example:  '[7,1,5,3,6,4]'
 *
 * You are given an array prices where prices[i] is the price of a given stock
 * on the i^th day.
 * 
 * You want to maximize your profit by choosing a single day to buy one stock
 * and choosing a different day in the future to sell that stock.
 * 
 * Return the maximum profit you can achieve from this transaction. If you
 * cannot achieve any profit, return 0.
 * 
 * 
 * Example 1:
 * 
 * 
 * Input: prices = [7,1,5,3,6,4]
 * Output: 5
 * Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit
 * = 6-1 = 5.
 * Note that buying on day 2 and selling on day 1 is not allowed because you
 * must buy before you sell.
 * 
 * 
 * Example 2:
 * 
 * 
 * Input: prices = [7,6,4,3,1]
 * Output: 0
 * Explanation: In this case, no transactions are done and the max profit =
 * 0.
 * 
 * 
 * 
 * Constraints:
 * 
 * 
 * 1 <= prices.length <= 10^5
 * 0 <= prices[i] <= 10^4
 * 
 * 
 */
public class MaxProfit {

    public static void main(String... args) {
        int profit = maxProfit(new int[]{7, 1, 5, 3, 6, 4});
        System.out.println(profit);
    }

    static int maxProfit(int[] prices) {
        // Store lowest and profit then find the highest
        // Get the difference as profit
        int buyPrice = prices[0];
        int profit = 0;

        for (int sellIdx = 1; sellIdx < prices.length; sellIdx++) {

            // make sure buyPrice is the lowest
            if (buyPrice > prices[sellIdx]) {
                buyPrice = prices[sellIdx];
            }
            // using max to find which is bigger, update profit with the value
            profit = Math.max(profit, prices[sellIdx] - buyPrice);
        }

        return profit;
    }
}
