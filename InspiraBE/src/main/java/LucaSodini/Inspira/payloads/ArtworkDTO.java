package LucaSodini.Inspira.payloads;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtworkDTO {
    private Long id;
    private String title;
    private String description;
    private List<String> mediaUrls;
    private String avatarUrl;
    private Float price;
    private LocalDateTime createdAt;
    private Boolean sold;


}
