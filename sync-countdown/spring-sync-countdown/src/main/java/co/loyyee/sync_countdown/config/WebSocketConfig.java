package co.loyyee.sync_countdown.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/portfolio", "/timer")
		.setAllowedOrigins("http://localhost:4200")
		;
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// endpoint to interact. 
		registry.setApplicationDestinationPrefixes("/app");
		// topic FE Stomp will subscribe to.
		registry.enableSimpleBroker("/topic");
	}
}
