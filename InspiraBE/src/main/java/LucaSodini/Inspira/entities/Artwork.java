package LucaSodini.Inspira.entities;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private String mediaUrl;

    private Float price;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Boolean sold = false;
}

