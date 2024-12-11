package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.payloads.UserDTO;
import LucaSodini.Inspira.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/utenti")
public class UserController {

    @Autowired
    private UserService userService;



    @GetMapping("/me")
    public User getProfile(@AuthenticationPrincipal User currentUtente) {
        return currentUtente;
    }


    @PutMapping("/me")
    public User updateProfile(@AuthenticationPrincipal User currentUtente,
                                @RequestBody @Validated UserDTO body) {
        return userService.updateUser(currentUtente.getId(), body);
    }

    @PatchMapping("/me/avatar")
    public ResponseEntity<String> updateOwnAvatar(@AuthenticationPrincipal User currentUtente,
                                                  @RequestParam("avatar") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(file, currentUtente.getId());
        return ResponseEntity.ok(avatarUrl);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOwnProfile(@AuthenticationPrincipal User currentUtente) {
        userService.deleteUser(currentUtente.getId());
    }

    @PatchMapping("/me/become-artist")
    public ResponseEntity<User> becomeArtist(@AuthenticationPrincipal User currentUtente) {
        User updatedUser = userService.becomeArtist(currentUtente.getId());
        return ResponseEntity.ok(updatedUser);
    }


    @GetMapping("/id/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam("username") String username) {
        return userService.searchUsersByUsername(username);
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(user);
    }




    @GetMapping("/by-role")
    public ResponseEntity<List<User>> getUsersByRole(@RequestParam String roleType) {
        List<User> users = userService.findUtenteByRuolo(roleType);
        return ResponseEntity.ok(users);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                             @RequestBody UserDTO userDTO) {
        User updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/{id}/invia-email")
    public void sendEmailToUser(@PathVariable("id") Long userId,
                                   @RequestParam String subject,
                                   @RequestParam String message) {
        userService.sendEmailToUser(userId, subject, message);
    }


    @PatchMapping("/{id}/avatar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String addAvatar(@PathVariable("utenteId") Long utenteId,
                            @RequestParam("avatar") MultipartFile file) {
        return userService.uploadAvatar(file, utenteId);
    }

}

