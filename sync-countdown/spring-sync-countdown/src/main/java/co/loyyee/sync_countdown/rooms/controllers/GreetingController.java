package co.loyyee.sync_countdown.rooms.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class GreetingController {

		// /app/hello
    @MessageMapping("/hello")
		@SendTo("/topic/greetings")
    public String handle(String greeting) {
        var response = "[" + getTimestamp() + ": " + greeting;
				System.out.println(response);
				return response;
    }
    @MessageMapping("/start")
		@SendTo("/topic/greetings")
    public String start(String greeting) throws JsonMappingException, JsonProcessingException {
				System.out.println(greeting);
				var objectMapper = new ObjectMapper();
				Action action = objectMapper.readValue(greeting, Action.class);
				System.out.println(action);
				return greeting;
    }

    private String getTimestamp() {
        return new SimpleDateFormat("MM/dd/yyyy h:mm:ss a").format(new Date());
    }

}

record Action(String action){}

class Greeting {

    private String content;

    public Greeting() {
    }

    public Greeting(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

}

class HelloMessage {

    private String name;

    public HelloMessage() {
    }

    public HelloMessage(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
