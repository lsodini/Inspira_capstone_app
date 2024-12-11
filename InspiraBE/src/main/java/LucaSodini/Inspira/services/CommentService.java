package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Comment;
import LucaSodini.Inspira.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId);
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
        List<Comment> comments = commentRepository.findByPostId(postId);
        commentRepository.deleteAll(comments);
    }

}
