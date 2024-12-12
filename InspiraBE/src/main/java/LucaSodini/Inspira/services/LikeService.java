package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Comment;
import LucaSodini.Inspira.entities.Like;
import LucaSodini.Inspira.entities.Post;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.repositories.CommentRepository;
import LucaSodini.Inspira.repositories.LikeRepository;
import LucaSodini.Inspira.repositories.PostRepository;
import LucaSodini.Inspira.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;


    public Like likePost(Long userId, Long postId) {
        // Controlla se l'utente ha già messo like al post
        if (likeRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException("Like already exists");
        }

        // Crea un nuovo like
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);

        return likeRepository.save(like);
    }


    public void unlikePost(Long userId, Long postId) {
        Like like = likeRepository.findByUserIdAndPostId(userId, postId)
                .orElseThrow(() -> new RuntimeException("Like not found"));
        likeRepository.delete(like);
    }


    public Like likeComment(Long userId, Long commentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (likeRepository.existsByUserIdAndCommentId(userId, commentId)) {
            throw new RuntimeException("User has already liked this comment");
        }

        Like like = new Like(user, comment);
        return likeRepository.save(like);
    }


    public void unlikeComment(Long userId, Long commentId) {
        Like like = likeRepository.findByUserIdAndCommentId(userId, commentId)
                .orElseThrow(() -> new RuntimeException("Like not found"));
        likeRepository.delete(like);
    }


    public List<Like> getLikesByPost(Long postId) {
        return likeRepository.findByPostId(postId);
    }


    public Long getLikeCountByComment(Long commentId) {
        return likeRepository.countByCommentId(commentId);
    }


    public List<Like> getLikesByComment(Long commentId) {
        return likeRepository.findByCommentId(commentId);
    }


    public boolean hasUserLikedPost(Long userId, Long postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }


    public boolean hasUserLikedComment(Long userId, Long commentId) {
        return likeRepository.existsByUserIdAndCommentId(userId, commentId);
    }


    public void deleteLikesByPost(Long postId) {
        List<Like> likes = likeRepository.findByPostId(postId);
        likeRepository.deleteAll(likes);
    }


    public void deleteLikesByComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        for (Comment comment : comments) {
            List<Like> commentLikes = likeRepository.findByCommentId(comment.getId());
            likeRepository.deleteAll(commentLikes);
        }
    }
    // Metodo per eliminare i like di un commento
    public void deleteLikesByComment(Long commentId) {
        likeRepository.deleteByCommentId(commentId);
    }
}
