package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Post;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.payloads.PostDTO;
import LucaSodini.Inspira.repositories.PostRepository;
import LucaSodini.Inspira.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;


    public PostDTO toPostDTO(Post post) {
        return new PostDTO(
                post.getId(),
                post.getContent(),
                post.getMediaUrl(),
                post.getUser().getUsername(),
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
