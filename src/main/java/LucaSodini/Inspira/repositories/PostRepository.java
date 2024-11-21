package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
//Gestisce la creazione, modifica, e recupero dei post condivisi dagli utenti
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long userId);

    // Trova i post più recenti (ordinati per data)
    List<Post> findAllByOrderByCreatedAtDesc();

    // Trova i post con una lista di utenti specifici (feed)
    @Query("SELECT p FROM Post p WHERE p.user.id IN :userIds ORDER BY p.createdAt DESC")
    List<Post> findByUserIds(@Param("userIds") List<Long> userIds);

    // Cerca post per parola chiave (nel contenuto o nei media URL)
    List<Post> findByContentContainingIgnoreCase(String keyword);

    // Controlla il numero di like e commenti di un post (via count nei servizi)
    Long countByLikes(Post post);
    Long countByComments(Post post);
}

