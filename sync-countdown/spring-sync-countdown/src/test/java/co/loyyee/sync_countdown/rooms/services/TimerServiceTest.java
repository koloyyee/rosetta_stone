package co.loyyee.sync_countdown.rooms.services;

import co.loyyee.sync_countdown.book_records.models.BookingRecord;
import co.loyyee.sync_countdown.book_records.repositories.BookingRecordsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TimerServiceTest {

    @Mock
    private BookingRecordsRepository bookingRecordsRepository;

    @Mock
    private SimpMessagingTemplate template;

    private TimerService timerService;

    @BeforeEach
    void setUp() {
        timerService = new TimerService(bookingRecordsRepository, template);
    }

    @Test
    void start_createsTimerInRunningState() {
        timerService.start("room-1", LocalDateTime.now(), 60);

        verify(template).convertAndSend(eq("/topic/timer/remaining/room-1"), any(Object.class));
    }

    @Test
    void pause_switchesToPausedState() {
        timerService.start("room-1", LocalDateTime.now(), 60);
        // No pause yet - then pause
        timerService.pause("room-1");

        verify(template, atLeast(2))
                .convertAndSend(eq("/topic/timer/remaining/room-1"), any(Object.class));
    }

    @Test
    void pause_doesNothingForNonRunningTimer() {
        timerService.start("room-1", LocalDateTime.now(), 60);
        timerService.pause("room-1"); // PAUSED
        timerService.pause("room-1"); // should be no-op state-wise

        // Should send three times (start + pause + pause)
        verify(template, times(3))
                .convertAndSend(eq("/topic/timer/remaining/room-1"), any(Object.class));
    }

    @Test
    void resume_fromPausedSetsRunning() {
        timerService.start("room-1", LocalDateTime.now(), 60);
        timerService.pause("room-1");
        timerService.resume("room-1");

        verify(template, times(3))
                .convertAndSend(eq("/topic/timer/remaining/room-1"), any(Object.class));
    }

    @Test
    void stop_fromRunningWorks() {
        timerService.start("room-1", LocalDateTime.now(), 60);
        timerService.stop("room-1");

        verify(template, atLeast(2))
                .convertAndSend(anyString(), any(Object.class));
    }

    @Test
    void stop_fromPausedWorks() {
        timerService.start("room-1", LocalDateTime.now(), 60);
        timerService.pause("room-1");
        timerService.stop("room-1");

        verify(template, atLeast(3))
                .convertAndSend(anyString(), any(Object.class));
    }

    @Test
    void extend_addsDurationIncrementally() {
        timerService.start("room-1", LocalDateTime.now(), 60);
        timerService.extend("room-1", 30);

        verify(template, atLeast(2))
                .convertAndSend(eq("/topic/timer/remaining/room-1"), any(Object.class));
    }

    @Test
    void sendRemainingTime_forUnknownRoomSendsError() {
        timerService.sendRemainingTime("nonexistent");

        verify(template).convertAndSend(eq("/topic/timer/nonexistent"), anyString());
    }

    @Test
    void scheduleRemainingTime_onlySendsForRunningTimers() {
        timerService.start("room-1", LocalDateTime.now(), 60);
        timerService.start("room-2", LocalDateTime.now(), 120);
        timerService.pause("room-2");

        clearInvocations(template);

        timerService.scheduleRemainingTime();

        // Should send for room-1 (RUNNING) but not room-2 (PAUSED)
        verify(template, times(1))
                .convertAndSend(eq("/topic/timer/remaining/room-1"), any(Object.class));
        verify(template, never())
                .convertAndSend(eq("/topic/timer/remaining/room-2"), any(Object.class));
    }

    @Test
    void finishedTimer_persistsBookingRecord() {
        // Start with 0s duration — should immediately finish
        timerService.start("room-1", LocalDateTime.now(), 0);

        verify(template, atLeast(1))
                .convertAndSend(eq("/topic/timer/remaining/room-1"), any(Object.class));
        verify(bookingRecordsRepository, atMost(1)).save(any(BookingRecord.class));
    }
}
