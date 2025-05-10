package co.loyyee.sync_countdown.rooms.services;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TimerService {

    private static final Logger logger = LoggerFactory.getLogger(TimerService.class);
    private final SimpMessagingTemplate template;
    private final Map<String, TimerData> timers = new ConcurrentHashMap<>();

    public TimerService(SimpMessagingTemplate template) {
        this.template = template;
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
        if (timer != null) {
            timer.state = TimerState.PAUSED;
            var now = LocalDateTime.now(Clock.system(ZoneId.of("America/Toronto")));
            timer.remaining = Duration.between(now, timer.startTime.plusSeconds(timer.duration)).getSeconds();
        }
        sendRemainingTime(roomId);
    }

    public void resume(String roomId) {
        var timer = timers.get(roomId);
        if (timer != null) {
            // Note: create a new temp now for resetting the start time
            var now = LocalDateTime.now(Clock.system(ZoneId.of("America/Toronto")));
            var newStartTime = now.minusSeconds(timer.duration - timer.remaining);
						timer.startTime = newStartTime;
						timer.state = TimerState.RUNNING;
        }
				sendRemainingTime(roomId);
    }

    public void stop(String roomId) {
        var timer = timers.get(roomId);
        if (timer != null) {
            timer.state = TimerState.STOPPED;
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

        var now = LocalDateTime.now(Clock.system(ZoneId.of("America/Toronto")));

        Map<String, Object> response = new HashMap<>();
        response.put("remaining", 0L);
        response.put("state", state.name());

        switch (state) {
            case TimerState.RUNNING -> {
                long remaining = Duration.between(now, startTime.plusSeconds(duration)).getSeconds();
                logger.info("Remaining seconds :" + remaining);
                if (remaining >= 0) {
                    response.put("remaining", remaining);
                    template.convertAndSend("/topic/timer/remaining/" + roomId, response);
                } else {
                    timer.state = TimerState.FINISHED;
                    template.convertAndSend("/topic/timer/remaining/" + roomId, response);
                }
            }
            case TimerState.FINISHED ->
                template.convertAndSend("/topic/timer/remaining/" + roomId, response);
            case TimerState.STOPPED ->
                template.convertAndSend("/topic/timer/remaining/" + roomId, response);
            case TimerState.PAUSED -> {
                response.put("remaining", Math.max(0L, timer.remaining));
                template.convertAndSend("/topic/timer/remaining/" + roomId, response);
            }
        }

    }

    @Scheduled(fixedRate = 1000)
    public void scheduleRemainingTime() {
        for (var room : timers.entrySet()) {
            var roomId = room.getKey();
            sendRemainingTime(roomId);
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

            // var now = LocalDateTime.now(Clock.system(ZoneId.of("America/Toronto")));
            // this.remaining = Duration.between(now, startTime.plusSeconds(duration)).getSeconds();
        }
    }

    enum TimerState {
        RUNNING,
        PAUSED,
        STOPPED,
        FINISHED;
    }

}
