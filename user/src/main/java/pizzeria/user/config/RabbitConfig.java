package pizzeria.user.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "pizzeria.exchange";
    public static final String SUPPLIER_CREATED_ROUTING_KEY = "supplier.created";
    public static final String SUPPLIER_DELETED_ROUTING_KEY = "supplier.deleted";

    @Bean
    TopicExchange topicExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
