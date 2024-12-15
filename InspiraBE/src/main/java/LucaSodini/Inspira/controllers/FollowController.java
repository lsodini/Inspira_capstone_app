package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.services.FollowService;
import LucaSodini.Inspira.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserService userService;



    @PostMapping("/{followerIdentifier}/follow/{followedIdentifier}")
    public ResponseEntity<Map<String, Long>> followUser(@PathVariable String followerIdentifier, @PathVariable String followedIdentifier) {
        try {
            // Converte lo username in ID se necessario
            Long followerId = resolveUserId(followerIdentifier);
            Long followedId = resolveUserId(followedIdentifier);

            followService.followUser(followerId, followedId);

            Long followersCount = followService.countFollowers(followedId);
            Long followingCount = followService.countFollowing(followerId);
            Map<String, Long> response = new HashMap<>();
            response.put("followersCount", followersCount);
            response.put("followingCount", followingCount);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    private Long resolveUserId(String identifier) {
        try {

            return Long.parseLong(identifier);
        } catch (NumberFormatException e) {

            User user = userService.findByUsername(identifier);
            if (user == null) {
                throw new RuntimeException("Utente non trovato");
            }
            return user.getId();
        }
    }

    @PostMapping("/{followerId}/unfollow/{followedId}")
    public ResponseEntity<Map<String, Long>> unfollowUser(@PathVariable Long followerId, @PathVariable Long followedId) {
        try {
            followService.unfollowUser(followerId, followedId);
            Long followersCount = followService.countFollowers(followedId);
            Long followingCount = followService.countFollowing(followerId);
            Map<String, Long> response = new HashMap<>();
            response.put("followersCount", followersCount);
            response.put("followingCount", followingCount);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable Long userId) {
        List<User> followers = followService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }


    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long userId) {
        List<User> following = followService.getFollowing(userId);
        return ResponseEntity.ok(following);
    }


    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<Long> countFollowers(@PathVariable Long userId) {
        Long followerCount = followService.countFollowers(userId);
        return ResponseEntity.ok(followerCount);
    }


    @GetMapping("/{userId}/following/count")
    public ResponseEntity<Long> countFollowing(@PathVariable Long userId) {
        Long followingCount = followService.countFollowing(userId);
        return ResponseEntity.ok(followingCount);
    }


    @GetMapping("/{followerId}/is-following/{followedId}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable Long followerId, @PathVariable Long followedId) {
        boolean isFollowing = followService.isFollowing(followerId, followedId);
        return ResponseEntity.ok(isFollowing);
    }


    @GetMapping("/{userId}/suggestions")
    public ResponseEntity<List<User>> suggestUsers(@PathVariable Long userId) {
        List<User> suggestedUsers = followService.suggestUsers(userId);
        return ResponseEntity.ok(suggestedUsers);
    }
}
