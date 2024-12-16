package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
//Gestisce la creazione e modifica di commenti sui post.
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Trova tutti i commenti di un post specifico
    List<Comment> findByPostId(Long postId);

    // Trova tutti i commenti di un post, includendo l'utente associato
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.post.id = :postId")
    List<Comment> findByPostIdWithUser(@Param("postId") Long postId);
    // Conta i commenti di un post
    Long countByPostId(Long postId);

    @Modifying //Indica che la query è di tipo update o delete
    @Transactional
    @Query("DELETE FROM Comment c WHERE c.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);

}
