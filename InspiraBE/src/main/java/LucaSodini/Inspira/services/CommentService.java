package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Comment;
import LucaSodini.Inspira.payloads.CommentDTO;
import LucaSodini.Inspira.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeService likeService;

    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }
    public CommentDTO toCommentDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getUser().getUsername(),
                comment.getUser().getAvatarUrl(),
                comment.getCreatedAt()
        );
    }

    public List<CommentDTO> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdWithUser(postId);
        return comments.stream()
                .map(this::toCommentDTO)
                .toList();
    }


    public Comment updateComment(Long id, Comment updatedComment) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(updatedComment.getContent());
            comment.setMediaUrl(updatedComment.getMediaUrl());
            comment.setUpdatedAt(updatedComment.getUpdatedAt());
            return commentRepository.save(comment);
        }).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }


    public void deleteCommentsByPost(Long postId) {
        // Recupera i commenti associati al post
        List<Comment> comments = commentRepository.findByPostId(postId);

        // Per ogni commento, elimina i like associati
        for (Comment comment : comments) {
            likeService.deleteLikesByComment(comment.getId()); // Elimina i like del commento
        }

        // Ora elimina tutti i commenti del post
        commentRepository.deleteAll(comments);
    }
    public void deleteCommentsByUser(Long userId) {
        // Recupera tutti i commenti associati all'utente
        List<Comment> comments = commentRepository.findByUserId(userId);

        // Per ogni commento, elimina i like associati
        for (Comment comment : comments) {
            likeService.deleteLikesByComment(comment.getId()); // Elimina i like del commento
        }

        // Ora elimina tutti i commenti dell'utente
        commentRepository.deleteAll(comments);
    }


}
