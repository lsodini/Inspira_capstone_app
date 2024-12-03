package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.Artwork;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.services.ArtworkService;
import LucaSodini.Inspira.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        return ResponseEntity.ok(artworkService.getAllArtworks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.getArtworkById(id));
    }

    @PostMapping
    public ResponseEntity<Artwork> createArtwork(@RequestBody Artwork artwork, @RequestParam Long userId) {
        User creator = userService.findById(userId);
        return ResponseEntity.ok(artworkService.createArtwork(artwork, creator));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, @RequestBody Artwork updatedArtwork) {
        return ResponseEntity.ok(artworkService.updateArtwork(id, updatedArtwork));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteArtwork(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/mark-sold")
    public ResponseEntity<Artwork> markAsSold(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.markAsSold(id));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Artwork>> getAvailableArtworks() {
        return ResponseEntity.ok(artworkService.getAvailableArtworks());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Artwork>> getArtworksByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(artworkService.getArtworksByUserId(userId));
    }
}
