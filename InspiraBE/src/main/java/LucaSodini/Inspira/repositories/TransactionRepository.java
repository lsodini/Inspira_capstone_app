package LucaSodini.Inspira.repositories;

import LucaSodini.Inspira.entities.Transaction;
import LucaSodini.Inspira.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}

