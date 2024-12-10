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


        String token = this.ss.checkCredentialsAndGenerateToken(body);


        String userId = this.jwt.getIdFromToken(token);


        return new UserLoginResponseDTO(token, Long.valueOf(userId));
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
