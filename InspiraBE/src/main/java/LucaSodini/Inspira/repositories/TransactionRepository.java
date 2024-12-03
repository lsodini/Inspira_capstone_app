package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Transaction;
import LucaSodini.Inspira.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Trova tutte le transazioni di un utente come compratore
    List<Transaction> findByBuyerId(Long buyerId);

    // Trova tutte le transazioni di un utente come venditore
    List<Transaction> findBySellerId(Long sellerId);

    // Trova tutte le transazioni associate a un'opera d'arte
    List<Transaction> findByArtworkId(Long artworkId);

    // Trova tutte le transazioni in uno stato specifico per un utente compratore
    List<Transaction> findByBuyerIdAndStatus(Long buyerId, TransactionStatus status);

    // Trova tutte le transazioni in uno stato specifico per un utente venditore
    List<Transaction> findBySellerIdAndStatus(Long sellerId, TransactionStatus status);

    // Conta le transazioni completate per un venditore
    Long countBySellerIdAndStatus(Long sellerId, TransactionStatus status);

    // Conta le transazioni completate per un compratore
    Long countByBuyerIdAndStatus(Long buyerId, TransactionStatus status);
}

