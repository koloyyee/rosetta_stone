
///usr/bin/env jbang "$0" "$@" ; exit $?


import java.util.ArrayList;
import java.util.List;

public class SummaryRange {

    public static void main(String... args) {
        var nums = new int[]{0, 2, 3, 4, 5, 7};
        var expected = List.of("0->2", "4->5", "7");

        var actual = summaryRanges(nums);
        System.out.println(actual);
    }

    static public List<String> summaryRanges(int[] nums) {

        List<String> ans = new ArrayList<>();
        if (nums.length == 0) {
            return ans;
        }

        int start = nums[0];
        for (int endPtr = 1; endPtr <= nums.length; endPtr++) {
            // check if the element increment is continuous
            // not continuous  [0, 1, 3], 0 is startptr, 1 is endptr, 3 is endptr + 1
            if (endPtr == nums.length || nums[endPtr] != nums[endPtr - 1] + 1) {

                if (start == nums[endPtr - 1]) {
                    ans.add(String.valueOf(start));
                } else {
                    ans.add(start + "->" + nums[endPtr]);
                }
                if (endPtr < nums.length) {
                    start = nums[endPtr];
                }

            }

        }

        return ans;
    }

}
