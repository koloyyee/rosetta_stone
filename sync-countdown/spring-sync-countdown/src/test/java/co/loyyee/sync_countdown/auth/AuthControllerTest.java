package co.loyyee.sync_countdown.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TokenService tokenService;

    @MockitoBean
    private UserDetailsManager userDetailsManager;

    @Test
    void signup_createsUser() throws Exception {
        doNothing().when(userDetailsManager).createUser(any(UserDetails.class));

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "new@user.com", "password": "password123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void signup_returns400OnDuplicate() throws Exception {
        doThrow(new RuntimeException("User already exists"))
                .when(userDetailsManager).createUser(any(UserDetails.class));

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "existing@user.com", "password": "password123"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void token_endpointReturnsToken() throws Exception {
        when(tokenService.generateToken(any())).thenReturn("jwt-token-value");

        mockMvc.perform(post("/auth/token"))
                .andExpect(status().isOk());
    }
}
