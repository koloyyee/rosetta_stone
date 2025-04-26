package co.loyyee.sync_countdown.auth;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
@ResponseBody
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final TokenService tokenService;

    public AuthController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/token")
    public ResponseEntity<Object> getToken(Authentication authentication) {

        try {
            logger.debug("Authenticating " + authentication);
            var token = tokenService.generateToken(authentication);
            logger.debug(token);
            return ResponseEntity.ok().body(Map.of("token", token, "username", authentication.getName(), "authorization", authentication.getAuthorities()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Wrong Username or Password."));
        }
    }

}
