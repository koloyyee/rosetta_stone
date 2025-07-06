package co.loyyee.sync_countdown;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;

@SpringBootApplication
public class SyncCountdownApplication {

    public static void main(String[] args) {
        SpringApplication.run(SyncCountdownApplication.class, args);
    }

    @Bean
    ApplicationRunner run(JdbcUserDetailsManager manager, PasswordEncoder passwordEncoder) {
        return args -> {

            JdbcUserDetailsManager users = manager;

            UserDetails user = User.builder()
                    .username("user@sync.room")
                    .password(passwordEncoder.encode("password"))
                    .roles("USER")
                    .build();
            UserDetails admin = User.builder()
                    .username("admin@sync.room")
                    .password(passwordEncoder.encode("password"))
                    .roles("USER", "ADMIN")
                    .build();
            users.createUser(user);
            users.createUser(admin);
        };
    }
}
