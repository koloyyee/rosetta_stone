///usr/bin/env jbang "$0" "$@" ; exit $?


public class LengthOfLastWord {
    public static void main(String... args) {
        var s = "  fly me  to the moon";
        System.out.println(lengthOfLastWord(s));
    }

    static int lengthOfLastWord(String s ) {
        s = s.trim();
        return s.length() - s.lastIndexOf(' ') - 1;
    }
}
