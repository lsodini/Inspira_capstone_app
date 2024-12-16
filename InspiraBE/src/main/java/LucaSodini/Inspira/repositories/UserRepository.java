package LucaSodini.Inspira.repositories;


import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(long id);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findByRole(UserRole userRole);

    // Ricerca utenti
    List<User> findByUsernameContainingIgnoreCase(String keyword); // Ricerca utenti per username con parola chiave

    // Suggerimenti amici
    //La @Param("excludedIds") è utilizzata per legare il parametro excludedIds nel metodo alla variabile :excludedIds nella query JPQL
     @Query("SELECT u FROM User u WHERE u.id NOT IN :excludedIds")
    List<User> findSuggestedUsers(@Param("excludedIds") List<Long> excludedIds);
}

