package co.loyyee.sync_countdown.rooms.controllers;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import co.loyyee.sync_countdown.rooms.models.Room;
import co.loyyee.sync_countdown.rooms.repositories.RoomsRepository;
import co.loyyee.sync_countdown.rooms.services.TimerService;

@RequestMapping("/rooms")
@ResponseBody
@RestController
public class RoomsController {

    private static final Logger logger = LoggerFactory.getLogger(RoomsController.class);

    private final RoomsRepository roomRepoImpl;
    private final TimerService timerService;

    public RoomsController(RoomsRepository roomRepoImpl, TimerService timerService) {
        this.roomRepoImpl = roomRepoImpl;
        this.timerService = timerService;
    }

    @GetMapping()
    public List<Room> getRooms() {
        return this.roomRepoImpl.findAll();
    }

    @GetMapping("{roomId}")
    public Optional<Room> getRoom(@PathVariable UUID roomId) {
        return this.roomRepoImpl.findById(roomId);
    }

    @PutMapping("/extend/{roomId}")
    public ResponseEntity<?> extend(@PathVariable UUID roomId, @RequestBody Long extendMinutes) {
        var currentRoom = this.roomRepoImpl.findById(roomId);
        if (currentRoom.isPresent()) {
            LocalDateTime newEndtime = currentRoom.get().endTime().plusMinutes(extendMinutes);
            this.roomRepoImpl.extendDuration(roomId, newEndtime);

            return ResponseEntity.ok(newEndtime);
        }

        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping()
    public Room saveRoom(@RequestBody String roomName) {
        var newRoom = new Room(null, roomName, null, null, false);
        logger.info("newRoom: {}", newRoom);
        return this.roomRepoImpl.save(newRoom);
    }

    @PutMapping("/{roomId}")
    public Room updateRoom(@PathVariable String roomId, @RequestBody Room room) {
        return this.roomRepoImpl.save(room);
    }

    record RoomBooking(UUID roomId, String action, long duration) {

    }

    /**
     * WebSocket entry endpoint: /app/timer/start destination: /topic/timer
     *
     * we can differentiate each function with the "." separator.
     */
    @MessageMapping("/timer.startTimer/{roomId}")
    @SendTo("/topic/timer/status/{roomId}")
    public ResponseEntity<?> startTimer(@DestinationVariable String roomId, @Payload RoomBooking booking) {

        var startTime = LocalDateTime.now(Clock.system(ZoneId.of("America/Toronto")));
        var endTime = startTime.plusSeconds(booking.duration());
        var currentRoom = roomRepoImpl.findById(booking.roomId());

        if (currentRoom.isPresent()) {
            var room = currentRoom.get();
            var updatedRoom = roomRepoImpl.save(new Room(room.id(), room.name(), startTime, endTime, true));
            // convert to String because WebSocket doesn't support UUID
            timerService.start(room.id().toString(), startTime, booking.duration());
            logger.info("[SUCCESS]: Started room {}", room.id());

            return ResponseEntity.ok(updatedRoom);
        }

        logger.info("[Failed]: Started room {}", booking.roomId());
        return ResponseEntity.badRequest().body(null);
    }

    @MessageMapping("/timer.pauseTimer/{roomId}")
    @SendTo("/topic/timer/status/{roomId}")
    public ResponseEntity<?> pauseTimer(@DestinationVariable String roomId, RoomBooking booking) {

        var currentRoom = roomRepoImpl.findById(booking.roomId());

        if (currentRoom.isPresent()) {
            var room = currentRoom.get();
            var updatedRoom = roomRepoImpl.save(new Room(room.id(), room.name(), room.startTime(), room.endTime(), false));
            // convert to String because WebSocket doesn't support UUID
            timerService.pause(room.id().toString());
            logger.info("[SUCCESS]: room {}", room.id());

            return ResponseEntity.ok(updatedRoom);
        }

        logger.info("[Failed]: Started room {}", booking.roomId());
        return ResponseEntity.badRequest().body(null);
    }

    @MessageMapping("/timer.stopTimer/{roomId}")
    // @SendTo("/topic/timer/status/{roomId}")
    public ResponseEntity<?> stopTimer(@DestinationVariable String roomId, RoomBooking booking) {

        var currentRoom = roomRepoImpl.findById(booking.roomId());
        if (currentRoom.isPresent()) {
            var room = currentRoom.get();
            var updatedRoom = roomRepoImpl.save(new Room(room.id(), room.name(), null, null, false));
            timerService.stop(room.id().toString());
            logger.info("[SUCCESS]: room {}", room.id());

            return ResponseEntity.ok(updatedRoom);
        }
        return ResponseEntity.badRequest().body(null);
    }

    @MessageMapping("/timer.resumeTimer/{roomId}")
    @SendTo("/topic/timer/status/{roomId}")
    public ResponseEntity<?> resumeTimer(@DestinationVariable String roomId, RoomBooking booking) {

        var currentRoom = roomRepoImpl.findById(booking.roomId());

        if (currentRoom.isPresent()) {
            var room = currentRoom.get();
            var updatedRoom = roomRepoImpl.save(new Room(room.id(), room.name(), room.startTime(), room.endTime(), true));
            // convert to String because WebSocket doesn't support UUID
            timerService.resume(room.id().toString());
            logger.info("[SUCCESS]: room {}", room.id());

            return ResponseEntity.ok(updatedRoom);
        }

        logger.info("[Failed]: Started room {}", booking.roomId());
        return ResponseEntity.badRequest().body(null);
    }

    /**
     * Why no @SendTo() ? because @SendTo will prevent from broadcasting from my
     * timerService layer.
     *
     * @SendTo is when we need to return a specific value.
     */
    @MessageMapping("/timer.remainingTime/{roomId}")
    public void remainingTime(@DestinationVariable String roomId) {
        if (roomId != null) {
            timerService.sendRemainingTime(roomId);
        }
    }
}
