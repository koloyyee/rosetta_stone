package co.loyyee.sync_countdown.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
// @EnableWebSocket
public class WebSocketConfig {

	@Bean
	public ServerEndpointExporter serverEndpointExporter() {
		return new ServerEndpointExporter();
	}


	// @Override
	// public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
	// 	registry.addHandler(webSocketHandler, "/timer/{roomId}");
	// }
}
