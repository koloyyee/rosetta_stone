
///usr/bin/env jbang "$0" "$@" ; exit $?


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * Basic unix commands without Picocli yet.
 */
public class cmds {

    static Map<String, Consumer<String>> commands = new HashMap<>();

    public static void main(String... args) {
        commands.put("cat", cmds::cat);
        commands.put("ls", cmds::ls);
        commands.put("grep", cmds::grep);
        commands.put("less", cmds::less);
        commands.put("head", cmds::head);
        commands.put("wc", cmds::wc);

        if (args.length < 2) {
            System.err.println("Usage: cmd <command> [arguments]");
        }

        var command = args[0];

        String subcommand;
        String arg;

        if (args.length == 3) {
            subcommand = args[1];
            arg = subcommand + " " + args[2];
        } else {
            arg = args[1];
        }

        if (commands.containsKey(command)) {
            commands.get(command).accept(arg);
        }

    }

    static void cat(String arg) {

        String[] splittedArg = arg.split(" ");
        String filename = splittedArg.length > 1 ? splittedArg[1] : arg;

        Path dirPath = getFile(filename);
        if (Files.exists(dirPath)) {

            try {
                String content = Files.readString(dirPath);
                System.out.println(content);
            } catch (IOException e) {
                System.err.println(e);
            }
        }
    }

    static void ls(String arg) {

        var splittedArg = arg.split(" ");
        String dir;
        String subcommand = null;

        if (splittedArg.length == 2) {
            subcommand = splittedArg[0];
            dir = splittedArg[1];
        } else {
            dir = arg;
        }

        Path path = getFile(dir);

        try (var fileStream = Files.list(path)) {
            var dirContent = fileStream.toList();
            for (var content : dirContent) {
                if (subcommand != null && subcommand.equals("-a")) {
                    System.out.println(content.getFileName());
                } else if (subcommand == null && !content.getFileName().toString().startsWith(".")) {
                    System.out.println(content.getFileName());
                } else {
                    throw new RuntimeException("we only support ls or ls -a.");
                }
            }
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }

    static void grep(String arg) {
        try {
            var splittedArg = arg.split(" ");
            if (splittedArg.length < 2) {
                throw new RuntimeException("missing word or filename");
            }

            String word = splittedArg[0];
            String filename = splittedArg[1];

            Path path = getFile(filename);

            var lines = Files.readAllLines(path);
            for (var line : lines) {
                if (line.contains(word)) {
                    System.out.println(line);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * arg - (subcommand) + filename less 10 cmd.java - last 10 lines of the
     * file.
     */
    static void less(String arg) {
        var splittedArg = arg.split(" ");
        var linesCount = 5;
        var filename = "";

        if (splittedArg.length > 1) {
            linesCount = Integer.parseInt(splittedArg[0]);
            filename = splittedArg[1];
        } else {
            filename = splittedArg[0];
        }

        Path filePath = getFile(filename);

        try {
            var lines = Files.readAllLines(filePath.getFileName());
            lines.subList(Math.max(0, lines.size() - linesCount), lines.size())
                    .forEach(System.out::println);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * head - head filename first n lines of the file
     */
    static void head(String arg) {

        var splittedArg = arg.split(" ");
        var linesCount = 5;
        var filename = "";

        if (splittedArg.length > 1) {
            linesCount = Integer.parseInt(splittedArg[0]);
            filename = splittedArg[1];
        } else {
            filename = splittedArg[0];
        }

        Path filePath = getFile(filename);
        try {
            var lines = Files.readAllLines(filePath.getFileName());
            lines.subList(0, linesCount)
                    .forEach(System.out::println);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static void wc(String args) {
        var filename = "";
        var subcommand = "";
        String[] splittedArgs = args.split(" ");

        if (splittedArgs.length > 1) {
            subcommand = splittedArgs[0];
            filename = splittedArgs[1];
        } else {
            filename = splittedArgs[0];
        }
        Path path = getFile(filename);
        if (Files.exists(path)) {
            try {
                var linesCount = Files.readAllLines(path).size();
                var wordCount = new StringTokenizer(Files.readAllLines(path).stream().collect(Collectors.joining())).countTokens();
                var byteCount = Files.size(path);

                switch(subcommand) {
                    case "-l" ->  {
                        System.out.println("%d lines.".formatted(linesCount));
                    }
                    case "-w" ->  {
                        System.out.println("%d words.".formatted(wordCount));
                    }
                    case "-b" ->  {
                        System.out.println("%d bytes.".formatted(byteCount));
                    }
                    default -> {
                        System.out.println("%d  %d  %d".formatted(linesCount, wordCount, byteCount));
                    }
                }

            } catch (IOException e) {
                System.err.println(e.getMessage());
            }
        }
    }

    private static Path getFile(String filename) {

        Path cwd = Path.of(System.getProperty("user.dir"));
        Path filePath = cwd.resolve(filename).normalize();
        return filePath;
    }
}
