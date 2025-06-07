package co.loyyee.sync_countdown.book_records.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import co.loyyee.sync_countdown.book_records.models.BookingRecord;

@Repository
public interface BookingRecordsRepository extends ListCrudRepository<BookingRecord, Long>{

	Optional<BookingRecord> findByRoomId(UUID roomId);
}
