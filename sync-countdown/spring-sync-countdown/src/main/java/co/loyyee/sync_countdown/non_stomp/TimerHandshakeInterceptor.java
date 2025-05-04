package co.loyyee.sync_countdown.non_stomp;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

@Component
public class TimerHandshakeInterceptor implements HandshakeInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(TimerHandshakeInterceptor.class);
    private final JwtDecoder jwtDecoder;

    public TimerHandshakeInterceptor(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        var uri = request.getURI();
        logger.info("URI: {}", uri.toString());
        String query = uri.getQuery();
                logger.info("Query: {}", query);
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2) {
                    attributes.put(keyValue[0], keyValue[1]); // Add to WebSocket session attributes
                }
            }
        }

        // Validate JWT token
        String token = (String) attributes.get("token");
        System.out.println("TOKEN: " + token);
        if (token == null) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        try {
            var claims  = jwtDecoder.decode(token); // Validate the token
            logger.info("Valid JWT: {} ", claims.getSubject());
        } catch (JwtException e) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            logger.error("Failed to validate: {} ", e.getMessage());
            return false;
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Exception exception) {
    }

}
