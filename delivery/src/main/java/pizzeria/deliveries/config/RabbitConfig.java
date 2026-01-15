package pizzeria.deliveries.config;

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

    public static final String DELIVERY_QUEUE = "delivery.queue";
    public static final String SUPPLIER_QUEUE = "supplier.queue";
    public static final String DELIVERY_ROUTING_KEY = "order.delivery.requested";
    public static final String ORDER_ROUTING_KEY = "delivery.status.changed";
    public static final String SUPPLIER_CREATED_ROUTING_KEY = "supplier.created";
    public static final String SUPPLIER_DELETED_ROUTING_KEY = "supplier.deleted";

    @Bean
    TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    Queue orderQueue() {
        return new Queue(DELIVERY_QUEUE, true);
    }

    @Bean
    Queue supplierQueue() {
        return new Queue(SUPPLIER_QUEUE, true);
    }

    @Bean
    Binding orderBinding(Queue orderQueue, TopicExchange exchange) {
        return BindingBuilder.bind(orderQueue).to(exchange).with(DELIVERY_ROUTING_KEY);
    }

    @Bean
    Binding supplierCreatedBinding(Queue supplierQueue, TopicExchange exchange) {
        return BindingBuilder.bind(supplierQueue).to(exchange).with(SUPPLIER_CREATED_ROUTING_KEY);
    }

    @Bean
    Binding supplierDeletedBinding(Queue supplierQueue, TopicExchange exchange) {
        return BindingBuilder.bind(supplierQueue).to(exchange).with(SUPPLIER_DELETED_ROUTING_KEY);
    }

    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
