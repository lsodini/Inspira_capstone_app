package LucaSodini.Inspira.services;

import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.enums.UserRole;
import LucaSodini.Inspira.exceptions.BadRequestException;
import LucaSodini.Inspira.exceptions.NotFoundException;
import LucaSodini.Inspira.payloads.UserDTO;
import LucaSodini.Inspira.repositories.UserRepository;
import LucaSodini.Inspira.tools.MailGunSender;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder bcrypt;

    @Autowired
    private MailGunSender mailGunSender;

    @Autowired
    private Cloudinary cloudinaryUploader;

    public User findById(Long id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nessun utente trovato con ID: " + id));
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Nessun utente registrato con email: " + email));
    }

    public User findByUsername(String username) {
        return this.userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Nessun utente registrato con username: " + username));
    }

    public List<User> findAllUsers() {
        return this.userRepository.findAll();
    }

    public User registerUser(UserDTO body) {

        if (userRepository.findByEmail(body.email()).isPresent()) {
            throw new BadRequestException("L'email è già registrata!");
        }
        if (userRepository.findByUsername(body.username()).isPresent()) {
            throw new BadRequestException("Lo username è già in uso!");
        }

        User newUser = new User();
        newUser.setName(body.name());
        newUser.setSurname(body.surname());
        newUser.setUsername(body.username());
        newUser.setEmail(body.email());
        newUser.setPassword(bcrypt.encode(body.password()));
        newUser.setRole(UserRole.BUYER);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(newUser);

        mailGunSender.sendRegistrationEmail(savedUser);

        return savedUser;
    }

    public String uploadAvatar(MultipartFile file, Long userId) {
        String url;
        try {
            url = (String) cloudinaryUploader.uploader().upload(file.getBytes(), ObjectUtils.emptyMap()).get("url");
        } catch (IOException e) {
            throw new BadRequestException("Ci sono stati problemi con l'upload del file!");
        }

        User foundUser = this.findById(userId);
        foundUser.setAvatarUrl(url);
        userRepository.save(foundUser);

        return url;
    }

    public User becomeArtist(Long userId) {
        User user = this.findById(userId);

        if (user.getRole() == UserRole.ARTIST) {
            throw new BadRequestException("L'utente è già un artista!");
        }

        user.setRole(UserRole.ARTIST);
        user.setUpdatedAt(LocalDateTime.now());
        mailGunSender.sendBecomeArtistEmail(user);
        return userRepository.save(user);
    }


    public User updateUser(Long userId, UserDTO userDTO) {
        User user = this.findById(userId);

        if (userDTO.name() != null) {
            user.setName(userDTO.name());
        }
        if (userDTO.surname() != null) {
            user.setSurname(userDTO.surname());
        }
        if (userDTO.username() != null) {
            user.setUsername(userDTO.username());
        }
        if (userDTO.email() != null) {
            user.setEmail(userDTO.email());
        }
        if (userDTO.password() != null) {
            user.setPassword(bcrypt.encode(userDTO.password()));
        }

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }


    public void deleteUser(Long userId) {
        User user = this.findById(userId);
        userRepository.delete(user);
    }


    public void sendEmailToUser(Long userId, String subject, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User non trovato con ID: " + userId));
        mailGunSender.sendCustomEmail(user, subject, message);
    }


    public List<User> findUtenteByRuolo(String roleType) {
        UserRole role = UserRole.valueOf(roleType.toUpperCase());
        return userRepository.findByRole(role);
    }
}
