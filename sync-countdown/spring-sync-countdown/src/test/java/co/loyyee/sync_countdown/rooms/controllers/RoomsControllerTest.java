package co.loyyee.sync_countdown.rooms.controllers;

import co.loyyee.sync_countdown.rooms.models.Room;
import co.loyyee.sync_countdown.rooms.repositories.RoomsRepository;
import co.loyyee.sync_countdown.rooms.services.TimerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class RoomsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoomsRepository roomsRepository;

    @MockitoBean
    private TimerService timerService;

    @Test
    void getRooms_returnsRoomList() throws Exception {
        var room = new Room(UUID.randomUUID(), "Test Room", null, null, false);
        when(roomsRepository.findAll()).thenReturn(List.of(room));

        mockMvc.perform(get("/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Room"));
    }

    @Test
    void getRoom_byId_returnsRoom() throws Exception {
        var id = UUID.randomUUID();
        var room = new Room(id, "Test Room", null, null, false);
        when(roomsRepository.findById(id)).thenReturn(Optional.of(room));

        mockMvc.perform(get("/rooms/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Room"));
    }

    @Test
    void getRoom_byId_returns200ForMissing() throws Exception {
        var id = UUID.randomUUID();
        when(roomsRepository.findById(id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/rooms/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "SCOPE_ROLE_ADMIN")
    void saveRoom_withAdmin_createsRoom() throws Exception {
        var savedRoom = new Room(UUID.randomUUID(), "New Room", null, null, false);
        when(roomsRepository.save(any(Room.class))).thenReturn(savedRoom);

        mockMvc.perform(post("/rooms")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("New Room"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Room"));
    }

    @Test
    @WithMockUser(authorities = "SCOPE_ROLE_ADMIN")
    void extendRoom_withAdmin_extendsDuration() throws Exception {
        var id = UUID.randomUUID();
        var endTime = LocalDateTime.now().plusHours(1);
        var room = new Room(id, "Test Room", null, endTime, false);
        when(roomsRepository.findById(id)).thenReturn(Optional.of(room));

        mockMvc.perform(put("/rooms/extend/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("30"))
                .andExpect(status().isOk());
    }
}
