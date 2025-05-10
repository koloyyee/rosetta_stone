package co.loyyee.sync_countdown.non_stomp;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class TimerHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(TimerHandler.class);

    private final Map<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    private final JwtDecoder jwtDecoder;

    public TimerHandler(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        var token = (String) session.getAttributes().get("token");
        var roomId = (String) session.getAttributes().get("roomId");
        try {
            var claims = jwtDecoder.decode(token);
            logger.info("Jwt validated for user: {}", claims.getSubject());

            /**
             * NOTE: Using CopyOnWriteArraySet instead of ConcurrentSkipListSet
             * because WebSocket lacks of Comparable.
             */
            sessions.computeIfAbsent(token, s -> new CopyOnWriteArraySet<>()).add(session);
            logger.info("Client connected to room: {} ", roomId);
        } catch (JwtException jEx) {
            logger.error("Invalid Jwt token: {}", jEx.getMessage());
            session.close(CloseStatus.POLICY_VIOLATION);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("Received payload", payload);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        var roomId = (String) session.getAttributes().get("roomId");
        var roomSessions = sessions.get(roomId);
        if (roomSessions != null) {
            roomSessions.remove(session);
            if (roomSessions.isEmpty()) {
                sessions.remove(roomId);
                logger.info("Emptying room: {}.", roomId, status);
            }
        }
        logger.info("Client disconnected from the room: {} ", roomId, session.getId(), status);
    }

    public void broadcast(String roomId, String message) {
        var roomSessions = sessions.get(roomId);
        if (roomSessions != null) {
            for (WebSocketSession s : roomSessions) {
                try {
                    s.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    logger.error("Error boarding message: {}", e.getMessage());
                }
            }
        }
    }
}
