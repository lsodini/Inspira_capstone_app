package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;


    @PostMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<?> likePost(@PathVariable Long userId, @PathVariable Long postId) {
        return ResponseEntity.ok(likeService.likePost(userId, postId));
    }

    @PostMapping("/comment/{commentId}/user/{userId}")
    public ResponseEntity<?> likeComment(@PathVariable Long userId, @PathVariable Long commentId) {
        return ResponseEntity.ok(likeService.likeComment(userId, commentId));
    }


    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getLikesByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikesByPost(postId));
    }
    // Recupera il conteggio dei like di un commento
    @GetMapping("/count/comment/{commentId}")
    public ResponseEntity<Long> getLikeCountByComment(@PathVariable Long commentId) {
        Long likeCount = likeService.getLikeCountByComment(commentId);
        return ResponseEntity.ok(likeCount);
    }


    // Recupera tutti i like di un commento
    @GetMapping("/comment/{commentId}")
    public ResponseEntity<?> getLikesByComment(@PathVariable Long commentId) {
        return ResponseEntity.ok(likeService.getLikesByComment(commentId));
    }

    // Verifica se un utente ha messo like a un post o a un commento
    @GetMapping("/check/post")
    public ResponseEntity<?> hasUserLikedPost(@RequestParam Long userId, @RequestParam Long postId) {
        return ResponseEntity.ok(likeService.hasUserLikedPost(userId, postId));
    }

    @GetMapping("/check/comment")
    public ResponseEntity<?> hasUserLikedComment(@RequestParam Long userId, @RequestParam Long commentId) {
        return ResponseEntity.ok(likeService.hasUserLikedComment(userId, commentId));
    }

    // Rimuove un like
    @DeleteMapping("/{likeId}")
    public ResponseEntity<?> removeLike(@PathVariable Long likeId) {
        likeService.unlike(likeId);
        return ResponseEntity.ok().build();
    }
}
