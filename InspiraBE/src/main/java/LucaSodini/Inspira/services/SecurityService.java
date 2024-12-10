package LucaSodini.Inspira.services;


import LucaSodini.Inspira.entities.User;
import LucaSodini.Inspira.exceptions.UnauthorizedException;
import LucaSodini.Inspira.payloads.LoginDTO;
import LucaSodini.Inspira.tools.JWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    @Autowired
    private UserService userService;

    @Autowired
    private JWT jwt;

    @Autowired
    private PasswordEncoder bcrypt;

    public String checkCredentialsAndGenerateToken(LoginDTO body) {
        User found = this.userService.findByEmail(body.email());

       
        if (found == null) {
            throw new UnauthorizedException("Credenziali errate!");
        }


        if (bcrypt.matches(body.password(), found.getPassword())) {
            return jwt.createToken(found);
        } else {
            throw new UnauthorizedException("Credenziali errate!");
        }
    }
}
