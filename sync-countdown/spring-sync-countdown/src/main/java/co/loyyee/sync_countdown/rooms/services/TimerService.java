package co.loyyee.sync_countdown.rooms.services;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import co.loyyee.sync_countdown.book_records.models.BookingRecord;
import co.loyyee.sync_countdown.book_records.repositories.BookingRecordsRepository;

@Service
public class TimerService {

    private static final Logger logger = LoggerFactory.getLogger(TimerService.class);
    private final Map<String, TimerData> timers = new ConcurrentHashMap<>();
    private final ZoneId zoneId = ZoneId.systemDefault();

    private final SimpMessagingTemplate template;
    private final BookingRecordsRepository bookingRecordsRepository;

    public TimerService(BookingRecordsRepository bookingRecordsRepository, SimpMessagingTemplate template) {
        this.bookingRecordsRepository = bookingRecordsRepository;
        this.template = template;
    }

    /**
     * Getting the current time by server's location zone id.
     *
     * @return now
     */
    private LocalDateTime now() {
        return LocalDateTime.now(Clock.system(zoneId));
    }

    /**
     * Start a timer.
     */
    public void start(String roomId, LocalDateTime startTime, long duration) {
        this.timers.put(roomId, new TimerData(startTime, duration, TimerState.RUNNING));
        sendRemainingTime(roomId);
    }

    public void pause(String roomId) {
        var timer = timers.get(roomId);
        if (timer != null && timer.state == TimerState.RUNNING) {
            timer.state = TimerState.PAUSED;
            // recalculate the remaining
            timer.remaining = Duration.between(now(), timer.startTime.plusSeconds(timer.duration)).getSeconds();
        }
        sendRemainingTime(roomId);
    }

    public void resume(String roomId) {
        var timer = timers.get(roomId);
        if (timer != null && timer.state != TimerState.RUNNING) {
            // Note: create a new temp now for resetting the start time
            // offset by - 1 because the milliseconds differences will cause it round down missing a second.
            var newStartTime = now().minusSeconds((timer.duration - timer.remaining) - 1);
            timer.startTime = newStartTime;
            timer.state = TimerState.RUNNING;
        }
        sendRemainingTime(roomId);
    }

    public void stop(String roomId) {
        var timer = timers.get(roomId);
        if (timer != null && timer.state == TimerState.RUNNING) {
            timer.state = TimerState.STOPPED;
            timer.startTime = null;
            timer.duration = 0;
            timer.remaining = 0;
        }
        sendRemainingTime(roomId);
    }

    public void extend(String roomId, long duration) {
        var timer = timers.get(roomId);
        if (timer != null) {
            timer.duration = duration;
        }
        sendRemainingTime(roomId);
    }

    public void sendRemainingTime(String roomId) {
        var timer = timers.get(roomId);
        if (timer == null) {
            template.convertAndSend("/topic/timer/" + roomId, "Timer not found for room: " + roomId);
            return;
        }
        var startTime = timer.startTime;
        var state = timer.state;
        var duration = timer.duration;

        Map<String, Object> response = new HashMap<>();
        response.put("remaining", 0L);
        response.put("state", state.name());

        final var roomRemainingTopic = "/topic/timer/remaining/" + roomId;

        switch (state) {
            case TimerState.RUNNING -> {
                long remaining = Duration.between(now(), startTime.plusSeconds(duration)).getSeconds();
                logger.info("Remaining seconds :" + remaining);
                if (remaining >= 0) {
                    response.put("remaining", remaining);
                    template.convertAndSend(roomRemainingTopic, response);
                } else {
                    timer.state = TimerState.FINISHED;
                    template.convertAndSend(roomRemainingTopic, response);
                }
            }
            // When timer state is STOPPED or FINISHED, it will be recorded in database.
            case TimerState.FINISHED, TimerState.STOPPED -> {
                template.convertAndSend(roomRemainingTopic, response);
                BookingRecord newRecord = new BookingRecord(null, UUID.fromString(roomId), startTime, now());
                bookingRecordsRepository.save(newRecord);
            }
            case TimerState.PAUSED -> {
                response.put("remaining", Math.max(0L, timer.remaining));
                template.convertAndSend(roomRemainingTopic, response);
            }
        }

    }

    @Scheduled(fixedRate = 1000)
    public void scheduleRemainingTime() {
        for (var room : timers.entrySet()) {
            var roomId = room.getKey();
            var timer = room.getValue();
            if (timer.state == TimerState.RUNNING || timer.state == TimerState.STOPPED) {
                sendRemainingTime(roomId);
            }
        }
    }

    private static class TimerData {

        public TimerState state;
        public long duration;
        public long remaining;
        LocalDateTime startTime;

        public TimerData(LocalDateTime startTime, long duration, TimerState state) {
            this.startTime = startTime;
            this.duration = duration;
            this.state = state;
        }
    }

    enum TimerState {
        RUNNING,
        PAUSED,
        STOPPED,
        FINISHED;
    }

}
