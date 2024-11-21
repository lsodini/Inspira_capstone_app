package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
//gestisce i messaggi di una stanza
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Trova tutti i messaggi di una stanza
    List<ChatMessage> findByChatRoomId(Long chatRoomId);

    // Trova i messaggi recenti
    @Query("SELECT m FROM ChatMessage m WHERE m.chatRoom.id = :chatRoomId ORDER BY m.sentAt DESC")
    List<ChatMessage> findRecentMessagesByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}
