package co.loyyee.sync_countdown.book_records.controllers;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.loyyee.sync_countdown.book_records.repositories.BookingRecordsRepository;

@RestController
@RequestMapping("booking-records")
public class BookingRecordController {

    private static Logger logger = LoggerFactory.getLogger(BookingRecordController.class);

    private final BookingRecordsRepository repo;

    public BookingRecordController(BookingRecordsRepository repo) {
        this.repo = repo;
    }

    @GetMapping()
    public ResponseEntity<?> getRecords() {
        try {
            var records = this.repo.findAll();
            return ResponseEntity.ok().body(records);
        } catch (Exception e) {
            logger.error("Failed to get records: {}", e.getLocalizedMessage());
        }
        return ResponseEntity.badRequest().body("No records.");
    }

    @GetMapping(params = "id")
    public ResponseEntity<?> getRecordByRoomId(@RequestParam Long id) {
        try {
            var record = this.repo.findById(id);
            return ResponseEntity.ok().body(record.get());

        } catch (Exception e) {
            logger.error("Failed to get records: {}", e.getLocalizedMessage());
        }
        return ResponseEntity.badRequest().body("No records.");
    }

    @GetMapping(params = "roomId")
    public ResponseEntity<?> getMethodName(@RequestParam UUID roomId) {

        try {
            var record = this.repo.findByRoomId(roomId);
            return ResponseEntity.ok().body(record.get());

        } catch (Exception e) {
            logger.error("Failed to get records: {}", e.getLocalizedMessage());
        }
        return ResponseEntity.badRequest().body("No records.");
    }

}
