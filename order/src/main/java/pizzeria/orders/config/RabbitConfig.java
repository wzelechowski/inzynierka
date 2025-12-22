package pizzeria.orders.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "pizzeria.exchange";

    public static final String ORDER_QUEUE = "order.queue";
    public static final String AI_QUEUE = "ai.queue";

    public static final String ORDER_ROUTING_KEY = "delivery.status.changed";
    public static final String DELIVERY_ROUTING_KEY = "order.delivery.requested";
    public static final String AI_ROUTING_KEY = "order.completed";

    @Bean
    TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    Queue deliveryQueue() {
        return new Queue(ORDER_QUEUE, true);
    }

    @Bean
    Binding deliveryBinding(Queue deliveryQueue, TopicExchange exchange) {
        return BindingBuilder.bind(deliveryQueue).to(exchange).with(ORDER_ROUTING_KEY);
    }

    @Bean
    Queue aiQueue() {
        return new Queue(AI_QUEUE, true);
    }

    @Bean
    Binding aiBinding(Queue aiQueue, TopicExchange exchange) {
        return BindingBuilder.bind(aiQueue).to(exchange).with(AI_ROUTING_KEY);
    }

    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
