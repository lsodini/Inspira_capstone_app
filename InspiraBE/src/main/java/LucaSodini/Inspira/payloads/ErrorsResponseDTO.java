package LucaSodini.Inspira.payloads;

import java.time.LocalDateTime;

public record ErrorsResponseDTO(
        String message, LocalDateTime timestamp
) {
}