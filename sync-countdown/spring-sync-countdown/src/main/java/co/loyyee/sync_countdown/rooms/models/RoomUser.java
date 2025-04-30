package co.loyyee.sync_countdown.rooms.models;

import java.util.UUID;

import org.springframework.data.relational.core.mapping.Table;

@Table("ROOM_USERS")
public record RoomUser (UUID roomId, String username) {

}
