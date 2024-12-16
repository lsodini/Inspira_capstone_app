package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long userId);

    // Trova i post più recenti (ordinati per data)
    List<Post> findAllByOrderByCreatedAtDesc();

        // Trova i post di un utente specifico
        @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
        List<Post> findByUserIdWithUser(@Param("userId") Long userId);

        // Trova tutti i post più recenti, includendo i dettagli utente
        @Query("SELECT p FROM Post p JOIN FETCH p.user ORDER BY p.createdAt DESC")
        List<Post> findAllWithUser();

        // Trova i post con una lista di utenti specifici (feed), includendo i dettagli utente
        @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.user.id IN :userIds ORDER BY p.createdAt DESC")
        List<Post> findByUserIdsWithUser(@Param("userIds") List<Long> userIds);

        // Cerca post per parola chiave, includendo i dettagli utente
        @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY p.createdAt DESC")
        List<Post> searchByContentWithUser(@Param("keyword") String keyword);
    }




