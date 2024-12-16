package LucaSodini.Inspira.payloads;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private String username;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
