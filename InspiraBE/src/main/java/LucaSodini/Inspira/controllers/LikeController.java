package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.Like;
import LucaSodini.Inspira.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;


    @PostMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Like> likePost(@PathVariable Long userId, @PathVariable Long postId) {
        Like like = likeService.likePost(userId, postId);
        return ResponseEntity.ok(like);
    }


    @DeleteMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Void> unlikePost(@PathVariable Long userId, @PathVariable Long postId) {
        likeService.unlikePost(userId, postId);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/comment/{commentId}/user/{userId}")
    public ResponseEntity<Like> likeComment(@PathVariable Long userId, @PathVariable Long commentId) {
        Like like = likeService.likeComment(userId, commentId);
        return ResponseEntity.ok(like);
    }

    @DeleteMapping("/comment/{commentId}/user/{userId}")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long userId, @PathVariable Long commentId) {
        likeService.unlikeComment(userId, commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPost(@PathVariable Long postId) {
        List<Like> likes = likeService.getLikesByPost(postId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/count/comment/{commentId}")
    public ResponseEntity<Long> getLikeCountByComment(@PathVariable Long commentId) {
        Long count = likeService.getLikeCountByComment(commentId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<Like>> getLikesByComment(@PathVariable Long commentId) {
        List<Like> likes = likeService.getLikesByComment(commentId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Boolean> hasUserLikedPost(@PathVariable Long userId, @PathVariable Long postId) {
        boolean hasLiked = likeService.hasUserLikedPost(userId, postId);
        return ResponseEntity.ok(hasLiked);
    }

    @GetMapping("/comment/{commentId}/user/{userId}")
    public ResponseEntity<Boolean> hasUserLikedComment(@PathVariable Long userId, @PathVariable Long commentId) {
        boolean hasLiked = likeService.hasUserLikedComment(userId, commentId);
        return ResponseEntity.ok(hasLiked);
    }
}
