package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.Post;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.payloads.PostDTO;
import LucaSodini.Inspira.services.CommentService;
import LucaSodini.Inspira.services.LikeService;
import LucaSodini.Inspira.services.PostService;
import LucaSodini.Inspira.services.UserService;
import LucaSodini.Inspira.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private LikeService likeService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO, Authentication authentication) {
        String username = authentication.getName();
        Post createdPost = postService.createPost(postDTO, username);
        PostDTO responsePostDTO = postService.toPostDTO(createdPost);
        return ResponseEntity.ok(responsePostDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        PostDTO postDTO = postService.toPostDTO(post);
        return ResponseEntity.ok(postDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getUserPosts(@PathVariable Long userId) {
        List<Post> posts = postService.getUserPosts(userId);
        List<PostDTO> postDTOs = posts.stream()
                .map(postService::toPostDTO)
                .toList();
        return ResponseEntity.ok(postDTOs);
    }

    @GetMapping("/user/{userId}/posts-count")
    public ResponseEntity<Integer> getUserPostsCount(@PathVariable Long userId) {
        int postsCount = postService.countPosts(userId);
        return ResponseEntity.ok(postsCount);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePostWithCommentsAndLikes(@PathVariable Long id, Authentication authentication) {

        String username = authentication.getName();
        User user = userService.findByUsername(username);

        // Recupera il post
        Post post = postService.getPostById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Verifica che l'utente sia l'amministratore o il proprietario del post
        if (user.getRole() == UserRole.ADMIN || post.getUser().getUsername().equals(username)) {

            // Elimina prima i commenti associati al post
            commentService.deleteCommentsByPost(id);

            // Elimina i like associati al post
            likeService.deleteLikesByPost(id);

            // Elimina i like associati ai commenti
            likeService.deleteLikesByComments(id);

            // Ora che i commenti e i like sono stati eliminati, elimina il post
            postService.deletePost(id);

            return ResponseEntity.ok("Post and related comments, likes deleted successfully.");
        } else {
            return ResponseEntity.status(403).body("Only the post owner or an ADMIN can delete this post.");
        }
    }


    @GetMapping("/authenticated-user/posts-count")
    public ResponseEntity<Integer> getAuthenticatedUserPostsCount(Authentication authentication) {
        String username = authentication.getName();

        User user = userService.findByUsername(username);
        int postsCount = postService.countPosts(user.getId());
        return ResponseEntity.ok(postsCount);
    }



    @GetMapping("/")
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        List<PostDTO> postDTOs = posts.stream()
                .map(postService::toPostDTO)
                .toList();
        return ResponseEntity.ok(postDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @RequestBody PostDTO postDTO) {
        Post updatedPost = postService.updatePost(id, postDTO);
        PostDTO responsePostDTO = postService.toPostDTO(updatedPost);
        return ResponseEntity.ok(responsePostDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id, Authentication authentication) {

        String username = authentication.getName();

        User user = userService.findByUsername(username);

        Post post = postService.getPostById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Se l'utente è un ADMIN o è il proprietario del post, può eliminarlo
        if (user.getRole() == UserRole.ADMIN || post.getUser().getUsername().equals(username)) {
            postService.deletePost(id);
            return ResponseEntity.ok("Post deleted successfully");
        } else {
            return ResponseEntity.status(403).body("Only the post owner or an ADMIN can delete this post.");
        }
    }
}
