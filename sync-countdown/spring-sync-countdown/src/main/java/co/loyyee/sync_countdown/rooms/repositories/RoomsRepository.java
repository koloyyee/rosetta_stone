package co.loyyee.sync_countdown.rooms.repositories;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import co.loyyee.sync_countdown.rooms.models.Room;


@Repository
public interface RoomsRepository extends ListCrudRepository<Room, UUID> {
	Optional<Room> findByName(String name);

	@Query("UPDATE rooms SET end_time = :end_time WHERE id = :id")
	Long extendDuration(@Param("id") UUID roomId, @Param("end_time") LocalDateTime endtime);
}
