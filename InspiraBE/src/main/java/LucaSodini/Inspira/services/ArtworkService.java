package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.Artwork;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.exceptions.BadRequestException;
import LucaSodini.Inspira.repositories.ArtworkRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private Cloudinary cloudinaryUploader;
    public Artwork uploadArtwork(MultipartFile file, Artwork artwork) {
        if (file.isEmpty()) {
            throw new BadRequestException("Il file non può essere vuoto");
        }

        String mediaUrl;
        try {
            Map uploadResult = cloudinaryUploader.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            mediaUrl = (String) uploadResult.get("url");
        } catch (IOException e) {
            throw new BadRequestException("Errore durante l'upload del file su Cloudinary.");
        }


        if (artwork.getMediaUrls() == null) {
            artwork.setMediaUrls(new ArrayList<>());
        }


        artwork.getMediaUrls().add(mediaUrl);

        artwork.setCreatedAt(LocalDateTime.now());
        artwork.setUpdatedAt(LocalDateTime.now());

        return artworkRepository.save(artwork);
    }

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

    public Artwork updateArtwork(Long id, Artwork updatedArtwork, MultipartFile file) {
        Artwork existingArtwork = getArtworkById(id);

        // Aggiorna i dettagli testuali
        existingArtwork.setTitle(updatedArtwork.getTitle());
        existingArtwork.setDescription(updatedArtwork.getDescription());
        existingArtwork.setPrice(updatedArtwork.getPrice());
        existingArtwork.setUpdatedAt(LocalDateTime.now());

        // Gestisci i file multimediali, se forniti
        if (file != null && !file.isEmpty()) {
            String mediaUrl;
            try {
                Map uploadResult = cloudinaryUploader.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                mediaUrl = (String) uploadResult.get("url");
            } catch (IOException e) {
                throw new BadRequestException("Errore durante l'upload del file su Cloudinary.");
            }

            if (existingArtwork.getMediaUrls() == null) {
                existingArtwork.setMediaUrls(new ArrayList<>());
            }

            existingArtwork.getMediaUrls().add(mediaUrl);
        }

        return artworkRepository.save(existingArtwork);
    }


    public void deleteArtwork(Long id) {
        Artwork artwork = getArtworkById(id);
        artworkRepository.delete(artwork);
    }

    public Artwork markAsSold(Long id, User user) {
        Artwork artwork = getArtworkById(id);


        if (artwork.getSold()) {
            throw new RuntimeException("Artwork is already sold");
        }


        artwork.setSold(true);
        artwork.setUpdatedAt(LocalDateTime.now());
        return artworkRepository.save(artwork);
    }

    public Long countArtworksByUserId(Long userId) {
        return artworkRepository.countByUserId(userId);
    }

    public List<Artwork> getAvailableArtworks() {
        return artworkRepository.findAvailableArtworks();
    }

    public List<Artwork> getArtworksByUserId(Long userId) {
        return artworkRepository.findByUserId(userId);
    }
}
