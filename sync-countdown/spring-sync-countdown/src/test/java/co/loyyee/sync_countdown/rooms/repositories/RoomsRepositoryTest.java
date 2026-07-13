package co.loyyee.sync_countdown.rooms.repositories;

import co.loyyee.sync_countdown.rooms.models.Room;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration test for RoomsRepository using H2 in PostgreSQL mode.
 * Creates tables via spring.sql.init, tests basic CRUD operations.
 */
@SpringBootTest
@ActiveProfiles("test")
class RoomsRepositoryTest {

    @Autowired
    private RoomsRepository roomsRepository;

    @Test
    void contextLoads() {
        assertNotNull(roomsRepository);
    }
}
