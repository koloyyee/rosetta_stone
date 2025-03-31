package co.loyyee;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.DelayQueue;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

/**
 * Directory watcher mechanism, spying changes of a particular directory.
 *
 * 2 kinds: 1. from ~ or $HOME and a particular directory without recursive
 * watching using {@link #register(Path)}. 2. from . or cwd, it will watch all
 * the directories with the cwd using {@link #registerAll(Path)}
 */
class FileWatcher {

    enum Dirs {
        Home("user.home"),
        Current("user.dir"),
        Downloads("Downloads");

        private final String name;

        private Dirs(String s) {
            name = s;
        }

        public String string() {
            return this.name;
        }
    }

    private final WatchService watcher;

    public FileWatcher() throws IOException {
        this.watcher = FileSystems.getDefault().newWatchService();
    }

    public void watchCurrent() {
        watch(Dirs.Current.string(), ".");
    }

    public void watchDownloads() {
        watch(Dirs.Home.string(), Dirs.Downloads.string());
    }

    public void registerAll(final Path dir) throws IOException {
        Files.walkFileTree(dir, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                register(dir);
                return FileVisitResult.CONTINUE;
            }
        });
    }

    void register(Path dir) {

        try {
            dir.register(watcher, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY, StandardWatchEventKinds.ENTRY_DELETE);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    void watch(final String parent, final String dir) {

        try {

            // Getting the home directory
            var home = Path.of(System.getProperty(parent));
            // go to the downloads directory, using normalize to do ~/Downloads        
            var target = home.resolve(dir).normalize();
            System.out.println("Start file watching at %s.".formatted(target.toString()));
            // here is where we can watch the Downloads directory
            // abstract to register();
            // target.register(watcher, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY, StandardWatchEventKinds.ENTRY_MODIFY);
            if (home.toString().equals(Dirs.Home.string())) {
                register(target);
            } else {
                registerAll(target);
            }

            WatchKey key;
            while ((key = watcher.take()) != null) {
                for (WatchEvent<?> event : key.pollEvents()) {

                    //  typecasting from ? -> Path 
                    @SuppressWarnings("unchecked")
                    var ev = (WatchEvent<Path>) event;
                    var filename = ev.context();
                    var filetype = Files.probeContentType(target.resolve(filename));
                    System.out.println("""
                                Watching directory: %s
                                File: %s
                                File type: %s
                                Event: %s
                                """.formatted(
                            target.toString(),
                            filename,
                            filetype,
                            ev.kind()));

                    if (ev.kind().equals(StandardWatchEventKinds.ENTRY_MODIFY) && filename.toString().endsWith("java")) {
                        var task = new MyTask();
                        var trigger = Trigger
                                .newBuilder()
                                .withTask(task)
                                .delayBy(2)
                                .build();
                        trigger.fire();
                    }

                }
                key.reset();
            }

        } catch (IOException e) {
            System.err.println(e.getLocalizedMessage());
        } catch (InterruptedException ex) {
            System.err.println(ex.getLocalizedMessage());
        }

    }
}

record Job(String title, String description, String isoDate) {

    public Date date() {
        var localDateTime = LocalDateTime.parse(isoDate, DateTimeFormatter.ISO_DATE_TIME);
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
}

class JobScheduler {

    /**
     * Why DelayQueue?
     *
     * ✅ Purpose-built for scheduling
     *
     * ✅ Thread-safe
     *
     * ✅ Elements become available only after their delay has expired
     *
     * ❌ Requires additional wrapper class
     */
    private DelayQueue<DelayedJob> queuedJob = new DelayQueue<>();

    /**
     * Add new Reminder to the queue
     *
     * @param Reminder
     */
    public void schedule(Job job) {
        var delayed = new DelayedJob(job);
        queuedJob.add(delayed);
        System.out.println("Job scheduled: " + job);
    }

    public void process() {
        Thread.ofVirtual().start(() -> {
            try {
                while (true) {
                    var delayedJob = queuedJob.take();
                    System.out.println("Executing job: " + delayedJob.job.title());
                    System.out.println("Description: " + delayedJob.job.description());

                    var myTask = new EmailReminder(delayedJob.job);

                    var trigger = Trigger
                            .newBuilder()
                            .withTask(myTask)
                            .sendOn(delayedJob.job.date())
                            .build();
                    trigger.fire();
                }
            } catch (InterruptedException e) {
                System.out.println(e.getLocalizedMessage());
            }
        });
    }

    /**
     * Inner class for conforming to the DelayQueue
     */
    static class DelayedJob implements Delayed {

        final Job job;
        private final long executeAtMillis;

        public DelayedJob(Job job) {
            this.job = job;

            // convert String -> LocalDateTime -> Instant ->  Long milliseconds 
            this.executeAtMillis = Instant.ofEpochMilli(job.date().getTime()).toEpochMilli();
        }

        @Override
        public int compareTo(Delayed other) {
            if (other instanceof DelayedJob delayedjob) {
                return Long.compare(executeAtMillis, delayedjob.executeAtMillis);
            }
            return Long.compare(getDelay(TimeUnit.MILLISECONDS), other.getDelay(TimeUnit.MILLISECONDS));
        }

        @Override
        public long getDelay(TimeUnit unit) {
            long diff = executeAtMillis - System.currentTimeMillis();
            return unit.convert(diff, TimeUnit.MILLISECONDS);
        }
    }
}

/**
 * The time based trigger for another action, with async virtual thread
 * executing the task.
 */
class Trigger {

    private final TimerTask task;
    private final Date date;

    private Trigger(Trigger.Builder builder) {
        this.task = builder.task;
        this.date = builder.date;
    }

    public void fire() {
        var timer = new Timer();
        timer.schedule(task, date);

        /**
         * Why cancel()?
         * Resource Management: By canceling the timer shortly after its task executes, you're properly cleaning up resources
         * Memory Leak Prevention: Without cancellation, each timer would continue to exist even after its task completes
         * Background Thread Cleanup: Each Timer creates a thread that would otherwise persist for the life of the application
         */
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                timer.cancel();
            }
        }, new Date(date.getTime() + 100));
    }

    /**
     * Builder Pattern that current used in most Java libraries.
     * @return
     */
    public static Builder newBuilder() {
        return new Builder();
    }

    public static class Builder {

        private TimerTask task;
        private Date date = new Date();

        private Builder() {
        }

        public Builder withTask(TimerTask task) {
            this.task = task;
            return this;
        }

        /**
         * Optional: if task fire immediately. Accepting date already in Date
         * type, e.g.: new Date()
         *
         * @param date
         * @return
         */
        public Builder sendOn(Date date) {
            this.date = date;
            return this;
        }

        /**
         *
         * Optional: if task fire immediately. Accepting ISO 8601 String format
         * e.g.: 2025-03-31T12:20:00
         *
         * @param isoDateString
         * @return Builder
         */
        public Builder sendOn(String isoDateString) {
            this.date = convert8601ToDate(isoDateString);
            return this;
        }

        /**
         * Convert ISO 8601 datetime to Date type.
         *
         * @param isoDateString
         * @return
         */
        private Date convert8601ToDate(String isoDateString) {
            var localDateTime = LocalDateTime.parse(isoDateString, DateTimeFormatter.ISO_DATE_TIME);
            var zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
            return Date.from(zonedDateTime.toInstant());
        }

        /**
         * Delaying task by
         *
         * @param milliseconds
         * @return
         */
        public Builder delayBy(int seconds) {
            var milliseconds = seconds * 1000;
            this.date = new Date(this.date.getTime() + milliseconds);
            return this;
        }

        public Trigger build() {
            if (task == null) {
                throw new IllegalStateException("Task is missing.");
            }
            return new Trigger(this);
        }
    }
}

class EmailReminder extends TimerTask {

    private final Job job;

    public EmailReminder(Job job) {
        this.job = job;
    }

    @Override
    public void run() {
        // logic 
        System.out.println("Sending Email: " + job.toString());
    }

}

class MyTask extends TimerTask {

    @Override
    public void run() {
        System.out.println("Super important task");
    }

}

public class Main {

    private static final JobScheduler scheduler = new JobScheduler();

    public static void main(String[] args) {
        try {
            // var watcher = new FileWatcher();
            // watcher.watchCurrent();
            // System.out.println("fire?");

            LocalDateTime future = LocalDateTime.now().plusSeconds(10);
            String isoDate = future.format(DateTimeFormatter.ISO_DATE_TIME);
            Job testJob = new Job("say hello", "to my little friend", isoDate);
            scheduler.schedule(testJob);
            scheduler.process();

            
            // mimic a server by keep running.
            System.out.println("Job scheduler running. Press Ctrl+C to exit.");
            Thread.sleep(60000); // Keep alive for 1 minute System.out.println("Job scheduler running. Press Ctrl+C to exit.");

        } catch (Exception e) {
            // TODO: handle exception
            System.out.println(e.getLocalizedMessage());
        }
    }
}
