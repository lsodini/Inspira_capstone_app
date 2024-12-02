package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
//gestisce le interazioni di like sui post
public interface LikeRepository extends JpaRepository<Like, Long> {
    // Trova tutti i like su un post specifico
    List<Like> findByPostId(Long postId);

    // Trova tutti i like di un utente su vari post
    @Query("SELECT l FROM Like l WHERE l.user.id = :userId")
    List<Like> findByUserId(@Param("userId") Long userId);

    // Verifica se un utente ha già messo like a un post
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    // Conta i like su un post
    Long countByPostId(Long postId);
}
