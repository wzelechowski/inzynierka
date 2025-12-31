package pizzeria.promotions.config;

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

    public static final String PROMOTION_QUEUE = "promotion.queue";

    public static final String PROMOTION_ROUTING_KEY = "promotion.proposed";

    @Bean
    TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    Queue queue() {
        return new Queue(PROMOTION_QUEUE, true);
    }

    @Bean
    Binding promotionBinding(Queue promotionQueue, TopicExchange exchange) {
        return BindingBuilder.bind(promotionQueue).to(exchange).with(PROMOTION_ROUTING_KEY);
    }

    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
