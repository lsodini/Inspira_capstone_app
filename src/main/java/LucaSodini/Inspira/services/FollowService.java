package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Follow;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.repositories.FollowRepository;
import LucaSodini.Inspira.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;


    public void followUser(Long followerId, Long followedId) {
        if (followRepository.existsByFollowerIdAndFollowedId(followerId, followedId)) {
            throw new RuntimeException("You are already following this user");
        }

        User follower = userRepository.findById(followerId).orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId).orElseThrow(() -> new RuntimeException("Followed user not found"));

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowed(followed);
        follow.setFollowedAt(LocalDateTime.now());

        followRepository.save(follow);
    }


    public void unfollowUser(Long followerId, Long followedId) {
        Follow follow = followRepository.findByFollowerIdAndFollowedId(followerId, followedId)
                .orElseThrow(() -> new RuntimeException("Follow relationship not found"));

        followRepository.delete(follow);
    }


    public List<User> getFollowers(Long userId) {
        return followRepository.findByFollowedId(userId).stream()
                .map(Follow::getFollower)
                .toList();
    }


    public List<User> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId).stream()
                .map(Follow::getFollowed)
                .toList();
    }


    public Long countFollowers(Long userId) {
        return followRepository.countByFollowedId(userId);
    }


    public Long countFollowing(Long userId) {
        return followRepository.countByFollowerId(userId);
    }


    public boolean isFollowing(Long followerId, Long followedId) {
        return followRepository.existsByFollowerIdAndFollowedId(followerId, followedId);
    }
    //questo da la lista dei suggeriti
    public List<User> suggestUsers(Long userId) {
        List<Long> excludedIds = getFollowing(userId).stream()
                .map(User::getId)
                .toList();
        excludedIds.add(userId); // Esclude l'utente stesso

        return userRepository.findSuggestedUsers(excludedIds);
    }
}
