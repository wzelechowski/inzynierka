package pizzeria.menu.common.exception;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorResponse(
    String message,
    HttpStatus status,
    String path,
    LocalDateTime timestamp
){}
