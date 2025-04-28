package co.loyyee.sync_countdown.rooms;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("ROOMS")
public record Room(@Id Integer id, String name, LocalDateTime startTime,  LocalDateTime endTime, int duration, RoomStatus status) {

}

enum RoomStatus {
	NOT_STARTED,
	RUNNING,
	PAUSED,
	FINISHED;
}