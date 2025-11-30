package pizzeria.orders.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean
    @LoadBalanced
    public WebClient menuWebClient(WebClient.Builder builder,
                                   @Value("${menu-service.url}") String menuServiceUrl) {
        return builder
                .baseUrl(menuServiceUrl)
                .build();
    }
}
