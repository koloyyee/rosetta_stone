
///usr/bin/env jbang "$0" "$@" ; exit $?


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

/**
 * Basic unix commands without Picocli yet.
 */
public class cmds {

    static Map<String, Consumer<String>> commands = new HashMap<>();

    public static void main(String... args) {
        commands.put("cat", cmds::cat);
        commands.put("ls", cmds::ls);
        commands.put("grep", cmds::grep);

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

        Path dirPath = Paths.get(System.getProperty("user.dir"), filename);
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

        Path cwd = Paths.get(System.getProperty("user.dir"));
        Path targetPath = cwd.resolve(dir).normalize();

        try (var fileStream = Files.list(targetPath)) {
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

            Path cwd = Paths.get(System.getProperty("user.dir"));
            Path path = cwd.resolve(filename).normalize(); // not checking

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
}
