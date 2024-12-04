package LucaSodini.Inspira.entities;

import LucaSodini.Inspira.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"password","enabled","accountNonLocked","credentialsNonExpired","accountNonExpired","authorities"})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String bio;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public User(String name, String surname, String username, String email, String password, String avatarUrl, LocalDateTime createdAt, LocalDateTime updatedAt, UserRole role, String bio) {
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatarUrl =  avatarUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.role = role;
        this.bio = bio;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> listaGranted = new ArrayList<>();
        if (role != null) {
            listaGranted.add(new SimpleGrantedAuthority(role.getAuthority()));
        }
        return listaGranted;
    }
}
