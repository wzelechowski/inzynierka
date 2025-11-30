package pizzeria.orders.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient menuWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("http://menu-service/api/v1/menu")
                .build();
    }
}
