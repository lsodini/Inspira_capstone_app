package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
//Gestisce la creazione e gestione degli oggetti vendibili nello shop
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    // Trova tutti gli artwork di un utente specifico
    List<Artwork> findByUserId(Long userId);

    // Cerca artwork per titolo o descrizione
    List<Artwork> findByTitleContainingIgnoreCase(String keyword);

    // Trova tutti gli artwork disponibili (non venduti)
    @Query("SELECT a FROM Artwork a WHERE a.sold = false")
    List<Artwork> findAvailableArtworks();

    // Conta gli artwork di un utente
    Long countByUserId(Long userId);
}

