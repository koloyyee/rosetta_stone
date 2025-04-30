package co.loyyee.sync_countdown.rooms.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("ROOMS")
public record Room(@Id UUID id, String name, LocalDateTime startTime,  LocalDateTime endTime, long duration, RoomStatus status) {}
