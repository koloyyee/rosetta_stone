package co.loyyee.sync_countdown.rooms;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;


/**
 * An Endpoint which implements the Jakarta EE  WebSocket
 * 
 * Room's id has a type UUID, however WebSocket only support String.
 */
@ServerEndpoint("/ws/timer/{roomId}")
@Component
public class TimerWebSocketController {

    private final static Logger logger = LoggerFactory.getLogger(TimerWebSocketController.class);
    private final Map<String, Set<Session>> sessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId) {
        /**
         * NOTE: Using CopyOnWriteArraySet instead of ConcurrentSkipListSet 
         * because WebSocket lacks of Comparable.
         */
        sessions.computeIfAbsent(roomId, s -> new CopyOnWriteArraySet<>()).add(session);
        logger.info("Client connect to room: {}", roomId, session.getId());
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
					for(Session s : roomSessions) {
						sendMessage(s, message);
					}
        }
    }
}
