package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    List<Like> findByPostId(Long postId);

    List<Like> findByCommentId(Long commentId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    boolean existsByUserIdAndCommentId(Long userId, Long commentId);

    Long countByPostId(Long postId);

    Long countByCommentId(Long commentId);
}
