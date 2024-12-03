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

    // Aggiungi un like a un post
    public Like likePost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (likeRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new RuntimeException("User has already liked this post");
        }

        Like like = new Like(user, post);
        return likeRepository.save(like);
    }

    // Aggiungi un like a un commento
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

    // Rimuove un like
    public void unlike(Long likeId) {
        likeRepository.deleteById(likeId);
    }

    // Recupera tutti i like di un post
    public List<Like> getLikesByPost(Long postId) {
        return likeRepository.findByPostId(postId);
    }

    // Recupera tutti i like di un commento
    public List<Like> getLikesByComment(Long commentId) {
        return likeRepository.findByCommentId(commentId);
    }

    // Verifica se un utente ha messo like a un post
    public boolean hasUserLikedPost(Long userId, Long postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }

    // Verifica se un utente ha messo like a un commento
    public boolean hasUserLikedComment(Long userId, Long commentId) {
        return likeRepository.existsByUserIdAndCommentId(userId, commentId);
    }
}
