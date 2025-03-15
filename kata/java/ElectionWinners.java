///usr/bin/env jbang "$0" "$@" ; exit $?

import static java.lang.System.*;

import java.util.ArrayList;
import java.util.List;

public class ElectionWinners {

  public static void main(String[] args) {
    int[] votes = { 2, 3, 5, 2 };
    int k = 3;
    find(votes, k);
  }

  static int find(final int[] votes, final int k) {

    List<Integer> winners = new ArrayList<>();

    int winner = 0;
    int secondup = 0;

    for (int i = 1; i < votes.length; i++) {
      if()
    }
    out.println(winners.size());
    return 0;
  }
}
