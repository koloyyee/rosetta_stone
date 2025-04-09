
///usr/bin/env jbang "$0" "$@" ; exit $?


import java.util.Arrays;
import java.util.stream.IntStream;

public class CreatePhoneNumber{

    public static void main(String... args) {

         System.out.println("(123) 456-7890".equals(CreatePhoneNumber.createPhoneNumber(new int[] {1, 2, 3, 4, 5, 6, 7, 8, 9, 0})));
    }

    public static String createPhoneNumber(int[] numbers) {
        var nums = IntStream.of(numbers).boxed().toArray();
        Object[] x = { 1 ,2 };
        return String.format("(%d%d%d) %d%d%d-%d%d%d%d", nums);
    }

    public static long newAvg(double[] arr, double navg) {
        double sum = Arrays.stream(arr).sum();
        double result = navg * (arr.length + 1) - sum;
        if (result > 0) {
            return Math.round(Math.ceil(result));
        } else {
            throw new IllegalArgumentException();
        }
    }

    static int electionWinners(int[] votes, int k) {
        int max = IntStream.of(votes).max().orElse(0);
        if (k > 0) {
            return (int) IntStream.of(votes).filter(n -> n > max - k).count();
        }
        return IntStream.of(votes).filter(n -> n == max).count() == 1 ? 1 : 0;
    }
}
