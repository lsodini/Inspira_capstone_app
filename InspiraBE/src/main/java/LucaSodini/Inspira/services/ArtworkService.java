package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Artwork;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.repositories.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepository;

    public List<Artwork> getAllArtworks() {
        return artworkRepository.findAll();
    }

    public Artwork getArtworkById(Long id) {
        return artworkRepository.findById(id).orElseThrow(() -> new RuntimeException("Artwork not found"));
    }

    public Artwork createArtwork(Artwork artwork, User creator) {
        artwork.setUser(creator);
        artwork.setCreatedAt(LocalDateTime.now());
        artwork.setUpdatedAt(LocalDateTime.now());
        artwork.setSold(false);
        return artworkRepository.save(artwork);
    }

    public Artwork updateArtwork(Long id, Artwork updatedArtwork) {
        Artwork existingArtwork = getArtworkById(id);
        existingArtwork.setTitle(updatedArtwork.getTitle());
        existingArtwork.setDescription(updatedArtwork.getDescription());
        existingArtwork.setMediaUrl(updatedArtwork.getMediaUrl());
        existingArtwork.setPrice(updatedArtwork.getPrice());
        existingArtwork.setUpdatedAt(LocalDateTime.now());
        return artworkRepository.save(existingArtwork);
    }

    public void deleteArtwork(Long id) {
        Artwork artwork = getArtworkById(id);
        artworkRepository.delete(artwork);
    }

    public Artwork markAsSold(Long id) {
        Artwork artwork = getArtworkById(id);
        if (artwork.getSold()) {
            throw new RuntimeException("Artwork is already sold");
        }
        artwork.setSold(true);
        artwork.setUpdatedAt(LocalDateTime.now());
        return artworkRepository.save(artwork);
    }

    public List<Artwork> getAvailableArtworks() {
        return artworkRepository.findAvailableArtworks();
    }

    public List<Artwork> getArtworksByUserId(Long userId) {
        return artworkRepository.findByUserId(userId);
    }
}
