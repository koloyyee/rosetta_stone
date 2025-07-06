
///usr/bin/env jbang "$0" "$@" ; exit $?


import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * "din" => "((("
 *
 * "recede" => "()()()"
 *
 * "Success" => ")())())"
 *
 * "(( @" => "))(("
 *
 * The goal of this exercise is to convert a string to a new string where each
 * character in the new string is "(" if that character appears only once in the
 * original string, or ")" if that character appears more than once in the
 * original string. Ignore capitalization when determining if a character is a
 * duplicate.
 */
public class DuplicateEncoder {

    public static void main(String... args) {
        check(")()())()(()()(", encode("Prespecialized"));
        check(")()())()(()()(", encodeForI("Prespecialized"));
        check(")()())()(()()(", encodeStream("Prespecialized"));
        check(")()())()(()()(", encodeForIn("Prespecialized"));
    }

    static String encode(String word) {
				Map<Character, Integer> wordMap = new HashMap<>();
        StringBuilder sb = new StringBuilder();
				var chars =  word.toLowerCase().toCharArray();
        for (char c : chars ) {
					wordMap.put(c, (wordMap.getOrDefault(c, 0) + 1) );
        }

				for ( char c : chars) {
					int count = wordMap.get(c);
					if (count > 1 ) {
						sb.append(")");
					}else {
						sb.append("(");
					}
				}

        return sb.toString();
    }
		static String encodeStream(String word) {
			return word
			.toLowerCase()
			.chars()
			// .peek( s -> out.println(s))
			.mapToObj(s -> String.valueOf((char) s))
			// .peek( s -> out.println(s))
			.map(c -> word.toLowerCase().lastIndexOf(c) == word.toLowerCase().indexOf(c) ? "(" : ")")
			.collect(Collectors.joining());
		}

		static String encodeForIn(String word) {
			word = word.toLowerCase();
			String result = "";
			for (char c : word.toCharArray()) {
				result += word.indexOf(c) == word.lastIndexOf(c) ? "(" : ")";
			}
			return result;
		}

		static String encodeForI(String word) {
			word = word.toLowerCase();
			String result = "";

			for (int i = 0; i < word.length(); i++) {
				char c = word.charAt(i);
				result += word.lastIndexOf(c) == word.indexOf(c) ? "(" : ")";
			}
			return result;
		}


    static boolean check(String expect, String actual) {
        System.out.println("expected: %s | actual: %s".formatted(expect, actual));
        var outcome = expect.equals(actual);
        System.out.println(outcome);
        return outcome;
    }
}
