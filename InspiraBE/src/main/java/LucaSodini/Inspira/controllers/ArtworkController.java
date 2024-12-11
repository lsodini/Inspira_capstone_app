package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.Artwork;
import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.enums.UserRole;
import LucaSodini.Inspira.services.ArtworkService;
import LucaSodini.Inspira.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<Artwork> createArtwork(@RequestBody Artwork artwork, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);


        if (user.getRole() != UserRole.ARTIST) {
            return ResponseEntity.status(403).body(null);
        }

        return ResponseEntity.ok(artworkService.createArtwork(artwork, user));
    }

    @PostMapping("/upload")
    public ResponseEntity<Artwork> uploadArtwork(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Float price,
            Authentication authentication) {

        User user = userService.findByUsername(authentication.getName());

        Artwork artwork = new Artwork();
        artwork.setTitle(title);
        artwork.setDescription(description);
        artwork.setPrice(price);
        artwork.setUser(user);

        Artwork savedArtwork = artworkService.uploadArtwork(file, artwork);
        return ResponseEntity.ok(savedArtwork);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Float price,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);


        if (user.getRole() != UserRole.ARTIST) {
            return ResponseEntity.status(403).body(null);
        }

        Artwork updatedArtwork = new Artwork();
        updatedArtwork.setTitle(title);
        updatedArtwork.setDescription(description);
        updatedArtwork.setPrice(price);

        Artwork savedArtwork = artworkService.updateArtwork(id, updatedArtwork, file);
        return ResponseEntity.ok(savedArtwork);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArtwork(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        Artwork artwork = artworkService.getArtworkById(id);


        if (user.getRole() == UserRole.ADMIN || artwork.getUser().equals(user)) {
            artworkService.deleteArtwork(id);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(403).body("Only the artist who created the artwork or an admin can delete it.");
    }

    @PatchMapping("/{id}/mark-sold")
    public ResponseEntity<Artwork> markAsSold(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(artworkService.markAsSold(id, user));
    }
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getArtworkCountByUserId(@PathVariable Long userId) {
        Long count = artworkService.countArtworksByUserId(userId);
        return ResponseEntity.ok(count);
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
