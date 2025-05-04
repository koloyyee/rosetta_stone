package co.loyyee.sync_countdown.rooms.services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import co.loyyee.sync_countdown.rooms.models.RoomStatus;

/**
 * Timer Business Logic
 */
@Service
public class TimerService {

	private static final Logger logger = LoggerFactory.getLogger(TimerService.class);

	// private final TimerWebSocketController websocket;	
	private final TimerHandler websocket;

	private final Map<String, LocalDateTime> roomEndTimes = new ConcurrentHashMap<>();
	private final Map<String, RoomStatus> roomStatuses = new ConcurrentHashMap<>();

	private final ObjectMapper objectMapper;

	public TimerService(TimerHandler timerHandler) {
		this.websocket = timerHandler;
		this.objectMapper = new ObjectMapper();
		// NOTE: Jackson cannot convert LocalDateTime to Timestamp directly.
		this.objectMapper.registerModule(new JavaTimeModule());
		this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
	}
	/****** WebSocket Broadcasting functions  *******/

	void broadcastingUpdate(String roomId, long remainingSeconds) {
		try {
			String messageJson = objectMapper.writeValueAsString(Map.of(
				"type", TimerStatus.UPDATE.name(),
				"roomId", roomId,
				"remainingTime", remainingSeconds
			));
			websocket.broadcast(roomId, messageJson);	
		} catch (JsonProcessingException e) {
			logger.error("Failed to stringify message: {} ", roomId, TimerStatus.UPDATE.name(), e.getMessage());
		}
	}

	void broadcastingStart(String roomId, LocalDateTime startTime, LocalDateTime endTime, long duration) {
		try {
			String messageJson = objectMapper.writeValueAsString(Map.of(
			"type" , TimerStatus.STARTED.name() ,
			"roomId", roomId,
			"startTime", startTime,
			"endTime", endTime,
			"duration", duration
			));

			websocket.broadcast(roomId, messageJson);
		} catch (JsonProcessingException e) {
			logger.error("Failed to stringify message: {} ", roomId, TimerStatus.STARTED.name(), e.getMessage());
		}
	}
	
	void broadcastingPaused(String roomId) {
		try {
			String messageJson = objectMapper.writeValueAsString(Map.of(
				"type", TimerStatus.PAUSED.name(),
				"roomId", roomId
			));
			websocket.broadcast(roomId, messageJson);
		} catch (JsonProcessingException e) {
			logger.error("Failed to stringify message: {} ", roomId, TimerStatus.PAUSED.name(), e.getMessage());
		}
	}

	void broadcastingResumed(String roomId) {
		try {
			String messageJson = objectMapper.writeValueAsString(Map.of(
				"type", TimerStatus.RESUMED.name(),
				"roomId", roomId
			));
			websocket.broadcast(roomId, messageJson);
		} catch (JsonProcessingException e) {
			logger.error("Failed to stringify message: {} ", roomId, TimerStatus.PAUSED.name(), e.getMessage());
		}
	}

	void broadcastingExtended(String roomId, long additionalDuration ) {
		try {
			String messageJson = objectMapper.writeValueAsString(Map.of(
				"type", TimerStatus.EXTENDED.name(),
				"roomId", roomId,
				"additional", additionalDuration
			));
			websocket.broadcast(roomId, messageJson);
		} catch (JsonProcessingException e) {
			logger.error("Failed to stringify message: {} ", roomId, TimerStatus.EXTENDED.name(), e.getMessage());
		}
	}

	void broadcastingFinished(String roomId) {
		try {
			String messageJson = objectMapper.writeValueAsString(Map.of(
				"type", TimerStatus.FINISHED.name(),
				"roomId", roomId
			));
			websocket.broadcast(roomId, messageJson);
		} catch (JsonProcessingException e) {
			logger.error("Failed to stringify message: {} ", roomId, TimerStatus.EXTENDED.name(), e.getMessage());
		}
	}

	/**
	 * TODO: DOC
	 */
	public void start(String roomId, LocalDateTime startTime, long duration) {
		LocalDateTime endTime = startTime.plusSeconds(duration);
		roomEndTimes.put(roomId, endTime);
		roomStatuses.put(roomId, RoomStatus.RUNNING);
		broadcastingStart(roomId, startTime, endTime, duration);
	}

	public void pause(String roomId) {
		roomStatuses.put(roomId, RoomStatus.PAUSED);
		broadcastingPaused(roomId);
	}

	public void resume(String roomId) {
		roomStatuses.put(roomId, RoomStatus.RUNNING);
		broadcastingResumed(roomId);
	}

	public void extend(String roomId, long additionalDuration) {
		if ( roomEndTimes.containsKey(roomId) && isRunning(roomId)) {
				roomEndTimes.compute(roomId, (key, oldValue) -> oldValue.plusSeconds(additionalDuration));
				broadcastingExtended(roomId, additionalDuration);
		}
	}

	public void initializeTimer() {

	}

	public boolean isRunning(String roomId) {
		return roomStatuses.getOrDefault(roomId, RoomStatus.NOT_STARTED) == RoomStatus.RUNNING;
	}

	/**
	 * TODO: DOC
	 */
	@Scheduled(fixedRate = 1000)
	public void sendTimerUpdate() {
		LocalDateTime now = LocalDateTime.now(java.time.Clock.system(java.time.ZoneId.of("America/Toronto")));
		roomEndTimes.forEach(( roomId, endtime ) ->  {
			if(isRunning(roomId)) {
				long remainingSeconds = ChronoUnit.SECONDS.between(now, endtime);
				if ( remainingSeconds > 0) {
					broadcastingUpdate(roomId, remainingSeconds);
				} else {
					roomStatuses.put(roomId, RoomStatus.FINISHED);
					broadcastingFinished(roomId);
				}
			}
		});
	}
}	 

enum TimerStatus {
	UPDATE,
	STARTED,
	PAUSED,
	RESUMED,
	EXTENDED,
	FINISHED;
}