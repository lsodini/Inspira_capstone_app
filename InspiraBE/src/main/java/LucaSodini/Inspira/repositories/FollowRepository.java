package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    // Controlla se un utente segue un altro
    boolean existsByFollowerIdAndFollowedId(Long followerId, Long followedId);

    // Trova tutti i follower di un utente
    List<Follow> findByFollowedId(Long followedId);

    // Trova tutti gli utenti seguiti da un utente
    List<Follow> findByFollowerId(Long followerId);

    // Conta il numero di follower di un utente
    Long countByFollowedId(Long followedId);

    // Conta il numero di utenti seguiti da un utente
    Long countByFollowerId(Long followerId);

    Optional<Follow> findByFollowerIdAndFollowedId(Long followerId, Long followedId);
}
