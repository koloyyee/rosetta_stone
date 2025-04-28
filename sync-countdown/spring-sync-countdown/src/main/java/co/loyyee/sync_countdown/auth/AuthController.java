package co.loyyee.sync_countdown.auth;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
@ResponseBody
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final TokenService tokenService;
    private final UserDetailsManager userDetailsManager;

    public AuthController(TokenService tokenService, UserDetailsManager userDetailsManager) {
        this.tokenService = tokenService;
        this.userDetailsManager = userDetailsManager;
    }

    record NewUser(String email, String password) {

    }

    @PostMapping("/signup")
    public ResponseEntity<ResultResponse<String>> createUser(@RequestBody NewUser newUser) {
        try {

            UserDetails user = User.builder()
                    .username(newUser.email())
                    .password(newUser.password())
                    .authorities("ROLE_USER")
                    .build();
            userDetailsManager.createUser(user);
            var result = new ResultResponse<>("Success: create new user", newUser.email(), true);
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            var result = new ResultResponse<String>("Failed: create new user", null, false);
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/token")
    public ResponseEntity<Object> getToken(Authentication authentication) {

        logger.debug("Authenticating " + authentication);
        var token = tokenService.generateToken(authentication);
        logger.debug(token);
        var result = Map.of("token", token, "username", authentication.getName(), "authorities", authentication.getAuthorities());
        return ResponseEntity.ok().body(result);
    }

}
