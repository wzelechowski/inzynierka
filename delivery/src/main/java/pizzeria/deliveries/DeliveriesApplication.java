package pizzeria.deliveries;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableRabbit
@EnableCaching
public class DeliveriesApplication {

	public static void main(String[] args) {
		SpringApplication.run(DeliveriesApplication.class, args);
	}

}
