package co.loyyee.sync_countdown.book_records.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name="booking_records")
public record BookingRecord(@Id Long id, UUID roomId, LocalDateTime startTime, LocalDateTime endTime) {

}
