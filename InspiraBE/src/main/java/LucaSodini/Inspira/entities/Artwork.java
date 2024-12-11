package LucaSodini.Inspira.entities;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "artworks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User user;

    private String title;
    private String description;
    @ElementCollection
    @CollectionTable(name = "artwork_media_urls", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "media_url")
    private List<String> mediaUrls;

    private Float price;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Boolean sold = false;
}

