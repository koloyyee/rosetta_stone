package co.loyyee.sync_countdown.rooms;

import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Service;


@Service
public interface RoomsService extends ListCrudRepository<Room, Integer> {
	Optional<Room> findByName(String name);
}
