package LucaSodini.Inspira.entities;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private Comment comment;

    private LocalDateTime createdAt;

    public Like(User user, Post post) {
        this.user = user;
        this.post = post;
        this.createdAt = LocalDateTime.now();
    }

    public Like(User user, Comment comment) {
        this.user = user;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }
}
