package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    // Trova tutti i like associati a un post
    List<Like> findByPostId(Long postId);

    // Trova tutti i like associati a un commento
    List<Like> findByCommentId(Long commentId);

    // Verifica se un utente ha messo like a un determinato post
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    // Verifica se un utente ha messo like a un determinato commento
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);

    void deleteByCommentId(Long commentId);


    // Conta il numero di like di un commento
    Long countByCommentId(Long commentId);

    // Trova il like di un utente su un determinato post
    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);

    // Trova il like di un utente su un determinato commento
   Optional<Like> findByUserIdAndCommentId(Long userId, Long commentId);
}
