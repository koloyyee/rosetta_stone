package co.loyyee.sync_countdown.rooms;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import co.loyyee.sync_countdown.rooms.models.Room;
import co.loyyee.sync_countdown.rooms.models.RoomStatus;
import co.loyyee.sync_countdown.rooms.repositories.RoomsRepositoryImpl;
import co.loyyee.sync_countdown.rooms.services.TimerService;

@RequestMapping("/rooms")
@ResponseBody
@RestController
public class RoomsController {

    private final RoomsRepositoryImpl roomRepoImpl;
    private final TimerService timerService;

    public RoomsController(RoomsRepositoryImpl roomRepoImpl, TimerService timerService) {
        this.roomRepoImpl = roomRepoImpl;
        this.timerService = timerService;
    }

    @GetMapping("")
    public List<Room> getRooms() {
        return this.roomRepoImpl.findAll();
    }

    @GetMapping("{roomId}")
    public Optional<Room> getRoom(@PathVariable UUID roomId) {
        return this.roomRepoImpl.findById(roomId);
    }

    @PostMapping()
    public Room saveRoom(@RequestParam Room room) {
        return this.roomRepoImpl.save(room);
    }


    @MessageMapping("/timer/start")
    @SendTo("/topic/timer")
    public Action startTimer(Action action) {
        System.out.println(action);
        return action;
    }

    @PostMapping("{roomId}/start")
    public ResponseEntity<?> timerStart(@PathVariable UUID roomId, @RequestBody RoomDuration request ) {
        var startTime = LocalDateTime.now(java.time.Clock.system(java.time.ZoneId.of("America/Toronto")));
        var endTime = startTime.plusSeconds(request.duration());
        var currentRoom = roomRepoImpl.findById(roomId);
        currentRoom.ifPresent((room) -> {
            var updatedRoom = new Room(room.id(), room.name(), startTime, endTime, request.duration(), RoomStatus.RUNNING );
            roomRepoImpl.save(updatedRoom);
            // convert to String because WebSocket doesn't support UUID
            timerService.start(room.id().toString() , startTime, request.duration());
        });
        return ResponseEntity.ok(roomId + "timer started");
    }

    /** 
     * RoomDuration helps to Deserialize the "long" type during JSON process.
     */
    record RoomDuration(long duration){}
}
