
///usr/bin/env jbang "$0" "$@" ; exit $?

import java.util.Arrays;

public class NewAverage {

    public static void main(String... args) {

        double[] a = new double[]{546.0, 84.0, 84.0, 441.0, 406.0, 651.0};
        double expected = 314042;
        double actual = NewAverage.newAvg(a, 316.0);

        System.out.println(expected + "\n" + actual);
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
}
