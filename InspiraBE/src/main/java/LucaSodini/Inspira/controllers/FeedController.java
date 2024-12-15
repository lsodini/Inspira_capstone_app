package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.Artwork;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.payloads.PostDTO;
import LucaSodini.Inspira.services.ArtworkService;
import LucaSodini.Inspira.services.FollowService;
import LucaSodini.Inspira.services.PostService;
import LucaSodini.Inspira.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    @Autowired
    private FollowService followService;

    @Autowired
    private PostService postService;

    @Autowired
    private ArtworkService artworkService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Object>> getFeed(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username);

        // Ottieni gli utenti seguiti
        List<User> followedUsers = followService.getFollowing(currentUser.getId());

        // Recupera i post dagli utenti seguiti
        List<PostDTO> posts = followedUsers.stream()
                .flatMap(user -> postService.getUserPosts(user.getId()).stream())
                .map(postService::toPostDTO)
                .toList();

        // Recupera le opere d'arte disponibili dagli utenti seguiti
        List<Artwork> artworks = followedUsers.stream()
                .flatMap(user -> artworkService.getArtworksByUserId(user.getId()).stream())
                .filter(artwork -> !artwork.getSold()) // Mostra solo le opere non vendute
                .toList();

        // Combina i dati (puoi aggiungere un ordinamento per data di creazione)
        List<Object> feed = Stream.concat(posts.stream(), artworks.stream())
                .sorted((a, b) -> {
                    // Ordinamento per data (esempio: per oggetti con getCreatedAt)
                    if (a instanceof PostDTO postA && b instanceof Artwork artworkB) {
                        return artworkB.getCreatedAt().compareTo(postA.getCreatedAt());
                    } else if (a instanceof Artwork artworkA && b instanceof PostDTO postB) {
                        return postB.getCreatedAt().compareTo(artworkA.getCreatedAt());
                    }
                    return 0;
                })
                .toList();

        return ResponseEntity.ok(feed);
    }
}
