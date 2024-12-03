package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.services.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private ArtworkService artworkService;

    @PostMapping("/buy/{artworkId}")
    public ResponseEntity<?> buyArtwork(@PathVariable Long artworkId) {
        // Simulazione transazione di pagamento
        boolean paymentSuccess = true; // Simulazione: dovrebbe arrivare dal gateway

        if (paymentSuccess) {
            return ResponseEntity.ok(artworkService.markAsSold(artworkId));
        } else {
            return ResponseEntity.badRequest().body("Transaction failed");
        }
    }
}
