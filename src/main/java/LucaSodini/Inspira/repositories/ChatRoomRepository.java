package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    // Trova la stanza tra due utenti (se esiste)
    @Query("SELECT c FROM ChatRoom c WHERE (c.user1.id = :userId1 AND c.user2.id = :userId2) " +
            "OR (c.user1.id = :userId2 AND c.user2.id = :userId1)")
    Optional<ChatRoom> findChatRoomBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
