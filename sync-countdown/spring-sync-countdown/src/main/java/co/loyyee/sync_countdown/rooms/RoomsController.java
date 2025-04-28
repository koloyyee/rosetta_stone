package co.loyyee.sync_countdown.rooms;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("/rooms")
@ResponseBody
@RestController
public class RoomsController {

	private RoomsService roomsService;

	public RoomsController(RoomsService roomsService) {
		this.roomsService = roomsService;
	}

	@GetMapping("")
	public List<Room> getRooms() {
		return this.roomsService.findAll();
	}
	
	@GetMapping("{name}")
	public Optional<Room> getRoom(@PathVariable String name) {
		return this.roomsService.findByName(name);
	}

	@PostMapping()
	public Room saveRoom(@RequestParam Room room) {
		return this.roomsService.save(room);
	}
}
