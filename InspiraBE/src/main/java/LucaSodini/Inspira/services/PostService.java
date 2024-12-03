package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Post;
import LucaSodini.Inspira.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
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

    public Post updatePost(Long id, Post updatedPost) {
        return postRepository.findById(id).map(post -> {
            post.setContent(updatedPost.getContent());
            post.setMediaUrl(updatedPost.getMediaUrl());
            post.setUpdatedAt(updatedPost.getUpdatedAt());
            return postRepository.save(post);
        }).orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
