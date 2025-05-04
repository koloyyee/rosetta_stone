package co.loyyee.sync_countdown.non_stomp;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.server.standard.SpringConfigurator;

import jakarta.websocket.CloseReason;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

/**
 * An Endpoint which implements the Jakarta EE WebSocket
 *
 * Room's id has a type UUID, however WebSocket only support String.
 *
 * Having configurator = SpringConfigurator.class 
 * The @ServerEndpoint annotation is part of the Jakarta WebSocket API, which does not integrate directly with Spring's dependency injection.
 * The WebSocket container (e.g., Tomcat) tries to create an instance of TimerWebSocketController using reflection, but it cannot inject the JwtDecoder dependency because the class does not have a no-argument constructor.
 */
// @ServerEndpoint(value ="/ws/timer/{roomId}", configurator = SpringConfigurator.class)
// @Component
public class TimerWebSocketController {

    private final static Logger logger = LoggerFactory.getLogger(TimerWebSocketController.class);
    private final Map<String, Set<Session>> sessions = new ConcurrentHashMap<>();

    private final JwtDecoder jwtDecoder;

    public TimerWebSocketController(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId) {

        String token = session.getRequestParameterMap().get("token").get(0);
        try {
            var claims = jwtDecoder.decode(token);
            logger.info("JWT validated for users: {} ", claims.getSubject());

            /**
             * NOTE: Using CopyOnWriteArraySet instead of ConcurrentSkipListSet
             * because WebSocket lacks of Comparable.
             */
            sessions.computeIfAbsent(roomId, s -> new CopyOnWriteArraySet<>()).add(session);
            logger.info("Client connect to room: {}", roomId, session.getId());
        } catch (JwtException e) {
            logger.error("Invalid JWT token: {} ", e.getMessage());
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "invalid token"));
            } catch (IOException ioEx) {
                logger.error("Error closing session: {} ", ioEx.getMessage());
            }

        }
    }

    @OnClose
    public void onClose(Session session, @PathParam("roomId") String roomId) {
        var roomSessions = sessions.get(roomId);
        if (roomSessions != null) {
            roomSessions.remove(session);
            if (roomSessions.isEmpty()) {
                sessions.remove(roomId);
                logger.info("Room {} is now empty.", roomId);
            }
        }
        logger.info("Client disconnected from the room: {} ", roomId, session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session, @PathParam("roomId") String roomId) {
        logger.info("On Message from client: {}", message, session.getId(), roomId);
        // Handle incoming messages from clients (e.g., start, pause, extend timer requests)
        // You'll likely need to parse the JSON message
    }

    @OnError
    public void onError(Session session, Throwable error, @PathParam("roomId") String roomId) {
        logger.error("Error in WebSocket connection for room: {} (Session ID: {}): {}", roomId, session.getId(), error.getMessage());
        // Handle errors appropriately (e.g., close session, log error)
    }

    private void sendMessage(Session session, String message) {
        try {
            session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            logger.error("Error sending message to session {}: {}", session.getId(), e.getMessage());
        }
    }

    public void broadcast(String roomId, String message) {
        var roomSessions = sessions.get(roomId);
        if (roomSessions != null) {
            for (Session s : roomSessions) {
                sendMessage(s, message);
            }
        }
    }
}
