package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Post;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.enums.UserRole;
import LucaSodini.Inspira.payloads.PostDTO;
import LucaSodini.Inspira.repositories.CommentRepository;
import LucaSodini.Inspira.repositories.PostRepository;
import LucaSodini.Inspira.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeService likeService;

    @Autowired
    private CommentService commentService;


    public PostDTO toPostDTO(Post post) {
        return new PostDTO(
                post.getId(),
                post.getContent(),
                post.getMediaUrl(),
                post.getUser().getUsername(),
                post.getUser().getAvatarUrl(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }


    public Post createPost(PostDTO postDTO, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(postDTO.getContent());
        post.setMediaUrl(postDTO.getMediaUrl());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public int countPosts(Long userId) {
        return postRepository.findByUserId(userId).size();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    @Transactional
    public void deletePostAndDependencies(Long postId, String username) {
        // Recupera il post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Verifica autorizzazione (admin o proprietario del post)
        if (!post.getUser().getUsername().equals(username) &&
                !userRepository.findByUsername(username).orElseThrow(() ->
                        new RuntimeException("User not found")).getRole().equals(UserRole.ADMIN)) {
            throw new RuntimeException("Solo il proprietario del post o un  ADMIN possono eliminare questo post.");
        }

        // Elimina i commenti associati al post
        commentService.deleteCommentsByPost(postId);

        // Elimina i like associati al post e ai commenti del post
        likeService.deleteLikesByPost(postId);


        // Elimina il post
        postRepository.deleteById(postId);
    }

    public List<Post> getUserPosts(Long userId) {
        return postRepository.findByUserId(userId);
    }


    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }


    public Post updatePost(Long id, PostDTO postDTO) {
        return postRepository.findById(id).map(post -> {
            post.setContent(postDTO.getContent());
            post.setMediaUrl(postDTO.getMediaUrl());
            post.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }).orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }


    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
