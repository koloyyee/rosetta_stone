///usr/bin/env jbang "$0" "$@" ; exit $?

import static java.lang.System.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

public class ElectionWinners {

  public static void main(String[] args) {
    int[] votes = { 2, 3, 5, 2 };
    int k = 3;
    find(votes, k);
  }

  static int find(int[] votes, int k) {
    int max = IntStream.of(votes).max().orElse(0);
    if (k > 0) {
      return (int) IntStream.of(votes).filter(n -> n > max - k).count();
    }
    return IntStream.of(votes).filter(n -> n == max).count() == 1 ? 1 : 0;
  }
}
