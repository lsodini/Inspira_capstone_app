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

    }




