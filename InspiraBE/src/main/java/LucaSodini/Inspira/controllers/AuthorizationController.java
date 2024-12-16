package LucaSodini.Inspira.controllers;

import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.exceptions.BadRequestException;
import LucaSodini.Inspira.payloads.LoginDTO;
import LucaSodini.Inspira.payloads.UserDTO;
import LucaSodini.Inspira.payloads.UserLoginResponseDTO;
import LucaSodini.Inspira.services.SecurityService;
import LucaSodini.Inspira.services.UserService;
import LucaSodini.Inspira.tools.JWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthorizationController {

    @Autowired
    private SecurityService ss;

    @Autowired
    private UserService userService;

    @Autowired
    private JWT jwt;

    @PostMapping("/login")
    public UserLoginResponseDTO login(@RequestBody @Validated LoginDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String message = validationResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage())
                    .collect(Collectors.joining(". "));
            throw new BadRequestException("Ci sono stati errori nel payload! " + message);
        }

        // Verifica le credenziali e genera il token
        String token = this.ss.checkCredentialsAndGenerateToken(body);

        // Estrai l'ID dell'utente dal token
        String userId = this.jwt.getIdFromToken(token);

        // Recupera l'utente dal database usando l'ID
        User user = this.userService.findById(Long.valueOf(userId));

        // Restituisci una risposta con accessToken, userId e username
        return new UserLoginResponseDTO(token, Long.valueOf(userId), user.getUsername(),user.getAvatarUrl());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User save(@RequestBody @Validated UserDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String message = validationResult.getAllErrors().stream()
                    .map(objectError -> objectError.getDefaultMessage())
                    .collect(Collectors.joining(". "));
            throw new BadRequestException("Ci sono stati errori nel payload! " + message);
        }

        return this.userService.registerUser(body);
    }
}
