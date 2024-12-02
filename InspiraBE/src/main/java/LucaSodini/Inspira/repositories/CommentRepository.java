package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
//Gestisce la creazione e modifica di commenti sui post.
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Trova tutti i commenti di un post specifico
    List<Comment> findByPostId(Long postId);

    // Conta i commenti di un post
    Long countByPostId(Long postId);

}
