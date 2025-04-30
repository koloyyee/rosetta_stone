package co.loyyee.sync_countdown.rooms.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Service;

import co.loyyee.sync_countdown.rooms.models.Room;


@Service
public interface RoomsRepositoryImpl extends ListCrudRepository<Room, UUID> {
	Optional<Room> findByName(String name);
}
