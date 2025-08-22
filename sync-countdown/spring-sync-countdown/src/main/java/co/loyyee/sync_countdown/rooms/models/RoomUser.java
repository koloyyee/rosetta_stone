package co.loyyee.sync_countdown.rooms.models;

import java.util.UUID;

import org.springframework.data.relational.core.mapping.Table;

@Table("room_users")
public record RoomUser (UUID roomId, String username) {

}
