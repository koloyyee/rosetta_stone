package co.loyyee.sync_countdown.book_records.controllers;

import co.loyyee.sync_countdown.book_records.models.BookingRecord;
import co.loyyee.sync_countdown.book_records.repositories.BookingRecordsRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class BookingRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookingRecordsRepository repository;

    @Test
    void getRecords_returnsAllRecords() throws Exception {
        var record = new BookingRecord(1L, UUID.randomUUID(), LocalDateTime.now(), LocalDateTime.now());
        when(repository.findAll()).thenReturn(List.of(record));

        mockMvc.perform(get("/booking-records"))
                .andExpect(status().isOk());
    }

    @Test
    void getRecordByPrimaryKey_returnsRecord() throws Exception {
        var record = new BookingRecord(1L, UUID.randomUUID(), LocalDateTime.now(), LocalDateTime.now());
        when(repository.findById(1L)).thenReturn(Optional.of(record));

        mockMvc.perform(get("/booking-records").param("id", "1"))
                .andExpect(status().isOk());
    }
}
