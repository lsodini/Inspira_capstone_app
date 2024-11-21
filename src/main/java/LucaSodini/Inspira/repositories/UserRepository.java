package LucaSodini.Inspira.repositories;


import LucaSodini.Inspira.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
//Gestisce gli utenti e le loro interazioni. Necessario per autenticazione, profili, ricerca utenti, ecc.
public interface UserRepository extends JpaRepository<User, Long> {
    // Autenticazione
    User findByEmail(String email);
    User findByUsername(String username);

    // Controllo se utente esiste by email o by username
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // Ricerca utenti
    List<User> findByUsernameContainingIgnoreCase(String keyword); // Ricerca utenti per username
    List<User> findByFullNameContainingIgnoreCase(String keyword); // Ricerca utenti per nome completo

    // Suggerimenti amici (esempio: persone che seguono chi segui)
    @Query("SELECT u FROM User u WHERE u.id NOT IN :excludedIds")
    List<User> findSuggestedUsers(@Param("excludedIds") List<Long> excludedIds);
}

